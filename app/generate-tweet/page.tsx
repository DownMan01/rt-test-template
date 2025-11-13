"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SimpleAPIGenerator() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!quote.trim()) {
      setError("Please enter a quote");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote,
          name: "Random Tweets",
          handle: "irtph",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const blob = await response.blob();
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `tweet-quote-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#15202B] text-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold">API Tweet Generator</h1>
          <p className="text-sm text-gray-400">Powered by Puppeteer + Chromium</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Quote</label>
            <Textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter your inspiring quote..."
              className="h-32 bg-gray-900/50 border-gray-700 resize-none"
              maxLength={500}
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{quote.length}/500 characters</span>
              {quote.length > 400 && (
                <span className="text-yellow-500">
                  {500 - quote.length} characters remaining
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={generateImage}
            disabled={loading || !quote.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating on server...
              </>
            ) : (
              "Generate Tweet Image"
            )}
          </Button>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {imageUrl && (
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
                <img src={imageUrl} alt="Generated tweet" className="w-full h-auto" />
              </div>

              <Button
                onClick={downloadImage}
                variant="outline"
                className="w-full border-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          <p>
            Server-side rendering with Puppeteer
            <br />
            Compatible with Vercel Edge + local testing
          </p>
        </div>
      </div>
    </div>
  );
}
