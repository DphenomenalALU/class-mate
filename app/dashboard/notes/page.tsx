"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

export default function NotesPage() {
  const [showAddNote, setShowAddNote] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Context Notes</h1>
          <p className="text-muted-foreground mt-1">Add announcements and guidance for your AI assistants</p>
        </div>
        <Button onClick={() => setShowAddNote(!showAddNote)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {showAddNote && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Note</CardTitle>
            <CardDescription>
              Provide context or announcements for your assistant to share with students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assistant">Select Assistant</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an assistant..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prof-smith">👨‍🏫 Professor Smith - Calculus I</SelectItem>
                  <SelectItem value="dr-chen">👩‍💻 Dr. Chen - Intro to Programming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note Content</Label>
              <Textarea
                id="note"
                placeholder="e.g., 'Midterm exam is scheduled for next Friday. Students should review chapters 1-5.'"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button>Save Note</Button>
              <Button variant="outline" onClick={() => setShowAddNote(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Midterm Exam Announcement</CardTitle>
                  <CardDescription>Professor Smith - Calculus I</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Midterm exam is scheduled for next Friday. Students should review chapters 1-5, focusing on derivatives
              and integrals.
            </p>
            <p className="text-xs text-muted-foreground mt-2">Added 2 days ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Office Hours Update</CardTitle>
                  <CardDescription>Dr. Chen - Intro to Programming</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Office hours moved to Tuesdays and Thursdays, 2-4 PM. Students can book via the calendar link.
            </p>
            <p className="text-xs text-muted-foreground mt-2">Added 1 week ago</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
