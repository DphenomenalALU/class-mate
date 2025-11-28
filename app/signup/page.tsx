import { Suspense } from "react"

import { SignupPageClient } from "./SignupPageClient"

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <SignupPageClient />
    </Suspense>
  )
}
