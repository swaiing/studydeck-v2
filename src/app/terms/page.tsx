import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: February 7, 2026</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-600">
              By accessing or using Studydeck, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Registration</h2>
            <p className="text-gray-600 mb-4">
              To use certain features of Studydeck, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be at least 13 years old (or the age of digital consent in your country)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Scrape, crawl, or use automated tools to access the service without permission</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for any commercial purpose without our consent</li>
              <li>Create multiple accounts to manipulate ratings or abuse the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Content</h2>
            <p className="text-gray-600 mb-4">
              You retain ownership of the flashcard content you create. By making content public, you grant Studydeck and other users a license to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Display and distribute your public content on the platform</li>
              <li>Allow other users to study from and copy your public decks</li>
              <li>Use your content to improve and promote our service</li>
            </ul>
            <p className="text-gray-600 mt-4">
              You represent that you have the rights to share any content you upload, and that your content does not violate any third-party rights or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-600">
              The Studydeck platform, including its design, features, and code, is owned by Studydeck and protected by copyright, trademark, and other laws. You may not copy, modify, or create derivative works without our permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
            <p className="text-gray-600">
              We strive to provide reliable service but cannot guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-600">
              We may terminate or suspend your account at any time for violating these terms. You may delete your account at any time through your account settings. Upon termination, your right to use the service will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimers</h2>
            <p className="text-gray-600 mb-4">
              Studydeck is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>The service will meet your requirements</li>
              <li>The service will be error-free or uninterrupted</li>
              <li>Any errors will be corrected</li>
              <li>User-generated content is accurate or reliable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600">
              To the maximum extent permitted by law, Studydeck shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
            <p className="text-gray-600">
              You agree to indemnify and hold Studydeck harmless from any claims, damages, or expenses arising from your violation of these terms or your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-600">
              These terms are governed by the laws of the United States and the State of California, without regard to conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of significant changes by email or through the platform. Continued use of the service after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-600">
              If you have questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@studydeck.app" className="text-indigo-600 hover:text-indigo-700">
                legal@studydeck.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
