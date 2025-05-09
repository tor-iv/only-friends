"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import ProfilePictureUpload from "@/components/profile-picture-upload"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function CreateProfilePage() {
  const [birthday, setBirthday] = useState<Date | undefined>(undefined)

  return (
    <div className="min-h-screen flex flex-col items-center p-6 leaf-pattern">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <div className="w-full">
          <Link href="/verify" className="inline-flex items-center text-forest-500 dark:text-cream-300 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-bold">Create Your Profile</h1>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <ProfilePictureUpload />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="First Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Last Name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="birthday"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !birthday && "text-muted-foreground")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {birthday ? format(birthday, "PPP") : <span>Select your birthday</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={birthday}
                      onSelect={setBirthday}
                      initialFocus
                      disabled={(date) => date > new Date() || date < new Date(new Date().getFullYear() - 100, 0, 1)}
                      captionLayout="dropdown-buttons"
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Your birthday will be shared with friends on your special day.
                </p>
              </div>
            </div>

            <Button className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100" size="lg" asChild>
              <Link href="/contacts-access">Continue</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
