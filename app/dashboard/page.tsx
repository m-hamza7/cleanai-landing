'use client'

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { WasteDetectionMap } from "@/components/dashboard/waste-detection-map-simple"
import { FleetManagement } from "@/components/dashboard/fleet-management"
import { FloodRiskAssessment } from "@/components/dashboard/flood-risk-assessment"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"

export default function DashboardPage() {
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
              <WasteDetectionMap />
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
        </div>
      </main>
    </div>
  )
}