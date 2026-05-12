'use client'

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Camera, CheckCircle2, Eye, EyeOff, AlertCircle, MapPin, Navigation, Truck, LogOut } from "lucide-react"
import { api, type DriverAssignment } from "@/lib/api-client"

const DRIVER_AREAS = [
  "Scheme33",
  "Malir 15",
  "Quadabad",
  "Shahrae faisal",
  "Tariq Road",
  "North Nazimabad",
]

export default function DriverPortalPage() {
  const router = useRouter()
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "")

  const [activeTab, setActiveTab] = useState("login")
  const [loginPhone, setLoginPhone] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupArea, setSignupArea] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirm, setSignupConfirm] = useState("")
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirm, setShowSignupConfirm] = useState(false)
  const [signupError, setSignupError] = useState("")
  const [signupSuccess, setSignupSuccess] = useState("")
  const [signupLoading, setSignupLoading] = useState(false)

  const [driverUser, setDriverUser] = useState<{ name: string; role: string } | null>(null)
  const [assignments, setAssignments] = useState<DriverAssignment[]>([])
  const [assignmentsLoading, setAssignmentsLoading] = useState(false)
  const [assignmentsError, setAssignmentsError] = useState("")

  const [completionTask, setCompletionTask] = useState<DriverAssignment | null>(null)
  const [completionImage, setCompletionImage] = useState<File | null>(null)
  const [completionPreview, setCompletionPreview] = useState("")
  const [completionLocation, setCompletionLocation] = useState("")
  const [completionLatitude, setCompletionLatitude] = useState("")
  const [completionLongitude, setCompletionLongitude] = useState("")
  const [completionError, setCompletionError] = useState("")
  const [completionLoading, setCompletionLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)

  useEffect(() => {
    const storedUser = api.auth.getStoredUser()
    if (storedUser?.role === "driver") {
      setDriverUser({ name: storedUser.name, role: storedUser.role })
    }
  }, [])

  useEffect(() => {
    if (driverUser) {
      loadAssignments()
    }
  }, [driverUser])

  const isAssignmentCompleted = (assignment: DriverAssignment) => {
    const status = (assignment.completion_status || '').trim().toUpperCase()
    if (status === 'COMPLETED' || status === 'COMPLETE') {
      return true
    }

    return !!assignment.completed_at
  }

  const activeAssignments = useMemo(() => {
    return assignments.filter((assignment) => !isAssignmentCompleted(assignment))
  }, [assignments])

  const completedAssignments = useMemo(() => {
    return assignments.filter((assignment) => isAssignmentCompleted(assignment))
  }, [assignments])

  const getPickupReportLabel = (status?: string | null) => {
    switch ((status || "").toLowerCase()) {
      case "waiting":
        return "Waiting for user"
      case "confirmed":
        return "Confirmed"
      case "rejected":
        return "Rejected"
      default:
        return "Pending"
    }
  }

  const loadAssignments = async () => {
    try {
      setAssignmentsLoading(true)
      setAssignmentsError("")
      const data = await api.drivers.getAssignments()
      setAssignments(data)
    } catch (error: any) {
      setAssignmentsError(error.message || "Failed to load assignments")
    } finally {
      setAssignmentsLoading(false)
    }
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoginError("")
    setLoginLoading(true)
    try {
      const response = await api.drivers.login({ phone: loginPhone, password: loginPassword })
      setDriverUser({ name: response.user.name, role: response.user.role })
    } catch (error: any) {
      setLoginError(error.message || "Login failed. Please check your credentials.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()
    setSignupError("")
    setSignupSuccess("")

    if (!signupArea) {
      setSignupError("Please select your area.")
      return
    }

    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match.")
      return
    }

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.")
      return
    }

    setSignupLoading(true)
    try {
      await api.drivers.register({
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        area: signupArea,
        password: signupPassword,
      })
      setSignupSuccess("Registration successful! Please sign in.")
      setSignupName("")
      setSignupEmail("")
      setSignupPhone("")
      setSignupArea("")
      setSignupPassword("")
      setSignupConfirm("")
      setLoginPhone(signupPhone)
      setTimeout(() => {
        setSignupSuccess("")
        setActiveTab("login")
      }, 1500)
    } catch (error: any) {
      setSignupError(error.message || "Registration failed. Please try again.")
    } finally {
      setSignupLoading(false)
    }
  }

  const handleLogout = () => {
    api.auth.logout()
    setDriverUser(null)
    setAssignments([])
    router.push("/driver-portal")
  }

  const handleCompletionImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setCompletionImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setCompletionPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleAutoDetectLocation = async () => {
    setLocationLoading(true)
    setCompletionError("")

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser")
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        })
      })

      const { latitude, longitude } = position.coords
      setCompletionLatitude(latitude.toFixed(6))
      setCompletionLongitude(longitude.toFixed(6))

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en-US,en;q=0.9",
              "User-Agent": "CleanAI Driver Portal",
            },
          }
        )
        const data = await response.json()
        setCompletionLocation(data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
      } catch (error) {
        setCompletionLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
      }
    } catch (error: any) {
      setCompletionError(error.message || "Unable to detect location")
    } finally {
      setLocationLoading(false)
    }
  }

  const submitCompletion = async () => {
    if (!completionTask || !completionImage) {
      setCompletionError("Please upload a completion photo.")
      return
    }

    if (!completionLatitude || !completionLongitude) {
      setCompletionError("Please provide GPS coordinates.")
      return
    }

    try {
      setCompletionLoading(true)
      setCompletionError("")
      await api.drivers.completeAssignment(
        completionTask.task_id,
        {
          latitude: completionLatitude,
          longitude: completionLongitude,
          location: completionLocation,
        },
        completionImage
      )
      setCompletionTask(null)
      setCompletionImage(null)
      setCompletionPreview("")
      setCompletionLatitude("")
      setCompletionLongitude("")
      setCompletionLocation("")
      await loadAssignments()
    } catch (error: any) {
      setCompletionError(error.message || "Failed to complete assignment")
    } finally {
      setCompletionLoading(false)
    }
  }

  if (!driverUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-4 text-center pb-2">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Truck className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">CleanAI Driver Portal</CardTitle>
              <CardDescription className="text-base mt-1">
                Manage pickup assignments and verify completion
              </CardDescription>
            </div>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">Register</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="driver-phone">Phone</Label>
                    <Input
                      id="driver-phone"
                      type="tel"
                      placeholder="e.g. 0300 0000000"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      required
                      disabled={loginLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driver-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="driver-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        disabled={loginLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 pt-0">
                  <Button type="submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <a href="/" className="hover:text-primary transition-colors">← Back to Home</a>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4 pt-4">
                  {signupError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}
                  {signupSuccess && (
                    <Alert className="border-green-200 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription>{signupSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="e.g. Ali Khan"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      disabled={signupLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">
                      Email <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={signupLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="e.g. 0300 0000000"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                      disabled={signupLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-area">Assigned Area</Label>
                    <Select value={signupArea} onValueChange={setSignupArea}>
                      <SelectTrigger id="signup-area">
                        <SelectValue placeholder="Select your area" />
                      </SelectTrigger>
                      <SelectContent>
                        {DRIVER_AREAS.map((area) => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        disabled={signupLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm"
                        type={showSignupConfirm ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        required
                        disabled={signupLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupConfirm((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showSignupConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 pt-0">
                  <Button type="submit" className="w-full" disabled={signupLoading}>
                    {signupLoading ? "Registering..." : "Create Driver Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CleanAI Driver Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome, {driverUser.name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Active Assignments
            </CardTitle>
            <CardDescription>Pickup tasks assigned to you by admins</CardDescription>
          </CardHeader>
          <CardContent>
            {assignmentsError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{assignmentsError}</AlertDescription>
              </Alert>
            )}

            {assignmentsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading assignments...</div>
            ) : activeAssignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No active assignments</p>
                <p className="text-xs mt-1">New pickup tasks will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAssignments.map((assignment) => (
                  <div key={assignment.task_id} className="border rounded-lg p-4 bg-card/50">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="w-full md:w-32">
                        {assignment.image_url ? (
                          <img
                            src={`${backendBaseUrl}${assignment.image_url}`}
                            alt="Report"
                            className="w-full h-24 object-cover rounded-md border"
                          />
                        ) : (
                          <div className="w-full h-24 rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">Report #{assignment.report_id}</p>
                            <p className="text-xs text-muted-foreground">
                              {assignment.waste_type || "Pending AI"}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {assignment.completion_status || (assignment.completed_at ? "COMPLETED" : "TASK DUE")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {assignment.location || "Location not available"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assignment.latitude?.toFixed(4)}, {assignment.longitude?.toFixed(4)}
                        </p>
                        {assignment.due_date && (
                          <p className="text-xs text-muted-foreground">
                            <strong>Pickup:</strong> {new Date(assignment.due_date).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Button size="sm" onClick={() => setCompletionTask(assignment)}>
                          <Camera className="h-4 w-4 mr-1" />
                          Complete Pickup
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Completed Pickups
            </CardTitle>
            <CardDescription>Confirmed cleanup tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {completedAssignments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No completed pickups yet.
              </div>
            ) : (
              <div className="space-y-3">
                {completedAssignments.map((assignment) => (
                  <div key={assignment.task_id} className="border rounded-lg p-3 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Report #{assignment.report_id}</p>
                        <p className="text-xs text-muted-foreground">
                          Completed {assignment.completed_at ? new Date(assignment.completed_at).toLocaleString() : ""}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {getPickupReportLabel(assignment.pickup_report_status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!completionTask} onOpenChange={(open) => !open && setCompletionTask(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Pickup</DialogTitle>
            <DialogDescription>
              Upload a cleanup photo and confirm your current location for report #{completionTask?.report_id}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {completionError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{completionError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="completion-image">Completion Photo</Label>
              {completionPreview ? (
                <img src={completionPreview} alt="Completion" className="w-full h-40 object-cover rounded-md border" />
              ) : (
                <div className="border border-dashed rounded-md p-6 text-center text-sm text-muted-foreground">
                  Upload a clear photo after cleanup
                </div>
              )}
              <Input
                id="completion-image"
                type="file"
                accept="image/*"
                onChange={handleCompletionImageChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>GPS Coordinates</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAutoDetectLocation} disabled={locationLoading}>
                  <Navigation className={`h-4 w-4 mr-1 ${locationLoading ? 'animate-spin' : ''}`} />
                  {locationLoading ? "Detecting..." : "Auto-Detect"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="completion-lat" className="text-xs text-muted-foreground">Latitude</Label>
                  <Input
                    id="completion-lat"
                    value={completionLatitude}
                    onChange={(e) => setCompletionLatitude(e.target.value)}
                    placeholder="24.8607"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="completion-lng" className="text-xs text-muted-foreground">Longitude</Label>
                  <Input
                    id="completion-lng"
                    value={completionLongitude}
                    onChange={(e) => setCompletionLongitude(e.target.value)}
                    placeholder="67.0011"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="completion-location">Location Description</Label>
              <Input
                id="completion-location"
                value={completionLocation}
                onChange={(e) => setCompletionLocation(e.target.value)}
                placeholder="Auto-filled address"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCompletionTask(null)}>
              Cancel
            </Button>
            <Button onClick={submitCompletion} disabled={completionLoading}>
              {completionLoading ? "Submitting..." : "Submit Completion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
