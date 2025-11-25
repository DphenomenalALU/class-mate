import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, LayoutDashboard, Video, BookOpen, LogOut } from "lucide-react"

export default function StudentLayout({
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
              href="/student"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/student/assistants"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Video className="h-4 w-4" />
              My Assistants
            </Link>
            <Link
              href="/student/history"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Session History
            </Link>
          </nav>
        </div>
        <div className="border-t p-4">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="sm">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6 md:py-10">{children}</div>
      </main>
    </div>
  )
}
