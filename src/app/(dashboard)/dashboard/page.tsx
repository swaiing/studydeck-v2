import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">Ready to start studying?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Your Decks</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Cards Studied Today</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Study Streak</div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-12 text-center">
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
            Create your first deck
          </Link>
        </div>
      </main>
  )
}
