#!/bin/bash
# Start Celery with only ONE worker process and low memory settings
celery -A celery_worker.celery_app worker --loglevel=info --concurrency=1 --max-memory-per-child=200000 &

# Start the FastAPI server
uvicorn main.py:app --host 0.0.0.0 --port 8000