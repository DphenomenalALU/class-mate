'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 md:px-8 lg:px-12">
      <div className="container flex h-16 items-center gap-4">
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span>ClassMate</span>
          </Link>
        </div>
        <nav className="hidden md:flex flex-1 items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-foreground transition-colors">
            How it Works
          </Link>
          <Link href="/help" className="hover:text-foreground transition-colors">
            Guide
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="container md:hidden border-t bg-background pb-4 pt-3">
          <nav className="flex flex-col gap-3 text-sm font-medium text-muted-foreground">
            <Link href="/#features" className="hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
              How it Works
            </Link>
            <Link href="/help" className="hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
              Guide
            </Link>
            <div className="flex gap-2 pt-3">
              <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
