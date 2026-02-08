"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Lightbulb } from "lucide-react"

interface HintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialHint?: string
  onSave: (hint: string) => Promise<any>
}

export function HintDialog({ open, onOpenChange, initialHint, onSave }: HintDialogProps) {
  const [hint, setHint] = useState(initialHint || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!hint.trim()) {
      setError("Hint cannot be empty")
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await onSave(hint.trim())

    if (result.success) {
      onOpenChange(false)
      setHint("")
    } else {
      setError(result.error || "Failed to save hint")
    }

    setIsLoading(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setHint(initialHint || "")
      setError(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            {initialHint ? "Edit Hint" : "Add Personal Hint"}
          </DialogTitle>
          <DialogDescription>
            Add a personal hint to help you remember this card better. Only you can see this hint.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="hint">Your Hint</Label>
            <Textarea
              id="hint"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="e.g., Remember this by thinking of..."
              rows={4}
              maxLength={1000}
              className="mt-1"
            />
            <div className="text-xs text-gray-500 mt-1">
              {hint.length}/1000 characters
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Hint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
