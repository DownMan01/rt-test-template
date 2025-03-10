"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Camera, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toPng } from "html-to-image"

export default function TwitterGenerator() {
  const [name, setName] = useState("Random Tweets")
  const [handle, setHandle] = useState("irtph")
  const [tweet, setTweet] = useState("dito mo ilagay yung quote mo, \ndapat hindi masyadong mahaba. ")
  const [profileImage, setProfileImage] = useState("/rt.svg?height=80&width=80")
  const [background, setBackground] = useState("")
  const tweetRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackground(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadImage = async () => {
    if (!tweetRef.current) return

    setIsGenerating(true)

    try {
      // Directly capture the preview element
      const dataUrl = await toPng(tweetRef.current, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 3, // Higher pixel ratio for better quality
        canvasWidth: 1500,
        canvasHeight: 1500,
      })

      // Create download link
      const link = document.createElement("a")
      link.download = "twitter-quote.png"
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
      alert("Failed to generate image. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#15202B] text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center">Twitter Quote Generator</h1>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="bg-gray-900/50 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Username</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-900/70 text-gray-400">
                  @
                </span>
                <Input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="username"
                  className="rounded-l-none bg-gray-900/50 border-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Tweet Text</label>
            <Textarea
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              placeholder="Enter your tweet..."
              className="h-32 bg-gray-900/50 border-gray-700 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm block mb-2">Profile Image</label>
              <label className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium bg-gray-900/50 border border-gray-700 rounded-md hover:bg-gray-800 cursor-pointer">
                <Camera className="w-4 h-4 mr-2" />
                Upload Profile
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
              </label>
            </div>

            <div>
              <label className="text-sm block mb-2">Background Image</label>
              <label className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium bg-gray-900/50 border border-gray-700 rounded-md hover:bg-gray-800 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Background
                <input type="file" accept="image/*" className="hidden" onChange={handleBackgroundChange} />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4"></div>
        <div className="mt-4"></div>



        {/* Preview with outer shadow only */}
        <div
          className="relative shadow-2xl rounded-lg"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <div
            ref={tweetRef}
            className="aspect-square relative overflow-hidden rounded-lg"
            style={{
              backgroundColor: "#15202B",
              backgroundImage: background ? `url(${background})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
            }}
          >
            {/* Tweet container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-lg bg-[#151f2b] px-12">
                {/* Profile section */}
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-800 border border-gray-700">
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="text-white font-bold text-lg">{name}</div>
                    <div className="text-gray-500">@{handle}</div>
                  </div>
                  <div className="text-gray-500 text-sm leading-none">•••</div>
                </div>

                {/* Tweet content */}
                <div className="mt-4">
                  <p className="text-white text-xl whitespace-pre-line">{tweet}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={downloadImage} className="bg-blue-500 hover:bg-blue-600" disabled={isGenerating}>
            {isGenerating ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

