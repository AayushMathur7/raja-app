web: cd server && gunicorn app:app

worker: celery -A app.celery worker --loglevel=info
