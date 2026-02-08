import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getStudySession } from "@/actions/study-actions"
import { StudySession } from "@/components/study/study-session"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function StudyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const { id } = await params
  const result = await getStudySession(id)

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {result.error || "Unable to start study session"}
            </h1>
            <p className="text-gray-600 mb-6">
              There was a problem loading this deck.
            </p>
            <Link
              href={`/decks/${id}`}
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Deck
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const deck = result.data

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <StudySession deck={deck} />
    </div>
  )
}
