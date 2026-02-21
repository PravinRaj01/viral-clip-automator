FROM python:3.10-slim

# 1. Install FFmpeg AND ImageMagick + standard fonts
RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6 imagemagick fonts-liberation && rm -rf /var/lib/apt/lists/*

# 2. The Hacker Fix: Remove the Linux security policy that blocks ImageMagick from reading paths
RUN sed -i '/<policy domain="path" rights="none" pattern="@\*"/d' /etc/ImageMagick-6/policy.xml

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]