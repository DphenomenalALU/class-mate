import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Trash2, CheckCircle } from "lucide-react"

export default function KnowledgePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>Documents your replica uses to answer questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Calculus_Syllabus_2024.pdf", size: "2.4 MB", status: "Indexed" },
                { name: "Lecture_Notes_Week_1-4.pdf", size: "1.8 MB", status: "Indexed" },
                { name: "Midterm_Review_Guide.docx", size: "500 KB", status: "Processing" },
                { name: "Practice_Problems_Set_1.pdf", size: "3.2 MB", status: "Indexed" },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs">
                      {doc.status === "Indexed" ? (
                        <span className="flex items-center gap-1 text-green-500">
                          <CheckCircle className="h-3 w-3" /> Indexed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-500">
                          <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span> Processing
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Settings</CardTitle>
              <CardDescription>Configure how your replica uses this data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Access Level</label>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <input type="radio" id="public" name="access" className="accent-primary" defaultChecked />
                    <label htmlFor="public" className="text-sm">
                      Public (All Students)
                    </label>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <input type="radio" id="private" name="access" className="accent-primary" />
                    <label htmlFor="private" className="text-sm">
                      Private (Only Enrolled)
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
