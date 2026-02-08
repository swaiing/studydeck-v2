"use client"

import { useState } from "react"
import { deleteCard } from "@/actions/card-actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CardEditor } from "./card-editor"
import { Edit, Trash2, GripVertical } from "lucide-react"

interface CardItemProps {
  card: any
  index: number
  isOwner: boolean
}

export function CardItem({ card, index, isOwner }: CardItemProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this card?")) {
      return
    }

    setIsDeleting(true)
    const result = await deleteCard(card.id)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || "Failed to delete card")
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <CardEditor
        deckId={card.deckId}
        card={card}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    )
  }

  return (
    <Card className="p-6">
      <div className="flex gap-4">
        {isOwner && (
          <div className="flex items-start pt-1">
            <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Card #{index + 1} - Question
              </div>
              <div className="text-gray-900 whitespace-pre-wrap">{card.question}</div>
            </div>
            {isOwner && (
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  disabled={isDeleting}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="border-t pt-4">
            <div className="text-xs font-medium text-gray-500 mb-1">Answer</div>
            <div className="text-gray-700 whitespace-pre-wrap">{card.answer}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
