import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Users, Leaf, Shield } from "lucide-react"

const impactAreas = [
  {
    icon: Target,
    title: "Municipal Efficiency",
    description:
      "Reduce operational costs, optimize resource allocation, and improve response times through intelligent automation",
    benefits: ["40% faster response", "60% cost reduction", "Real-time coordination"],
  },
  {
    icon: Users,
    title: "Citizen Engagement",
    description:
      "Empower communities to actively participate in urban cleanliness through easy reporting and transparent tracking",
    benefits: ["Mobile reporting", "Real-time updates", "Community involvement"],
  },
  {
    icon: Leaf,
    title: "Environmental Impact",
    description: "Prevent illegal dumping, reduce urban flooding, and create cleaner, more sustainable cities",
    benefits: ["Cleaner cities", "Flood prevention", "Sustainable practices"],
  },
  {
    icon: Shield,
    title: "Public Health & Safety",
    description: "Minimize health risks from waste accumulation and prevent flood-related disasters in urban areas",
    benefits: ["Health protection", "Disaster prevention", "Safer communities"],
  },
]

export function ImpactSection() {
  return (
    <section id="impact" className="py-24 px-6 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Transforming Urban Sustainability</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            CleanAI addresses critical urban challenges in cities like Karachi, where millions of tons of waste and
            monsoon flooding create complex environmental and public health issues
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {impactAreas.map((area, index) => (
            <Card key={index} className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <area.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{area.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                {area.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    {benefit}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Ready to Transform Your City?</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Join the future of smart urban management. CleanAI provides the tools and intelligence needed to create
              cleaner, safer, and more resilient cities through AI-powered automation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-base px-8">
                Schedule a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 bg-transparent">
                View Documentation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
