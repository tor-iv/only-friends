"use client"

import { ArrowLeft, ChevronDown, Mail, MessageCircle } from "lucide-react"
import BackButton from "@/components/back-button"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full p-4 text-left flex justify-between items-center hover:bg-muted/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t">
          <p className="text-muted-foreground">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function HelpSupportPage() {
  const faqs = [
    {
      question: "How do I add friends?",
      answer:
        "You can add friends by going to the Add Friends page from your profile. You can search for friends by username or phone number, or invite them via text message.",
    },
    {
      question: "How do I create a post?",
      answer:
        "Tap the + button in the bottom navigation bar to create a new post. You can add text, photos, or both to share with your friends.",
    },
    {
      question: "How do I change my profile picture?",
      answer:
        "Go to your profile page and tap on your profile picture. You'll be prompted to upload a new photo or take a picture.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, you can delete your account in Account Settings. Please note that this action is permanent and all your data will be deleted.",
    },
    {
      question: "Who can see my posts?",
      answer:
        "Only your friends can see your posts. You can adjust your privacy settings to control who can see your profile and posts.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <BackButton fallbackPath="/settings" className="inline-flex items-center text-forest-500">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </BackButton>
          <h1 className="font-medium ml-4">Help & Support</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Support</h2>
            <p className="text-muted-foreground">
              Need more help? Our support team is ready to assist you with any questions or issues.
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <Button className="flex items-center" asChild>
                <Link href="mailto:support@onlyfriends.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Link>
              </Button>
              <Button variant="outline" className="flex items-center" asChild>
                <Link href="/chat-support">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Live Chat
                </Link>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Troubleshooting</h2>
            <div className="space-y-2">
              <Link href="/settings/help/connection-issues" className="block text-forest-500 hover:underline">
                Connection Issues
              </Link>
              <Link href="/settings/help/login-problems" className="block text-forest-500 hover:underline">
                Login Problems
              </Link>
              <Link href="/settings/help/missing-content" className="block text-forest-500 hover:underline">
                Missing Content
              </Link>
              <Link href="/settings/help/app-performance" className="block text-forest-500 hover:underline">
                App Performance
              </Link>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-2">Report an Issue</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Found a bug or experiencing a problem? Let us know so we can fix it.
            </p>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/settings/help/report">Report Issue</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
