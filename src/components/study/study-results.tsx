import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, RotateCcw, ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"

interface StudyResultsProps {
  deckName: string
  deckId: string
  stats: {
    correct: number
    incorrect: number
    total: number
  }
  onRestart: () => void
}

export function StudyResults({ deckName, deckId, stats, onRestart }: StudyResultsProps) {
  const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
  const passed = accuracy >= 70

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="max-w-2xl w-full p-12 text-center">
        {/* Trophy Icon */}
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
            passed ? "bg-green-100" : "bg-yellow-100"
          }`}>
            <Trophy className={`h-12 w-12 ${passed ? "text-green-600" : "text-yellow-600"}`} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {passed ? "Great Job!" : "Session Complete!"}
        </h1>
        <p className="text-gray-600 mb-8">
          You've finished studying <span className="font-medium">{deckName}</span>
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-indigo-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Cards Studied</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Check className="h-6 w-6 text-green-600" />
              <div className="text-4xl font-bold text-green-600">{stats.correct}</div>
            </div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <X className="h-6 w-6 text-red-600" />
              <div className="text-4xl font-bold text-red-600">{stats.incorrect}</div>
            </div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Final Accuracy</div>
          <div className="text-5xl font-bold text-indigo-600 mb-2">
            {accuracy.toFixed(0)}%
          </div>
          {passed ? (
            <div className="text-green-600 font-medium">Excellent work! 🎉</div>
          ) : (
            <div className="text-yellow-600 font-medium">Keep practicing!</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRestart} size="lg" className="gap-2">
            <RotateCcw className="h-5 w-5" />
            Study Again
          </Button>
          <Link href={`/decks/${deckId}`}>
            <Button variant="outline" size="lg" className="gap-2 w-full">
              <ArrowLeft className="h-5 w-5" />
              Back to Deck
            </Button>
          </Link>
        </div>

        {/* Tips */}
        {!passed && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <div className="text-sm font-medium text-blue-900 mb-2">💡 Study Tips:</div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Try studying the deck multiple times to improve retention</li>
              <li>• Add personal hints to cards you find difficult</li>
              <li>• Use the difficulty ratings to identify which cards need more practice</li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  )
}
