"use client"

import { useEffect, useMemo, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabaseClient } from "@/lib/supabase-client"
import { useAuth } from "@/hooks/use-auth"

type SessionRow = {
  id: string
  assistant_id: string
  status: "queued" | "active" | "completed" | "escalated"
  rating: number | null
  started_at: string | null
  ended_at: string | null
}

type Assistant = {
  id: string
  course_code: string
  name: string
}

export default function StudentHistoryPage() {
  const { currentUser, loading } = useAuth()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [assistants, setAssistants] = useState<Assistant[]>([])

  useEffect(() => {
    if (loading || !currentUser?.user?.id) return

    async function load() {
      const { data: sessionsData } = await supabaseClient
        .from("sessions")
        .select("id, assistant_id, status, rating, started_at, ended_at")
        .eq("student_id", currentUser.user.id)
        .order("started_at", { ascending: false })

      const { data: assistantsData } = await supabaseClient
        .from("assistants")
        .select("id, course_code, name")

      setSessions((sessionsData || []) as SessionRow[])
      setAssistants((assistantsData || []) as Assistant[])
    }

    load()
  }, [currentUser, loading])

  const rows = useMemo(() => {
    return sessions.map((s) => {
      const assistant = assistants.find((a) => a.id === s.assistant_id)
      const course = assistant?.course_code ?? "Course"
      const name = assistant?.name ?? "Assistant"
      const start = s.started_at ? new Date(s.started_at).toLocaleString() : "Unknown"
      const end = s.ended_at ? new Date(s.ended_at).toLocaleString() : "In progress"
      return { ...s, course, name, start, end }
    })
  }, [sessions, assistants])

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
        <p className="text-sm text-muted-foreground">
          A log of your previous ClassMate sessions, including status and ratings.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">You don&apos;t have any sessions yet.</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.map((s) => (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b last:border-0 pb-3 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {s.course} – {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Started: {s.start}
                    {s.ended_at && <> · Ended: {s.end}</>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={
                      s.status === "escalated"
                        ? "bg-yellow-600/20 text-yellow-400 border-0"
                        : s.status === "completed"
                        ? "bg-emerald-600/20 text-emerald-400 border-0"
                        : "bg-zinc-700/50 text-zinc-100 border-0"
                    }
                  >
                    {s.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {s.rating != null ? `Rating: ${s.rating}/5` : "No rating"}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

