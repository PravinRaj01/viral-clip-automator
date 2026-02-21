from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import downloader
import video_editor
import ai_agent
from fastapi.responses import FileResponse
import os


app = FastAPI(title="Viral Growth Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, # This MUST be False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online", 
        "message": "Viral Clip Automator Engine is running! Please use the frontend UI to submit video POST requests."
    }

class VideoRequest(BaseModel):
    url: str

@app.post("/api/process-video")
async def process_video(request: VideoRequest):
    try:
        # Step 1: Download video
        raw_video_path = downloader.download_video_from_url(request.url, "raw_video.mp4")

        # Step 2: Process and edit video
        edited_video = video_editor.process_video(raw_video_path, "final_viral_clip.mp4")

        # Step 3: Generate viral caption using AI
        caption = ai_agent.generate_viral_metadata(edited_video)

        return {
            "status": "success",
            "message": "Video processed successfully!",
            "video_path": edited_video,
            "caption": caption}
    except Exception as e:
        print(f"🔥🔥🔥 CRITICAL ERROR: {str(e)}") # <-- This will now print to your Render logs!
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/download-video")
async def download_video():
    file_path = "final_viral_clip.mp4"
    if os.path.exists(file_path):
        return FileResponse(path=file_path, media_type="video/mp4", filename="viral_clip_ready.mp4")
    else:
        raise HTTPException(status_code=404, detail="Video not found.")