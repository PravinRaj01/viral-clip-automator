"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ProcessVideoResult {
  caption: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessVideoResult | null>(null);
  const [error, setError] = useState("");

  // Get the backend URL from environment variables
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
      // Uses the dynamic BACKEND_URL instead of a hardcoded string
      const res = await fetch(`${BACKEND_URL}/api/process-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      if (!res.ok) throw new Error("Backend failed to process video.");
      
      const data = await res.json();
      setResult(data);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-zinc-950 text-zinc-50">
      <Card className="w-full max-w-xl bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-emerald-400">
            Viral Clip Automator
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Paste a TikTok or YouTube Shorts link. We will download it, re-brand it, and generate a viral Llama-3 caption.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="https://www.youtube.com/shorts/..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          <Button 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processing Engine (This takes ~30s)...
              </>
            ) : "Generate Viral Asset"}
          </Button>

          {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}

          {result && (
            <div className="mt-6 p-5 bg-zinc-800 border border-zinc-700 rounded-lg space-y-3">
              <h3 className="text-lg font-bold text-emerald-400">✅ Processing Complete</h3>
              <div className="bg-zinc-950 p-4 rounded text-sm text-zinc-300 font-mono whitespace-pre-wrap">
                {result.caption}
              </div>
              <p className="text-xs text-zinc-500 italic mt-2">
                *Request sent to: {BACKEND_URL}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}