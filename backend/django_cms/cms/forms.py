import json
from pathlib import Path

from django import forms
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.utils.text import slugify

from .models import ContentSection, Course, Product, Project, Service


class JsonTextMixin:
    json_fields = ()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name in self.json_fields:
            value = getattr(self.instance, name, '[]') if self.instance else '[]'
            try:
                value = json.loads(value or '[]')
            except (TypeError, json.JSONDecodeError):
                value = []
            self.fields[name] = forms.JSONField(
                required=False,
                initial=value,
                widget=forms.Textarea(attrs={'rows': 12, 'style': 'font-family: monospace;'}),
                help_text='Enter a valid JSON list. The website reads these items in the displayed order.',
            )

    def clean(self):
        cleaned = super().clean()
        for name in self.json_fields:
            cleaned[name] = json.dumps(cleaned.get(name) or [], ensure_ascii=False)
        return cleaned


class ContentSectionForm(JsonTextMixin, forms.ModelForm):
    json_fields = ('items_json',)

    class Meta:
        model = ContentSection
        fields = '__all__'


class ProductForm(JsonTextMixin, forms.ModelForm):
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


class ProjectForm(forms.ModelForm):
    image_upload = forms.FileField(
        required=False,
        help_text='Optional image upload. You can also paste an existing Cloudinary or public image URL below.',
    )

    class Meta:
        model = Project
        fields = '__all__'

    def clean_image_upload(self):
        uploaded = self.cleaned_data.get('image_upload')
        if not uploaded:
            return uploaded
        if uploaded.size > 10 * 1024 * 1024:
            raise forms.ValidationError('Image must be 10 MB or smaller.')
        if uploaded.content_type and not uploaded.content_type.startswith('image/'):
            raise forms.ValidationError('Upload a valid image file.')
        return uploaded

    def save(self, commit=True):
        project = super().save(commit=False)
        uploaded = self.cleaned_data.get('image_upload')
        if uploaded:
            suffix = Path(uploaded.name).suffix.lower()[:10]
            safe_name = f'{slugify(project.slug or project.title) or "project"}{suffix}'
            storage = FileSystemStorage(location=settings.MEDIA_ROOT, base_url=settings.MEDIA_URL)
            stored_name = storage.save(f'projects/{safe_name}', uploaded)
            project.image_url = f'{settings.PUBLIC_BASE_URL}{storage.url(stored_name)}'
        if commit:
            project.save()
        return project
