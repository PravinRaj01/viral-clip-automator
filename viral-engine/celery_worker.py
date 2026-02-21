Python
import os
from celery import Celery
from dotenv import load_dotenv
import downloader
import video_editor
import ai_agent

load_dotenv()

# Change: Make sure we get the URL and provide a clear error if it's missing
REDIS_URL = os.getenv("UPSTASH_REDIS_URL")

if not REDIS_URL:
    print("❌ ERROR: UPSTASH_REDIS_URL is not set in environment variables!")

# Initialize Celery with explicit broker and backend
celery_app = Celery(
    "video_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    broker_connection_retry_on_startup=True,
    # Add this to ensure it doesn't look for RabbitMQ (amqp)
    broker_url=REDIS_URL,
    result_backend=REDIS_URL
)

@celery_app.task(bind=True, name="process_video_task")
def process_video_task(self, video_url: str):
    try:
        print(f"🚀 Starting task {self.request.id} for {video_url}")
        
        # Step 1: Download
        raw_path = downloader.download_video_from_url(video_url, "raw_video.mp4")
        
        # Step 2: Edit
        edited_path = video_editor.process_video(raw_path, "final_viral_clip.mp4")
        
        # Step 3: AI Metadata
        caption = ai_agent.generate_viral_metadata(edited_path)
        
        return {
            "status": "success",
            "caption": caption,
            "video_path": edited_path
        }
    except Exception as e:
        print(f"❌ Task Failed: {str(e)}")
        return {"status": "error", "message": str(e)}