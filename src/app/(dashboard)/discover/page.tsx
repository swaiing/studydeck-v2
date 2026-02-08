import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { searchPublicDecks, getAllTags } from "@/actions/discover-actions"
import { DiscoverSearch } from "@/components/discover/discover-search"
import { DiscoverGrid } from "@/components/discover/discover-grid"
import { TagCloud } from "@/components/discover/tag-cloud"
import { Compass } from "lucide-react"

interface DiscoverPageProps {
  searchParams: Promise<{
    q?: string
    tags?: string
    sortBy?: string
  }>
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const params = await searchParams
  const query = params.q || ''
  const tags = params.tags ? params.tags.split(',').filter(Boolean) : []
  const sortBy = (params.sortBy || 'newest') as 'newest' | 'popular' | 'mostCards'

  const [decksResult, tagsResult] = await Promise.all([
    searchPublicDecks({ query, tags, sortBy }),
    getAllTags(),
  ])

  const decks = decksResult.success ? decksResult.data?.decks || [] : []
  const total = decksResult.success ? decksResult.data?.total || 0 : 0
  const allTags = tagsResult.success ? tagsResult.data || [] : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Compass className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Discover Decks</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Browse and study from {total.toLocaleString()} public flashcard decks
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <DiscoverSearch initialQuery={query} initialTags={tags} initialSortBy={sortBy} />
        </div>

        {/* Tag Cloud */}
        {allTags.length > 0 && (
          <div className="mb-8">
            <TagCloud tags={allTags} selectedTags={tags} />
          </div>
        )}

        {/* Results */}
        {decksResult.error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{decksResult.error}</p>
          </div>
        ) : decks.length === 0 ? (
          <div className="text-center py-12">
            <Compass className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {query || tags.length > 0 ? 'No decks found' : 'No public decks yet'}
            </h2>
            <p className="text-gray-600">
              {query || tags.length > 0
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a public deck!'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                Showing {decks.length} of {total} deck{total !== 1 ? 's' : ''}
              </div>
            </div>
            <DiscoverGrid decks={decks} />
          </>
        )}
      </div>
    </div>
  )
}
