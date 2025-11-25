import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Clock, CheckCircle2 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">View detailed usage statistics across your assistants</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">↑ 14%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38 min</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">↑ 5%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <p className="text-xs text-muted-foreground">Questions resolved without escalation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 / 5.0</div>
            <p className="text-xs text-muted-foreground">Based on 56 ratings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Activity by Course</CardTitle>
          <CardDescription>Total sessions per course assistant over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { course: "CS101 - Intro to Programming", assistant: "Dr. Chen", sessions: 87, color: "bg-blue-500" },
              { course: "Math 201 - Calculus I", assistant: "Prof. Smith", sessions: 65, color: "bg-green-500" },
              { course: "Physics 101 - Mechanics", assistant: "Prof. Okafor", sessions: 42, color: "bg-purple-500" },
              { course: "Chem 101 - General Chemistry", assistant: "Dr. Patel", sessions: 28, color: "bg-orange-500" },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.course}</p>
                    <p className="text-xs text-muted-foreground">{item.assistant}</p>
                  </div>
                  <span className="font-bold">{item.sessions}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${(item.sessions / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most Common Questions</CardTitle>
            <CardDescription>Topics students ask about most frequently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { topic: "Binary search trees", count: 24 },
                { topic: "Derivatives and integrals", count: 19 },
                { topic: "Newton's laws", count: 16 },
                { topic: "For loops in Python", count: 14 },
                { topic: "Quadratic equations", count: 12 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{item.topic}</span>
                  <span className="text-sm font-medium text-muted-foreground">{item.count} times</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Usage Times</CardTitle>
            <CardDescription>When students connect with assistants most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "6:00 PM - 8:00 PM", sessions: 42 },
                { time: "2:00 PM - 4:00 PM", sessions: 35 },
                { time: "8:00 PM - 10:00 PM", sessions: 28 },
                { time: "12:00 PM - 2:00 PM", sessions: 18 },
                { time: "10:00 AM - 12:00 PM", sessions: 12 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{item.time}</span>
                  <span className="text-sm font-medium text-muted-foreground">{item.sessions} sessions</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
