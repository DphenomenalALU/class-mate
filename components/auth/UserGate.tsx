"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

type Props = {
  children: React.ReactNode
  allowRoles?: Array<"student" | "facilitator">
}

export function UserGate({ children, allowRoles }: Props) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    // While auth is loading, render nothing to avoid jarring UI text.
    return null
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Sign in to continue</h1>
          <p className="text-sm text-muted-foreground">
            You need to be signed in to access this area.
          </p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
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
