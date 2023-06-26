web: cd server && gunicorn app:app

worker: celery -A app worker --loglevel=info
