"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Video, ArrowRight, Bot } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStudentId } from "@/hooks/use-student-id"
import { useAuth } from "@/hooks/use-auth"
import { supabaseClient } from "@/lib/supabase-client"

type Assistant = {
  id: string
  course_code: string
  name: string
}

type SessionRow = {
  id: string
  assistant_id: string
  status: "queued" | "active" | "completed" | "escalated"
  rating: number | null
  started_at: string | null
}

export default function StudentDashboard() {
  const router = useRouter()
  const studentId = useStudentId()
  const { currentUser } = useAuth()

  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [sessions, setSessions] = useState<SessionRow[]>([])

  useEffect(() => {
    async function loadAssistants() {
      const { data } = await supabaseClient
        .from("assistants")
        .select("id, course_code, name")
        .order("course_code")
      setAssistants((data || []) as Assistant[])
    }

    loadAssistants()
  }, [])

  useEffect(() => {
    if (!currentUser?.user?.id) return

    async function loadSessions() {
      const { data } = await supabaseClient
        .from("sessions")
        .select("id, assistant_id, status, rating, started_at")
        .eq("student_id", currentUser.user.id)
        .order("started_at", { ascending: false })
      setSessions((data || []) as SessionRow[])
    }

    loadSessions()
  }, [currentUser])

  const name =
    (currentUser?.user?.user_metadata?.full_name as string | undefined) ||
    (currentUser?.user?.email as string | undefined) ||
    "there"

  const primaryAssistant = assistants[0]
  const otherAssistants = assistants.slice(1, 4)

  const stats = useMemo(() => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recent = sessions.filter((s) => {
      if (!s.started_at) return false
      const t = new Date(s.started_at)
      return t >= oneWeekAgo
    })

    const sessionsThisWeek = recent.length
    const escalatedThisWeek = recent.filter((s) => s.status === "escalated").length
    const ratings = recent.map((s) => s.rating).filter((r): r is number => typeof r === "number")
    const avgRating = ratings.length
      ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
      : "–"

    return {
      sessionsThisWeek,
      escalatedThisWeek,
      avgRating,
    }
  }, [sessions])

  async function handleConnect(assistantId?: string) {
    if (!studentId) return

    try {
      const response = await fetch("/api/queue/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId: assistantId || undefined,
          studentClientId: studentId,
        }),
      })

      if (!response.ok) {
        console.error("Failed to request session")
        return
      }

      const data = await response.json()

      if (data.status === "active") {
        router.push(`/session/${data.queueId}`)
      } else {
        const params = new URLSearchParams({
          queueId: data.queueId,
          position: String(data.position),
        })
        router.push(`/student/queue?${params.toString()}`)
      }
    } catch (error) {
      console.error("Error requesting session:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name}</h1>
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
            {primaryAssistant ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-2xl">
                    👩‍🏫
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{primaryAssistant.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {primaryAssistant.course_code} – ClassMate Assistant
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                    Available
                  </Badge>
                </div>
                {otherAssistants.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    As more assistants are added for your courses, they&apos;ll appear here.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>No assistants are available yet.</p>
                <p>Your facilitator will add assistants for your courses. Check back later.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full sm:w-auto gap-2"
              onClick={() => handleConnect(primaryAssistant?.id)}
              disabled={!primaryAssistant}
            >
              Start Session <ArrowRight className="h-4 w-4" />
            </Button>
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
                <span className="font-bold">{stats.sessionsThisWeek}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Escalations</span>
                <span className="font-bold">{stats.escalatedThisWeek}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg. Rating</span>
                <span className="font-bold">{stats.avgRating}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Your Courses</h2>
        {assistants.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              No assistants have been configured for your courses yet. Once your facilitator sets them up, they&apos;ll
              appear here for quick access.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assistants.slice(0, 6).map((assistant) => (
              <Card key={assistant.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base truncate">{assistant.course_code}</CardTitle>
                        <CardDescription className="text-xs truncate">{assistant.name}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assistant</span>
                    <span className="font-medium truncate max-w-[9rem]">{assistant.name}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="secondary"
                    className="w-full gap-2"
                    onClick={() => handleConnect(assistant.id)}
                  >
                    <Video className="h-4 w-4" />
                    Connect Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
