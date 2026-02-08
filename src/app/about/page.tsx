import Link from "next/link"
import { BookOpen, Users, TrendingUp, Heart } from "lucide-react"

export default function AboutPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Studydeck</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Studydeck is a modern flashcard study platform designed to help students master any subject through effective spaced repetition and collaborative learning.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600">
              Originally launched in 2013, Studydeck has been rebuilt from the ground up with modern web technologies to provide a faster, more intuitive learning experience. We believe that effective studying shouldn't be complicated.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <BookOpen className="h-8 w-8 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Flashcards</h3>
                  <p className="text-gray-600 text-sm">
                    Create custom flashcard decks with text, images, and personal hints to reinforce your learning.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Users className="h-8 w-8 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Study Groups</h3>
                  <p className="text-gray-600 text-sm">
                    Collaborate with classmates by sharing decks and studying together in groups.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <TrendingUp className="h-8 w-8 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                  <p className="text-gray-600 text-sm">
                    Monitor your performance with detailed statistics and difficulty ratings for each card.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Heart className="h-8 w-8 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Free Forever</h3>
                  <p className="text-gray-600 text-sm">
                    Core features are completely free. No credit card required, no hidden fees.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              We're committed to making high-quality educational tools accessible to everyone. Whether you're studying for exams, learning a new language, or mastering professional skills, Studydeck is here to help you succeed.
            </p>
          </section>

          <section className="bg-indigo-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to start learning?</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of students already using Studydeck to achieve their goals.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Get started for free
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
