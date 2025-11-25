"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

import { supabaseClient } from "@/lib/supabase-client"

export type CurrentUser = {
  user: User
  role: "student" | "facilitator" | null
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)

      const { data } = await supabaseClient.auth.getUser()
      const user = data.user

      if (!user) {
        if (mounted) {
          setCurrentUser(null)
          setLoading(false)
        }
        return
      }

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (mounted) {
        setCurrentUser({
          user,
          role: (profile?.role as "student" | "facilitator" | null) ?? null,
        })
        setLoading(false)
      }
    }

    load()

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          setCurrentUser(null)
          return
        }
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        setCurrentUser({
          user: session.user,
          role: (profile?.role as "student" | "facilitator" | null) ?? null,
        })
      },
    )

    return () => {
      mounted = false
      subscription?.subscription.unsubscribe()
    }
  }, [])

  return { currentUser, loading }
}

