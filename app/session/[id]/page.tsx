"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CVIProvider } from "@/app/components/cvi/components/cvi-provider"
import { Conversation } from "@/app/components/cvi/components/conversation"
import { useLocalMicrophone } from "@/app/components/cvi/hooks/use-local-microphone"
import { useLocalCamera } from "@/app/components/cvi/hooks/use-local-camera"
import { useBrowserMediaPermissions } from "@/hooks/use-browser-media-permissions"

function SessionContent() {
  const router = useRouter()
  const [showEscalation, setShowEscalation] = useState(false)
  const [conversationUrl, setConversationUrl] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { isMicMuted, onToggleMicrophone } = useLocalMicrophone()
  const { isCamMuted, onToggleCamera } = useLocalCamera()
  const { requestPermissions } = useBrowserMediaPermissions()

  const isMicOn = !isMicMuted
  const isVideoOn = !isCamMuted

  useEffect(() => {
    if (conversationUrl) {
      requestPermissions()
    }
  }, [conversationUrl, requestPermissions])

  async function handleStartConversation() {
    try {
      setIsStarting(true)
      setError(null)
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
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
    if (isMicOn) onToggleMicrophone()
    if (isVideoOn) onToggleCamera()
    setConversationUrl(null)
  }

  function handleHangUp() {
    handleEndSession()
    router.push("/student")
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-sm z-10 absolute top-0 w-full">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="font-medium text-sm">Live Session: CS101 - Introduction to Programming</span>
        </div>
        <div className="text-sm font-mono opacity-70">00:12:45</div>
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
              <div className="flex gap-2">
                <Button variant="destructive" className="flex-1">
                  Confirm Escalation
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowEscalation(false)}>
                  Cancel
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
