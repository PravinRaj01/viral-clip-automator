# Viral Clip Automator

A compact, pragmatic toolset for producing short-form social clips from source videos. It combines a small web UI and a containerized processing service so you can rapidly test ideas and iterate on creative workflows.

Why this repo
- Move faster: download, crop, rebrand, and export short clips with a single API.
- Keep costs low: designed to run in lightweight containers and cloud free tiers.
- Swapable AI: optional cloud services can be used for transcription or metadata generation — not required to run the core pipeline.

Repository layout
- `viral-engine/` — Python processing service (FastAPI) that downloads and edits videos.
- `viral-frontend/` — Next.js dashboard to submit URLs and download results.

What it does (overview)
- Downloads video from a URL (uses `yt-dlp`).
- Converts/crops to vertical aspect ratios, overlays simple branding/CTAs, and exports an MP4 via FFmpeg.
- Optionally extracts audio and sends it to a transcription/ML service for captions and hashtag suggestions.

Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (for containerized runs) or `ffmpeg` installed locally for video processing

Quickstart — Backend (local development)
1. Create and activate a virtual environment:

```bash
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows PowerShell
.venv\Scripts\activate
```

2. Install Python dependencies:

```bash
pip install -r viral-engine/requirements.txt
```

3. Start the API:

```bash
cd viral-engine
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

4. Useful endpoints
- `GET /` — service status
- `POST /api/process-video` — JSON body `{ "url": "<video_url>" }` to process a video
- `GET /api/download-video` — download the processed clip (if available)

Quickstart — Frontend (local development)
1. Install and run:

```bash
# Viral Clip Automator

A compact, pragmatic toolset for producing short-form social clips (TikTok/Shorts/Reels) from source videos. It combines a serverless web UI and a containerized processing service so you can rapidly test ideas, automate branding, and iterate on creative workflows.

## Why this repo?
- **Move faster:** Download, crop to 9:16, rebrand, and export short clips with a single API call.
- **Keep costs low:** Architected for compute offloading. The core pipeline runs in a lightweight container (512MB RAM target), while heavy ML workloads are offloaded to cloud LPUs.
- **Swapable AI:** Cloud integrations (`whisper-large-v3` for 100+ language transcription, `llama-3.1` for metadata generation) are entirely decoupled from the core download/edit pipeline.

## System Architecture

This monorepo is split into two distinct services:

1. `frontend/` **(Next.js / Vercel Edge)**
	- A minimal, premium dashboard for submitting URLs and retrieving processed assets.
	- Built with React, Tailwind CSS, and Lucide Icons.
2. `backend/` **(FastAPI / Docker)**
	- A Python microservice that handles the heavy lifting.
	- Uses `yt-dlp` (with cookie injection for anti-bot bypass) to fetch source media.
	- Uses `MoviePy` and `FFmpeg` to calculate aspect ratios, crop, and merge audio/video.
	- Modifies Linux security policies via Docker to allow headless text-to-video rendering via ImageMagick.

## Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (for containerized execution)
- Groq API Key (for AI transcription/caption generation)

---

## Quickstart: Local Development

### 1. Backend Service
The backend requires system-level dependencies (FFmpeg, ImageMagick) to manipulate video.

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\\Scripts\\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start the API
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Useful endpoints:

- `GET /` — Service health check

- `POST /api/process-video` — JSON body `{ "url": "<video_url>" }`

- `GET /api/download-video` — Retrieve the generated MP4 file

### 2. Frontend Dashboard
In a separate terminal block:

```bash
cd frontend

# Install and run
npm install
npm run dev

# Open http://localhost:3000 to view the UI.
```

## Docker Deployment (Recommended)
To guarantee environment parity and bypass local OS quirks (especially with FFmpeg/ImageMagick paths), run the backend via Docker.

```bash
# Build the backend image
docker build -t viral-engine:latest -f backend/Dockerfile backend

# Run the container (inject your API key)
docker run -p 8000:8000 --rm -e GROQ_API_KEY=\"your_api_key_here\" viral-engine:latest
```

## CI & Quality Control
This repository includes a GitHub Actions workflow that runs automated linters (flake8) on the Python backend upon every push to the main branch. This CI pipeline is strictly focused on catching syntax errors, undefined variables, and fatal regressions before deployment.

To run the linter locally:

```bash
pip install flake8
flake8 backend --count --select=E9,F63,F7,F82 --show-source --statistics
```

## Notes & Tradeoffs
The backend currently writes output files (e.g., `final_viral_clip.mp4`) directly to the container's working directory. For enterprise production, this should be swapped to an object store (e.g., AWS S3 or Cloudflare R2).

CORS middleware is currently set to allow_origins=[\"*\"] for frictionless local development. Restrict this to your frontend domain before public release.

## Developed by
Pravin Raj
