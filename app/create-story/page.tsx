"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ImageIcon, Pencil, Type, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CreateStoryPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [isAddingText, setIsAddingText] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between">
          <Link href="/home" className="inline-flex items-center text-forest-500 dark:text-cream-300">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
          <h1 className="font-medium">Create Story</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="text-center text-sm text-muted-foreground">Stories disappear after 24 hours</div>

          <div className="relative bg-black rounded-lg overflow-hidden aspect-[9/16] flex items-center justify-center">
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Story preview"
                  width={600}
                  height={1067}
                  className="w-full h-full object-cover"
                />

                {isAddingText && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <textarea
                      className="w-full bg-transparent text-white text-center text-xl border-none focus:outline-none resize-none"
                      placeholder="Add text to your story..."
                      value={text}
                      onChange={handleTextChange}
                      autoFocus
                    />
                  </div>
                )}

                {text && !isAddingText && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="text-white text-center text-xl">{text}</div>
                  </div>
                )}

                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setIsAddingText(!isAddingText)}
                  >
                    <Type className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-black/50 hover:bg-black/70 text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button variant="destructive" size="icon" className="rounded-full" onClick={removeImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <label className="cursor-pointer flex flex-col items-center">
                  <ImageIcon className="h-10 w-10 text-white mb-2" />
                  <span className="text-white mb-2">Add a photo to your story</span>
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                    Upload Image
                  </Button>
                  <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            )}
          </div>

          <Button
            className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100"
            size="lg"
            disabled={!imagePreview}
            asChild
          >
            <Link href="/home">Share to Your Story</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
