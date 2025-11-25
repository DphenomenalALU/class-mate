"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function QueuePage() {
  const [position, setPosition] = useState(3)
  const [estimatedWait, setEstimatedWait] = useState(15)

  // Simulate queue movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => Math.max(1, prev - 1))
      setEstimatedWait((prev) => Math.max(5, prev - 5))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl">
            👩‍💻
          </div>
          <CardTitle className="text-2xl">Dr. Chen is Currently Busy</CardTitle>
          <CardDescription>
            The assistant can only speak with one student at a time. You've been added to the queue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Your position in queue</p>
            <div className="text-5xl font-bold text-primary">{position}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">Est. Wait</span>
              </div>
              <p className="text-xl font-bold">{estimatedWait} min</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Users2 className="h-4 w-4" />
                <span className="text-xs font-medium">In Queue</span>
              </div>
              <p className="text-xl font-bold">{position}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-muted-foreground">We'll notify you when it's your turn</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Tip
              </Badge>
              <span className="text-muted-foreground">Keep this page open to maintain your position</span>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Link href="/student" className="block">
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Button variant="ghost" className="w-full text-destructive">
              Leave Queue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
