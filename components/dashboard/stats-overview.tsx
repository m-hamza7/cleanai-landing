import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, Truck } from "lucide-react"

export function StatsOverview() {
  const stats = [
    {
      title: "Active Waste Sites",
      value: "127",
      change: "+12%",
      trend: "up",
      icon: AlertTriangle,
      color: "text-red-500"
    },
    {
      title: "Fleet Efficiency",
      value: "89%",
      change: "+5%",
      trend: "up", 
      icon: Truck,
      color: "text-green-500"
    },
    {
      title: "Flood Risk Areas",
      value: "23",
      change: "-8%",
      trend: "down",
      icon: TrendingDown,
      color: "text-orange-500"
    },
    {
      title: "AI Detection Accuracy",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-500"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`text-sm flex items-center mt-2 ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {stat.change} from last week
              </p>
            </div>
            <div className={`${stat.color}`}>
              <stat.icon className="h-8 w-8" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}