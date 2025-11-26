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

    async function ensureProfile(user: User) {
      try {
        const fullName =
          (user.user_metadata?.full_name as string | undefined) ||
          [user.user_metadata?.given_name, user.user_metadata?.family_name]
            .filter(Boolean)
            .join(" ") ||
          null

        const firstName = (user.user_metadata?.given_name as string | undefined) || null
        const lastName = (user.user_metadata?.family_name as string | undefined) || null

        await supabaseClient
          .from("profiles")
          .upsert(
            {
              id: user.id,
              email: user.email,
              full_name: fullName,
              first_name: firstName,
              last_name: lastName,
            },
            { onConflict: "id" },
          )
      } catch (err) {
        console.error("Failed to ensure profile:", err)
      }
    }

    async function load() {
      try {
        setLoading(true)

        const { data, error } = await supabaseClient.auth.getUser()
        if (error) {
          console.error("Error getting current user:", error)
        }

        const user = data?.user ?? null

        if (!user) {
          if (mounted) {
            setCurrentUser(null)
            setLoading(false)
          }
          return
        }

        await ensureProfile(user)

        const { data: profile, error: profileError } = await supabaseClient
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("Error loading profile:", profileError)
        }

        if (mounted) {
          setCurrentUser({
            user,
            role: (profile?.role as "student" | "facilitator" | null) ?? null,
          })
          setLoading(false)
        }
      } catch (err) {
        console.error("Unexpected auth load error:", err)
        if (mounted) {
          setCurrentUser(null)
          setLoading(false)
        }
      }
    }

    load()

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          setCurrentUser(null)
          return
        }
        await ensureProfile(session.user)

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
