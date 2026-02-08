import Link from "next/link"
import { BookOpen, Check } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Studydeck</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Pricing</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Simple, transparent pricing for everyone
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-gray-600">Unlimited flashcard decks</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-gray-600">Spaced repetition algorithm</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-gray-600">Browse public decks</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-gray-600">Study groups</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-gray-600">Progress tracking</span>
              </li>
            </ul>
            <Link
              href="/signup"
              className="block w-full text-center rounded-lg bg-gray-100 px-4 py-3 font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-indigo-600 rounded-lg border-2 border-indigo-600 p-8 text-white relative">
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold">$5</span>
              <span className="text-indigo-200">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-white shrink-0 mt-0.5" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-white shrink-0 mt-0.5" />
                <span>AI-generated flashcards</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-white shrink-0 mt-0.5" />
                <span>Advanced statistics</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-white shrink-0 mt-0.5" />
                <span>Custom themes</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-white shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
            <div className="block w-full text-center rounded-lg bg-white/20 px-4 py-3 font-semibold cursor-not-allowed">
              Coming Soon
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
          <p className="text-gray-600 mb-6">
            We're here to help. Contact us at{" "}
            <a href="mailto:support@studydeck.app" className="text-indigo-600 hover:text-indigo-700">
              support@studydeck.app
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
