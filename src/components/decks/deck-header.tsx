import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Globe, Link as LinkIcon, Play, Share2 } from "lucide-react"
import Link from "next/link"

interface DeckHeaderProps {
  deck: any
  isOwner: boolean
}

export function DeckHeader({ deck, isOwner }: DeckHeaderProps) {
  const privacy = deck.privacy as "private" | "public" | "unlisted"

  const privacyIcon = {
    private: <Lock className="h-4 w-4" />,
    public: <Globe className="h-4 w-4" />,
    unlisted: <LinkIcon className="h-4 w-4" />,
  }[privacy]

  const privacyLabel = {
    private: "Private",
    public: "Public",
    unlisted: "Unlisted",
  }[privacy]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-gray-900">{deck.name}</h1>
            <Badge variant="outline" className="gap-1">
              {privacyIcon}
              {privacyLabel}
            </Badge>
          </div>
          {deck.description && (
            <p className="text-gray-600 mb-4">{deck.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{deck._count?.cards || 0} cards</span>
            {!isOwner && deck.user && (
              <span>by @{deck.user.username}</span>
            )}
            {deck._count?.comments > 0 && (
              <span>{deck._count.comments} comments</span>
            )}
          </div>
          {deck.tags && deck.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {deck.tags.map((deckTag: any) => (
                <Badge key={deckTag.tag.id} variant="secondary">
                  {deckTag.tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-6">
          {deck.cards && deck.cards.length > 0 && (
            <Link href={`/decks/study/${deck.id}`}>
              <Button className="gap-2 w-full">
                <Play className="h-4 w-4" />
                Study
              </Button>
            </Link>
          )}
          {!isOwner && (
            <Button variant="outline" className="gap-2 w-full">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
