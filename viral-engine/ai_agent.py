import os
from groq import Groq
from moviepy.editor import VideoFileClip

def generate_viral_metadata(video_path: str):
    """Extracts audio, transcribes it via Groq Cloud, and generates a viral caption."""
    print("[3/3] Extracting audio for AI analysis...")
    
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return "⚠️ GROQ_API_KEY not found."
        
    client = Groq(api_key=api_key)
    
    # 1. Extract audio from the video and save as a temporary mp3
    audio_path = "temp_audio.mp3"
    video = VideoFileClip(video_path)
    # Extract audio silently
    video.audio.write_audiofile(audio_path, logger=None) 
    video.close()
    
    print("[3/3] Transcribing audio with Groq Whisper-Large-v3...")
    
    # 2. Send the audio file to Groq's Whisper API
    with open(audio_path, "rb") as file:
        transcription = client.audio.transcriptions.create(
          file=(audio_path, file.read()),
          model="whisper-large-v3",
        )
    transcript = transcription.text
    
    # Clean up the temporary audio file
    if os.path.exists(audio_path):
        os.remove(audio_path)
        
    print(f"Transcript: '{transcript[:50]}...'")
    print("[3/3] Generating viral caption with Llama-3...")
    
    # 3. Generate the viral caption using Llama 3
    prompt = f"""
    You are an expert TikTok/Reels Growth Marketer. 
    I will give you a video transcript. You must write a highly viral, engaging caption 
    (under 2 sentences) and include exactly 5 trending hashtags.
    
    Transcript: "{transcript}"
    
    Output ONLY the caption and hashtags.
    """
    
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )
    
    caption = chat_completion.choices[0].message.content
    print("[3/3] AI Generation complete!")
    
    return caption