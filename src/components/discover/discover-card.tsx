"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, User, MessageSquare, Users } from "lucide-react"
import { addDeckToLibrary, removeDeckFromLibrary } from "@/actions/discover-actions"

interface DiscoverCardProps {
  deck: any
  isLoggedIn?: boolean
}

export function DiscoverCard({ deck, isLoggedIn = true }: DiscoverCardProps) {
  const router = useRouter()
  const [isAdded, setIsAdded] = useState(deck.isAdded)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleLibrary = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = isAdded
      ? await removeDeckFromLibrary(deck.id)
      : await addDeckToLibrary({ deckId: deck.id })

    if (result.success) {
      setIsAdded(!isAdded)
      router.refresh()
    } else {
      alert(result.error || 'Failed to update library')
    }

    setIsLoading(false)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          {isLoggedIn ? (
            <Link href={`/decks/${deck.id}`} className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-2 hover:text-indigo-600 transition-colors">
                {deck.name}
              </CardTitle>
            </Link>
          ) : (
            <CardTitle className="text-lg line-clamp-2 flex-1 min-w-0">
              {deck.name}
            </CardTitle>
          )}
          {isLoggedIn && !deck.isOwner && (
            <Button
              size="sm"
              variant={isAdded ? "outline" : "default"}
              onClick={handleToggleLibrary}
              disabled={isLoading}
              className="shrink-0"
            >
              {isAdded ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          )}
        </div>
        {deck.description && (
          <CardDescription className="line-clamp-2">{deck.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="font-medium">{deck._count?.cards || 0}</span>
            <span>cards</span>
          </div>
          {deck._count?.comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{deck._count.comments}</span>
            </div>
          )}
          {deck._count?.userDecks > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{deck._count.userDecks}</span>
            </div>
          )}
        </div>

        {/* Author */}
        <div className="text-sm text-gray-600 mb-3">
          by <span className="font-medium text-gray-900">@{deck.user?.username}</span>
        </div>

        {/* Tags */}
        {deck.tags && deck.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {deck.tags.slice(0, 3).map((deckTag: any) => (
              <Badge key={deckTag.tag.id} variant="secondary" className="text-xs">
                {deckTag.tag.name}
              </Badge>
            ))}
            {deck.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{deck.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Sign up CTA for logged out users */}
        {!isLoggedIn && (
          <div className="mt-4 pt-4 border-t">
            <Link href="/signup">
              <Button className="w-full">
                Sign up to study
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
