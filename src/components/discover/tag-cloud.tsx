"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TagCloudProps {
  tags: Array<{
    id: string
    name: string
    _count?: {
      decks: number
    }
  }>
  selectedTags: string[]
}

export function TagCloud({ tags, selectedTags }: TagCloudProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const toggleTag = (tagName: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentTags = selectedTags.includes(tagName)
      ? selectedTags.filter((t) => t !== tagName)
      : [...selectedTags, tagName]

    if (currentTags.length > 0) {
      params.set('tags', currentTags.join(','))
    } else {
      params.delete('tags')
    }

    router.push(`/discover?${params.toString()}`)
  }

  if (tags.length === 0) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name)
          const deckCount = tag._count?.decks || 0

          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.name)}
              className="transition-transform hover:scale-105"
            >
              <Badge
                variant={isSelected ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer gap-1.5",
                  isSelected && "bg-indigo-600 hover:bg-indigo-700"
                )}
              >
                {tag.name}
                <span className={cn(
                  "text-xs",
                  isSelected ? "text-indigo-200" : "text-gray-500"
                )}>
                  {deckCount}
                </span>
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}
