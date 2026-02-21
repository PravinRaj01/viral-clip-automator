"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle, Sparkles, CheckCircle2, Clock, Globe } from "lucide-react";

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
      
      if (!res.ok) throw new Error("Backend timeout or processing failure. Try a shorter video.");
      
      const data = await res.json();
      setResult(data);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-950 text-zinc-50 selection:bg-emerald-500/30">
      
      {/* SaaS-Style Badge */}
      <div className="mb-6 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 backdrop-blur-sm">
        <Sparkles className="mr-2 h-4 w-4" />
        AI-Powered Growth Engine v1.0
      </div>

      <Card className="w-full max-w-2xl bg-zinc-900/50 border-zinc-800 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl text-white">
        <CardHeader className="text-center space-y-2 pb-4">
          <CardTitle className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            Viral Clip Automator
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base">
            Instantly download, re-brand, and generate viral metadata for short-form content.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          
          {/* Platform Status Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="flex items-center rounded-md bg-zinc-800 px-3 py-1.5 border border-zinc-700">
               <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
               TikTok (Active)
            </span>
            <span className="flex items-center rounded-md bg-zinc-800/50 px-3 py-1.5 border border-zinc-700/50 text-zinc-500">
               <span className="flex h-2 w-2 rounded-full bg-amber-500/50 mr-2"></span>
               YouTube Shorts (Coming Soon)
            </span>
            <span className="flex items-center rounded-md bg-zinc-800/50 px-3 py-1.5 border border-zinc-700/50 text-zinc-500">
               <span className="flex h-2 w-2 rounded-full bg-amber-500/50 mr-2"></span>
               IG Reels (Coming Soon)
            </span>
          </div>

          {/* System Limits / Capabilities Info Box */}
          <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4 space-y-2 text-sm text-zinc-400">
            <p className="flex items-center"><Clock className="mr-2 h-4 w-4 text-emerald-500" /> <strong>Limit:</strong> Videos must be under 30 seconds (Free Cloud Tier constraint).</p>
            <p className="flex items-center"><Globe className="mr-2 h-4 w-4 text-emerald-500" /> <strong>Languages:</strong> Whisper-Large-v3 natively detects and translates 100+ languages.</p>
          </div>

          {/* Input Area */}
          <div className="space-y-3 pt-2">
            <Input 
              placeholder="Paste a TikTok link here..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500"
            />
            <Button 
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all" 
              onClick={handleSubmit} 
              disabled={loading || !url}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                  Processing Engine (Takes ~30-60s)...
                </>
              ) : "Generate Viral Asset"}
            </Button>
          </div>

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center p-3 text-red-400 bg-red-400/10 border border-red-400/20 rounded-md text-sm">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}

          {/* Success State */}
          {result && (
            <div className="mt-6 p-5 bg-zinc-950 border border-emerald-500/30 rounded-lg space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5" /> Pipeline Complete
                </h3>
              </div>
              
              <div className="bg-zinc-900 p-4 rounded border border-zinc-800 text-sm text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
                {result.caption}
              </div>
              
              <a href={`${BACKEND_URL}/api/download-video`} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold border-none">
                  🎬 Download Watermarked Video
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Footer / Portfolio Watermark */}
      <p className="mt-8 text-xs text-zinc-600">
        Architected for scalability & automation.
      </p>
    </main>
  );
}