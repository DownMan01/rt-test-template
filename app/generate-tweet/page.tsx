"use client";

import { useState, type ChangeEvent } from "react";
import { Camera, Download, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TwitterGenerator() {
  const [name, setName] = useState("Random Tweets");
  const [handle, setHandle] = useState("irtph");
  const [tweet, setTweet] = useState("dito mo ilagay yung quote mo,\ndapat hindi masyadong mahaba.");
  const [profileImage, setProfileImage] = useState("");
  const [background, setBackground] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setter(ev.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const generateServerImage = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Build the API URL - adjust this based on your deployment
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/generate-tweet';
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name, 
          handle, 
          tweet, 
          profileImage: profileImage || undefined,
          background: background || undefined
        }),
      });

      // Check if response is ok
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        
        // If the response is JSON, it's an error message
        if (contentType?.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(errorData.error || errorData.details || "Failed to generate image");
        }
        
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      // Check if we got an image back
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("image/png")) {
        const text = await res.text();
        console.error("Unexpected response:", text);
        throw new Error("Server did not return an image. Check console for details.");
      }

      // Create blob and display image
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      
      // Clean up old image URL if exists
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      
      setImageUrl(url);
      
    } catch (err) {
      console.error("Error generating image:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      alert(`Failed to generate image: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `twitter-quote-${Date.now()}.png`;
    link.click();
  };

  const clearImage = (type: 'profile' | 'background') => {
    if (type === 'profile') {
      setProfileImage("");
    } else {
      setBackground("");
    }
  };

  return (
    <div className="min-h-screen bg-[#15202B] text-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold">Random Tweets Quote Generator</h1>
          <p className="text-sm text-gray-400">Create beautiful tweet quote images</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-2">Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="bg-gray-900/50 border-gray-700"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="text-sm block mb-2">Username</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-900/70 text-gray-400">
                @
              </span>
              <Input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="rounded-l-none bg-gray-900/50 border-gray-700"
                placeholder="username"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm block mb-2">Tweet Text</label>
          <Textarea 
            value={tweet} 
            onChange={(e) => setTweet(e.target.value)} 
            className="h-24 sm:h-32 bg-gray-900/50 border-gray-700 resize-none" 
            placeholder="Enter your tweet text here..."
          />
          <p className="text-xs text-gray-500 mt-1">Tip: Use line breaks for better formatting</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-2">Profile Image (Optional)</label>
            <div className="space-y-2">
              <label className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium bg-gray-900/50 border border-gray-700 rounded-md hover:bg-gray-800 cursor-pointer transition">
                <Camera className="w-4 h-4 mr-2" /> 
                {profileImage ? "Change Profile" : "Upload Profile"}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleUpload(e, setProfileImage)} 
                />
              </label>
              {profileImage && (
                <div className="flex items-center gap-2">
                  <img src={profileImage} alt="Profile preview" className="w-10 h-10 rounded-full object-cover border border-gray-700" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => clearImage('profile')}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm block mb-2">Background Image (Optional)</label>
            <div className="space-y-2">
              <label className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium bg-gray-900/50 border border-gray-700 rounded-md hover:bg-gray-800 cursor-pointer transition">
                <Upload className="w-4 h-4 mr-2" /> 
                {background ? "Change Background" : "Upload Background"}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleUpload(e, setBackground)} 
                />
              </label>
              {background && (
                <div className="flex items-center gap-2">
                  <img src={background} alt="Background preview" className="w-16 h-10 rounded object-cover border border-gray-700" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => clearImage('background')}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Button
            onClick={generateServerImage}
            className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto px-8 py-2"
            disabled={isGenerating || !name || !handle || !tweet}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Tweet Image"
            )}
          </Button>
        </div>

        {imageUrl && (
          <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Generated tweet" 
                className="w-full"
              />
            </div>
            <Button 
              onClick={downloadImage} 
              variant="outline" 
              className="w-full border-gray-700 hover:bg-gray-800"
            >
              <Download className="w-4 h-4 mr-2" /> 
              Download Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
