'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Mode = 'light' | 'dark'

const LIGHT_VARS: Record<string, string> = {
  '--background': 'oklch(0.985 0 0)',
  '--foreground': 'oklch(0.18 0 0)',
  '--card': 'oklch(0.97 0 0)',
  '--card-foreground': 'oklch(0.18 0 0)',
  '--popover': 'oklch(0.98 0 0)',
  '--popover-foreground': 'oklch(0.18 0 0)',
  '--primary': 'oklch(0.6 0.25 270)',
  '--primary-foreground': 'oklch(0.985 0 0)',
  '--secondary': 'oklch(0.94 0 0)',
  '--secondary-foreground': 'oklch(0.28 0 0)',
  '--muted': 'oklch(0.94 0 0)',
  '--muted-foreground': 'oklch(0.55 0 0)',
  '--accent': 'oklch(0.96 0 0)',
  '--accent-foreground': 'oklch(0.28 0 0)',
  '--destructive': 'oklch(0.62 0.16 25.7)',
  '--destructive-foreground': 'oklch(0.985 0 0)',
  '--border': 'oklch(0.9 0 0)',
  '--input': 'oklch(0.9 0 0)',
  '--ring': 'oklch(0.6 0.25 270)',
  '--chart-1': 'oklch(0.6 0.25 270)',
  '--chart-2': 'oklch(0.6 0.18 210)',
  '--chart-3': 'oklch(0.7 0.18 150)',
  '--chart-4': 'oklch(0.7 0.2 90)',
  '--chart-5': 'oklch(0.65 0.16 30)',
  '--sidebar': 'oklch(0.97 0 0)',
  '--sidebar-foreground': 'oklch(0.18 0 0)',
  '--sidebar-primary': 'oklch(0.6 0.25 270)',
  '--sidebar-primary-foreground': 'oklch(0.985 0 0)',
  '--sidebar-accent': 'oklch(0.94 0 0)',
  '--sidebar-accent-foreground': 'oklch(0.28 0 0)',
  '--sidebar-border': 'oklch(0.9 0 0)',
  '--sidebar-ring': 'oklch(0.6 0.25 270)',
}

const DARK_VARS: Record<string, string> = {
  '--background': 'oklch(0.1 0 0)',
  '--foreground': 'oklch(0.985 0 0)',
  '--card': 'oklch(0.15 0 0)',
  '--card-foreground': 'oklch(0.985 0 0)',
  '--popover': 'oklch(0.12 0 0)',
  '--popover-foreground': 'oklch(0.985 0 0)',
  '--primary': 'oklch(0.6 0.25 270)',
  '--primary-foreground': 'oklch(0.985 0 0)',
  '--secondary': 'oklch(0.2 0 0)',
  '--secondary-foreground': 'oklch(0.985 0 0)',
  '--muted': 'oklch(0.2 0 0)',
  '--muted-foreground': 'oklch(0.7 0 0)',
  '--accent': 'oklch(0.25 0 0)',
  '--accent-foreground': 'oklch(0.985 0 0)',
  '--destructive': 'oklch(0.396 0.141 25.723)',
  '--destructive-foreground': 'oklch(0.985 0 0)',
  '--border': 'oklch(0.2 0 0)',
  '--input': 'oklch(0.2 0 0)',
  '--ring': 'oklch(0.6 0.25 270)',
  '--chart-1': 'oklch(0.6 0.25 270)',
  '--chart-2': 'oklch(0.5 0.2 250)',
  '--chart-3': 'oklch(0.4 0.15 230)',
  '--chart-4': 'oklch(0.7 0.2 290)',
  '--chart-5': 'oklch(0.8 0.1 310)',
  '--sidebar': 'oklch(0.12 0 0)',
  '--sidebar-foreground': 'oklch(0.985 0 0)',
  '--sidebar-primary': 'oklch(0.6 0.25 270)',
  '--sidebar-primary-foreground': 'oklch(0.985 0 0)',
  '--sidebar-accent': 'oklch(0.2 0 0)',
  '--sidebar-accent-foreground': 'oklch(0.985 0 0)',
  '--sidebar-border': 'oklch(0.2 0 0)',
  '--sidebar-ring': 'oklch(0.6 0.25 270)',
}

function applyTheme(mode: Mode) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const vars = mode === 'dark' ? DARK_VARS : LIGHT_VARS

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  root.classList.toggle('dark', mode === 'dark')
  console.log('[ThemeToggle] Applied theme:', mode)
}

function getInitialTheme(): Mode {
  if (typeof window === 'undefined') return 'dark'

  const stored =
    (window.localStorage.getItem('classmate_theme') as Mode | null) ?? null
  if (stored === 'light' || stored === 'dark') return stored

  const prefersDark = window.matchMedia?.(
    '(prefers-color-scheme: dark)',
  ).matches
  return prefersDark ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initial = getInitialTheme()
    setMode(initial)
    applyTheme(initial)
    setMounted(true)
  }, [])

  function toggleMode() {
    const next: Mode = mode === 'dark' ? 'light' : 'dark'
    setMode(next)
    applyTheme(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('classmate_theme', next)
    }
  }

  if (!mounted) {
    return null
  }

  const isDark = mode === 'dark'

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleMode}
      className="rounded-full"
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
