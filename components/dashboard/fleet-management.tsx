import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Truck, Navigation, Clock } from "lucide-react"

export function FleetManagement() {
  const trucks = [
    {
      id: "TRK-001",
      driver: "Ahmed Khan",
      location: "DHA Phase 1",
      status: "active",
      progress: 75,
      eta: "15 mins",
      route: "Route A-3"
    },
    {
      id: "TRK-002", 
      driver: "Hassan Ali",
      location: "Gulshan Block 5",
      status: "active",
      progress: 45,
      eta: "25 mins",
      route: "Route B-2"
    },
    {
      id: "TRK-003",
      driver: "Zain Ahmed",
      location: "Depot",
      status: "idle",
      progress: 0,
      eta: "Ready",
      route: "Standby"
    },
    {
      id: "TRK-004",
      driver: "Omar Sheikh",
      location: "Clifton",
      status: "maintenance",
      progress: 0,
      eta: "2 hours",
      route: "Out of Service"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'idle': return 'secondary' 
      case 'maintenance': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Fleet Management</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4" />
          <span>4 trucks active</span>
        </div>
      </div>

      <div className="space-y-4">
        {trucks.map((truck) => (
          <div key={truck.id} className="p-4 rounded-lg border bg-card/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <h4 className="font-medium">{truck.id}</h4>
                <Badge variant={getStatusColor(truck.status)}>
                  {truck.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{truck.eta}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className="text-muted-foreground">Driver: </span>
                <span>{truck.driver}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Location: </span>
                <span>{truck.location}</span>
              </div>
            </div>

            {truck.status === 'active' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Route Progress</span>
                  <span>{truck.progress}%</span>
                </div>
                <Progress value={truck.progress} className="h-2" />
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  <span>{truck.route}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}