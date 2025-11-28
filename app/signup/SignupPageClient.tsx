"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GraduationCap } from "lucide-react"
import { supabaseClient } from "@/lib/supabase-client"
import { useAuth } from "@/hooks/use-auth"

export function SignupPageClient() {
  const [role, setRole] = useState<"student" | "facilitator">("student")
  const { currentUser, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // If a session is already active, redirect away from signup.
  useEffect(() => {
    if (loading || !currentUser) return

    const nextParam = searchParams.get("next")
    const defaultNext = currentUser.role === "facilitator" ? "/dashboard" : "/student"
    const next = nextParam || defaultNext

    router.replace(next)
  }, [currentUser, loading, router, searchParams])

  async function handleSignUp() {
    const defaultNext = role === "facilitator" ? "/dashboard" : "/student"

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/login?next=${encodeURIComponent(defaultNext)}&role=${role}`
        : undefined

    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    })
  }

  if (loading || currentUser?.role) {
    // If auth is still loading or a fully-configured session exists,
    // avoid showing the signup UI (redirect effect will handle it).
    return null
  }

  return (
    <div className="relative min-h-screen grid items-center justify-center px-6 py-10 lg:max-w-none lg:grid-cols-2 lg:px-0 lg:py-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span>ClassMate</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;ClassMate has allowed me to support my students at scale. My AI assistant handles routine questions
              so I can focus on what matters most - complex academic guidance.&rdquo;
            </p>
            <footer className="text-sm">Dr. Amara Okonkwo, ALU Facilitator</footer>
          </blockquote>
        </div>
      </div>
      <div className="w-full lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Sign up with your institutional Google account</p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>I am a</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as "student" | "facilitator")}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="student" id="student" className="peer sr-only" />
                    <Label
                      htmlFor="student"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>Student</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="facilitator" id="facilitator" className="peer sr-only" />
                    <Label
                      htmlFor="facilitator"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>Facilitator</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button className="w-full gap-2" size="lg" onClick={handleSignUp}>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
                <Link href="/terms" className="hover:text-brand underline underline-offset-4">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="hover:text-brand underline underline-offset-4">
                  Privacy Policy
                </Link>
              .
            </p>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-brand">
              Already have an account? Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

