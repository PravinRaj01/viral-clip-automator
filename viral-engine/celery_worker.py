import os
import downloader
import video_editor
import ai_agent
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

# Get your Upstash URL from environment variables
REDIS_URL = os.getenv("UPSTASH_REDIS_URL")

celery_app = Celery(
    "video_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL
)

# Optimized for free-tier (low memory)
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    broker_connection_retry_on_startup=True
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