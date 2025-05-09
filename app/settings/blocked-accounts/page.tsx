"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserX, Plus, Search, X } from "lucide-react"
import BackButton from "@/components/back-button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"

// Mock data for blocked contacts
type BlockedContact = {
  id: string
  name: string
  phoneNumber: string
  blockedAt: Date
}

// Mock data for all contacts
type Contact = {
  id: string
  name: string
  phoneNumber: string
  profilePicture?: string
}

export default function BlockedAccountsPage() {
  const [blockedContacts, setBlockedContacts] = useState<BlockedContact[]>([
    {
      id: "1",
      name: "John Smith",
      phoneNumber: "+1 (555) 123-4567",
      blockedAt: new Date(2023, 3, 15),
    },
    {
      id: "2",
      name: "Sarah Johnson",
      phoneNumber: "+1 (555) 987-6543",
      blockedAt: new Date(2023, 5, 22),
    },
  ])

  const [allContacts, setAllContacts] = useState<Contact[]>([
    { id: "1", name: "John Smith", phoneNumber: "+1 (555) 123-4567" },
    { id: "2", name: "Sarah Johnson", phoneNumber: "+1 (555) 987-6543" },
    { id: "3", name: "Michael Brown", phoneNumber: "+1 (555) 456-7890" },
    { id: "4", name: "Emily Davis", phoneNumber: "+1 (555) 789-0123" },
    { id: "5", name: "David Wilson", phoneNumber: "+1 (555) 321-6547" },
    { id: "6", name: "Jessica Taylor", phoneNumber: "+1 (555) 654-9870" },
    { id: "7", name: "Robert Martinez", phoneNumber: "+1 (555) 258-3690" },
    { id: "8", name: "Jennifer Anderson", phoneNumber: "+1 (555) 147-2583" },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [unblockContactId, setUnblockContactId] = useState<string | null>(null)
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false)

  // Filter contacts based on search query
  const filteredContacts = allContacts.filter((contact) => {
    const isBlocked = blockedContacts.some((blocked) => blocked.id === contact.id)
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || contact.phoneNumber.includes(searchQuery)

    return !isBlocked && matchesSearch
  })

  // Handle blocking a contact
  const handleBlockContact = (contactId: string) => {
    const contactToBlock = allContacts.find((contact) => contact.id === contactId)
    if (contactToBlock) {
      const newBlockedContact: BlockedContact = {
        ...contactToBlock,
        blockedAt: new Date(),
      }
      setBlockedContacts([...blockedContacts, newBlockedContact])
      setIsBlockDialogOpen(false)
    }
  }

  // Handle unblocking a contact
  const handleUnblockContact = () => {
    if (unblockContactId) {
      setBlockedContacts(blockedContacts.filter((contact) => contact.id !== unblockContactId))
      setUnblockContactId(null)
      setIsUnblockDialogOpen(false)
    }
  }

  // Open unblock dialog
  const openUnblockDialog = (contactId: string) => {
    setUnblockContactId(contactId)
    setIsUnblockDialogOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <BackButton fallbackPath="/settings/privacy" className="inline-flex items-center text-forest-500">
            Back
          </BackButton>
          <h1 className="font-medium ml-4">Blocked Accounts</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="bg-forest-50 p-4 rounded-lg border border-forest-100">
            <p className="text-sm text-forest-800">
              Blocked contacts won't be able to see your posts, comment on your content, or send you messages.
            </p>
          </div>

          {/* Block new contact button */}
          <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-forest-500 hover:bg-forest-600">
                <Plus className="h-4 w-4 mr-2" />
                Block Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Block Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-72 rounded-md border">
                  {filteredContacts.length > 0 ? (
                    <div className="p-4 space-y-2">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-forest-100 flex items-center justify-center">
                              {contact.profilePicture ? (
                                <img
                                  src={contact.profilePicture || "/placeholder.svg"}
                                  alt={contact.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-forest-500 font-medium">{contact.name.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.phoneNumber}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBlockContact(contact.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Block
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <UserX className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        {searchQuery ? "No contacts found matching your search" : "No contacts available to block"}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>

          {/* Blocked contacts list */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium flex items-center">
              <UserX className="h-5 w-5 mr-2 text-forest-500" />
              Blocked Contacts
            </h2>

            {blockedContacts.length > 0 ? (
              <div className="space-y-3">
                {blockedContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.phoneNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Blocked on {format(contact.blockedAt, "MMMM d, yyyy")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openUnblockDialog(contact.id)}
                      className="text-forest-500 hover:text-forest-600 hover:bg-forest-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Unblock
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border rounded-md">
                <UserX className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">You haven't blocked any contacts yet</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Unblock confirmation dialog */}
      <AlertDialog open={isUnblockDialogOpen} onOpenChange={setIsUnblockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock Contact</AlertDialogTitle>
            <AlertDialogDescription>
              This will unblock the contact. They will be able to see your posts, comment on your content, and send you
              messages again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUnblockContactId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnblockContact} className="bg-forest-500 hover:bg-forest-600">
              Unblock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
