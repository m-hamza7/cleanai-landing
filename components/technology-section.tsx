import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const techStack = [
  {
    category: "AI & Machine Learning",
    technologies: ["YOLOv8", "R-CNN", "Computer Vision", "Deep Learning"],
    description: "Advanced object detection and classification models",
  },
  {
    category: "Backend & API",
    technologies: ["FastAPI", "Node.js", "RESTful APIs", "Real-time Processing"],
    description: "High-performance backend infrastructure",
  },
  {
    category: "Geospatial & Mapping",
    technologies: ["GPS Integration", "Satellite Imagery", "Routing Algorithms", "GIS"],
    description: "Precise location tracking and optimization",
  },
  {
    category: "Data & Analytics",
    technologies: ["Real-time Database", "Historical Analysis", "Predictive Models", "Dashboard"],
    description: "Comprehensive data management and insights",
  },
]

const metrics = [
  { value: "98%", label: "Faster time to market", sublabel: "vs traditional systems" },
  { value: "300%", label: "Increase in efficiency", sublabel: "municipal response" },
  { value: "60%", label: "Reduction in costs", sublabel: "operational savings" },
  { value: "24/7", label: "Continuous monitoring", sublabel: "satellite integration" },
]

export function TechnologySection() {
  return (
    <section id="technology" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-primary">Advanced Technology Stack</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built with cutting-edge AI and modern infrastructure for scalable urban solutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-8">Core Technologies</h3>
            <div className="space-y-6">
              {techStack.map((stack, index) => (
                <Card key={index} className="p-6">
                  <h4 className="font-semibold mb-2">{stack.category}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{stack.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {stack.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-8">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-6">
              {metrics.map((metric, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                  <div className="font-medium mb-1">{metric.label}</div>
                  <div className="text-xs text-muted-foreground">{metric.sublabel}</div>
                </Card>
              ))}
            </div>

            <Card className="p-6 mt-6">
              <h4 className="font-semibold mb-4">Success Criteria</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                  ≥80% accuracy in waste detection and classification
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                  Real-time GPS geo-tagging and site localization
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                  Optimized municipal truck dispatch and routing
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                  Flood risk prediction with acceptable accuracy
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                  Satellite verification of waste clearance
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
