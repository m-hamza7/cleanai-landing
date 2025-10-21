import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CloudRain, Droplets, AlertTriangle, TrendingUp } from "lucide-react"

export function FloodRiskAssessment() {
  const riskAreas = [
    {
      area: "Malir River Basin",
      riskLevel: "high",
      probability: 85,
      reason: "Heavy rainfall expected + blocked drainage"
    },
    {
      area: "Lyari Town",
      riskLevel: "medium", 
      probability: 60,
      reason: "Moderate waste accumulation"
    },
    {
      area: "Korangi Creek",
      riskLevel: "low",
      probability: 25,
      reason: "Recent cleanup completed"
    }
  ]

  const weatherData = {
    currentTemp: "32°C",
    humidity: "78%",
    rainfall: "15mm expected",
    windSpeed: "12 km/h"
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getRiskProgress = (level: string) => {
    switch (level) {
      case 'high': return 85
      case 'medium': return 60
      case 'low': return 25
      default: return 0
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Flood Risk Assessment</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CloudRain className="h-4 w-4" />
          <span>Monsoon Season</span>
        </div>
      </div>

      {/* Weather Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Temperature</p>
          <p className="font-semibold">{weatherData.currentTemp}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Humidity</p>
          <p className="font-semibold">{weatherData.humidity}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Expected Rain</p>
          <p className="font-semibold">{weatherData.rainfall}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Wind Speed</p>
          <p className="font-semibold">{weatherData.windSpeed}</p>
        </div>
      </div>

      {/* Risk Areas */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          High-Risk Areas
        </h4>
        
        {riskAreas.map((area, index) => (
          <div key={index} className="p-4 rounded-lg border bg-card/50">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium">{area.area}</h5>
              <Badge variant={getRiskColor(area.riskLevel)}>
                {area.riskLevel} risk
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Flood Probability</span>
                <span className="font-medium">{area.probability}%</span>
              </div>
              <Progress value={area.probability} className="h-2" />
              <p className="text-sm text-muted-foreground">{area.reason}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Prediction Accuracy */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">AI Prediction Accuracy: 94.2%</span>
          </div>
          <span className="text-muted-foreground">Updated 10 mins ago</span>
        </div>
      </div>
    </Card>
  )
}