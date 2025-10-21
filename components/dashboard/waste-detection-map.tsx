import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Camera, Satellite } from "lucide-react"

export function WasteDetectionMap() {
  const wasteLocations = [
    { id: 1, lat: 24.8607, lng: 67.0011, type: "High", detected: "2 hours ago", status: "pending" },
    { id: 2, lat: 24.8615, lng: 67.0025, type: "Medium", detected: "4 hours ago", status: "dispatched" },
    { id: 3, lat: 24.8590, lng: 67.0040, type: "Low", detected: "6 hours ago", status: "completed" },
    { id: 4, lat: 24.8630, lng: 67.0015, type: "Critical", detected: "1 hour ago", status: "urgent" }
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Real-time Waste Detection Map</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Camera className="h-4 w-4 mr-2" />
            Drone View
          </Button>
          <Button variant="outline" size="sm">
            <Satellite className="h-4 w-4 mr-2" />
            Satellite
          </Button>
        </div>
      </div>
      
      {/* Map Placeholder */}
      <div className="relative h-96 bg-muted rounded-lg mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Interactive Map</p>
            <p className="text-sm text-muted-foreground">Karachi Waste Detection Sites</p>
          </div>
        </div>
        
        {/* Mock waste location markers */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Critical/High Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
        </div>
        <p className="text-muted-foreground">Last updated: 2 minutes ago</p>
      </div>
    </Card>
  )
}