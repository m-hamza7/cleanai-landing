import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export function Navigation() {
  return (
    <nav className="flex flex-col gap-4 p-6 max-w-7xl mx-auto md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:space-x-8 md:gap-0">
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
          <a href="#our-team" className="hover:text-foreground transition-colors">
            Our Team
          </a>

          <a href="research-papers" className="hover:text-foreground transition-colors">
            Research Papers
          </a>



        </div>
      </div>
      <div className="flex flex-col items-center gap-2 w-full md:w-auto md:flex-row md:space-x-4 md:gap-0">
        <Button variant="outline" size="sm" asChild>
          <a href="/login">Citizen Login</a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="/driver-portal">Driver Portal</a>
        </Button>
        <Button size="sm" asChild>
          <a href="/dashboard">Admin Dashboard</a>
        </Button>
      </div>
    </nav>
  )
}
