import { DiscoverCard } from "./discover-card"

interface DiscoverGridProps {
  decks: any[]
}

export function DiscoverGrid({ decks }: DiscoverGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <DiscoverCard key={deck.id} deck={deck} />
      ))}
    </div>
  )
}
