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
  const [profileImage, setProfileImage] = useState("/rt.svg?height=80&width=80");
  const [background, setBackground] = useState("/bg-rt.png?height=1500&width=1500");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => ev.target?.result && setter(ev.target.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const generateServerImage = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, handle, tweet, profileImage, background }),
      });
      if (!res.ok) throw new Error("Failed to generate image");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "twitter-quote.png";
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#15202B] text-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <h1 className="text-xl sm:text-2xl font-bold text-center">Random Tweets Quote Generator</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-900/50 border-gray-700" />
          </div>

          <div>
            <label className="text-sm">Username</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-900/70 text-gray-400">@</span>
              <Input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="rounded-l-none bg-gray-900/50 border-gray-700"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm">Tweet Text</label>
          <Textarea value={tweet} onChange={(e) => setTweet(e.target.value)} className="h-24 sm:h-32 bg-gray-900/50 border-gray-700 resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-2">Profile Image</label>
            <label className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium bg-gray-900/50 border border-gray-700 rounded-md hover:bg-gray-800 cursor-pointer">
              <Camera className="w-4 h-4 mr-2" /> Upload Profile
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, setProfileImage)} />
            </label>
          </div>
          <div>
            <label className="text-sm block mb-2">Background Image</label>
            <label className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium bg-gray-900/50 border border-gray-700 rounded-md hover:bg-gray-800 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" /> Upload Background
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, setBackground)} />
            </label>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={generateServerImage}
            className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Generate Tweet Image"}
          </Button>
        </div>

        {imageUrl && (
          <div className="space-y-4 mt-6">
            <img src={imageUrl} alt="Generated tweet" className="w-full border border-gray-700 rounded-lg" />
            <Button onClick={downloadImage} variant="outline" className="w-full border-gray-700">
              <Download className="w-4 h-4 mr-2" /> Download Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
