import yt_dlp
import os

def download_video_from_url(url: str, output_filename = "raw_video.mp4"):
    """Downloads a video from TikTok, YouTube Shorts, or Reels."""
    if os.path.exists(output_filename):
        os.remove(output_filename)

    ydl_opts = {
        'outtmpl': output_filename,
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'cookiefile': 'cookies.txt',
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            print("[1/3] Download complete!")
            return output_filename
    except Exception as e:
        print(f"Error downloading video: {e}")
        raise Exception(f"Failed to download video from URL: {url}. Ensure link is public.")
        return None
        