"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SessionPage() {
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [showEscalation, setShowEscalation] = useState(false)

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
        {/* Placeholder for AI Video Stream */}
        <div className="text-center opacity-30">
          <div className="h-32 w-32 rounded-full bg-zinc-800 mx-auto mb-4 flex items-center justify-center text-5xl">
            👩‍💻
          </div>
          <p className="text-xl font-medium">Dr. Chen is speaking...</p>
        </div>

        {/* Transcript Overlay */}
        <div className="absolute bottom-32 left-0 right-0 px-8 text-center">
          <span className="inline-block bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl text-lg font-medium">
            "Let's walk through how loops work in Python. Can you show me your code?"
          </span>
        </div>

        {isVideoOn && (
          <div className="absolute bottom-32 right-6 w-48 h-36 bg-zinc-800 rounded-xl border border-zinc-700 shadow-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-zinc-700">
              <span className="text-xs text-zinc-400">You</span>
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
          className={`h-12 w-12 rounded-full ${isMicOn ? "bg-zinc-800 hover:bg-zinc-700" : "bg-destructive hover:bg-destructive/90"} text-white border-0`}
          onClick={() => setIsMicOn(!isMicOn)}
        >
          {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className={`h-12 w-12 rounded-full ${isVideoOn ? "bg-zinc-800 hover:bg-zinc-700" : "bg-destructive hover:bg-destructive/90"} text-white border-0`}
          onClick={() => setIsVideoOn(!isVideoOn)}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>

        <Link href="/student">
          <Button variant="destructive" size="icon" className="h-12 w-16 rounded-full px-8 mx-4">
            <PhoneOff className="h-6 w-6" />
          </Button>
        </Link>

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
