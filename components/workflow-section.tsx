import { Card } from "@/components/ui/card"
import { Smartphone, Brain, Truck, Satellite, BarChart3 } from "lucide-react"
import Image from "next/image"

const workflowSteps = [
  {
    icon: Smartphone,
    title: "Citizen Report Submission",
    description: "User captures waste photo with GPS tagging via mobile/web app",
  },
  {
    icon: Brain,
    title: "AI Detection & Processing",
    description: "FastAPI backend analyzes images using AI models to classify waste",
  },
  {
    icon: Truck,
    title: "Truck Dispatch",
    description: "System assigns nearest available truck for quick response",
  },
  {
    icon: Satellite,
    title: "Satellite & Drone Integration",
    description: "Real-time monitoring of hotspots, drains, and dumping sites",
  },
  {
    icon: BarChart3,
    title: "Unified Dashboard",
    description: "Municipal authorities track reports, trucks, and waste hotspots in one place",
  },
]

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">System Workflow</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From citizen reporting to waste clearance - see how CleanAI transforms urban waste management
          </p>
        </div>

        <div className="mb-16">
          <Image
            src="/images/system-workflow.png"
            alt="CleanAI System Workflow"
            width={1200}
            height={400}
            className="w-full max-w-4xl mx-auto rounded-lg border border-border"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {workflowSteps.map((step, index) => (
            <Card key={index} className="p-6 text-center relative">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              {index < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
