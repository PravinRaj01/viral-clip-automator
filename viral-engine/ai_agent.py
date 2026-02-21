import os
import whisper
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

print("Loading Whisper Moodel...")
whisper_model = whisper.load_model("base")

def generate_viral_metada(video_path: str):
    """Transcribes the video and generates a viral caption using LLama-3."""
    print("Generating metadata...")
    
    # 1. Transcribe audio using Whisper (extracts audio from mp4)
    result = whisper_model.transcribe(video_path)
    transcript = result['text']

    print(f"Transcript generated: '{transcript[:50]}...'")
    print("[3/3] Generating viral caption using LLaMA-3...")


    # 2. Call Groq
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return "Error: GROQ_API_KEY not set in environment variables."
    
    client = Groq(api_key=api_key)
    prompt = f""" 
    You are a social media expert, especially in TikTok/Reels Growth Marketer, specializing in creating viral content. 
    I will give you a video transcript. You must write a highly viral, engaging caption 
    (under 2 sentences) and include exactly 5 trending hashtags.

    Transcript: "{transcript}"

    Out ONLY the caption and hashtags.
    """
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192",
    )
    
    caption = chat_completion.choices[0].message.content
    print("[3/3] AI Generation complete!")

    return caption