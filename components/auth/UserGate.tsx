"use client"

import Link from "next/link"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

type Props = {
  children: React.ReactNode
  allowRoles?: Array<"student" | "facilitator">
}

export function UserGate({ children, allowRoles }: Props) {
  const { currentUser, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // If there is no active session, redirect to login with ?next
  useEffect(() => {
    if (loading) return
    if (currentUser) return

    const next = pathname || "/"
    router.replace(`/login?next=${encodeURIComponent(next)}`)
  }, [currentUser, loading, pathname, router])

  if (loading) {
    // Briefly render nothing while we determine auth state.
    return null
  }

  if (!currentUser) {
    // Redirect is in progress; avoid flashing extra UI.
    return null
  }

  if (allowRoles && !allowRoles.includes(currentUser.role ?? "student")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Access restricted</h1>
          <p className="text-sm text-muted-foreground">
            Your account does not have permission to view this page.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
