#!/bin/bash

# Start the Celery worker in the background (&)
celery -A celery_worker.celery_app worker --loglevel=info &

# Start the FastAPI server in the foreground
uvicorn main:app --host 0.0.0.0 --port 8000