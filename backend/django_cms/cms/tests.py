import tempfile
from pathlib import Path
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase, override_settings

from .forms import ProductForm
from .models import Product


class ProductFormImageUploadTests(SimpleTestCase):
    def test_image_upload_sets_public_product_media_url(self):
        with tempfile.TemporaryDirectory() as media_root:
            upload = SimpleUploadedFile('New Logo.PNG', b'png-image-content', content_type='image/png')
            form = ProductForm(
                data={
                    'slug': 'axis',
                    'title': 'Axis',
                    'category': 'software',
                    'actions_json': '[]',
                    'steps_json': '[]',
                    'benefits_json': '[]',
                },
                files={'image_upload': upload},
            )

            with patch.object(Product, 'validate_unique'):
                self.assertTrue(form.is_valid(), form.errors)
            with override_settings(MEDIA_ROOT=media_root, PUBLIC_BASE_URL='https://example.test'):
                product = form.save(commit=False)

            self.assertEqual(product.image_url, 'https://example.test/media/products/axis.png')
            self.assertTrue((Path(media_root) / 'products' / 'axis.png').exists())

    def test_non_image_upload_is_rejected(self):
        upload = SimpleUploadedFile('notes.txt', b'not-an-image', content_type='text/plain')
        form = ProductForm(
            data={
                'slug': 'axis',
                'title': 'Axis',
                'category': 'software',
                'actions_json': '[]',
                'steps_json': '[]',
                'benefits_json': '[]',
            },
            files={'image_upload': upload},
        )

        with patch.object(Product, 'validate_unique'):
            self.assertFalse(form.is_valid())
        self.assertIn('image_upload', form.errors)

    def test_image_content_type_with_unsafe_extension_is_rejected(self):
        upload = SimpleUploadedFile('logo.html', b'<script>alert(1)</script>', content_type='image/png')
        form = ProductForm(
            data={
                'slug': 'axis',
                'title': 'Axis',
                'category': 'software',
                'actions_json': '[]',
                'steps_json': '[]',
                'benefits_json': '[]',
            },
            files={'image_upload': upload},
        )

        with patch.object(Product, 'validate_unique'):
            self.assertFalse(form.is_valid())
        self.assertIn('image_upload', form.errors)
