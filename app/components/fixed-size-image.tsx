"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { toPng } from "html-to-image"

interface FixedSizeImageProps {
  width: number
  height: number
  children: React.ReactNode
  onImageGenerated: (dataUrl: string) => void
}

export function FixedSizeImage({ width, height, children, onImageGenerated }: FixedSizeImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isGenerating && containerRef.current) {
      const generateImage = async () => {
        try {
          const dataUrl = await toPng(containerRef.current!, {
            width,
            height,
            pixelRatio: 1,
            quality: 1,
            canvasWidth: width,
            canvasHeight: height,
          })

          onImageGenerated(dataUrl)
          setIsGenerating(false)
        } catch (error) {
          console.error("Error generating image:", error)
          setIsGenerating(false)
        }
      }

      generateImage()
    }
  }, [isGenerating, width, height, onImageGenerated])

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: isGenerating ? "absolute" : "fixed",
          left: isGenerating ? "0" : "-9999px",
          top: isGenerating ? "0" : "-9999px",
          zIndex: isGenerating ? "-1" : "-9999",
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      <button onClick={() => setIsGenerating(true)} className="hidden">
        Generate
      </button>
    </>
  )
}

