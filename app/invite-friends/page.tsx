"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft, Copy, MessageSquare, Search, User, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for contacts
const mockContacts = [
  { id: 1, name: "Alex Johnson", phone: "***-***-1234", status: "not-on-app" },
  { id: 2, name: "Jamie Smith", phone: "***-***-5678", status: "pending" },
  { id: 3, name: "Taylor Brown", phone: "***-***-9012", status: "connected" },
  { id: 4, name: "Jordan Lee", phone: "***-***-3456", status: "not-on-app" },
  { id: 5, name: "Casey Wilson", phone: "***-***-7890", status: "not-on-app" },
  { id: 6, name: "Riley Garcia", phone: "***-***-2345", status: "pending" },
  { id: 7, name: "Morgan Davis", phone: "***-***-6789", status: "connected" },
  { id: 8, name: "Quinn Martinez", phone: "***-***-0123", status: "not-on-app" },
  { id: 9, name: "Avery Robinson", phone: "***-***-4567", status: "not-on-app" },
  { id: 10, name: "Drew Thompson", phone: "***-***-8901", status: "pending" },
]

type ContactStatus = "not-on-app" | "pending" | "connected"

interface Contact {
  id: number
  name: string
  phone: string
  status: ContactStatus
}

export default function InviteFriendsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const pendingContacts = contacts.filter((contact) => contact.status === "pending")
  const connectedContacts = contacts.filter((contact) => contact.status === "connected")
  const progress = (connectedContacts.length / 5) * 100

  const handleInvite = (id: number) => {
    setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, status: "pending" } : contact)))
  }

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 border-b">
        <div className="w-full max-w-md mx-auto">
          <Link href="/contacts-access" className="inline-flex items-center text-forest-500 dark:text-cream-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto">
          <Tabs defaultValue="invite">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="invite" className="flex-1">
                Invite Friends
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">
                Pending Requests
                {pendingContacts.length > 0 && <Badge className="ml-2 bg-forest-500">{pendingContacts.length}</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invite" className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Contacts</h2>
                  <div className="text-xs text-muted-foreground">{connectedContacts.length}/5 friends connected</div>
                </div>
                <Progress value={progress} className="h-2 bg-muted" />
              </div>

              <div className="space-y-3">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(contact.status)}
                      {contact.status === "not-on-app" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <UserPlus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleInvite(contact.id)}>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleInvite(contact.id)}>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              iMessage
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleInvite(contact.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-sm font-medium">Pending Invitations</h2>
                {pendingContacts.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground">No pending invitations</div>
                ) : (
                  <div className="space-y-3">
                    {pendingContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.phone}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-amber-500 border-amber-500">
                          Pending
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Button className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100" size="lg" asChild>
              <Link href={connectedContacts.length >= 5 ? "/home" : "/pending-progress"}>Continue</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
