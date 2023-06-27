web: cd server && gunicorn app:app
worker: cd server && celery -A app.celery worker --loglevel=info
