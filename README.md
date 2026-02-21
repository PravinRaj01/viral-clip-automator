# Viral Clip Automator

>A small toolkit (backend + frontend) to download, edit, and generate viral-ready short clips from video URLs.

Repository layout
- `viral-engine/` — Python FastAPI backend that downloads, edits, and generates captions.
- `viral-frontend/` — Next.js frontend for submitting video URLs and downloading results.

Key features
- Download videos from URLs (uses `yt-dlp`).
- Simple editing pipeline with `moviepy` and FFmpeg.
- AI metadata/caption generation via the `ai_agent` module.
- Web API (FastAPI) plus a Next.js UI.

Prerequisites
- Python 3.10+
- Node 18+ (for frontend)
- ffmpeg (required by the backend; Docker image includes it)

Quickstart — Backend (development)
1. Open a terminal and create a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate   # macOS / Linux
.venv\\Scripts\\activate     # Windows PowerShell
```

2. Install Python dependencies:

```bash
pip install -r viral-engine/requirements.txt
```

3. Run the API (development):

```bash
cd viral-engine
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

4. API endpoints
- `GET /` — health/status.
- `POST /api/process-video` — body: `{ "url": "<video_url>" }` to download + process the video.
- `GET /api/download-video` — download the last processed clip `viral_clip_ready.mp4`.

Quickstart — Frontend (development)
1. Install node dependencies and start dev server:

```bash
cd viral-frontend
npm install
npm run dev
# App will be available at http://localhost:3000
```

Notes about the frontend
- This project uses Next.js (v16) and React 19. Use Node 18+ for compatibility.
- Scripts available in `viral-frontend/package.json`:
  - `dev` — start development server
  - `build` — production build
  - `start` — start built app

Docker (backend)
1. Build the backend image:

```bash
docker build -t viral-engine:latest -f viral-engine/Dockerfile viral-engine
```

2. Run the container:

```bash
docker run -p 8000:8000 --rm viral-engine:latest
```

Security & limitations
- CORS is permissive in development (`allow_origins=['*']`) — tighten before production.
- The backend writes output files (`final_viral_clip.mp4`) to the working directory; consider persistence or S3 for production.
- Use rate-limiting and validation when allowing arbitrary external URLs.

Development notes
- Backend dependencies: see `viral-engine/requirements.txt` (FastAPI, uvicorn, yt-dlp, moviepy, pydantic, etc.).
- The API entrypoint is `viral-engine/main.py`.
- Frontend scaffolded with Next.js; see `viral-frontend/` for components and pages.

Contributing
- Open an issue or submit a pull request. Keep changes small and focused.

License
- This repository does not include a license file. Add one (e.g., MIT) if you intend to permit reuse.

Enjoy! If you want, I can also:
- add a simple Docker Compose file to run frontend + backend together
- create a GitHub Actions workflow to lint and run basic checks
