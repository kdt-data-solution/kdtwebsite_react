from django.contrib import admin

from .forms import ContentSectionForm, CourseForm, ProductForm, ProjectForm, ServiceForm
from .models import Article, ContactMessage, ContentSection, Course, Product, Project, Service, SiteSetting


admin.site.site_header = 'KDT Website Administration'
admin.site.site_title = 'KDT Admin'
admin.site.index_title = 'Website content management'


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectForm
    list_display = ('title', 'category', 'date', 'slug')
    list_filter = ('category',)
    search_fields = ('title', 'description', 'tags', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at',)
    fields = ('title', 'slug', 'category', 'description', 'date', 'tags', 'image_upload', 'image_url', 'created_at')


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'date')
    list_filter = ('category',)
    search_fields = ('title', 'author', 'body', 'tags')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductForm
    list_display = ('title', 'category', 'coming_soon', 'slug')
    list_filter = ('category', 'coming_soon')
    search_fields = ('title', 'description', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    form = ServiceForm
    list_display = ('title', 'slug')
    search_fields = ('title', 'description', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at',)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    form = CourseForm
    list_display = ('title', 'start_date', 'level', 'status')
    list_filter = ('status', 'level', 'mode')
    search_fields = ('title', 'description', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at',)


@admin.register(ContentSection)
class ContentSectionAdmin(admin.ModelAdmin):
    form = ContentSectionForm
    list_display = ('label', 'page', 'key', 'display_order', 'is_active')
    list_filter = ('page', 'is_active')
    list_editable = ('display_order', 'is_active')
    search_fields = ('label', 'key', 'title', 'body')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Identity', {'fields': ('label', 'key', 'page', 'display_order', 'is_active')}),
        ('Copy', {'fields': ('eyebrow', 'title', 'subtitle', 'body')}),
        ('Media and action', {'fields': ('image_url', 'image_alt', 'cta_label', 'cta_url')}),
        ('Repeating items', {'fields': ('items_json',)}),
        ('Audit', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'value')
    search_fields = ('key', 'value')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('name', 'email', 'message', 'created_at')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
