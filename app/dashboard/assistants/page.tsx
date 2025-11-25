"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Settings, Trash2 } from "lucide-react"
import { useState } from "react"

// Stock replica personas
const STOCK_REPLICAS = [
  { id: "prof-smith", name: "Professor Smith", subject: "Mathematics", avatar: "👨‍🏫" },
  { id: "dr-chen", name: "Dr. Chen", subject: "Computer Science", avatar: "👩‍💻" },
  { id: "prof-okafor", name: "Professor Okafor", subject: "Physics", avatar: "🧑‍🔬" },
  { id: "dr-patel", name: "Dr. Patel", subject: "Chemistry", avatar: "👨‍🔬" },
  { id: "prof-johnson", name: "Professor Johnson", subject: "English Literature", avatar: "📚" },
  { id: "dr-kim", name: "Dr. Kim", subject: "Biology", avatar: "🧬" },
  { id: "prof-martinez", name: "Professor Martinez", subject: "History", avatar: "📜" },
  { id: "dr-anderson", name: "Dr. Anderson", subject: "Economics", avatar: "💼" },
  { id: "prof-williams", name: "Professor Williams", subject: "Psychology", avatar: "🧠" },
  { id: "dr-brown", name: "Dr. Brown", subject: "Engineering", avatar: "⚙️" },
]

export default function AssistantsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedReplica, setSelectedReplica] = useState("")

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistants</h1>
          <p className="text-muted-foreground mt-1">Create and manage your course assistants</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Assistant
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Assistant</CardTitle>
            <CardDescription>Choose a stock replica and configure it for your course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course Name</Label>
              <Input id="course" placeholder="e.g., Calculus I, Introduction to Programming" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="replica">Select Stock Replica</Label>
              <Select value={selectedReplica} onValueChange={setSelectedReplica}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a persona..." />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_REPLICAS.map((replica) => (
                    <SelectItem key={replica.id} value={replica.id}>
                      {replica.avatar} {replica.name} - {replica.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button>Create Assistant</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Example existing assistants */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-2xl">
                  👨‍🏫
                </div>
                <div>
                  <CardTitle className="text-lg">Professor Smith</CardTitle>
                  <CardDescription>Calculus I</CardDescription>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sessions</span>
                <span className="font-medium">87</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Students</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-primary font-medium">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-2xl">
                  👩‍💻
                </div>
                <div>
                  <CardTitle className="text-lg">Dr. Chen</CardTitle>
                  <CardDescription>Introduction to Programming</CardDescription>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sessions</span>
                <span className="font-medium">41</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Students</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-primary font-medium">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
