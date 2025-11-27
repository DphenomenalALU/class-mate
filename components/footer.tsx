import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-12 md:py-16 lg:py-20 px-6 md:px-8 lg:px-12">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-10">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span>ClassMate</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered academic support for distributed learning environments. Helping students get personalized
              assistance anytime, anywhere.
            </p>
          </div>
          <div className="space-y-4 sm:text-right">
            <h4 className="text-sm font-medium">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ClassMate by African Leadership University. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
