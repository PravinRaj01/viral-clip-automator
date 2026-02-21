from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip
import os

def process_video(input_path: str, output_path = "final_viral_clip.mp4"):
    """Crops the video to 9:16 and adds a viral call to action overlay."""
    print("[2/3] Processing and editing video...")

    if os.path.exists(output_path):
        os.remove(output_path)
    
    # Load input video
    clip = VideoFileClip(input_path)

    # Crop to 9:16 aspect ratio
    width, height = clip.size
    target_aspect_ratio = 9 / 16
    current_aspect_ratio = width / height   
    
    if current_aspect_ratio > target_aspect_ratio:
        # Video is wider than 9:16, crop width
        new_width = int(height * target_aspect_ratio)
        x1 = (width - new_width) // 2
        x2 = x1 + new_width
        clip = clip.crop(x1=x1, y1=0, x2=x2, y2=height)
    elif current_aspect_ratio < target_aspect_ratio:
        # Video is taller than 9:16, crop height
        new_height = int(width / target_aspect_ratio)
        y1 = (height - new_height) // 2
        y2 = y1 + new_height
        clip = clip.crop(x1=0, y1=y1, x2=width, y2=y2)
    
    # Add viral call to action overlay (Explicitly using the Linux font we installed)
    txt_clip = TextClip("LINK IN BIO!", fontsize=50, color='white', bg_color='red', font='Liberation-Sans')
    txt_clip = txt_clip.set_position(('center', 'top')).set_duration(clip.duration).margin(top=20, opacity=0)

    final_video = CompositeVideoClip([clip, txt_clip])

    # Write the result (Removed the "path=" bug)
    final_video.write_videofile(
        output_path,
        codec="libx264",
        audio_codec="aac",
        fps=24,             # Lowering FPS reduces memory load
        preset="ultrafast", # Faster encoding uses less RAM
        threads=1,          # LIMIT to 1 thread to prevent memory spikes
        ffmpeg_params=["-crf", "28"] # Compresses more to save memory
    )

    clip.close()
    final_video.close()
    print("[3/3] Video processing complete!")
    return output_path