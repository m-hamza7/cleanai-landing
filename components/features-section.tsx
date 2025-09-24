import { Card } from "@/components/ui/card"
import { Eye, MapPin, Route, Shield, TrendingUp, Zap } from "lucide-react"

const features = [
  {
    icon: Eye,
    title: "AI Waste Detection",
    description: "YOLOv8 and R-CNN models accurately identify and classify different types of waste with >80% accuracy",
    metric: "90%+ Accuracy",
  },
  {
    icon: MapPin,
    title: "GPS Geo-Tagging",
    description: "Precise location mapping of waste sites for efficient tracking and municipal response coordination",
    metric: "Real-time Tracking",
  },
  {
    icon: Route,
    title: "Smart Fleet Optimization",
    description:
      "Routing algorithms automatically assign the nearest available trucks, reducing response time and fuel costs",
    metric: "40% Faster Response",
  },
  {
    icon: Shield,
    title: "Flood Risk Assessment",
    description: "AI analysis of historical rainfall and drainage data to predict and prevent urban flooding",
    metric: "Predictive Analytics",
  },
  {
    icon: TrendingUp,
    title: "Satellite Verification",
    description: "Cross-verification using satellite imagery to confirm waste clearance and monitor site conditions",
    metric: "24/7 Monitoring",
  },
  {
    icon: Zap,
    title: "Real-time Dashboard",
    description:
      "Centralized platform for municipal authorities with live updates, alerts, and comprehensive reporting",
    metric: "Live Updates",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Flagship Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI capabilities designed for modern urban challenges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:bg-card/50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">{feature.metric}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
