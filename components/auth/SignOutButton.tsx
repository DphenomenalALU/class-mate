"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase-client"
import { LogOut } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter()

  async function handleSignOut() {
    console.log("SignOutButton: starting sign out")

    try {
      const { error } = await supabaseClient.auth.signOut()

      if (error) {
        console.error("Error signing out:", error)
        toast({
          variant: "destructive",
          title: "Sign out failed",
          description: "Please try again.",
        })
        return
      }

      toast({
        title: "Signed out",
        description: "You have been signed out of ClassMate.",
      })
    } catch (err) {
      console.error("Unexpected sign out error:", err)
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "Unexpected error. Please refresh and try again.",
      })
      return
    }

    if (typeof window !== "undefined") {
      window.location.href = "/"
    } else {
      router.push("/")
    }
  }

  return (
    <Button
      variant="outline"
      className={compact ? "w-full justify-center bg-transparent px-0" : "w-full justify-start gap-2 bg-transparent"}
      size={compact ? "icon-sm" : "sm"}
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4" />
      {!compact && "Sign Out"}
    </Button>
  )
}
