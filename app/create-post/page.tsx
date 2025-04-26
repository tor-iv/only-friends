"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ImageIcon, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CreatePostPage() {
  const [caption, setCaption] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between">
          <Link href="/home" className="inline-flex items-center text-forest-500 dark:text-cream-300">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
          <h1 className="font-medium">Create Post</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[120px] resize-none"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            {imagePreview ? (
              <div className="relative">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Post preview"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-8 h-8 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <label className="cursor-pointer flex flex-col items-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground mb-2">Add a photo to your post</span>
                  <Button variant="outline" size="sm">
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
            disabled={!caption.trim() && !imagePreview}
            asChild
          >
            <Link href="/home">Post</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
