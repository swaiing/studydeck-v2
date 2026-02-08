import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserDecks } from "@/actions/deck-actions"
import Link from "next/link"
import { BookOpen, Plus, TrendingUp, Library, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Fetch user's decks
  const userDecksResult = await getUserDecks()
  const userDecks = userDecksResult.success ? userDecksResult.data || [] : []

  // Calculate stats
  const totalCards = userDecks.reduce((sum, deck) => sum + (deck._count?.cards || 0), 0)
  const recentDecks = userDecks.slice(0, 3) // Show 3 most recent decks

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user?.name || 'Learner'}!
        </h1>
        <p className="text-gray-600 mt-2">Ready to start studying?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-indigo-600">
                {userDecks.length}
              </CardTitle>
              <Library className="h-5 w-5 text-indigo-600" />
            </div>
            <CardDescription>Your Decks</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-indigo-600">
                {totalCards}
              </CardTitle>
              <BookOpen className="h-5 w-5 text-indigo-600" />
            </div>
            <CardDescription>Total Cards</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-indigo-600">
                {userDecks.filter(d => d._count?.cards && d._count.cards > 0).length}
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <CardDescription>Ready to Study</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Decks or Empty State */}
      {userDecks.length === 0 ? (
        <Card className="p-6 sm:p-12 text-center">
          <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            No decks yet
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Create your first deck to start studying
          </p>
          <Link
            href="/decks/new"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            Create your first deck
          </Link>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Decks</h2>
            <Link
              href="/decks"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDecks.map((deck) => (
              <Link key={deck.id} href={`/decks/${deck.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{deck.name}</CardTitle>
                    {deck.description && (
                      <CardDescription className="line-clamp-2">
                        {deck.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{deck._count?.cards || 0} cards</span>
                      <Badge variant="outline">
                        {deck.privacy}
                      </Badge>
                    </div>
                    {deck.tags && deck.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {deck.tags.slice(0, 3).map((deckTag: any) => (
                          <Badge key={deckTag.tag.id} variant="secondary" className="text-xs">
                            {deckTag.tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {userDecks.length > 3 && (
            <div className="mt-6 text-center">
              <Link
                href="/decks"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                View all {userDecks.length} decks
              </Link>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
