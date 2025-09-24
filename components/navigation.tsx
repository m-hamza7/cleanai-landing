import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CA</span>
          </div>
          <span className="text-xl font-semibold">CleanAI</span>
        </div>
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
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          Documentation
        </Button>
        <Button size="sm">Get Started</Button>
      </div>
    </nav>
  )
}
