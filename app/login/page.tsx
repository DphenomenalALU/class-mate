"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase-client"
import { useAuth } from "@/hooks/use-auth"
import { RoleSelector } from "@/components/auth/RoleSelector"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentUser, loading } = useAuth()

  useEffect(() => {
    const next = searchParams.get("next") || "/student"
    if (currentUser?.role === "facilitator") {
      router.push("/dashboard")
    } else if (currentUser?.role === "student") {
      router.push(next)
    }
  }, [currentUser, router, searchParams])

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
      return (
        <div className="flex min-h-screen items-center justify-center">
          <RoleSelector next={searchParams.get("next") || undefined} />
        </div>
      )
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold">You are signed in</h1>
          <p className="text-sm text-muted-foreground">
            Use the navigation to access the student or facilitator dashboards.
          </p>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      </div>
    )
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
