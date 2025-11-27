import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 px-6 md:px-8 lg:px-12">
        <div className="container max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              ClassMate is committed to protecting the privacy of students and facilitators using our AI-powered
              academic support platform. This Privacy Policy explains how we collect, use, and safeguard your personal
              information in compliance with African Leadership University's data protection policies and applicable
              regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect the following types of information to provide and improve ClassMate services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Account Information:</strong> Your institutional email, name, and student or facilitator role
                when you register.
              </li>
              <li>
                <strong>Session Data:</strong> Questions asked, AI responses provided, timestamps, and session duration
                during video interactions.
              </li>
              <li>
                <strong>Course Materials:</strong> Documents, slides, and notes uploaded by facilitators to support AI
                responses.
              </li>
              <li>
                <strong>Escalation Records:</strong> Queries that require facilitator follow-up, including student
                information and question context.
              </li>
              <li>
                <strong>Usage Analytics:</strong> Aggregated data on session counts, resolution rates, and system
                performance.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ClassMate uses your information solely for educational purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide personalized AI-powered academic support based on course materials</li>
              <li>To enable real-time video interactions between students and AI assistants</li>
              <li>To escalate unresolved questions to facilitators for human follow-up</li>
              <li>To generate analytics for facilitators to monitor system usage and effectiveness</li>
              <li>To improve AI response accuracy and adapt to student learning preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your data. All information is encrypted in
              transit using HTTPS and at rest in our secure database. Access to student data is restricted to authorized
              facilitators for enrolled courses only. Session recordings are not stored; only text transcripts of
              questions and responses are retained for quality assurance purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Sharing and Third Parties</h2>
            <p className="text-muted-foreground leading-relaxed">
              ClassMate does not sell or share your personal information with third parties for marketing purposes. We
              use Tavus CVI for AI video generation and Supabase for secure data storage. These service providers are
              bound by confidentiality agreements and process data solely to enable ClassMate functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">As a ClassMate user, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access your session history and questions asked</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of usage analytics (though this may limit platform improvements)</li>
              <li>Report privacy concerns to your facilitator or ALU administration</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Session data is retained for the duration of your enrollment in the course plus one academic year for
              record-keeping purposes. After this period, all personal identifiers are anonymized for research and
              system improvement. Facilitators may retain escalation logs as part of their course administration
              records.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or how ClassMate handles your data, please contact your
              course facilitator or reach out to African Leadership University's IT administration.
            </p>
          </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
