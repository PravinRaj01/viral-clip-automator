# Viral Clip Automator

A compact, pragmatic toolset for producing short-form social clips (TikTok/Shorts/Reels) from source videos. It combines a serverless web UI and a containerized processing service so you can rapidly test ideas, automate branding, and iterate on creative workflows.

## Why this repo?
- **Move faster:** Download, crop to 9:16, rebrand, and export short clips with a single API call.
- **Keep costs low:** Architected for compute offloading. The core pipeline runs in a lightweight container (512MB RAM target), while heavy ML workloads are offloaded to cloud LPUs.
- **Swapable AI:** Cloud integrations (`whisper-large-v3` for 100+ language transcription, `llama-3.1` for metadata generation) are entirely decoupled from the core download/edit pipeline.

## System Architecture

This monorepo is split into two distinct services:

1. `viral-frontend/` **(Next.js / Vercel Edge)**
- A minimal dashboard for submitting URLs and retrieving processed assets.
- Built with React, Tailwind CSS, and Lucide Icons.
2. `viral-engine/` **(FastAPI / Docker)**
- A Python microservice that handles the heavy lifting.
- Uses `yt-dlp` (with cookie injection for anti-bot bypass) to fetch source media.
- Uses `MoviePy` and `FFmpeg` to calculate aspect ratios, crop, and merge audio/video.
- Optionally extracts audio and sends it to a transcription/ML service for captions and hashtag suggestions.

## Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (for containerized execution)
- FFmpeg and ImageMagick (for local development)

---

## Quickstart: Local Development

### 1. Backend Service
The backend requires system-level dependencies (FFmpeg, ImageMagick) to manipulate video.

```bash
cd viral-engine

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start the API
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Useful endpoints:

- `GET /`  Service health check
- `POST /api/process-video`  JSON body `{ "url": "<video_url>" }`
- `GET /api/download-video`  Retrieve the generated MP4 file

### 2. Frontend Dashboard
In a separate terminal block:

```bash
cd viral-frontend

# Install and run
npm install
npm run dev

# Open http://localhost:3000 to view the UI.
```

## Docker Deployment (Recommended)
To guarantee environment parity and bypass local OS quirks (especially with FFmpeg/ImageMagick paths), run the backend via Docker.

```bash
# Build the backend image
docker build -t viral-engine:latest -f viral-engine/Dockerfile viral-engine

# Run the container
docker run -p 8000:8000 --rm viral-engine:latest
```

## Notes & Tradeoffs
The backend currently writes output files (e.g., `final_viral_clip.mp4`) directly to the container's working directory. For enterprise production, this should be swapped to an object store (e.g., AWS S3 or Cloudflare R2).

CORS middleware is currently set to allow all origins for frictionless local development. Restrict this to your frontend domain before public release.

## Developed by
Pravin Raj
