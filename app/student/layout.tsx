"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { GraduationCap, LayoutDashboard, Video, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { UserGate } from "@/components/auth/UserGate"
import { SignOutButton } from "@/components/auth/SignOutButton"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r bg-card transition-all duration-200 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        <div className="flex h-16 items-center border-b px-4 justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <GraduationCap className="h-4 w-4" />
            </div>
            {!collapsed && <span>ClassMate</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-1 px-2 text-sm font-medium">
            <SidebarLink href="/student" collapsed={collapsed} icon={<LayoutDashboard className="h-4 w-4" />}>
              Dashboard
            </SidebarLink>
            <SidebarLink href="/student/history" collapsed={collapsed} icon={<BookOpen className="h-4 w-4" />}>
              Session History
            </SidebarLink>
          </nav>
        </div>
        <div className="border-t p-3">
          <SignOutButton compact={collapsed} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <UserGate allowRoles={["student", "facilitator"]}>
          <div className="px-6 md:px-10 py-6 md:py-10 max-w-7xl mx-auto">{children}</div>
        </UserGate>
      </main>
    </div>
  )
}

function SidebarLink({
  href,
  collapsed,
  icon,
  children,
}: {
  href: string
  collapsed: boolean
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {icon}
      {!collapsed && <span className="truncate">{children}</span>}
    </Link>
  )
}
