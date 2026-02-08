"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface StudyCardProps {
  card: any
  isFlipped: boolean
  onFlip: () => void
  userHint?: string
  onShowHint?: () => void
  showHintSection: boolean
}

export function StudyCard({
  card,
  isFlipped,
  onFlip,
  userHint,
  onShowHint,
  showHintSection,
}: StudyCardProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Flip Card Container */}
      <div
        className={cn(
          "relative w-full h-[400px] sm:h-[500px] cursor-pointer transition-transform duration-500 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
        onClick={onFlip}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of Card (Question) */}
        <Card
          className={cn(
            "absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 bg-white border-2 shadow-2xl",
            !isFlipped ? "border-indigo-300" : "border-gray-200"
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="text-center space-y-4 sm:space-y-6 w-full">
            <div className="text-xs sm:text-sm font-medium text-indigo-600 uppercase tracking-wide">
              Question
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 whitespace-pre-wrap">
              {card.question}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-8">
              Click or press Space to reveal answer
            </div>
          </div>
        </Card>

        {/* Back of Card (Answer) */}
        <Card
          className={cn(
            "absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 shadow-2xl",
            isFlipped ? "border-indigo-300" : "border-gray-200"
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center space-y-4 sm:space-y-6 w-full">
            <div className="text-xs sm:text-sm font-medium text-indigo-600 uppercase tracking-wide">
              Answer
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 whitespace-pre-wrap">
              {card.answer}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-8">
              Click or press Space to go back
            </div>
          </div>
        </Card>
      </div>

      {/* Hint Section */}
      {showHintSection && (
        <div className="mt-6">
          {userHint ? (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-yellow-900 mb-1">Your Hint</div>
                  <div className="text-sm text-yellow-800 whitespace-pre-wrap">{userHint}</div>
                </div>
              </div>
            </Card>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onShowHint?.()
              }}
              className="gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Add a hint for this card
            </Button>
          )}
        </div>
      )}

      {/* CSS for 3D flip effect */}
      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}
