"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase-client"
import { useAuth } from "@/hooks/use-auth"

export function RoleSelector() {
  const { currentUser, loading } = useAuth()
  const [saving, setSaving] = useState<"student" | "facilitator" | null>(null)

  if (loading || !currentUser || currentUser.role) {
    return null
  }

  async function setRole(role: "student" | "facilitator") {
    if (!currentUser?.user?.id) return
    try {
      setSaving(role)
      await supabaseClient
        .from("profiles")
        .upsert(
          {
            id: currentUser.user.id,
            role,
          },
          {
            onConflict: "id",
          },
        )
      // After role is set, reload so useAuth picks up the new role
      window.location.href = role === "facilitator" ? "/dashboard" : "/student"
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Tell us who you are</h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Choose whether you&apos;re signing in as a student or a facilitator. You can change this later in Supabase if
        needed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          size="lg"
          variant="outline"
          onClick={() => setRole("student")}
          disabled={!!saving}
        >
          {saving === "student" ? "Saving…" : "I am a Student"}
        </Button>
        <Button
          size="lg"
          onClick={() => setRole("facilitator")}
          disabled={!!saving}
        >
          {saving === "facilitator" ? "Saving…" : "I am a Facilitator"}
        </Button>
      </div>
    </div>
  )
}

