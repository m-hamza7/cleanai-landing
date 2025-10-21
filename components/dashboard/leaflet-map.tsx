'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Badge } from "@/components/ui/badge"

interface WasteLocation {
  id: string
  lat: number
  lng: number
  type: 'critical' | 'high' | 'medium' | 'low' | 'resolved'
  description: string
  timestamp: string
  status: 'pending' | 'dispatched' | 'completed' | 'urgent'
}

interface LeafletMapProps {
  locations: WasteLocation[]
}

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
  if (typeof window === 'undefined') return undefined
  
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

export default function LeafletMap({ locations }: LeafletMapProps) {
  return (
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
      {locations.map((location) => (
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
  )
}
