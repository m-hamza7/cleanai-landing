'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Satellite, AlertTriangle, CheckCircle } from "lucide-react"
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false })

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

// Custom icon creation for different waste types
const createCustomIcon = (type: string) => {
  if (typeof window === 'undefined') return null
  
  const L = require('leaflet')
  const iconColor = type === 'critical' ? '#dc2626' :
                   type === 'high' ? '#ea580c' : 
                   type === 'medium' ? '#ca8a04' : 
                   type === 'low' ? '#2563eb' : '#16a34a'
  
  const iconSize = type === 'critical' ? 16 : 12
  
  return new L.DivIcon({
    html: `<div style="background-color: ${iconColor}; width: ${iconSize}px; height: ${iconSize}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); ${type === 'critical' ? 'animation: pulse 2s infinite;' : ''}"></div>`,
    iconSize: [iconSize, iconSize],
    className: 'custom-marker'
  })
}

export function WasteDetectionMap() {  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
        
        {/* Interactive OpenStreetMap */}
        <div className="h-96 rounded-lg overflow-hidden mb-4">
          {isClient ? (
            <MapContainer
              center={[24.8607, 67.0011]} // Karachi coordinates
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mockWasteLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={createCustomIcon(location.type)}
                >
                  <Popup>
                    <div className="p-2 min-w-48">
                      <div className="font-semibold text-sm mb-2">{location.description}</div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Priority:</span>
                        <Badge className={getStatusColor(location.type)} variant="outline">
                          {location.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Status:</span>
                        <span className="text-xs font-medium capitalize">{location.status}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{location.timestamp}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            // Loading fallback
            <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading Interactive Map...</p>
                <p className="text-xs text-muted-foreground mt-1">Karachi, Pakistan</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
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
                    location.type === 'critical' ? 'text-red-600' :
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