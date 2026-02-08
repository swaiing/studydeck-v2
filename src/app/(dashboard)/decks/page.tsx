import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserDecks, getAddedDecks } from "@/actions/deck-actions"
import Link from "next/link"
import { Plus, BookOpen, Lock, Globe, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DecksPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const [userDecksResult, addedDecksResult] = await Promise.all([
    getUserDecks(),
    getAddedDecks(),
  ])

  const userDecks = userDecksResult.success ? userDecksResult.data || [] : []
  const addedDecks = addedDecksResult.success ? addedDecksResult.data || [] : []

  const allDecks = [...userDecks]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Decks</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Manage your flashcard decks and start studying
            </p>
          </div>
          <Link href="/decks/new" className="sm:shrink-0">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Create Deck
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-indigo-600">
                {userDecks.length}
              </CardTitle>
              <CardDescription>Created by you</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-indigo-600">
                {addedDecks.length}
              </CardTitle>
              <CardDescription>Added from others</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-indigo-600">
                {allDecks.reduce((sum, deck) => sum + (deck._count?.cards || 0), 0)}
              </CardTitle>
              <CardDescription>Total cards</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Decks List */}
        {allDecks.length === 0 ? (
          <Card className="p-6 sm:p-12 text-center">
            <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No decks yet</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Create your first deck to start studying</p>
            <Link href="/decks/new">
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Create your first deck
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Your Decks */}
            {userDecks.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Decks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userDecks.map((deck) => (
                    <DeckCard key={deck.id} deck={deck} />
                  ))}
                </div>
              </div>
            )}

            {/* Added Decks */}
            {addedDecks.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Added Decks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addedDecks.map((deck) => (
                    <DeckCard key={deck.id} deck={deck} isAdded />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface DeckCardProps {
  deck: any
  isAdded?: boolean
}

function DeckCard({ deck, isAdded = false }: DeckCardProps) {
  const privacy = deck.privacy as "private" | "public" | "unlisted"

  const privacyIcon = {
    private: <Lock className="h-3 w-3" />,
    public: <Globe className="h-3 w-3" />,
    unlisted: <LinkIcon className="h-3 w-3" />,
  }[privacy]

  const privacyLabel = {
    private: "Private",
    public: "Public",
    unlisted: "Unlisted",
  }[privacy]

  return (
    <Link href={`/decks/${deck.id}`}>
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-lg line-clamp-2">{deck.name}</CardTitle>
            <Badge variant="outline" className="gap-1 shrink-0">
              {privacyIcon}
              {privacyLabel}
            </Badge>
          </div>
          {deck.description && (
            <CardDescription className="line-clamp-2">{deck.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>{deck._count?.cards || 0} cards</span>
            {isAdded && deck.user && (
              <span className="text-xs">by @{deck.user.username}</span>
            )}
          </div>
          {deck.tags && deck.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {deck.tags.slice(0, 3).map((deckTag: any) => (
                <Badge key={deckTag.tag.id} variant="secondary" className="text-xs">
                  {deckTag.tag.name}
                </Badge>
              ))}
              {deck.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{deck.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
