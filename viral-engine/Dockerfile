FROM python:3.10-slim

RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6 imagemagick fonts-liberation && rm -rf /var/lib/apt/lists/*

RUN sed -i '/<policy domain="path" rights="none" pattern="@\*"/d' /etc/ImageMagick-*/policy.xml || true

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]