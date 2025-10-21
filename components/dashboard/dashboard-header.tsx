import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Bell, Settings, User, Home } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Logo and nav */}
        <div className="flex items-center space-x-8">
          <Logo size="md" />
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" asChild>
              <a href="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
            </Button>
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </nav>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}