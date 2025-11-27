"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase-client"
import { useAuth } from "@/hooks/use-auth"
import { RoleSelector } from "@/components/auth/RoleSelector"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentUser, loading } = useAuth()
  const [isSettingRole, setIsSettingRole] = useState(false)

  useEffect(() => {
    const next = searchParams.get("next") || "/student"
    if (currentUser?.role === "facilitator") {
      router.push("/dashboard")
    } else if (currentUser?.role === "student") {
      router.push(next)
    }
  }, [currentUser, router, searchParams])

  // Handle automatic role assignment coming from signup (role passed as query param)
  useEffect(() => {
    async function applyPreferredRole() {
      if (!currentUser || currentUser.role || isSettingRole) return

      const preferredRole = searchParams.get("role")
      if (preferredRole !== "student" && preferredRole !== "facilitator") return

      try {
        setIsSettingRole(true)
        await supabaseClient
          .from("profiles")
          .upsert(
            {
              id: currentUser.user.id,
              role: preferredRole,
            },
            { onConflict: "id" },
          )

        const next = searchParams.get("next") || (preferredRole === "facilitator" ? "/dashboard" : "/student")
        router.push(next)
      } finally {
        setIsSettingRole(false)
      }
    }

    applyPreferredRole()
  }, [currentUser, isSettingRole, router, searchParams])

  async function handleSignInWithGoogle() {
    const next = searchParams.get("next") || "/student"
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/login?next=${encodeURIComponent(next)}`
        : undefined

    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    })
  }

  async function handleSignOut() {
    await supabaseClient.auth.signOut()
  }

  if (currentUser) {
    if (!currentUser.role) {
      const preferredRole = searchParams.get("role")

      // Coming from signup with a chosen role: show a simple loading state
      if (preferredRole === "student" || preferredRole === "facilitator") {
        return (
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-muted-foreground">Setting up your account…</p>
          </div>
        )
      }

      // Fallback for users who hit login directly without a preset role
      return (
        <div className="flex min-h-screen items-center justify-center">
          <RoleSelector next={searchParams.get("next") || undefined} />
        </div>
      )
    }

    // If a session and role are present, the effect above will redirect
    // the user to the appropriate dashboard. Avoid rendering extra UI.
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign in to ClassMate</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Use your institutional Google account to access your ClassMate dashboard and live AI sessions.
        </p>
        <Button onClick={handleSignInWithGoogle} size="lg">
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
