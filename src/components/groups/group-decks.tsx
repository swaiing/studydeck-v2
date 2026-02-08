"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { shareDeckWithGroup, unshareDeckFromGroup } from "@/actions/group-actions"
import { getUserDecks } from "@/actions/deck-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FolderOpen, Share2, Trash2, Plus } from "lucide-react"
import Link from "next/link"

interface GroupDecksProps {
  groupId: string
  decks: any[]
  currentUserId: string
  isAdmin: boolean
}

export function GroupDecks({ groupId, decks, currentUserId, isAdmin }: GroupDecksProps) {
  const router = useRouter()
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [userDecks, setUserDecks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenShareDialog = async () => {
    setIsLoading(true)
    const result = await getUserDecks()
    if (result.success && result.data) {
      // Filter out decks that are already shared
      const sharedDeckIds = new Set(decks.map((d) => d.deckId))
      setUserDecks(result.data.filter((d) => !sharedDeckIds.has(d.id)))
    }
    setIsLoading(false)
    setIsShareDialogOpen(true)
  }

  const handleShareDeck = async (deckId: string) => {
    const result = await shareDeckWithGroup({ groupId, deckId })

    if (result.success) {
      setIsShareDialogOpen(false)
      router.refresh()
    } else {
      alert(result.error || "Failed to share deck")
    }
  }

  const handleUnshareDeck = async (deckId: string) => {
    if (!confirm("Are you sure you want to unshare this deck from the group?")) {
      return
    }

    const result = await unshareDeckFromGroup(groupId, deckId)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || "Failed to unshare deck")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Shared Decks ({decks.length})
          </CardTitle>
          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={handleOpenShareDialog} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share Deck
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Share a Deck with Group</DialogTitle>
                <DialogDescription>
                  Select one of your decks to share with this group
                </DialogDescription>
              </DialogHeader>
              {isLoading ? (
                <div className="py-8 text-center text-gray-500">Loading your decks...</div>
              ) : userDecks.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-600 mb-4">
                    You don't have any decks to share, or all your decks are already shared.
                  </p>
                  <Link href="/decks/new">
                    <Button variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create a Deck
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {userDecks.map((deck) => (
                    <button
                      key={deck.id}
                      onClick={() => handleShareDeck(deck.id)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">{deck.name}</div>
                      {deck.description && (
                        <div className="text-sm text-gray-600 line-clamp-1">{deck.description}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        {deck._count?.cards || 0} cards
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {decks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No decks shared yet. Share a deck to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decks.map(({ deck, addedBy }) => {
              const canUnshare = deck.userId === currentUserId || isAdmin

              return (
                <div key={deck.id} className="border border-gray-200 rounded-lg p-4">
                  <Link href={`/decks/${deck.id}`}>
                    <div className="mb-3 hover:text-indigo-600 transition-colors">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{deck.name}</h3>
                      {deck.description && (
                        <p className="text-sm text-gray-600 line-clamp-1 mt-1">{deck.description}</p>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-600">
                        {deck._count?.cards || 0} cards
                      </div>
                      <div className="text-xs text-gray-500">
                        by @{deck.user?.username}
                      </div>
                    </div>
                    {canUnshare && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnshareDeck(deck.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {deck.tags && deck.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {deck.tags.slice(0, 2).map((deckTag: any) => (
                        <Badge key={deckTag.tag.id} variant="secondary" className="text-xs">
                          {deckTag.tag.name}
                        </Badge>
                      ))}
                      {deck.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{deck.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
