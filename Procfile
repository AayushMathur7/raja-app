web: cd server && gunicorn app:app

worker: celery -A raja-app worker --loglevel=info
