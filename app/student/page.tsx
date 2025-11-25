import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, ArrowRight, Bot } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Amara</h1>
          <p className="text-muted-foreground mt-1">Ready to learn with your AI assistants?</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 bg-gradient-to-br from-primary/20 via-background to-background border-primary/50">
          <CardHeader>
            <CardTitle className="text-xl">Quick Connect</CardTitle>
            <CardDescription>Start a session with one of your course assistants.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-2xl">
                  👩‍💻
                </div>
                <div className="flex-1">
                  <p className="font-bold">Dr. Chen</p>
                  <p className="text-sm text-muted-foreground">CS101 - Introduction to Programming</p>
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                  Available
                </Badge>
              </div>
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-2xl">
                  👨‍🏫
                </div>
                <div className="flex-1">
                  <p className="font-bold">Professor Smith</p>
                  <p className="text-sm text-muted-foreground">Math 201 - Calculus I</p>
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                  Available
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/session/123" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Start Session <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
            <CardDescription>Your activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sessions</span>
                <span className="font-bold">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Time</span>
                <span className="font-bold">4.5h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Questions Asked</span>
                <span className="font-bold">23</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Your Courses</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">CS101</CardTitle>
                    <CardDescription className="text-xs">Intro to Programming</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assistant</span>
                <span className="font-medium">👩‍💻 Dr. Chen</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sessions</span>
                <span className="font-medium">4 this week</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/session/cs101" className="w-full">
                <Button variant="secondary" className="w-full gap-2">
                  <Video className="h-4 w-4" />
                  Connect Now
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Math 201</CardTitle>
                    <CardDescription className="text-xs">Calculus I</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assistant</span>
                <span className="font-medium">👨‍🏫 Prof. Smith</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sessions</span>
                <span className="font-medium">3 this week</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/session/math201" className="w-full">
                <Button variant="secondary" className="w-full gap-2">
                  <Video className="h-4 w-4" />
                  Connect Now
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Physics 101</CardTitle>
                    <CardDescription className="text-xs">Mechanics</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assistant</span>
                <span className="font-medium">🧑‍🔬 Prof. Okafor</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sessions</span>
                <span className="font-medium">2 this week</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/session/physics101" className="w-full">
                <Button variant="secondary" className="w-full gap-2">
                  <Video className="h-4 w-4" />
                  Connect Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
