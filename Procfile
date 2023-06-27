web: cd server && gunicorn app:app

worker: celery -A server.app.celery worker --loglevel=info
