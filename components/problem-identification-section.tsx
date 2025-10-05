import { AlertTriangle, Trash2, Truck, Ban, CloudRain } from "lucide-react"
import { Card } from "@/components/ui/card"

const problems = [
  {
    icon: Trash2,
    title: "Uncollected Waste",
    description: "Garbage piles are often left uncollected, causing health and environmental issues.",
  },
  {
    icon: Ban,
    title: "Illegal Dumping",
    description: "Waste is dumped illegally, blocking drains and increasing flood risks.",
  },
  {
    icon: Truck,
    title: "Inefficient Dispatch",
    description: "Trucks are dispatched without optimization, wasting time and resources.",
  },
  {
    icon: CloudRain,
    title: "Flooding During Monsoon",
    description: "Unmanaged waste leads to urban flooding and costly damages during monsoon.",
  },
  {
    icon: AlertTriangle,
    title: "No Real-Time Monitoring",
    description: "Lack of AI-driven, real-time detection and management for waste and flood prevention.",
  },
]

export function ProblemIdentificationSection() {
  return (
    <section className="py-24 px-6 bg-card/30 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-primary">Problem Identification</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Key challenges in Karachi's urban waste management and flood prevention
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <Card key={index} className="p-6 hover:bg-card/50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <problem.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{problem.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{problem.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}