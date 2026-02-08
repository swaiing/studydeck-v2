import Link from "next/link";
import {
  BookOpen,
  Brain,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Studydeck</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/discover" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Discover
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 mb-8">
            <Sparkles className="h-4 w-4" />
            The modern way to study
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Master anything with
            <br />
            <span className="text-indigo-600">smart flashcards</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 mb-10">
            Create, study, and share flashcard decks. Track your progress,
            join study groups, and achieve your learning goals faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Get started free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:border-gray-400 transition-colors"
            >
              Browse decks
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Free forever
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">10K+</div>
            <div className="text-sm text-gray-600 mt-1">Public Decks</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">50K+</div>
            <div className="text-sm text-gray-600 mt-1">Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">1M+</div>
            <div className="text-sm text-gray-600 mt-1">Cards Studied</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">500+</div>
            <div className="text-sm text-gray-600 mt-1">Study Groups</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to ace your studies
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features to help you learn faster and retain more
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-indigo-100 w-12 h-12 flex items-center justify-center mb-6">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Smart Progress Tracking
            </h3>
            <p className="text-gray-600">
              Track your performance on every card. See your strengths and weaknesses
              at a glance with detailed analytics.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-indigo-100 w-12 h-12 flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Study Groups
            </h3>
            <p className="text-gray-600">
              Create or join study groups. Share decks with classmates and
              collaborate to achieve your goals together.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-indigo-100 w-12 h-12 flex items-center justify-center mb-6">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Custom Hints
            </h3>
            <p className="text-gray-600">
              Add personal mnemonics and hints to any card. Make difficult
              concepts stick with your own memory tricks.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to level up your learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already using Studydeck to ace their exams
            and master new skills.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-indigo-600 hover:bg-gray-50 transition-colors"
          >
            Start studying now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">Studydeck</span>
              </div>
              <p className="text-gray-600 max-w-sm">
                The modern flashcard platform for students who want to learn
                smarter, not harder.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/discover" className="hover:text-gray-900">Discover</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>© 2026 Studydeck. Built with Next.js and PostgreSQL.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
