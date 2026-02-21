from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse
from celery.result import AsyncResult
import os
from celery_worker import celery_app, process_video_task

app = FastAPI(title="Viral Automator Async Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

@app.post("/api/process-video")
async def start_processing(request: VideoRequest):
    # Trigger the background task
    task = process_video_task.delay(request.url)
    # Return the ID immediately (no more 60s timeout!)
    return {"task_id": task.id}

@app.get("/api/task-status/{task_id}")
async def get_status(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    
    if result.state == 'SUCCESS':
        return {"status": "completed", "result": result.result}
    elif result.state == 'FAILURE':
        return {"status": "failed", "error": str(result.info)}
    else:
        # Includes PENDING, STARTED, etc.
        return {"status": "processing"}

@app.get("/api/download-video")
async def download():
    file_path = "final_viral_clip.mp4"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="video/mp4", filename="viral_clip.mp4")
    raise HTTPException(status_code=404, detail="File not ready")