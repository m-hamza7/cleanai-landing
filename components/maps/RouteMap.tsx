"use client"

import { useEffect, useMemo, useRef } from "react"
import L from "leaflet"

export type RouteMapStop = {
  id: string
  lat: number
  lng: number
  label: string
  kind?: "origin" | "pickup" | "destination"
}

type RouteMapProps = {
  /** GeoJSON LineString coordinates as [lng, lat][] */
  coordinates?: [number, number][] | null
  stops?: RouteMapStop[]
  distanceMeters?: number
  durationSeconds?: number
  className?: string
  mapClassName?: string
}

function formatDistance(meters?: number) {
  if (meters == null || Number.isNaN(meters)) return "—"
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

function formatDuration(seconds?: number) {
  if (seconds == null || Number.isNaN(seconds)) return "—"
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  const rem = mins % 60
  return rem ? `${hours}h ${rem}m` : `${hours}h`
}

export default function RouteMap({
  coordinates = null,
  stops = [],
  distanceMeters,
  durationSeconds,
  className = "",
  mapClassName = "h-72 w-full rounded-md border",
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layersRef = useRef<L.LayerGroup | null>(null)

  const latLngPath = useMemo(() => {
    if (!coordinates || coordinates.length === 0) return [] as [number, number][]
    return coordinates.map(([lng, lat]) => [lat, lng] as [number, number])
  }, [coordinates])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!containerRef.current || mapRef.current) return

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })

    const map = L.map(containerRef.current).setView([24.8607, 67.0011], 12)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map)

    layersRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      layersRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !layersRef.current) return

    layersRef.current.clearLayers()
    const bounds: L.LatLngExpression[] = []

    if (latLngPath.length >= 2) {
      const polyline = L.polyline(latLngPath, {
        color: "#0f766e",
        weight: 5,
        opacity: 0.85,
      }).addTo(layersRef.current)
      bounds.push(...polyline.getLatLngs() as L.LatLng[])
    }

    stops.forEach((stop) => {
      const kind = stop.kind || "pickup"
      const color =
        kind === "origin" ? "#2563eb" :
        kind === "destination" ? "#16a34a" :
        "#0f766e"

      const icon = L.divIcon({
        html: `<div style="background-color:${color};color:white;min-width:22px;height:22px;border-radius:9999px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;padding:0 4px;">${
          kind === "origin" ? "S" : stop.label
        }</div>`,
        iconSize: [22, 22],
        className: "",
      })

      L.marker([stop.lat, stop.lng])
        .setIcon(icon)
        .bindPopup(`<strong>${stop.label}</strong>`)
        .addTo(layersRef.current as L.LayerGroup)

      bounds.push([stop.lat, stop.lng])
    })

    if (bounds.length > 0) {
      mapRef.current.fitBounds(L.latLngBounds(bounds), { padding: [28, 28] })
    }

    // Leaflet needs a kick after dialog/layout changes
    setTimeout(() => mapRef.current?.invalidateSize(), 80)
  }, [latLngPath, stops])

  return (
    <div className={className}>
      <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>
          Distance: <strong className="text-foreground">{formatDistance(distanceMeters)}</strong>
        </span>
        <span>
          ETA: <strong className="text-foreground">{formatDuration(durationSeconds)}</strong>
        </span>
      </div>
      <div ref={containerRef} className={mapClassName} />
    </div>
  )
}
