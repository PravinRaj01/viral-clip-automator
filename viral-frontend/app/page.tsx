"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, CheckCircle2, AlertCircle, Clock, Globe, Github } from "lucide-react";

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
      // 1. Submit the task
      const res = await fetch(`${BACKEND_URL}/api/process-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      if (!res.ok) throw new Error("Failed to connect to the engine.");
      const { task_id } = await res.json();

      // 2. Poll the status until completed or failed
      const pollTimer = setInterval(async () => {
        try {
          const statusRes = await fetch(`${BACKEND_URL}/api/task-status/${task_id}`);
          const statusData = await statusRes.json();

          if (statusData.status === "completed") {
            clearInterval(pollTimer);
            setResult(statusData.result);
            setLoading(false);
          } else if (statusData.status === "failed") {
            clearInterval(pollTimer);
            setError(statusData.error || "Background processing failed.");
            setLoading(false);
          }
        } catch (err) {
          clearInterval(pollTimer);
          setError("Error checking status.");
          setLoading(false);
        }
      }, 3000); // Checks every 3 seconds

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-[#FBE8A6] selection:text-zinc-900 flex flex-col justify-center">
      <nav className="absolute top-0 w-full p-6 lg:px-12 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 z-50">
        <div className="font-extrabold text-2xl tracking-tighter text-zinc-900">
          Viral<span className="text-zinc-400">Automator</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/PravinRaj01/viral-clip-automator" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="h-10 rounded-full bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-semibold shadow-sm px-4 transition-all">
              <Github className="w-4 h-4 mr-2" />
              Source Code
            </Button>
          </a>
          <a href="https://pravinraj.dev" target="_blank" rel="noopener noreferrer">
            <Button className="h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-4 shadow-sm transition-all">
              <Globe className="w-4 h-4 mr-2" />
              pravinraj.dev
            </Button>
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
        <div className="space-y-8 mt-8 lg:mt-0">
          <h1 className="text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] text-zinc-900">
            Go Viral.<br />
            On <span className="relative inline-block">
              <span className="relative z-10">Autopilot.</span>
              <span className="absolute bottom-1 left-0 w-full h-[40%] bg-[#FBE8A6] -z-10 rounded-sm"></span>
            </span>
          </h1>
          <p className="text-lg text-zinc-500 max-w-md leading-relaxed font-medium">
            Automate downloads, video re-branding, and AI-driven metadata generation in seconds.
          </p>
        </div>

        <div className="bg-white p-8 lg:p-10 rounded-[2rem] border border-zinc-200 shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-1">Process Video</h2>
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
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Background Task...</>
                ) : (
                  <>Generate Viral Asset <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </div>

            {error && (
              <div className="flex items-center p-4 text-red-600 bg-red-50 border border-red-100 rounded-xl text-sm font-medium">
                <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

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
                    Download Final Video
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