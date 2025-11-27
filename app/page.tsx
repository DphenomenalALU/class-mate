import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Clock, AlertCircle, MessageSquare, Video, UserCheck } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-6 md:px-8 lg:px-12">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

          <div className="container relative z-10">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
              <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Built for African Leadership University
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-balance">
                Get <span className="text-primary">Instant Academic Support</span> from AI Assistants
              </h1>

              <p className="text-xl text-muted-foreground max-w-[600px] text-balance">
                ClassMate provides 24/7 personalized academic assistance through human-like AI video interactions. Ask
                course questions, get instant feedback, and escalate complex issues to your facilitator.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/#how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-transparent">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose ClassMate?</h2>
              <p className="text-muted-foreground max-w-[700px] md:text-lg">
                Scalable academic support designed for distributed learning environments.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 hover:border-primary/50 transition-colors">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Video className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Video-Based Q&A</h3>
                <p className="text-muted-foreground">
                  Interact with AI assistants through real-time video conversations that feel natural and human-like.
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 hover:border-primary/50 transition-colors">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">24/7 Availability</h3>
                <p className="text-muted-foreground">
                  Get immediate answers to course-related questions any time, day or night, without booking office
                  hours.
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 hover:border-primary/50 transition-colors">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Course-Specific Knowledge</h3>
                <p className="text-muted-foreground">
                  Assistants are trained on your facilitator's uploaded materials—syllabus, slides, readings, and notes.
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 hover:border-primary/50 transition-colors">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Smart Escalation</h3>
                <p className="text-muted-foreground">
                  When questions fall outside the knowledge base, they're automatically escalated to your facilitator.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 md:py-32 border-t">
          <div className="container">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
              <p className="text-muted-foreground max-w-[700px] md:text-lg">
                Get started with ClassMate in three simple steps.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  1
                </div>
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Ask Your Question</h3>
                <p className="text-muted-foreground">
                  Join a video session with the AI assistant for your course. Simply speak your question naturally, just
                  like you would with a real facilitator.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  2
                </div>
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                  <Video className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Get Instant Answers</h3>
                <p className="text-muted-foreground">
                  The AI assistant responds via video using knowledge from your course materials—syllabus, lecture
                  slides, and facilitator notes.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  3
                </div>
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                  <UserCheck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Escalate if Needed</h3>
                <p className="text-muted-foreground">
                  If your question requires human support (grades, attendance, etc.), the system escalates it directly
                  to your facilitator.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 border-t bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Get Instant Academic Support?
              </h2>
              <p className="text-muted-foreground max-w-[600px] md:text-lg">
                Join students who are getting their questions answered faster with ClassMate.
              </p>
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-base">
                  Start Learning Today
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
