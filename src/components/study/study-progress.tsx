import { Check, X } from "lucide-react"

interface StudyProgressProps {
  current: number
  total: number
  correct: number
  incorrect: number
}

export function StudyProgress({ current, total, correct, incorrect }: StudyProgressProps) {
  const progress = (current / total) * 100
  const accuracy = correct + incorrect > 0 ? (correct / (correct + incorrect)) * 100 : 0

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-green-600">
            <Check className="h-4 w-4" />
            <span className="font-medium">{correct}</span>
            <span className="text-gray-500">correct</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-600">
            <X className="h-4 w-4" />
            <span className="font-medium">{incorrect}</span>
            <span className="text-gray-500">incorrect</span>
          </div>
        </div>
        {correct + incorrect > 0 && (
          <div className="text-gray-600">
            Accuracy: <span className="font-medium text-indigo-600">{accuracy.toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
