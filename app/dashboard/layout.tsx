import type React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { GraduationCap, LayoutDashboard, Bot, BookOpen, FileText, BarChart3, AlertTriangle } from "lucide-react"
import { UserGate } from "@/components/auth/UserGate"
import { SignOutButton } from "@/components/auth/SignOutButton"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span>ClassMate</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-1 px-2 text-sm font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/dashboard/assistants"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Bot className="h-4 w-4" />
              Assistants
            </Link>
            <Link
              href="/dashboard/knowledge"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Knowledge Base
            </Link>
            <Link
              href="/dashboard/notes"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <FileText className="h-4 w-4" />
              Notes
            </Link>
            <Link
              href="/dashboard/escalations"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              Escalation Log
            </Link>
          </nav>
        </div>
        <div className="border-t p-4">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <UserGate allowRoles={["facilitator"]}>
          <div className="container py-6 md:py-10">{children}</div>
        </UserGate>
      </main>
    </div>
  )
}
