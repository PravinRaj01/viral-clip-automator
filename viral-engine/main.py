from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import downloader
import video_editor
import ai_agent


app = FastAPI(title="Viral Growth Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for vercel
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        caption = ai_agent.generate_viral_metada(edited_video)

        return {
            "status": "success",
            "message": "Video processed successfully!",
            "video_path": edited_video,
            "caption": caption}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))