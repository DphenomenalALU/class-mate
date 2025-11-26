"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, AlertTriangle, ArrowUpRight, CheckCircle2, TrendingUp } from "lucide-react"
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

type Escalation = {
  id: string
  status: "open" | "resolved"
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [escalations, setEscalations] = useState<Escalation[]>([])

  useEffect(() => {
    async function load() {
      const { data: sessionsData } = await supabaseClient
        .from("sessions")
        .select("id, assistant_id, status, rating")
      const { data: assistantsData } = await supabaseClient
        .from("assistants")
        .select("id, course_code, name")
      const { data: escalationsData } = await supabaseClient
        .from("escalations")
        .select("id, status")

      setSessions((sessionsData || []) as Session[])
      setAssistants((assistantsData || []) as Assistant[])
      setEscalations((escalationsData || []) as Escalation[])
    }

    load()
  }, [])

  const stats = useMemo(() => {
    const totalSessions = sessions.length
    const completed = sessions.filter((s) => s.status === "completed").length
    const escalatedSessions = sessions.filter((s) => s.status === "escalated").length
    const resolutionRate = totalSessions > 0 ? Math.round((completed / totalSessions) * 100) : 0
    const ratings = sessions.map((s) => s.rating).filter((r): r is number => typeof r === "number")
    const avgRating =
      ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : "–"

    const openEscalations = escalations.filter((e) => e.status === "open").length
    return {
      totalSessions,
      resolutionRate,
      openEscalations,
      escalatedSessions,
      avgRating,
      ratingsCount: ratings.length,
    }
  }, [sessions, escalations])

  const sessionsByAssistant = useMemo(() => {
    const map = new Map<string, { assistant: Assistant; count: number }>()
    for (const s of sessions) {
      const assistant = assistants.find((a) => a.id === s.assistant_id)
      if (!assistant) continue
      const entry = map.get(assistant.id)
      if (entry) {
        entry.count += 1
      } else {
        map.set(assistant.id, { assistant, count: 1 })
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [sessions, assistants])

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
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Across all assistants</p>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">Completed without escalation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openEscalations}</div>
            <p className="text-xs text-muted-foreground text-destructive">
              {stats.escalatedSessions} sessions escalated
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sessions by Assistant</CardTitle>
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
                        style={{
                          width: `${Math.min(
                            (count / (stats.totalSessions || 1)) * 100,
                            100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your assistants and content.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/dashboard/assistants">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <ArrowUpRight className="h-4 w-4" />
                Manage Assistants & Knowledge
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
