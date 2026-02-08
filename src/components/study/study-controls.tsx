"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, X, Star, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface StudyControlsProps {
  isFlipped: boolean
  onCorrect: () => void
  onIncorrect: () => void
  currentRating?: number
  onRate: (rating: number) => void
  onFlip: () => void
}

export function StudyControls({
  isFlipped,
  onCorrect,
  onIncorrect,
  currentRating,
  onRate,
  onFlip,
}: StudyControlsProps) {
  return (
    <div className="space-y-6">
      {/* Answer Buttons */}
      {isFlipped ? (
        <Card className="p-6">
          <div className="text-center mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Did you get it right?</div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={onIncorrect}
              variant="outline"
              size="lg"
              className="gap-2 min-w-[140px] hover:bg-red-50 hover:border-red-300 hover:text-red-700"
            >
              <X className="h-5 w-5" />
              Incorrect
              <kbd className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded">←</kbd>
            </Button>
            <Button
              onClick={onCorrect}
              size="lg"
              className="gap-2 min-w-[140px] bg-green-600 hover:bg-green-700"
            >
              <Check className="h-5 w-5" />
              Correct
              <kbd className="ml-2 px-2 py-1 text-xs bg-green-700 rounded">→</kbd>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center">
            <Button onClick={onFlip} size="lg" className="gap-2">
              <RotateCcw className="h-5 w-5" />
              Reveal Answer
              <kbd className="ml-2 px-2 py-1 text-xs bg-indigo-700 rounded">Space</kbd>
            </Button>
          </div>
        </Card>
      )}

      {/* Difficulty Rating */}
      {isFlipped && (
        <Card className="p-6">
          <div className="text-center mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">
              How difficult was this card?
            </div>
            <div className="text-xs text-gray-500">
              1 = Very Easy, 5 = Very Hard
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onRate(rating)}
                className={cn(
                  "group flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all",
                  currentRating === rating
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/50"
                )}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    currentRating === rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400 group-hover:text-yellow-400"
                  )}
                />
                <span className="text-xs font-medium text-gray-600">{rating}</span>
                <kbd className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">{rating}</kbd>
              </button>
            ))}
          </div>
          {currentRating && (
            <div className="text-center mt-3 text-sm text-green-600">
              ✓ Rated {currentRating} star{currentRating !== 1 ? "s" : ""}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
