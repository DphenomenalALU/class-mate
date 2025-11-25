"use client"

import { useEffect, useState } from "react"
import { Upload, FileText, Trash2, CheckCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const BUCKET = "course-materials"

export default function KnowledgePage() {
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>("")
  const [documents, setDocuments] = useState<AssistantDocument[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const { data: assistantsData } = await supabaseClient
        .from("assistants")
        .select("id, course_code, name")
        .order("course_code")

      setAssistants((assistantsData || []) as Assistant[])

      const initialAssistantId = assistantsData && assistantsData.length > 0 ? assistantsData[0].id : ""
      if (initialAssistantId) {
        setSelectedAssistantId(initialAssistantId)
        await loadDocuments(initialAssistantId)
      }
    }

    async function loadDocuments(assistantId: string) {
      const { data: docsData } = await supabaseClient
        .from("assistant_documents")
        .select("*")
        .eq("assistant_id", assistantId)
        .order("created_at", { ascending: false })

      setDocuments((docsData || []) as AssistantDocument[])
    }

    loadData()
  }, [])

  async function handleAssistantChange(id: string) {
    setSelectedAssistantId(id)
    const { data: docsData } = await supabaseClient
      .from("assistant_documents")
      .select("*")
      .eq("assistant_id", id)
      .order("created_at", { ascending: false })

    setDocuments((docsData || []) as AssistantDocument[])
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !selectedAssistantId) return

    try {
      setIsUploading(true)
      setError(null)

      const path = `${selectedAssistantId}/${Date.now()}-${file.name}`

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
          assistantId: selectedAssistantId,
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

    const { error: deleteError } = await supabaseClient.from("assistant_documents").delete().eq("id", id)
    if (deleteError) {
      console.error("Error deleting document:", deleteError)
      setDocuments(previous)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground text-sm">
            Upload course materials. Tavus will index them so your assistants can answer questions from your content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="kb-upload"
            type="file"
            accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.csv,.xlsx,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button asChild disabled={!selectedAssistantId || isUploading}>
            <label htmlFor="kb-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Document"}
            </label>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>Documents your replica uses to answer questions.</CardDescription>
            </div>
            <div className="w-56">
              <Select value={selectedAssistantId} onValueChange={handleAssistantChange}>
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
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-green-500">
                          <CheckCircle className="h-3 w-3" /> Indexed
                        </span>
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
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Settings</CardTitle>
              <CardDescription>Configure how your replica uses this data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Each document you upload is sent to Tavus as part of the Knowledge Base for the selected assistant. During
                a conversation, your assistant will retrieve information from these documents in real time.
              </p>
              <p>
                For this prototype, all documents are treated as public course materials. In a production setup, you can
                add tags and retrieval strategies per assistant.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
