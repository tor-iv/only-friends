"use client"

import type React from "react"

import { useState } from "react"
import { Upload, User } from "lucide-react"

export default function ProfilePictureUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  return (
    <div className="relative">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-forest-500">
        {previewUrl ? (
          <img src={previewUrl || "/placeholder.svg"} alt="Profile preview" className="w-full h-full object-cover" />
        ) : (
          <User className="w-12 h-12 text-muted-foreground" />
        )}
      </div>

      <label htmlFor="profile-picture" className="absolute -bottom-2 -right-2">
        <div className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center cursor-pointer hover:bg-forest-600 transition-colors">
          <Upload className="w-4 h-4 text-white" />
        </div>
        <input type="file" id="profile-picture" className="sr-only" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  )
}
