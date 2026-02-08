"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CardEditor } from "./card-editor"
import { CardItem } from "./card-item"
import { Plus } from "lucide-react"

interface CardListProps {
  deckId: string
  cards: any[]
  isOwner: boolean
}

export function CardList({ deckId, cards, isOwner }: CardListProps) {
  const [isAdding, setIsAdding] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Cards ({cards.length})
          </CardTitle>
          {isOwner && (
            <Button onClick={() => setIsAdding(true)} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-6">
            <CardEditor
              deckId={deckId}
              onCancel={() => setIsAdding(false)}
              onSuccess={() => setIsAdding(false)}
            />
          </div>
        )}

        {cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No cards yet</p>
            {isOwner && !isAdding && (
              <Button onClick={() => setIsAdding(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add your first card
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index}
                isOwner={isOwner}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
