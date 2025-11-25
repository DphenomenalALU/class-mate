"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ReplicasRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/assistants")
  }, [router])

  return null
}
