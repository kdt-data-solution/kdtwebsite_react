from django.db import models
from django.utils import timezone


class SharedModel(models.Model):
    class Meta:
        abstract = True
        managed = False


class Project(SharedModel):
    slug = models.CharField(max_length=80, unique=True)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=40, default='software')
    description = models.TextField(blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    date = models.CharField(max_length=80, blank=True, null=True)
    tags = models.TextField(blank=True, null=True)
    created_at = models.CharField(max_length=40, blank=True)

    class Meta(SharedModel.Meta):
        db_table = 'portfolio_items'
        verbose_name = 'project'
        verbose_name_plural = 'projects'

    def __str__(self):
        return self.title


class Article(SharedModel):
    slug = models.CharField(max_length=80, unique=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    date = models.CharField(max_length=80, blank=True, null=True)
    category = models.CharField(max_length=40, default='data')
    tags = models.TextField(blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    created_at = models.CharField(max_length=40, blank=True)

    class Meta(SharedModel.Meta):
        db_table = 'articles'

    def __str__(self):
        return self.title


class Product(SharedModel):
    slug = models.CharField(max_length=80, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=40, default='software')
    date = models.CharField(max_length=80, blank=True, null=True)
    features = models.TextField(blank=True, null=True)
    actions_json = models.TextField(default='[]')
    steps_json = models.TextField(default='[]')
    benefits_json = models.TextField(default='[]')
    benefits_title = models.CharField(max_length=255, blank=True, null=True)
    benefits_blurb = models.TextField(blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    coming_soon = models.BooleanField(default=False)
    created_at = models.CharField(max_length=40, blank=True)

    class Meta(SharedModel.Meta):
        db_table = 'products'

    def __str__(self):
        return self.title


class Service(SharedModel):
    slug = models.CharField(max_length=80, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    offerings_json = models.TextField(default='[]')
    created_at = models.CharField(max_length=40, blank=True)

    class Meta(SharedModel.Meta):
        db_table = 'services'

    def __str__(self):
        return self.title


class Course(SharedModel):
    slug = models.CharField(max_length=120, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    tags_json = models.TextField(default='[]')
    start_date = models.CharField(max_length=120, blank=True, null=True)
    level = models.CharField(max_length=120, blank=True, null=True)
    mode = models.CharField(max_length=120, blank=True, null=True)
    status = models.CharField(max_length=120, blank=True, null=True)
    inclusions_json = models.TextField(default='[]')
    register_url = models.TextField(blank=True, null=True)
    topics_json = models.TextField(default='[]')
    created_at = models.CharField(max_length=40, blank=True)

    class Meta(SharedModel.Meta):
        db_table = 'courses'

    def __str__(self):
        return self.title


class SiteSetting(SharedModel):
    key = models.CharField(max_length=120, primary_key=True)
    value = models.TextField(blank=True, null=True)

    class Meta(SharedModel.Meta):
        db_table = 'site_settings'
        verbose_name = 'site setting'

    def __str__(self):
        return self.key


class ContentSection(SharedModel):
    key = models.CharField(max_length=120, unique=True)
    page = models.CharField(max_length=80, default='global')
    label = models.CharField(max_length=255, blank=True)
    eyebrow = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255, blank=True)
    subtitle = models.TextField(blank=True)
    body = models.TextField(blank=True)
    image_url = models.TextField(blank=True)
    image_alt = models.CharField(max_length=255, blank=True)
    cta_label = models.CharField(max_length=255, blank=True)
    cta_url = models.TextField(blank=True)
    items_json = models.TextField(default='[]')
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.CharField(max_length=40, blank=True)
    updated_at = models.CharField(max_length=40, blank=True)

    class Meta(SharedModel.Meta):
        db_table = 'content_sections'
        verbose_name = 'page section'
        verbose_name_plural = 'page sections'
        ordering = ('page', 'display_order', 'id')

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.label or self.key


class ContactMessage(SharedModel):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.CharField(max_length=40, blank=True)

    class Meta(SharedModel.Meta):
        db_table = 'contact_messages'
        verbose_name = 'inquiry'
        verbose_name_plural = 'inquiries'

    def __str__(self):
        return f'{self.name} — {self.email}'
