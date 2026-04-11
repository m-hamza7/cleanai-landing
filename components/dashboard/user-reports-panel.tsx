'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { api, type Report } from "@/lib/api-client"
import { Camera, Clock, MapPin, Truck, User, XCircle } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  received: "Recieved",
  rejected: "Rejected",
  scheduled_for_pickup: "Scheduled for Pickup",
}

const pad2 = (value: number) => String(value).padStart(2, "0")

const formatLocalDateTimeForApi = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
}

export function UserReportsPanel() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "")
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingReportId, setUpdatingReportId] = useState<number | null>(null)
  const [selectedStatuses, setSelectedStatuses] = useState<Record<number, string>>({})
  const [rejectionReasons, setRejectionReasons] = useState<Record<number, string>>({})
  const [scheduleDialogReport, setScheduleDialogReport] = useState<Report | null>(null)
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined)
  const [scheduleTime, setScheduleTime] = useState("09:00")

  useEffect(() => {
    loadReports()
    const interval = setInterval(loadReports, 15000)
    return () => clearInterval(interval)
  }, [])

  const loadReports = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await api.reports.getAll()
      setReports(data)
    } catch (err: any) {
      const message = err?.message || "Failed to load reports"
      if (message.toLowerCase().includes("no token") || message.toLowerCase().includes("unauthorized")) {
        setError("Admin session expired. Please login again to view citizen reports.")
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white"
      case "received":
        return "bg-blue-500 text-white"
      case "rejected":
        return "bg-red-500 text-white"
      case "scheduled_for_pickup":
        return "bg-emerald-600 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const handleStatusUpdate = async (report: Report) => {
    const chosenStatus = selectedStatuses[report.report_id]
    if (!chosenStatus) {
      return
    }

    const rejectionReason = rejectionReasons[report.report_id]
    if (chosenStatus === "rejected" && !rejectionReason?.trim()) {
      setError(`Rejection reason is required for report #${report.report_id}`)
      return
    }

    try {
      setUpdatingReportId(report.report_id)
      setError("")
      await api.reports.updateStatus(report.report_id, chosenStatus, {
        rejection_reason: chosenStatus === "rejected" ? rejectionReason.trim() : undefined,
      })
      setSelectedStatuses((prev) => {
        const next = { ...prev }
        delete next[report.report_id]
        return next
      })
      setRejectionReasons((prev) => {
        const next = { ...prev }
        delete next[report.report_id]
        return next
      })
      await loadReports()
    } catch (err: any) {
      setError(err?.message || "Failed to update status")
    } finally {
      setUpdatingReportId(null)
    }
  }

  const openScheduleDialog = (report: Report) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setScheduleDate(tomorrow)
    setScheduleTime("09:00")
    setScheduleDialogReport(report)
  }

  const handleSchedulePickup = async () => {
    if (!scheduleDialogReport || !scheduleDate || !scheduleTime) {
      setError("Please choose both pickup date and pickup time")
      return
    }

    const [hours, minutes] = scheduleTime.split(":").map(Number)
    const pickupDate = new Date(scheduleDate)
    pickupDate.setHours(hours || 0, minutes || 0, 0, 0)

    if (pickupDate <= new Date()) {
      setError("Pickup date and time must be in the future")
      return
    }

    try {
      setUpdatingReportId(scheduleDialogReport.report_id)
      setError("")
      await api.reports.updateStatus(scheduleDialogReport.report_id, "scheduled_for_pickup", {
        pickup_scheduled_at: formatLocalDateTimeForApi(pickupDate),
      })
      setScheduleDialogReport(null)
      await loadReports()
    } catch (err: any) {
      setError(err?.message || "Failed to schedule pickup")
    } finally {
      setUpdatingReportId(null)
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Citizen Reports
        </CardTitle>
        <CardDescription>
          User-submitted waste reports ({reports.length} total) with status management
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Loading citizen reports...</p>
          </div>
        ) : reports.length === 0 ? (
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
                  key={report.report_id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {report.image_url ? (
                        <img
                          src={`${backendBaseUrl}${report.image_url}`}
                          alt="Waste report"
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm">Waste Report #{report.report_id}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <User className="h-3 w-3" />
                            {report.user_name || "Citizen"}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(report.status)} text-xs`}
                        >
                          <span>{STATUS_LABELS[report.status] || report.status}</span>
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {report.waste_type || "Pending AI"}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                        </p>

                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(report.submitted_at || "").toLocaleString()}
                        </p>

                        {report.rejection_reason && (
                          <p className="text-xs text-red-600 dark:text-red-400 pt-1">
                            <strong>Reason:</strong> {report.rejection_reason}
                          </p>
                        )}

                        {report.pickup_scheduled_at && (
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 pt-1">
                            <strong>Pickup:</strong> {new Date(report.pickup_scheduled_at).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                        <div className="md:col-span-1">
                          <Select
                            value={selectedStatuses[report.report_id] || undefined}
                            onValueChange={(value) => {
                              setSelectedStatuses((prev) => ({ ...prev, [report.report_id]: value }))
                              if (value !== "rejected") {
                                setRejectionReasons((prev) => ({ ...prev, [report.report_id]: "" }))
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="received">Recieved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(report)}
                            disabled={!selectedStatuses[report.report_id] || updatingReportId === report.report_id}
                            className="h-9"
                          >
                            {updatingReportId === report.report_id ? "Updating..." : "Save Status"}
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => openScheduleDialog(report)}
                            disabled={updatingReportId === report.report_id}
                            className="h-9"
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Schedule Pickup
                          </Button>
                        </div>
                      </div>

                      {selectedStatuses[report.report_id] === "rejected" && (
                        <div className="pt-2">
                          <Label htmlFor={`reason-${report.report_id}`} className="text-xs">
                            Rejection Reason
                          </Label>
                          <Textarea
                            id={`reason-${report.report_id}`}
                            value={rejectionReasons[report.report_id] || ""}
                            onChange={(e) =>
                              setRejectionReasons((prev) => ({
                                ...prev,
                                [report.report_id]: e.target.value,
                              }))
                            }
                            rows={2}
                            placeholder="Enter reason for rejection"
                            className="mt-1 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>

    <Dialog open={!!scheduleDialogReport} onOpenChange={(open) => !open && setScheduleDialogReport(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Pickup</DialogTitle>
          <DialogDescription>
            Set a future pickup date and time for report #{scheduleDialogReport?.report_id}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Pickup Date</Label>
            <div className="rounded-md border w-fit">
              <Calendar
                mode="single"
                selected={scheduleDate}
                onSelect={setScheduleDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup-time">Pickup Time</Label>
            <Input
              id="pickup-time"
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setScheduleDialogReport(null)}>
            <XCircle className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSchedulePickup} disabled={!scheduleDate || !scheduleTime || !!updatingReportId}>
            <Truck className="h-4 w-4 mr-1" />
            Confirm Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
