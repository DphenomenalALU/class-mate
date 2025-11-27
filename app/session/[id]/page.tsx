"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CVIProvider } from "@/app/components/cvi/components/cvi-provider"
import { Conversation } from "@/app/components/cvi/components/conversation"
import { useLocalMicrophone } from "@/app/components/cvi/hooks/use-local-microphone"
import { useLocalCamera } from "@/app/components/cvi/hooks/use-local-camera"
import { useBrowserMediaPermissions } from "@/hooks/use-browser-media-permissions"
import { supabaseClient } from "@/lib/supabase-client"
import { useAuth } from "@/hooks/use-auth"
import { Textarea } from "@/components/ui/textarea"
import { useDaily } from "@daily-co/daily-react"

function SessionContent() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [showEscalation, setShowEscalation] = useState(false)
  const [conversationUrl, setConversationUrl] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assistantId, setAssistantId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [wasEscalated, setWasEscalated] = useState(false)
  const [escalationSubmitting, setEscalationSubmitting] = useState(false)
  const [escalationNote, setEscalationNote] = useState("")
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const daily = useDaily()
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [ratingSubmitting, setRatingSubmitting] = useState(false)

  const { isMicMuted, onToggleMicrophone } = useLocalMicrophone()
  const { isCamMuted, onToggleCamera } = useLocalCamera()
  const { requestPermissions } = useBrowserMediaPermissions()
  const { currentUser } = useAuth()

  const isMicOn = !isMicMuted
  const isVideoOn = !isCamMuted

  useEffect(() => {
    async function loadAssistant() {
      if (!params?.id) return
      const { data, error } = await supabaseClient
        .from("session_queue_local")
        .select("assistant_id")
        .eq("id", params.id)
        .single()

      if (error) {
        console.error("Failed to load assistant for session:", error)
        return
      }
      setAssistantId((data as { assistant_id: string }).assistant_id)
    }

    loadAssistant()
  }, [params?.id])

  useEffect(() => {
    async function ensureSession() {
      if (!assistantId || !currentUser?.user?.id || sessionId) return

      const { data, error } = await supabaseClient
        .from("sessions")
        .insert({
          assistant_id: assistantId,
          student_id: currentUser.user.id,
          status: "active",
          started_at: new Date().toISOString(),
        })
        .select("id, started_at")
        .single()

      if (error) {
        console.error("Failed to create session record:", error)
        return
      }

      const inserted = data as { id: string; started_at: string }
      setSessionId(inserted.id)
      setSessionStartedAt(new Date(inserted.started_at))
    }

    ensureSession()
  }, [assistantId, currentUser, sessionId])

  useEffect(() => {
    if (conversationUrl) {
      requestPermissions()
    }
  }, [conversationUrl, requestPermissions])

  useEffect(() => {
    if (!sessionStartedAt) return

    const updateElapsed = () => {
      const diffMs = Date.now() - sessionStartedAt.getTime()
      const seconds = Math.max(0, Math.floor(diffMs / 1000))
      setElapsedSeconds(seconds)
    }

    updateElapsed()
    const interval = setInterval(updateElapsed, 1000)
    return () => clearInterval(interval)
  }, [sessionStartedAt])

  useEffect(() => {
    if (!daily) return

    function handleAppMessage(event: any) {
      const data = event?.data
      if (!data) return

      try {
        // Generic checks for a trigger_escalation tool call
        const toolName =
          data.tool?.name ||
          data.name ||
          data.tool_name

        const reason =
          data.tool?.arguments?.reason ||
          data.arguments?.reason ||
          data.reason ||
          ""

        if (toolName === "trigger_escalation") {
          if (typeof reason === "string" && reason.trim().length > 0) {
            setEscalationNote(reason.trim())
          }
          setShowEscalation(true)
        }
      } catch (err) {
        console.warn("Error handling CVI app message:", err)
      }
    }

    daily.on("app-message", handleAppMessage)
    return () => {
      daily.off("app-message", handleAppMessage)
    }
  }, [daily])

  async function handleStartConversation() {
    try {
      setIsStarting(true)
      setError(null)
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId: assistantId || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to start conversation")
      }

      const data = await response.json()
      setConversationUrl(data.conversation_url)
    } catch (err) {
      setError("Could not start the AI video session. Please try again.")
      console.error(err)
    } finally {
      setIsStarting(false)
    }
  }

  function handleEndSession() {
    if (sessionId) {
      const newStatus = wasEscalated ? "escalated" : "completed"
      supabaseClient
        .from("sessions")
        .update({
          status: newStatus,
          ended_at: new Date().toISOString(),
        })
        .eq("id", sessionId)
        .then(({ error }) => {
          if (error) {
            console.error("Failed to update session record:", error)
          }
        })
    }
    if (isMicOn) onToggleMicrophone()
    if (isVideoOn) onToggleCamera()
    setConversationUrl(null)
  }

  function handleHangUp() {
    handleEndSession()
    if (params?.id) {
      fetch("/api/queue/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queueId: params.id }),
      }).catch((error) => {
        console.error("Failed to complete queue entry:", error)
      })
    }
    setShowRating(true)
  }

  async function handleConfirmEscalation() {
    if (!assistantId || !sessionId) {
      setShowEscalation(false)
      return
    }

    try {
      setEscalationSubmitting(true)
      const response = await fetch("/api/escalations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId,
          sessionId,
          source: "student",
          reason:
            escalationNote.trim() ||
            "Student requested escalation from live session.",
        }),
      })

      if (!response.ok) {
        console.error("Failed to create escalation")
        return
      }

      setWasEscalated(true)
      setShowEscalation(false)
      handleHangUp()
    } finally {
      setEscalationSubmitting(false)
    }
  }

  async function handleSubmitRating() {
    if (!sessionId || rating == null) {
      setShowRating(false)
      router.push("/student")
      return
    }

    try {
      setRatingSubmitting(true)
      const { error } = await supabaseClient
        .from("sessions")
        .update({ rating })
        .eq("id", sessionId)

      if (error) {
        console.error("Failed to save rating:", error)
      }
    } finally {
      setRatingSubmitting(false)
      setShowRating(false)
      router.push("/student")
    }
  }

  function formatDuration(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const mm = minutes.toString().padStart(2, "0")
    const ss = seconds.toString().padStart(2, "0")

    if (hours > 0) {
      const hh = hours.toString().padStart(2, "0")
      return `${hh}:${mm}:${ss}`
    }
    return `${mm}:${ss}`
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-sm z-10 absolute top-0 w-full">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="font-medium text-sm">Live Session: CS101 - Introduction to Programming</span>
        </div>
        <div className="text-sm font-mono opacity-70">
          {formatDuration(elapsedSeconds)}
        </div>
      </header>

      {/* Main Video Area (AI Assistant) */}
      <div className="flex-1 relative flex items-center justify-center bg-zinc-900">
        {!conversationUrl ? (
          <div className="text-center opacity-90 space-y-4">
            <div className="h-32 w-32 rounded-full bg-zinc-800 mx-auto mb-2 flex items-center justify-center text-5xl">
              👩‍💻
            </div>
            <p className="text-xl font-medium">Ready to start your AI session?</p>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              When you start, ClassMate will open a real-time video session with your course assistant powered by Tavus CVI.
            </p>
            <div className="mt-4">
              <Button size="lg" onClick={handleStartConversation} disabled={isStarting}>
                {isStarting ? "Starting..." : "Start AI Video Session"}
              </Button>
            </div>
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full max-w-5xl mx-auto">
              <Conversation
                conversationUrl={conversationUrl}
                onLeave={handleEndSession}
              />
            </div>
          </div>
        )}

        {showEscalation && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 max-w-md space-y-4">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-6 w-6" />
                <h3 className="text-xl font-bold text-white">Escalate to Facilitator</h3>
              </div>
              <p className="text-sm text-zinc-300">
                Your question will be sent to your facilitator for review. They will follow up with you via email.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-zinc-400">
                  Add a short note to help your facilitator understand what you need help with.
                </p>
                <Textarea
                  rows={3}
                  placeholder="E.g., I think my grade for Assignment 3 is wrong because..."
                  value={escalationNote}
                  onChange={(e) => setEscalationNote(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleConfirmEscalation}
                  disabled={escalationSubmitting}
                >
                  {escalationSubmitting ? "Escalating..." : "Confirm Escalation"}
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowEscalation(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {showRating && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 max-w-md space-y-6">
              <h3 className="text-xl font-bold text-white text-center">Rate Your Session</h3>
              <p className="text-sm text-zinc-300 text-center">
                How helpful was this session with your assistant?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`h-10 w-10 rounded-full border text-sm font-medium ${
                      rating === value
                        ? "bg-primary text-black border-primary"
                        : "bg-zinc-800 border-zinc-600 text-zinc-200"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleSubmitRating}
                  disabled={ratingSubmitting}
                >
                  {ratingSubmitting ? "Saving..." : "Submit Rating"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setShowRating(false)
                    router.push("/student")
                  }}
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-20 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-center gap-4 px-6 relative z-20">
        <Button
          variant="secondary"
          size="icon"
          className={`h-12 w-12 rounded-full ${
            isMicOn ? "bg-zinc-800 hover:bg-zinc-700" : "bg-destructive hover:bg-destructive/90"
          } text-white border-0`}
          onClick={onToggleMicrophone}
        >
          {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className={`h-12 w-12 rounded-full ${
            isVideoOn ? "bg-zinc-800 hover:bg-zinc-700" : "bg-destructive hover:bg-destructive/90"
          } text-white border-0`}
          onClick={onToggleCamera}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>

        <Button
          variant="destructive"
          size="icon"
          className="h-12 w-16 rounded-full px-8 mx-4"
          onClick={handleHangUp}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white border-0"
          onClick={() => setShowEscalation(true)}
          title="Escalate to Facilitator"
        >
          <AlertCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute bottom-24 left-6 flex gap-2">
        <Badge variant="secondary" className="bg-zinc-800 text-white">
          {isMicOn ? "🎤 Mic On" : "🔇 Mic Off"}
        </Badge>
        <Badge variant="secondary" className="bg-zinc-800 text-white">
          {isVideoOn ? "📹 Camera On" : "📷 Camera Off"}
        </Badge>
      </div>
    </div>
  )
}

export default function SessionPage() {
  return (
    <CVIProvider>
      <SessionContent />
    </CVIProvider>
  )
}
