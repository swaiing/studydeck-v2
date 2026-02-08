"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface DiscoverSearchProps {
  initialQuery: string
  initialTags: string[]
  initialSortBy: string
}

export function DiscoverSearch({ initialQuery, initialTags, initialSortBy }: DiscoverSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(initialQuery)
  const [sortBy, setSortBy] = useState(initialSortBy)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl({ q: query })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateUrl({ sortBy: value })
  }

  const clearSearch = () => {
    setQuery('')
    updateUrl({ q: '' })
  }

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    startTransition(() => {
      router.push(`/discover?${params.toString()}`)
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search decks by name or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            Search
          </Button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="mostCards">Most Cards</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  )
}
