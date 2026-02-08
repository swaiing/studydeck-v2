"use client"

import { useState } from "react"
import { createCard, updateCard } from "@/actions/card-actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface CardEditorProps {
  deckId: string
  card?: any
  onCancel: () => void
  onSuccess: () => void
}

export function CardEditor({ deckId, card, onCancel, onSuccess }: CardEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    question: card?.question || "",
    answer: card?.answer || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = card
      ? await updateCard(card.id, formData)
      : await createCard({ deckId, ...formData })

    if (result.success) {
      router.refresh()
      onSuccess()
    } else {
      setError(result.error || "Failed to save card")
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-gray-50">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question / Front *</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the question or front of the card..."
              required
              rows={3}
              maxLength={5000}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="answer">Answer / Back *</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
              placeholder="Enter the answer or back of the card..."
              required
              rows={3}
              maxLength={5000}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : card ? "Update Card" : "Add Card"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
