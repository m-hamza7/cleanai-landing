"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Navigation, Clock, Route, RefreshCw } from "lucide-react"
import { api, type DriverRoute } from "@/lib/api-client"

const RouteMap = dynamic(() => import("@/components/maps/RouteMap"), { ssr: false })

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

function statusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "started":
      return "default"
    case "completed":
      return "secondary"
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

export function FleetManagement() {
  const [routes, setRoutes] = useState<DriverRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null)

  const loadRoutes = useCallback(async () => {
    try {
      setError("")
      const data = await api.drivers.getAllRoutes()
      setRoutes(data)
      setSelectedRouteId((prev) => {
        if (prev && data.some((r) => r.route_id === prev)) return prev
        return data[0]?.route_id ?? null
      })
    } catch (err: any) {
      setError(err.message || "Failed to load driver routes")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRoutes()
    const timer = setInterval(loadRoutes, 30000)
    return () => clearInterval(timer)
  }, [loadRoutes])

  const selectedRoute = useMemo(
    () => routes.find((r) => r.route_id === selectedRouteId) || null,
    [routes, selectedRouteId]
  )

  const activeCount = routes.filter((r) => r.status === "planned" || r.status === "started").length

  const mapStops = useMemo(() => {
    if (!selectedRoute) return []
    return [
      {
        id: "origin",
        lat: selectedRoute.origin_lat,
        lng: selectedRoute.origin_lng,
        label: "Start",
        kind: "origin" as const,
      },
      ...((selectedRoute.ordered_stops || []).map((stop) => ({
        id: `stop-${stop.task_id}`,
        lat: stop.lat,
        lng: stop.lng,
        label: String(stop.order),
        kind: "pickup" as const,
      }))),
    ]
  }, [selectedRoute])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold">Driver Planned Routes</h3>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>{activeCount} active</span>
          </div>
          <Button variant="ghost" size="sm" onClick={loadRoutes} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive mb-3">{error}</p>}

      {loading && routes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">Loading routes...</p>
      ) : routes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No planned routes yet. Drivers generate routes from the driver portal.
        </p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {routes.map((route) => (
              <button
                key={route.route_id}
                type="button"
                onClick={() => setSelectedRouteId(route.route_id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedRouteId === route.route_id
                    ? "border-primary bg-primary/5"
                    : "bg-card/50 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-sm">
                      {route.driver_name || `Driver #${route.driver_user_id}`}
                    </h4>
                    <Badge variant={statusVariant(route.status)}>{route.status}</Badge>
                    <Badge variant="outline">{route.route_type}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(route.duration_seconds)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <span className="text-muted-foreground">Area: </span>
                    <span>{route.driver_area || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stops: </span>
                    <span>{route.ordered_stops?.length || route.task_ids?.length || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Navigation className="h-3 w-3" />
                  <span>{formatDistance(route.distance_meters)}</span>
                  <Route className="h-3 w-3 ml-2" />
                  <span>
                    {route.created_at ? new Date(route.created_at).toLocaleString() : "—"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="min-h-[280px]">
            {selectedRoute ? (
              <RouteMap
                coordinates={
                  (selectedRoute.geometry?.coordinates as [number, number][] | undefined) || null
                }
                stops={mapStops}
                distanceMeters={selectedRoute.distance_meters}
                durationSeconds={selectedRoute.duration_seconds}
                mapClassName="h-72 w-full rounded-md border"
              />
            ) : (
              <div className="h-72 rounded-md border flex items-center justify-center text-sm text-muted-foreground">
                Select a route to preview
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
