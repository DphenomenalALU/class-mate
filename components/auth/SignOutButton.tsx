"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase-client"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    await supabaseClient.auth.signOut()
    router.push("/")
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2 bg-transparent"
      size="sm"
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  )
}
