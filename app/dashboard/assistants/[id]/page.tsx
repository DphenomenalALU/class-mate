"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Upload, FileText, Trash2, FileTextIcon, Plus } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { supabaseClient } from "@/lib/supabase-client"

type Assistant = {
  id: string
  course_code: string
  name: string
}

type AssistantDocument = {
  id: string
  assistant_id: string
  document_name: string
  document_url: string
  tavus_document_id: string
  created_at: string
}

type AssistantNote = {
  id: string
  assistant_id: string
  title: string
  body: string
  created_at: string
}

const BUCKET = "course-materials"

export default function AssistantDetailPage() {
  const params = useParams<{ id: string }>()
  const [assistant, setAssistant] = useState<Assistant | null>(null)
  const [documents, setDocuments] = useState<AssistantDocument[]>([])
  const [notes, setNotes] = useState<AssistantNote[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [isSavingNote, setIsSavingNote] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!params?.id) return

      const { data: assistantData } = await supabaseClient
        .from("assistants")
        .select("id, course_code, name")
        .eq("id", params.id)
        .single()

      setAssistant((assistantData || null) as Assistant | null)

      const { data: docsData } = await supabaseClient
        .from("assistant_documents")
        .select("*")
        .eq("assistant_id", params.id)
        .order("created_at", { ascending: false })

      setDocuments((docsData || []) as AssistantDocument[])

      const { data: notesData } = await supabaseClient
        .from("assistant_notes")
        .select("*")
        .eq("assistant_id", params.id)
        .order("created_at", { ascending: false })

      setNotes((notesData || []) as AssistantNote[])
    }

    load()
  }, [params?.id])

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !assistant) return

    try {
      setIsUploading(true)
      setError(null)

      const path = `${assistant.id}/${Date.now()}-${file.name}`

      const { error: uploadError } = await supabaseClient.storage.from(BUCKET).upload(path, file)
      if (uploadError) {
        console.error("Upload error:", uploadError)
        setError("Failed to upload file")
        return
      }

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId: assistant.id,
          path,
          documentName: file.name,
        }),
      })

      if (!response.ok) {
        setError("Failed to register document with Tavus")
        return
      }

      const data = await response.json()
      setDocuments((prev) => [data.document as AssistantDocument, ...prev])
    } catch (err) {
      console.error("Unexpected upload error:", err)
      setError("Something went wrong while uploading")
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  async function handleDeleteDocument(id: string) {
    const previous = documents
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))

    const { error } = await supabaseClient.from("assistant_documents").delete().eq("id", id)
    if (error) {
      console.error("Error deleting document:", error)
      setDocuments(previous)
    }
  }

  async function handleSaveNote() {
    if (!assistant || !noteContent.trim()) return

    const title = noteContent.length > 60 ? `${noteContent.slice(0, 57)}...` : noteContent

    try {
      setIsSavingNote(true)
      const { data, error } = await supabaseClient
        .from("assistant_notes")
        .insert({
          assistant_id: assistant.id,
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
    } finally {
      setIsSavingNote(false)
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

  if (!assistant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading assistant…</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{assistant.name}</h1>
          <p className="text-muted-foreground mt-1">Manage knowledge and notes for {assistant.course_code}</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>Documents this assistant uses to answer questions.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="assistant-kb-upload"
                type="file"
                accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.csv,.xlsx,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button asChild disabled={isUploading}>
                <label htmlFor="assistant-kb-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Document"}
                </label>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && <p className="text-sm text-destructive mb-4">{error}</p>}
            <div className="space-y-4">
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No documents uploaded yet for this assistant.
                </p>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.document_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Tavus ID: <span className="font-mono">{doc.tavus_document_id}</span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Context Notes</CardTitle>
            <CardDescription>Announcements or extra guidance you want this assistant to share.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <FileTextIcon className="h-4 w-4" />
                New Note
              </label>
              <Textarea
                placeholder="e.g., 'Midterm exam is next Friday. Focus on chapters 1–5.'"
                rows={3}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              className="gap-2"
              onClick={handleSaveNote}
              disabled={isSavingNote}
            >
              <Plus className="h-4 w-4" />
              {isSavingNote ? "Saving..." : "Save Note"}
            </Button>
            <div className="mt-4 space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes yet for this assistant.</p>
              ) : (
                notes.map((note) => {
                  const created = new Date(note.created_at).toLocaleString()
                  return (
                    <div key={note.id} className="rounded-lg border p-3 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{note.title}</p>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">{note.body}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{created}</p>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

