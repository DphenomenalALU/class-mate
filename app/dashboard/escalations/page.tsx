import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"

export default function EscalationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escalation Log</h1>
          <p className="text-muted-foreground mt-1">Review student queries that require your attention</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Mark All Reviewed
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Need response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-destructive/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Zara Hassan</CardTitle>
                  <Badge variant="destructive">Urgent</Badge>
                </div>
                <CardDescription>CS101 • Yesterday at 3:45 PM</CardDescription>
              </div>
              <Button size="sm">Respond</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Student Question:</p>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                "I believe there's an error in my grade for Assignment 3. I submitted on time but received a zero. Can
                you please check?"
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Escalation Reason: Grade dispute - outside knowledge base
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Kwame Mensah</CardTitle>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <CardDescription>Math 201 • 2 days ago</CardDescription>
              </div>
              <Button size="sm">Respond</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Student Question:</p>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                "My attendance record shows 3 absences, but I was present in all classes. Can we review this?"
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Escalation Reason: Attendance dispute - outside knowledge base
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Amara Okonkwo</CardTitle>
                  <Badge variant="outline">Resolved</Badge>
                </div>
                <CardDescription>CS101 • 3 days ago</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Student Question:</p>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                "Can I get an extension on the project due to medical reasons? I have documentation."
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Escalation Reason: Extension request - outside knowledge base
              </p>
              <div className="mt-3 p-2 bg-primary/10 rounded-lg">
                <p className="text-xs text-primary">✓ Resolved: Extension granted until next Monday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
