"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart3, TrendingUp, Clock, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseClient } from "@/lib/supabase-client"

type Session = {
  id: string
  assistant_id: string
  status: "queued" | "active" | "completed" | "escalated"
  rating: number | null
}

type Assistant = {
  id: string
  course_code: string
  name: string
}

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [assistants, setAssistants] = useState<Assistant[]>([])

  useEffect(() => {
    async function loadData() {
      const { data: sessionsData } = await supabaseClient
        .from("sessions")
        .select("id, assistant_id, status, rating")

      const { data: assistantsData } = await supabaseClient
        .from("assistants")
        .select("id, course_code, name")

      setSessions((sessionsData || []) as Session[])
      setAssistants((assistantsData || []) as Assistant[])
    }

    loadData()
  }, [])

  const stats = useMemo(() => {
    const totalSessions = sessions.length
    const completed = sessions.filter((s) => s.status === "completed").length
    const escalated = sessions.filter((s) => s.status === "escalated").length
    const resolvedWithoutEscalation =
      totalSessions > 0 ? Math.round((completed / totalSessions) * 100) : 0

    const ratings = sessions.map((s) => s.rating).filter((r): r is number => typeof r === "number")
    const avgRating =
      ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : "–"

    return {
      totalSessions,
      resolvedWithoutEscalation,
      avgRating,
      ratingsCount: ratings.length,
      escalated,
    }
  }, [sessions])

  const sessionsByAssistant = useMemo(() => {
    const map = new Map<
      string,
      { assistant: Assistant; count: number }
    >()

    for (const s of sessions) {
      const assistant = assistants.find((a) => a.id === s.assistant_id)
      if (!assistant) continue
      const key = assistant.id
      const current = map.get(key)
      if (current) {
        current.count += 1
      } else {
        map.set(key, { assistant, count: 1 })
      }
    }

    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [sessions, assistants])

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
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Across all assistants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">–</div>
            <p className="text-xs text-muted-foreground">Duration tracking not implemented yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedWithoutEscalation}%</div>
            <p className="text-xs text-muted-foreground">Completed sessions without escalation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgRating} {stats.avgRating !== "–" && "/ 5.0"}
            </div>
            <p className="text-xs text-muted-foreground">Based on {stats.ratingsCount} ratings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Activity by Course</CardTitle>
          <CardDescription>Total sessions per course assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessionsByAssistant.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions yet.</p>
            ) : (
              sessionsByAssistant.map(({ assistant, count }) => (
                <div key={assistant.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">
                        {assistant.course_code} – {assistant.name}
                      </p>
                    </div>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${Math.min((count / (stats.totalSessions || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
