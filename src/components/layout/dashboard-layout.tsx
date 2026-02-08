import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, LogOut, Library, Compass, Users } from "lucide-react"
import { signOut } from "@/lib/auth"

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  async function handleSignOut() {
    "use server"
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Studydeck</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/decks"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <Library className="h-4 w-4" />
                My Decks
              </Link>
              <Link
                href="/discover"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <Compass className="h-4 w-4" />
                Discover
              </Link>
              <Link
                href="/groups"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <Users className="h-4 w-4" />
                Groups
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </span>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  )
}
