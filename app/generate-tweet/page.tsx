"use client";

import { useState, type ChangeEvent, useRef } from "react";
import { Camera, Download, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toPng } from 'html-to-image';

export default function TwitterGenerator() {
  const [name, setName] = useState("Random Tweets");
  const [handle, setHandle] = useState("irtph");
  const [tweet, setTweet] = useState("dito mo ilagay yung quote mo,\ndapat hindi masyadong mahaba.");
  const [profileImage, setProfileImage] = useState("");
  const [background, setBackground] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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

  const generateImage = async () => {
    if (!previewRef.current) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const dataUrl = await toPng(previewRef.current, {
        width: 1500,
        height: 1500,
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });
      
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      
      setImageUrl(dataUrl);
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err instanceof Error ? err.message : "Failed to generate image");
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

  return (
    <div className="min-h-screen bg-[#15202B] text-white p-4 sm:p-6">
      {/* Hidden preview for screenshot */}
      <div 
        ref={previewRef}
        className="fixed -left-[9999px]"
        style={{
          width: '1500px',
          height: '1500px',
          backgroundColor: '#15202B',
          backgroundImage: background ? `url(${background})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '512px',
          background: '#151f2b',
          padding: '48px',
          borderRadius: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              overflow: 'hidden',
              marginRight: '12px',
              background: '#1f2937',
              border: '1px solid #374151',
            }}>
              <img 
                src={profileImage || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\'%3E%3Crect width=\'48\' height=\'48\' fill=\'%231f2937\'/%3E%3C/svg%3E'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt="Profile"
              />
            </div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>{name}</div>
              <div style={{ color: '#6b7280', fontSize: '20px' }}>@{handle}</div>
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>•••</div>
          </div>
          <div style={{
            color: 'white',
            fontSize: '24px',
            lineHeight: '1.5',
            whiteSpace: 'pre-line',
            marginTop: '16px',
          }}>
            {tweet}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold">Random Tweets Quote Generator</h1>
          <p className="text-sm text-gray-400">Create beautiful tweet quote images</p>
        </div>

        {/* Rest of your form JSX stays the same */}
        
        <Button
          onClick={generateImage}
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
