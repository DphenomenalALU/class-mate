import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Users, AlertTriangle, ArrowUpRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Facilitator Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/assistants">
            <Button>Create New Assistant</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+14% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <p className="text-xs text-muted-foreground">Without escalation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground text-destructive">3 need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Student Interactions</CardTitle>
            <CardDescription>Latest questions answered by your AI assistants.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                {
                  name: "Amara Okonkwo",
                  course: "CS101",
                  question: "Explain binary search trees",
                  time: "2 hours ago",
                  status: "resolved",
                },
                {
                  name: "Kwame Mensah",
                  course: "Math 201",
                  question: "How to solve quadratic equations?",
                  time: "5 hours ago",
                  status: "resolved",
                },
                {
                  name: "Zara Hassan",
                  course: "CS101",
                  question: "Question about my grade",
                  time: "Yesterday",
                  status: "escalated",
                },
                {
                  name: "Jabari Mwangi",
                  course: "Physics 101",
                  question: "Newton's laws application",
                  time: "Yesterday",
                  status: "resolved",
                },
              ].map((session, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{session.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.course} • {session.question}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${session.status === "escalated" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
                    >
                      {session.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{session.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your assistants and content.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/dashboard/knowledge">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <ArrowUpRight className="h-4 w-4" />
                Upload Course Materials
              </Button>
            </Link>
            <Link href="/dashboard/notes">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <ArrowUpRight className="h-4 w-4" />
                Add Context Notes
              </Button>
            </Link>
            <Link href="/dashboard/escalations">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <ArrowUpRight className="h-4 w-4" />
                Review Escalations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
