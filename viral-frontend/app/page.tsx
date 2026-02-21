"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, CheckCircle2, AlertCircle, Clock, Globe } from "lucide-react";

interface ProcessVideoResult {
  caption: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessVideoResult | null>(null);
  const [error, setError] = useState("");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  const handleSubmit = async () => {
    if (!url.includes("http")) {
      setError("Please enter a valid URL.");
      return;
    }
    
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/process-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      if (!res.ok) throw new Error("Processing failed. Please ensure the video is under 30 seconds.");
      
      const data = await res.json();
      setResult(data);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-[#FBE8A6] selection:text-zinc-900 flex flex-col justify-center">
      
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
        
        {/* Left Side: Hero Copy (LockedIn Style) */}
        <div className="space-y-8">
          <h1 className="text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] text-zinc-900">
            Go Viral.<br />
            On <span className="relative inline-block">
              <span className="relative z-10">Autopilot.</span>
              {/* The Signature Yellow Highlight */}
              <span className="absolute bottom-1 left-0 w-full h-[40%] bg-[#FBE8A6] -z-10 rounded-sm"></span>
            </span>
          </h1>
          
          <p className="text-lg text-zinc-500 max-w-md leading-relaxed font-medium">
            A tool built for creators who scale. Automate downloads, video re-branding, and AI-driven metadata generation in seconds.
          </p>

          {/* Clean Status Badges */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-zinc-600">
            <span className="flex items-center gap-2 border border-zinc-200 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> TikTok (Active)
            </span>
            <span className="flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-4 py-2 rounded-full text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-zinc-300"></span> YouTube Shorts (Soon)
            </span>
          </div>
        </div>

        {/* Right Side: The Application Interface */}
        <div className="bg-white p-8 lg:p-10 rounded-[2rem] border border-zinc-200 shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
          
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-1">Process Video</h2>
              <p className="text-sm text-zinc-500">Paste your link below to initiate the AI pipeline.</p>
            </div>

            <div className="space-y-3">
              <Input 
                placeholder="https://www.tiktok.com/@..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-14 bg-[#FAFAFA] border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 text-base rounded-xl"
              />
              <Button 
                className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-base rounded-xl transition-all" 
                onClick={handleSubmit} 
                disabled={loading || !url}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                    Processing Pipeline...
                  </>
                ) : (
                  <>
                    Generate Viral Asset <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            {/* System Constraints Notice */}
            <div className="bg-[#FAFAFA] border border-zinc-100 rounded-xl p-4 space-y-2 text-xs text-zinc-500 font-medium">
              <p className="flex items-center"><Clock className="mr-2 h-4 w-4 text-zinc-400" /> Max 30 seconds (Free tier limit)</p>
              <p className="flex items-center"><Globe className="mr-2 h-4 w-4 text-zinc-400" /> Whisper-v3 auto-translates 100+ languages</p>
            </div>

            {/* Error State */}
            {error && (
              <div className="flex items-center p-4 text-red-600 bg-red-50 border border-red-100 rounded-xl text-sm font-medium">
                <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Success State */}
            {result && (
              <div className="mt-4 p-6 bg-zinc-900 rounded-2xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center text-white">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-[#FBE8A6]" /> 
                  <h3 className="text-base font-bold">Pipeline Complete</h3>
                </div>
                
                <div className="bg-zinc-800/50 p-4 rounded-xl text-sm text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed border border-zinc-700/50">
                  {result.caption}
                </div>
                
                <a href={`${BACKEND_URL}/api/download-video`} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full h-12 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-xl transition-all">
                    Download Watermarked Video
                  </Button>
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}