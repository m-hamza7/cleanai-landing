'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { FleetManagement } from "@/components/dashboard/fleet-management"
import { FloodRiskAssessment } from "@/components/dashboard/flood-risk-assessment"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { UserReportsPanel } from "@/components/dashboard/user-reports-panel"
import { api } from "@/lib/api-client"

const LiveMap = dynamic(() => import("@/components/maps/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-lg bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
      Loading map...
    </div>
  ),
})

export default function DashboardPage() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [mapMarkers, setMapMarkers] = useState<
    Array<{ id: string; lat: number; lng: number; title: string; description?: string }>
  >([])

  useEffect(() => {
    const user = api.auth.getStoredUser()
    const isAuthenticated = api.auth.isAuthenticated()

    if (!isAuthenticated || !user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/user-dashboard")
      return
    }

    setIsReady(true)
  }, [router])

  useEffect(() => {
    if (!isReady) return

    const loadMarkers = async () => {
      try {
        const reports = await api.reports.getAll()
        const markers = reports
          .filter((report) => typeof report.latitude === "number" && typeof report.longitude === "number")
          .map((report) => ({
            id: `report-${report.report_id}`,
            lat: report.latitude as number,
            lng: report.longitude as number,
            title: `Report #${report.report_id}`,
            description: report.location || report.waste_type || "Reported location",
          }))

        setMapMarkers(markers)
      } catch (error) {
        console.error("Failed to load map markers", error)
      }
    }

    loadMarkers()
    const interval = setInterval(loadMarkers, 20000)
    return () => clearInterval(interval)
  }, [isReady])

  if (!isReady) {
    return null
  }


  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Overview */}
          <StatsOverview />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Map */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Real-time Waste Detection Map</h3>
                </div>
                <div className="h-96 rounded-lg overflow-hidden">
                  <LiveMap markers={mapMarkers.length ? mapMarkers : undefined} />
                </div>
              </Card>
            </div>
            
            {/* Right Column - Alerts */}
            <div className="lg:col-span-1">
              <AlertsPanel />
            </div>
          </div>
            {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FleetManagement />
            <FloodRiskAssessment />
          </div>

          {/* Citizen Reports Section */}
          <div className="w-full">
            <UserReportsPanel />
          </div>
        </div>
      </main>
    </div>
  )
}