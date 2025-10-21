import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, CheckCircle } from "lucide-react"

export function AlertsPanel() {
  const alerts = [
    {
      id: 1,
      type: "critical",
      title: "Blocked Drainage Detected",
      location: "Gulshan-e-Iqbal Block 10",
      time: "5 minutes ago",
      status: "active"
    },
    {
      id: 2,
      type: "warning",
      title: "High Waste Accumulation",
      location: "Clifton Beach Area",
      time: "15 minutes ago",
      status: "dispatched"
    },
    {
      id: 3,
      type: "info",
      title: "Cleanup Completed",
      location: "DHA Phase 2",
      time: "1 hour ago",
      status: "resolved"
    },
    {
      id: 4,
      type: "warning",
      title: "Truck Route Optimization",
      location: "North Nazimabad",
      time: "2 hours ago",
      status: "in-progress"
    }
  ]

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive'
      case 'warning': return 'secondary'
      case 'info': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-4 w-4" />
      case 'dispatched': 
      case 'in-progress': return <Clock className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Alerts</h3>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-card/50">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(alert.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium truncate">{alert.title}</p>
                <Badge variant={getAlertColor(alert.type)} className="ml-2">
                  {alert.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{alert.location}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">4 active alerts</span>
          <Button variant="ghost" size="sm">Manage Alerts</Button>
        </div>
      </div>
    </Card>
  )
}