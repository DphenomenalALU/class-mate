import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-6 md:px-8 lg:px-12">
        <div className="space-y-8 max-w-3xl mx-auto py-12 md:py-16">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">ClassMate Help & Quick Start</h1>
            <p className="text-sm text-muted-foreground">
              A quick guide for students and facilitators using ClassMate.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>For Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <span className="font-medium text-foreground">Sign in</span> with your institutional Google account
                  from the login page.
                </li>
                <li>
                  Go to <span className="font-medium text-foreground">Student Dashboard</span> to see your courses and
                  start a session.
                </li>
                <li>
                  When you join a session, you&apos;ll see a video-style interface with controls for{" "}
                  <span className="font-medium text-foreground">mic on/off</span> and{" "}
                  <span className="font-medium text-foreground">camera on/off</span>.
                </li>
                <li>
                  Ask questions out loud; your AI assistant answers from your course materials. If a question is about
                  grades, attendance, or something outside the course content, you&apos;ll be asked to{" "}
                  <span className="font-medium text-foreground">click the Escalate button</span>.
                </li>
                <li>
                  When you escalate, you can add a short note. Your facilitator receives an email and a log entry in
                  their dashboard.
                </li>
                <li>
                  After a session ends, rate the session from 1–5 so we can improve future support.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Facilitators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Sign in with your institutional Google account, then choose{" "}
                  <span className="font-medium text-foreground">Facilitator</span> when prompted.
                </li>
                <li>
                  Create an assistant from the <span className="font-medium text-foreground">Assistants</span> page for
                  each course you teach. Each assistant has its own persona and Tavus replica.
                </li>
                <li>
                  From the assistant&apos;s settings page, upload course documents to the{" "}
                  <span className="font-medium text-foreground">Knowledge Base</span>. These are sent to Tavus so the
                  assistant can answer questions from your materials.
                </li>
                <li>
                  Add <span className="font-medium text-foreground">Context Notes</span> for announcements or extra
                  guidance you want the assistant to share.
                </li>
                <li>
                  Share the assistant link (copied from the assistant card) with students. They&apos;ll be queued if
                  someone else is already in a session.
                </li>
                <li>
                  Use <span className="font-medium text-foreground">Escalation Log</span> to review escalated questions,
                  then respond to students directly.
                </li>
                <li>
                  Check the <span className="font-medium text-foreground">dashboard overview</span> for total sessions,
                  resolution rate, escalations, and student satisfaction.
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link href="/student">
              <Button variant="outline">Go to Student Dashboard</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Go to Facilitator Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
