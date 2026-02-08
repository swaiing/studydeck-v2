import Link from "next/link"
import { BookOpen, Home, Compass, Users, Library, LogOut } from "lucide-react"
import { auth, signOut } from "@/lib/auth"

export async function NavBar() {
  const session = await auth()

  if (!session) {
    return null
  }

  async function handleSignOut() {
    "use server"
    await signOut()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">Studydeck</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/decks"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Library className="h-4 w-4" />
              My Decks
            </Link>
            <Link
              href="/discover"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Compass className="h-4 w-4" />
              Discover
            </Link>
            <Link
              href="/groups"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Users className="h-4 w-4" />
              Groups
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">
                {session.user?.name || session.user?.email}
              </span>
              {session.user?.email && session.user?.name && (
                <span className="text-xs text-gray-500">
                  {session.user.email}
                </span>
              )}
            </div>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/decks"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Library className="h-4 w-4" />
            Decks
          </Link>
          <Link
            href="/discover"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Compass className="h-4 w-4" />
            Discover
          </Link>
          <Link
            href="/groups"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Users className="h-4 w-4" />
            Groups
          </Link>
        </nav>
      </div>
    </header>
  )
}
