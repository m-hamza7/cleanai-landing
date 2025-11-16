'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Camera, MapPin, Clock, User, CheckCircle, Truck } from "lucide-react"

interface UserReport {
  id: string
  imageUrl: string
  wasteType: string
  location: string
  description: string
  timestamp: string
  status: "pending" | "submitted" | "dispatched" | "resolved"
}

export function UserReportsPanel() {
  const [reports, setReports] = useState<UserReport[]>([])

  useEffect(() => {
    // Load reports from localStorage
    const loadReports = () => {
      const savedReports = localStorage.getItem("adminWasteReports")
      if (savedReports) {
        setReports(JSON.parse(savedReports))
      }
    }

    loadReports()

    // Poll for updates every 2 seconds
    const interval = setInterval(loadReports, 2000)
    return () => clearInterval(interval)
  }, [])

  const updateReportStatus = (reportId: string, newStatus: UserReport["status"]) => {
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, status: newStatus } : report
    )
    setReports(updatedReports)
    localStorage.setItem("adminWasteReports", JSON.stringify(updatedReports))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "submitted":
        return "bg-blue-500"
      case "dispatched":
        return "bg-orange-500"
      case "resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "dispatched":
        return <Truck className="h-3 w-3" />
      case "resolved":
        return <CheckCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Citizen Reports
        </CardTitle>
        <CardDescription>
          User-submitted waste reports ({reports.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No citizen reports yet</p>
            <p className="text-xs mt-1">Reports from the citizen portal will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={report.imageUrl}
                        alt="Waste report"
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm">Waste Report #{report.id.slice(-6)}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <User className="h-3 w-3" />
                            Citizen Report
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(report.status)} text-white text-xs`}
                        >
                          {getStatusIcon(report.status)}
                          <span className="ml-1">{report.status}</span>
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {report.wasteType}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.location}
                        </p>

                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(report.timestamp).toLocaleString()}
                        </p>

                        {report.description && report.description !== "No description provided" && (
                          <p className="text-xs text-muted-foreground italic pt-1">
                            "{report.description}"
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {report.status === "submitted" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReportStatus(report.id, "dispatched")}
                            className="h-7 text-xs"
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            Dispatch Team
                          </Button>
                        )}
                        {report.status === "dispatched" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReportStatus(report.id, "resolved")}
                            className="h-7 text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Resolved
                          </Button>
                        )}
                        {report.status === "resolved" && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
