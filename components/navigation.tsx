import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export function Navigation() {
  return (
    <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-8">
        <Logo size="lg" />
        <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#workflow" className="hover:text-foreground transition-colors">
            How it Works
          </a>
          <a href="#technology" className="hover:text-foreground transition-colors">
            Technology
          </a>
          <a href="#impact" className="hover:text-foreground transition-colors">
            Impact
          </a>

          <a href="research-papers" className="hover:text-foreground transition-colors">
            Research Papers
          </a>



        </div>
      </div>
      <div className="flex items-center space-x-4">
        
        <Button size="sm" asChild>
          <a href="/dashboard">Get Started</a>
        </Button>
      </div>
    </nav>
  )
}
