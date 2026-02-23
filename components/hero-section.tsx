import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center grid-pattern">
      {/* Background image for hero section */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/HERO_BG.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.45, // Adjust opacity as needed
          pointerEvents: "none",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
      <div className="relative z-20 max-w-4xl mx-auto text-center px-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
          <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
          AI-Powered Urban Solutions
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
          <span className="text-primary">Clean AI:</span> The future of smart waste management and flood prevention
        </h1>

        <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
          CleanAI revolutionizes urban sustainability through AI-powered waste detection, intelligent fleet
          optimization, and real-time flood risk assessment for cleaner, safer cities.
        </p>

        {/*<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button size="lg" className="text-base px-8">
            View Live Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8 bg-transparent">
            <Play className="mr-2 h-4 w-4" />
            Watch System Overview
          </Button>
        </div>*/}

        <div className="text-sm text-muted-foreground">
          Trusted by municipal authorities • Powered by YOLOv8 & R-CNN • Real-time satellite integration
        </div>
      </div>
    </section>
  )
}
