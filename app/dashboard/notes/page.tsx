"use client"

import { useEffect, useState } from "react"
import { FileText, Plus, Trash2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabaseClient } from "@/lib/supabase-client"

type Assistant = {
  id: string
  course_code: string
  name: string
}

type AssistantNote = {
  id: string
  assistant_id: string
  title: string
  body: string
  created_at: string
}

export default function NotesPage() {
  const [showAddNote, setShowAddNote] = useState(false)
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [notes, setNotes] = useState<AssistantNote[]>([])
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>("")
  const [noteContent, setNoteContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadData() {
      const { data: assistantsData } = await supabaseClient
        .from("assistants")
        .select("id, course_code, name")
        .order("course_code")

      const { data: notesData } = await supabaseClient
        .from("assistant_notes")
        .select("*")
        .order("created_at", { ascending: false })

      setAssistants((assistantsData || []) as Assistant[])
      setNotes((notesData || []) as AssistantNote[])

      if (assistantsData && assistantsData.length > 0 && !selectedAssistantId) {
        setSelectedAssistantId(assistantsData[0].id)
      }
    }

    loadData()
  }, [])

  async function handleSaveNote() {
    if (!selectedAssistantId || !noteContent.trim()) return

    const title = noteContent.length > 60 ? `${noteContent.slice(0, 57)}...` : noteContent

    try {
      setIsSaving(true)
      const { data, error } = await supabaseClient
        .from("assistant_notes")
        .insert({
          assistant_id: selectedAssistantId,
          title,
          body: noteContent,
        })
        .select()
        .single()

      if (error) {
        console.error("Error saving note:", error)
        return
      }

      setNotes((prev) => [data as AssistantNote, ...prev])
      setNoteContent("")
      setShowAddNote(false)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteNote(id: string) {
    const previous = notes
    setNotes((prev) => prev.filter((note) => note.id !== id))

    const { error } = await supabaseClient.from("assistant_notes").delete().eq("id", id)
    if (error) {
      console.error("Error deleting note:", error)
      setNotes(previous)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Context Notes</h1>
          <p className="text-muted-foreground mt-1">Add announcements and guidance for your AI assistants</p>
        </div>
        <Button onClick={() => setShowAddNote(!showAddNote)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {showAddNote && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Note</CardTitle>
            <CardDescription>
              Provide context or announcements for your assistant to share with students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assistant">Select Assistant</Label>
              <Select value={selectedAssistantId} onValueChange={setSelectedAssistantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an assistant..." />
                </SelectTrigger>
                <SelectContent>
                  {assistants.map((assistant) => (
                    <SelectItem key={assistant.id} value={assistant.id}>
                      {assistant.course_code} – {assistant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note Content</Label>
              <Textarea
                id="note"
                placeholder="e.g., 'Midterm exam is scheduled for next Friday. Students should review chapters 1-5.'"
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveNote} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Note"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddNote(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet. Add one above.</p>
        ) : (
          notes.map((note) => {
            const assistant = assistants.find((a) => a.id === note.assistant_id)
            const subtitle = assistant ? `${assistant.name} – ${assistant.course_code}` : "Assistant"
            const created = new Date(note.created_at)
            const createdText = created.toLocaleString()

            return (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{note.title}</CardTitle>
                        <CardDescription>{subtitle}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">Added {createdText}</p>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
