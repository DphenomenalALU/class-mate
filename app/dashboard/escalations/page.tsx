"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabaseClient } from "@/lib/supabase-client"

type Escalation = {
  id: string
  assistant_id: string
  student_id: string
  source: "student" | "llm"
  reason: string | null
  status: "open" | "resolved"
  created_at: string
  resolved_at: string | null
}

export default function EscalationsPage() {
  const [escalations, setEscalations] = useState<Escalation[]>([])

  useEffect(() => {
    async function loadEscalations() {
      const { data, error } = await supabaseClient
        .from("escalations")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading escalations:", error)
        return
      }

      setEscalations((data || []) as Escalation[])
    }

    loadEscalations()
  }, [])

  const stats = useMemo(() => {
    const pending = escalations.filter((e) => e.status === "open").length
    const resolved = escalations.filter((e) => e.status === "resolved").length
    return {
      pending,
      inProgress: 0,
      resolved,
    }
  }, [escalations])

  async function handleMarkAllReviewed() {
    const openIds = escalations.filter((e) => e.status === "open").map((e) => e.id)
    if (openIds.length === 0) return

    setEscalations((prev) => prev.map((e) => (openIds.includes(e.id) ? { ...e, status: "resolved" } : e)))

    const { error } = await supabaseClient
      .from("escalations")
      .update({ status: "resolved", resolved_at: new Date().toISOString() })
      .in("id", openIds)

    if (error) {
      console.error("Error marking escalations resolved:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escalation Log</h1>
          <p className="text-muted-foreground mt-1">Review student queries that require your attention</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllReviewed}>
            Mark All Reviewed
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Need response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {escalations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No escalations yet.</p>
        ) : (
          escalations.map((e) => {
            const created = new Date(e.created_at).toLocaleString()
            const isOpen = e.status === "open"
            return (
              <Card key={e.id} className={isOpen ? "border-destructive/50" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          Escalation from {e.source === "student" ? "Student" : "Assistant"}
                        </CardTitle>
                        <Badge variant={isOpen ? "destructive" : "outline"}>
                          {isOpen ? "Pending" : "Resolved"}
                        </Badge>
                      </div>
                      <CardDescription>{created}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Reason</p>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {e.reason || "No additional details provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
