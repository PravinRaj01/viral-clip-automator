FROM python:3.10-slim

RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6 imagemagick fonts-liberation bash && rm -rf /var/lib/apt/lists/*

RUN sed -i '/<policy domain="path" rights="none" pattern="@\*"/d' /etc/ImageMagick-*/policy.xml || true

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Add execution rights to the start script
RUN chmod +x start.sh

EXPOSE 8000

# Run the boot script
CMD ["./start.sh"]