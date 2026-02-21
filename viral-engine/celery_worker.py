import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("UPSTASH_REDIS_URL")

# Force SSL settings for Upstash
celery_app = Celery(
    "video_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    broker_use_ssl={
        'ssl_cert_reqs': 'none' # Required for serverless providers like Upstash
    },
    redis_backend_use_ssl={
        'ssl_cert_reqs': 'none'
    },
    broker_connection_retry_on_startup=True,
    worker_prefetch_multiplier=1,
    task_acks_late=True
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