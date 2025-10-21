'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Satellite, AlertTriangle, CheckCircle } from "lucide-react"

interface WasteLocation {
  id: string
  lat: number
  lng: number
  type: 'critical' | 'high' | 'medium' | 'low' | 'resolved'
  description: string
  timestamp: string
  status: 'pending' | 'dispatched' | 'completed' | 'urgent'
}

const mockWasteLocations: WasteLocation[] = [
  {
    id: '1',
    lat: 24.8607,
    lng: 67.0011,
    type: 'critical',
    description: 'Large garbage pile blocking main drainage',
    timestamp: '1 hour ago',
    status: 'urgent'
  },
  {
    id: '2',
    lat: 24.8616,
    lng: 67.0024,
    type: 'high',
    description: 'Overflowing waste bin near market',
    timestamp: '2 hours ago',
    status: 'pending'
  },
  {
    id: '3',
    lat: 24.8598,
    lng: 67.0005,
    type: 'medium',
    description: 'Scattered litter in residential area',
    timestamp: '4 hours ago',
    status: 'dispatched'
  },
  {
    id: '4',
    lat: 24.8623,
    lng: 67.0018,
    type: 'resolved',
    description: 'Waste collection completed',
    timestamp: '6 hours ago',
    status: 'completed'
  },
  {
    id: '5',
    lat: 24.8590,
    lng: 67.0040,
    type: 'low',
    description: 'Minor litter accumulation',
    timestamp: '8 hours ago',
    status: 'pending'
  }
]

const getStatusColor = (type: string) => {
  switch (type) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function WasteDetectionMap() {
  return (
    <div className="space-y-4">
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
        
        {/* Map Placeholder with Mock Markers */}
        <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg mb-4 overflow-hidden">
          {/* Background pattern to simulate map */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-gray-200" />
              ))}
            </div>
          </div>
          
          {/* Center indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center z-10">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">Karachi, Pakistan</p>
              <p className="text-xs text-gray-500">Interactive Map (Demo)</p>
            </div>
          </div>
          
          {/* Mock waste location markers */}
          {mockWasteLocations.map((location, index) => {
            const colors = {
              critical: 'bg-red-500 animate-ping',
              high: 'bg-orange-500',
              medium: 'bg-yellow-500',
              low: 'bg-blue-500',
              resolved: 'bg-green-500'
            }
            
            // Simulate positioning based on lat/lng
            const top = 20 + (index * 15) + (Math.random() * 10)
            const left = 25 + (index * 18) + (Math.random() * 15)
            
            return (
              <div
                key={location.id}
                className={`absolute w-4 h-4 rounded-full ${colors[location.type]} border-2 border-white shadow-lg cursor-pointer transform hover:scale-125 transition-transform`}
                style={{
                  top: `${Math.min(top, 85)}%`,
                  left: `${Math.min(left, 85)}%`,
                }}
                title={location.description}
              >
                {location.type === 'critical' && (
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                )}
              </div>
            )
          })}
          
          {/* Map attribution */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
            OpenStreetMap Demo
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
              <span>Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Resolved</span>
            </div>
          </div>
          <p className="text-muted-foreground">Last updated: 2 minutes ago</p>
        </div>
      </Card>

      {/* Recent Detections List */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Recent Waste Detections</h4>
        <div className="space-y-3">
          {mockWasteLocations.slice(0, 4).map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {location.type === 'resolved' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className={`h-4 w-4 ${
                    location.type === 'critical' ? 'text-red-600 animate-pulse' :
                    location.type === 'high' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`} />
                )}
                <div>
                  <p className="text-sm font-medium">{location.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {location.timestamp} • Status: {location.status}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(location.type)} variant="outline">
                {location.type}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
