"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { supabaseClient } from "@/lib/supabase-client"
import { useAuth } from "@/hooks/use-auth"

type FacilitatorSettings = {
  user_id: string
  tavus_api_key: string | null
  resend_api_key: string | null
  resend_from_email: string | null
}

export default function SettingsPage() {
  const { currentUser } = useAuth()
  const [settings, setSettings] = useState<FacilitatorSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser?.user?.id) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      const { data, error } = await supabaseClient
        .from("facilitator_settings")
        .select("user_id, tavus_api_key, resend_api_key, resend_from_email")
        .eq("user_id", currentUser.user.id)
        .single()

      if (!error && data) {
        setSettings(data as FacilitatorSettings)
      }
      setLoading(false)
    }

    load()
  }, [currentUser])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUser?.user?.id) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const { error } = await supabaseClient
        .from("facilitator_settings")
        .upsert(
          {
            user_id: currentUser.user.id,
            tavus_api_key: settings?.tavus_api_key || null,
            resend_api_key: settings?.resend_api_key || null,
            resend_from_email: settings?.resend_from_email || null,
          },
          { onConflict: "user_id" },
        )

      if (error) {
        console.error("Error saving settings:", error)
        setError("Failed to save settings. Please try again.")
        return
      }

      setSuccess("Settings saved. New keys will be used for future calls.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading settings…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Bring your own API keys for Tavus and Resend. These override the default project keys.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Tavus API Key</CardTitle>
            <CardDescription>
              Your own Tavus API key for CVI conversations and knowledge base.{" "}
              <a
                href="https://platform.tavus.io/dev/api-keys"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                Get a key
              </a>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="tavus-key">Tavus API Key</Label>
              <Input
                id="tavus-key"
                type="password"
                placeholder="tavsk_..."
                value={settings?.tavus_api_key ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...(prev || { user_id: currentUser?.user?.id || "" }),
                    tavus_api_key: e.target.value,
                    resend_api_key: prev?.resend_api_key ?? null,
                    resend_from_email: prev?.resend_from_email ?? null,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resend Email Settings</CardTitle>
            <CardDescription>
              Use your own Resend API key and from-address for escalation emails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="resend-key">Resend API Key</Label>
              <Input
                id="resend-key"
                type="password"
                placeholder="re_xxx..."
                value={settings?.resend_api_key ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...(prev || { user_id: currentUser?.user?.id || "" }),
                    tavus_api_key: prev?.tavus_api_key ?? null,
                    resend_api_key: e.target.value,
                    resend_from_email: prev?.resend_from_email ?? null,
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="resend-from">From Email</Label>
              <Input
                id="resend-from"
                type="email"
                placeholder="no-reply@your-domain.com"
                value={settings?.resend_from_email ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...(prev || { user_id: currentUser?.user?.id || "" }),
                    tavus_api_key: prev?.tavus_api_key ?? null,
                    resend_api_key: prev?.resend_api_key ?? null,
                    resend_from_email: e.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-emerald-500">{success}</p>}
        </div>
      </form>
    </div>
  )
}

