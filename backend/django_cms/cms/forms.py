import json
from pathlib import Path

from django import forms
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.utils.text import slugify

from .models import ContentSection, Course, Product, Project, Service


def decode_json_list(value):
    """Decode legacy repeatedly-encoded JSON and return None for non-lists."""
    if value in (None, ''):
        return []
    normalized = value
    for _ in range(6):
        if not isinstance(normalized, str):
            break
        try:
            normalized = json.loads(normalized or '[]')
        except (TypeError, json.JSONDecodeError):
            return None
    return normalized if isinstance(normalized, list) else None


def normalize_json_list(value):
    normalized = decode_json_list(value)
    return normalized if normalized is not None else []


class ImageUploadModelForm(forms.ModelForm):
    upload_directory = 'uploads'
    upload_fallback_name = 'image'
    allowed_image_extensions = {'.gif', '.jpeg', '.jpg', '.png', '.webp'}
    allowed_image_content_types = {
        'image/gif', 'image/jpeg', 'image/png', 'image/webp',
    }

    image_upload = forms.FileField(
        required=False,
        help_text=(
            'Optional image upload (PNG, JPG, WEBP, or GIF; maximum 10 MB). '
            'You can also paste an existing Cloudinary or public image URL below.'
        ),
    )

    def clean_image_upload(self):
        uploaded = self.cleaned_data.get('image_upload')
        if not uploaded:
            return uploaded
        if uploaded.size > 10 * 1024 * 1024:
            raise forms.ValidationError('Image must be 10 MB or smaller.')
        suffix = Path(uploaded.name).suffix.lower()
        if suffix not in self.allowed_image_extensions:
            raise forms.ValidationError('Upload a PNG, JPG, WEBP, or GIF image.')
        if uploaded.content_type not in self.allowed_image_content_types:
            raise forms.ValidationError('Upload a valid image file.')
        return uploaded

    def save(self, commit=True):
        instance = super().save(commit=False)
        uploaded = self.cleaned_data.get('image_upload')
        if uploaded:
            suffix = Path(uploaded.name).suffix.lower()[:10]
            fallback_name = self.upload_fallback_name
            safe_name = f'{slugify(instance.slug or instance.title) or fallback_name}{suffix}'
            storage = FileSystemStorage(location=settings.MEDIA_ROOT, base_url=settings.MEDIA_URL)
            stored_name = storage.save(f'{self.upload_directory}/{safe_name}', uploaded)
            instance.image_url = f'{settings.PUBLIC_BASE_URL}{storage.url(stored_name)}'
        if commit:
            instance.save()
        return instance


class JsonTextMixin:
    json_fields = ()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name in self.json_fields:
            value = getattr(self.instance, name, '[]') if self.instance else '[]'
            value = normalize_json_list(value)
            self.fields[name] = forms.JSONField(
                required=False,
                initial=value,
                widget=forms.Textarea(attrs={'rows': 12, 'style': 'font-family: monospace;'}),
                help_text='Enter a valid JSON list. The website reads these items in the displayed order.',
            )

    def clean(self):
        cleaned = super().clean()
        for name in self.json_fields:
            raw_value = cleaned.get(name)
            normalized = decode_json_list(raw_value)
            if normalized is None:
                self.add_error(name, 'Enter a JSON list.')
                normalized = []
            cleaned[name] = json.dumps(normalized, ensure_ascii=False)
        return cleaned


class ContentSectionForm(JsonTextMixin, forms.ModelForm):
    json_fields = ('items_json',)

    class Meta:
        model = ContentSection
        fields = '__all__'


class ProductForm(JsonTextMixin, ImageUploadModelForm):
    upload_directory = 'products'
    upload_fallback_name = 'product'
    json_fields = ('actions_json', 'steps_json', 'benefits_json')

    class Meta:
        model = Product
        fields = '__all__'


class ServiceForm(JsonTextMixin, forms.ModelForm):
    json_fields = ('offerings_json',)

    class Meta:
        model = Service
        fields = '__all__'


class CourseForm(JsonTextMixin, forms.ModelForm):
    json_fields = ('tags_json', 'inclusions_json', 'topics_json')

    class Meta:
        model = Course
        fields = '__all__'


class ProjectForm(ImageUploadModelForm):
    upload_directory = 'projects'
    upload_fallback_name = 'project'

    class Meta:
        model = Project
        fields = '__all__'
