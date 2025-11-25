"use client"

import { useEffect, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Video } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase-client"
import { useStudentId } from "@/hooks/use-student-id"
import { useAuth } from "@/hooks/use-auth"

type Assistant = {
  id: string
  course_code: string
  name: string
}

export default function AssistantEntryPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const pathname = usePathname()
  const studentId = useStudentId()
  const { currentUser, loading } = useAuth()

  const [assistant, setAssistant] = useState<Assistant | null>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    async function loadAssistant() {
      if (!params?.id) return

      const { data, error } = await supabaseClient
        .from("assistants")
        .select("id, course_code, name")
        .eq("id", params.id)
        .single()

      if (error) {
        console.error("Error loading assistant:", error)
        return
      }

      setAssistant(data as Assistant)
    }

    loadAssistant()
  }, [params?.id])

  useEffect(() => {
    if (loading) return
    if (!currentUser) {
      const next = encodeURIComponent(pathname || "/assistant")
      router.replace(`/login?next=${next}`)
    }
  }, [currentUser, loading, pathname, router])

  async function handleJoin() {
    if (!assistant?.id || !studentId) return
    setJoining(true)

    try {
      const response = await fetch("/api/queue/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId: assistant.id,
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
    } finally {
      setJoining(false)
    }
  }

  if (!assistant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading assistant…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{assistant.name}</CardTitle>
          <CardDescription>{assistant.course_code}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This is your course&apos;s AI assistant. You&apos;ll join a one-on-one video session powered by Tavus. If
            another student is already in a session, you&apos;ll be placed in a queue.
          </p>
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleJoin}
            disabled={joining}
          >
            <Video className="h-4 w-4" />
            {joining ? "Joining…" : "Start Session"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

