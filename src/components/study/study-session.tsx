"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { StudyCard } from "./study-card"
import { StudyControls } from "./study-controls"
import { StudyProgress } from "./study-progress"
import { StudyResults } from "./study-results"
import { HintDialog } from "./hint-dialog"
import { recordAnswer, rateCard, addOrUpdateHint } from "@/actions/study-actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StudySessionProps {
  deck: any
}

export function StudySession({ deck }: StudySessionProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showHintDialog, setShowHintDialog] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    total: deck.cards.length,
  })

  const currentCard = deck.cards[currentIndex]
  const userHint = currentCard?.hints?.[0]?.hint
  const userRating = currentCard?.ratings?.[0]?.rating

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case " ":
        case "spacebar":
          e.preventDefault()
          setIsFlipped((prev) => !prev)
          break
        case "arrowleft":
          if (isFlipped) {
            e.preventDefault()
            handleAnswer(false)
          }
          break
        case "arrowright":
          if (isFlipped) {
            e.preventDefault()
            handleAnswer(true)
          }
          break
        case "h":
          e.preventDefault()
          setShowHintDialog(true)
          break
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
          if (isFlipped) {
            e.preventDefault()
            handleRating(parseInt(e.key))
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isFlipped, currentIndex])

  const handleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  const handleAnswer = async (correct: boolean) => {
    // Record answer
    await recordAnswer({
      cardId: currentCard.id,
      correct,
    })

    // Update stats
    setStats((prev) => ({
      ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: !correct ? prev.incorrect + 1 : prev.incorrect,
    }))

    // Move to next card or complete session
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false)
    } else {
      setSessionComplete(true)
    }
  }

  const handleRating = async (rating: number) => {
    await rateCard({
      cardId: currentCard.id,
      rating,
    })
    router.refresh()
  }

  const handleSaveHint = async (hint: string) => {
    const result = await addOrUpdateHint({
      cardId: currentCard.id,
      hint,
    })
    if (result.success) {
      setShowHintDialog(false)
      router.refresh()
    }
    return result
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionComplete(false)
    setStats({
      correct: 0,
      incorrect: 0,
      total: deck.cards.length,
    })
  }

  if (sessionComplete) {
    return (
      <StudyResults
        deckName={deck.name}
        deckId={deck.id}
        stats={stats}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href={`/decks/${deck.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit Study Session
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{deck.name}</h1>
            {deck.user && (
              <p className="text-sm text-gray-600">by @{deck.user.username}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress</div>
            <div className="text-2xl font-bold text-indigo-600">
              {currentIndex + 1} / {deck.cards.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <StudyProgress
          current={currentIndex + 1}
          total={deck.cards.length}
          correct={stats.correct}
          incorrect={stats.incorrect}
        />
      </div>

      {/* Study Card */}
      <div className="max-w-4xl mx-auto mb-8">
        <StudyCard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          userHint={userHint}
          onShowHint={() => setShowHintDialog(true)}
          showHintSection={isFlipped}
        />
      </div>

      {/* Controls */}
      <div className="max-w-4xl mx-auto">
        <StudyControls
          isFlipped={isFlipped}
          onCorrect={() => handleAnswer(true)}
          onIncorrect={() => handleAnswer(false)}
          currentRating={userRating}
          onRate={handleRating}
          onFlip={handleFlip}
        />
      </div>

      {/* Hint Dialog */}
      <HintDialog
        open={showHintDialog}
        onOpenChange={setShowHintDialog}
        initialHint={userHint}
        onSave={handleSaveHint}
      />

      {/* Keyboard Shortcuts Help */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white/50 backdrop-blur rounded-lg p-4 text-sm text-gray-600">
          <div className="font-medium mb-2">Keyboard Shortcuts:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> Flip card</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">←</kbd> Incorrect</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">→</kbd> Correct</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">H</kbd> Add hint</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">1-5</kbd> Rate difficulty</div>
          </div>
        </div>
      </div>
    </div>
  )
}
