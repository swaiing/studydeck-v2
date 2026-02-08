import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDeckById } from "@/actions/deck-actions"
import { getDeckComments } from "@/actions/comment-actions"
import { DeckHeader } from "@/components/decks/deck-header"
import { DeckSettings } from "@/components/decks/deck-settings"
import { CardList } from "@/components/cards/card-list"
import { DeckComments } from "@/components/decks/deck-comments"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const { id } = await params
  const [deckResult, commentsResult] = await Promise.all([
    getDeckById(id),
    getDeckComments(id),
  ])

  if (!deckResult.success || !deckResult.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Deck not found</h1>
            <p className="text-gray-600 mb-6">{deckResult.error || "The deck you're looking for doesn't exist or you don't have access to it."}</p>
            <Link
              href="/decks"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Decks
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const deck = deckResult.data
  const comments = commentsResult.success ? commentsResult.data || [] : []
  const isOwner = deck.userId === session.user?.id

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/decks"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Decks
        </Link>

        {/* Deck Header */}
        <DeckHeader deck={deck} isOwner={isOwner} />

        {/* Deck Settings (for owners) */}
        {isOwner && (
          <div className="mt-6">
            <DeckSettings deck={deck} />
          </div>
        )}

        {/* Cards List */}
        <div className="mt-8">
          <CardList deckId={deck.id} cards={deck.cards} isOwner={isOwner} />
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <DeckComments
            deckId={deck.id}
            initialComments={comments}
            currentUserId={session.user?.id || ''}
            deckOwnerId={deck.userId}
          />
        </div>
      </div>
    </div>
  )
}
