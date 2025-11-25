"use client"

import { useEffect, useState } from "react"
import { Plus, Settings, Trash2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabaseClient } from "@/lib/supabase-client"

type Assistant = {
  id: string
  course_code: string
  name: string
  tavus_persona_id: string
  tavus_replica_id: string
  is_active: boolean
}

const STOCK_REPLICAS = [
  {
    id: "college-tutor",
    name: "College Tutor",
    subject: "General Academic Support",
    avatar: "👩‍🏫",
    personaId: "p88964a7",
    replicaId: "rfb51183fe",
  },
  {
    id: "sales-coach",
    name: "Sales Coach",
    subject: "Sales Skills",
    avatar: "💼",
    personaId: "pdced222244b",
    replicaId: "rc2146c13e81",
  },
  {
    id: "history-teacher",
    name: "History Teacher",
    subject: "History",
    avatar: "📜",
    personaId: "pc55154f229a",
    replicaId: "r6ae5b6efc9d",
  },
  {
    id: "corporate-trainer",
    name: "Corporate Trainer",
    subject: "Workplace Training",
    avatar: "🏢",
    personaId: "p7fb0be3",
    replicaId: "ra54d1d861",
  },
  {
    id: "healthcare-intake",
    name: "Healthcare Intake Assistant",
    subject: "Healthcare",
    avatar: "🏥",
    personaId: "p5d11710002a",
    replicaId: "r4317e64d25a",
  },
  {
    id: "ai-interviewer",
    name: "AI Interviewer",
    subject: "Interview Practice",
    avatar: "🎤",
    personaId: "pe13ed370726",
    replicaId: "r9d30b0e55ac",
  },
  {
    id: "technical-copilot",
    name: "Technical Co-Pilot",
    subject: "Coding Help",
    avatar: "👨‍💻",
    personaId: "pd43ffef",
    replicaId: "rbb0f535dd",
  },
  {
    id: "tavus-personal",
    name: "Tavus Personal AI",
    subject: "General Assistant",
    avatar: "🤖",
    personaId: "p2fbd605",
    replicaId: "r4c41453d2",
  },
  {
    id: "tavus-researcher",
    name: "Tavus Researcher",
    subject: "Research Insights",
    avatar: "🔬",
    personaId: "p48fdf065d6b",
    replicaId: "rf4703150052",
  },
  {
    id: "demo-persona",
    name: "Demo Persona",
    subject: "Demo / Sandbox",
    avatar: "🧪",
    personaId: "p9a95912",
    replicaId: "r79e1c033f",
  },
]

export default function AssistantsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedReplica, setSelectedReplica] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [courseName, setCourseName] = useState("")
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAssistants() {
      try {
        setIsLoading(true)
        const { data, error } = await supabaseClient
          .from("assistants")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error loading assistants:", error)
          setError("Failed to load assistants")
          return
        }

        setAssistants(data as Assistant[])
      } finally {
        setIsLoading(false)
      }
    }

    loadAssistants()
  }, [])

  async function handleCreateAssistant() {
    if (!courseCode || !courseName || !selectedReplica) return

    const stock = STOCK_REPLICAS.find((r) => r.id === selectedReplica)
    if (!stock) return

    try {
      setIsSaving(true)
      setError(null)

      const { data, error } = await supabaseClient
        .from("assistants")
        .insert({
          course_code: courseCode,
          name: courseName,
          tavus_persona_id: stock.personaId,
          tavus_replica_id: stock.replicaId,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating assistant:", error)
        setError("Failed to create assistant")
        return
      }

      setAssistants((prev) => [data as Assistant, ...prev])
      setShowCreateForm(false)
      setCourseCode("")
      setCourseName("")
      setSelectedReplica("")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteAssistant(id: string) {
    const previous = assistants
    setAssistants((prev) => prev.filter((a) => a.id !== id))

    const { error } = await supabaseClient.from("assistants").delete().eq("id", id)
    if (error) {
      console.error("Error deleting assistant:", error)
      setAssistants(previous)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistants</h1>
          <p className="text-muted-foreground mt-1">Create and manage your course assistants</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Assistant
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Assistant</CardTitle>
            <CardDescription>Choose a stock replica and configure it for your course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-code">Course Code</Label>
              <Input
                id="course-code"
                placeholder="e.g., CS101, MATH201"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input
                id="course-name"
                placeholder="e.g., Calculus I, Introduction to Programming"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="replica">Select Stock Replica</Label>
              <Select value={selectedReplica} onValueChange={setSelectedReplica}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a persona..." />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_REPLICAS.map((replica) => (
                    <SelectItem key={replica.id} value={replica.id}>
                      {replica.avatar} {replica.name} - {replica.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateAssistant} disabled={isSaving}>
                {isSaving ? "Creating..." : "Create Assistant"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
            {error && <p className="text-sm text-destructive pt-2">{error}</p>}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading && assistants.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading assistants…</p>
        ) : assistants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assistants yet. Create your first one above.</p>
        ) : (
          assistants.map((assistant) => (
            <Card key={assistant.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-2xl">
                      🎓
                    </div>
                    <div>
                      <CardTitle className="text-lg">{assistant.name}</CardTitle>
                      <CardDescription>{assistant.course_code}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteAssistant(assistant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Persona ID</span>
                    <span className="font-mono text-xs">{assistant.tavus_persona_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Replica ID</span>
                    <span className="font-mono text-xs">{assistant.tavus_replica_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium">{assistant.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
