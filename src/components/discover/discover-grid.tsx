import { DiscoverCard } from "./discover-card"

interface DiscoverGridProps {
  decks: any[]
  isLoggedIn?: boolean
}

export function DiscoverGrid({ decks, isLoggedIn = true }: DiscoverGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <DiscoverCard key={deck.id} deck={deck} isLoggedIn={isLoggedIn} />
      ))}
    </div>
  )
}
