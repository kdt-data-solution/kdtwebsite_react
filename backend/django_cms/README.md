# KDT Django admin

This companion admin uses the same SQLite database as the existing Express API. Express continues to serve the public API, contact form, authentication, uploads, and email; Django provides the content-management interface.

## Local setup

```powershell
cd backend\django_cms
..\..\.venv\Scripts\python.exe manage.py migrate
..\..\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

Open `http://127.0.0.1:8000/admin/`.

For production, provide `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_DEBUG=0`, `KDT_DATABASE_PATH`, and `DJANGO_PUBLIC_URL`. Run Django and Express against the same persistent database volume. Uploaded project images are stored below `django_cms/media/`; use persistent media storage or Cloudinary in production.
