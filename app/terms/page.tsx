import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 container max-w-4xl px-6 md:px-8 py-12 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using ClassMate, you agree to be bound by these Terms of Service and all applicable laws
              and regulations. ClassMate is provided by African Leadership University (ALU) as an educational tool to
              support students in distributed learning environments. If you do not agree with any part of these terms,
              you may not use the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              ClassMate is available only to currently enrolled ALU students and authorized facilitators. You must use
              your institutional email address to register and access the platform. Accounts created with
              non-institutional email addresses will be deactivated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Permitted Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ClassMate is designed to provide academic support for course-related questions. You may use the platform
              to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Ask questions about course materials, readings, and concepts</li>
              <li>Request clarification on syllabi and assignment guidelines</li>
              <li>Engage with the AI assistant through real-time video sessions</li>
              <li>Escalate complex or sensitive inquiries to your facilitator</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Prohibited Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree not to use ClassMate for any of the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Submitting assignments or projects to the AI for completion</li>
              <li>Requesting answers to graded assessments, exams, or quizzes</li>
              <li>Sharing your account credentials with other students</li>
              <li>Attempting to manipulate or reverse-engineer the AI system</li>
              <li>Uploading malicious files or content</li>
              <li>Using offensive, harassing, or inappropriate language during sessions</li>
              <li>Seeking medical, financial, or personal advice unrelated to academics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Academic Integrity</h2>
            <p className="text-muted-foreground leading-relaxed">
              ClassMate is a learning support tool, not a substitute for independent study or critical thinking. You are
              responsible for ensuring that all work submitted for grading is your own. Using ClassMate to complete
              graded assignments or assessments violates ALU's Academic Integrity Policy and may result in disciplinary
              action.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">AI Assistant Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              The ClassMate AI assistant is trained on facilitator-uploaded course materials and responds based on
              available information. While we strive for accuracy, the AI may occasionally provide incomplete or
              incorrect responses. If you receive an answer that seems inaccurate, please escalate the question to your
              facilitator for clarification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Facilitator Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Facilitators using ClassMate agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Upload accurate and up-to-date course materials</li>
              <li>Respond to escalated student inquiries in a timely manner</li>
              <li>Monitor analytics to ensure the AI is serving students effectively</li>
              <li>Protect student privacy and comply with ALU's data protection policies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">System Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              ClassMate aims to maintain 99% uptime during academic terms. However, we do not guarantee uninterrupted
              access and may perform scheduled maintenance. Students should not rely solely on ClassMate for last-minute
              assignment support or urgent questions close to deadlines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Session Queue and Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Each course assistant can engage with only one student at a time. If the assistant is busy, you will be
              placed in a queue and notified when it becomes available. Wait times may vary depending on demand. For
              urgent matters, please contact your facilitator directly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Termination of Access</h2>
            <p className="text-muted-foreground leading-relaxed">
              ALU reserves the right to suspend or terminate your access to ClassMate if you violate these Terms of
              Service, engage in academic dishonesty, or misuse the platform. Your access will automatically end when
              you are no longer enrolled at ALU or complete your program.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              ClassMate is provided "as is" without warranties of any kind, either express or implied. ALU does not
              guarantee that the AI assistant will always provide correct, complete, or timely responses. You use the
              platform at your own risk and are responsible for verifying information provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, ALU shall not be liable for any indirect, incidental, or
              consequential damages arising from your use of ClassMate, including but not limited to academic
              consequences resulting from reliance on AI responses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              ALU reserves the right to modify these Terms of Service at any time. Changes will be posted on this page
              with an updated "Last updated" date. Your continued use of ClassMate after changes are posted constitutes
              acceptance of the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service or to report violations, please contact your course facilitator
              or ALU's academic administration.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
