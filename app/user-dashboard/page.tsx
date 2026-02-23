'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, MapPin, Trash2, Upload, CheckCircle2, LogOut, Leaf, AlertCircle, Navigation, Brain } from "lucide-react"
import { api, type Report } from "@/lib/api-client"

export default function UserDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [location, setLocation] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [reports, setReports] = useState<Report[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(true)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [aiResult, setAiResult] = useState<{
    waste_type: string
    confidence: number
    severity_level: string
    num_detections: number
    all_types: Record<string, number>
  } | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = api.auth.getStoredUser()
    if (!userData) {
      router.push("/login")
      return
    }
    setUser({ username: userData.name })

    // Load reports from backend API
    loadReports()
  }, [router])

  const loadReports = async () => {
    try {
      setIsLoadingReports(true)
      const data = await api.reports.getAll()
      setReports(data)
    } catch (error: any) {
      console.error("Failed to load reports:", error)
    } finally {
      setIsLoadingReports(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleGetLocation = async () => {
    setIsGettingLocation(true)
    setLocationError("")

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser")
      }

      // Check permission status first (if supported by browser)
      if ('permissions' in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
          
          if (permissionStatus.state === 'denied') {
            throw new Error("Location access is blocked. Please click the location icon in your browser's address bar and allow location access, then try again.")
          }
          
          if (permissionStatus.state === 'prompt') {
            // Show info message before requesting permission
            setLocationError("Your browser will ask for location permission. Please click 'Allow' to auto-detect your location.")
          }
        } catch (permError) {
          // Permission API not supported, continue with geolocation request
          console.log("Permission API not supported, requesting location directly")
        }
      }

      // Request location with detailed options
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          reject, 
          {
            enableHighAccuracy: true,  // Use GPS if available
            timeout: 15000,            // Wait up to 15 seconds
            maximumAge: 0              // Don't use cached position
          }
        )
      })

      const { latitude: lat, longitude: lng, accuracy } = position.coords

      // Set coordinates
      setLatitude(lat.toFixed(6))
      setLongitude(lng.toFixed(6))

      // Try to get address using reverse geocoding
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        if (apiKey) {
          // Use Google Maps Geocoding API
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
          )
          const data = await response.json()
          
          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address
            setLocation(address)
          }
        } else {
          // Fallback: Use free OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'CleanAI Waste Management App'
              }
            }
          )
          const data = await response.json()
          
          if (data.display_name) {
            setLocation(data.display_name)
          } else {
            setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          }
        }
      } catch (geocodeError) {
        // If reverse geocoding fails, just show coordinates
        console.error("Reverse geocoding failed:", geocodeError)
        setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
      }

      setLocationError("")
    } catch (error: any) {
      let errorMessage = "Unable to get your location"
      
      if (error.code === 1) {
        // Permission denied
        errorMessage = "Location permission denied. To enable: Click the location icon (🔒) in your browser's address bar → Site settings → Location → Allow. Then try again."
      } else if (error.code === 2) {
        // Position unavailable
        errorMessage = "Location unavailable. Please enable location services on your device and ensure you have GPS/internet connection."
      } else if (error.code === 3) {
        // Timeout
        errorMessage = "Location request timed out. Please ensure location services are enabled and try again."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setLocationError(errorMessage)
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Validate required fields
      if (!selectedImage) {
        throw new Error("Please upload an image")
      }
      if (!latitude || !longitude) {
        throw new Error("Please enter GPS coordinates (latitude and longitude)")
      }

      // Create FormData for report submission
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('latitude', latitude)
      formData.append('longitude', longitude)
      formData.append('gps_accuracy', '0')

      // Call backend API directly with FormData
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://192.168.100.3:5000/api/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to submit report')
      }

      // Capture AI classification result
      if (data.ai_classification) {
        setAiResult(data.ai_classification)
      }      // Reset form
      setSelectedImage(null)
      setImagePreview("")
      setLocation("")
      setLatitude("")
      setLongitude("")
      setDescription("")
      setShowSuccess(true)

      // Reload reports
      await loadReports()
      // Hide success message after 8 seconds (longer to let user read AI result)
      setTimeout(() => {
        setShowSuccess(false)
        setAiResult(null)
      }, 8000)
    } catch (error: any) {
      setError(error.message || "Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    api.auth.logout()
    router.push("/login")
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CleanAI Citizen Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user.username}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <p>Your waste report has been submitted successfully! The municipal team will be notified.</p>
              {aiResult && (
                <div className="mt-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-md border border-green-200 dark:border-green-700">
                  <p className="font-semibold flex items-center gap-1.5 mb-1">
                    <Brain className="h-4 w-4" />
                    AI Classification Result
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Waste Type:</span>{' '}
                      <Badge variant="secondary">{aiResult.waste_type}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>{' '}
                      <span className="font-mono font-medium">{(aiResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Severity:</span>{' '}
                      <Badge variant={aiResult.severity_level === 'high' ? 'destructive' : aiResult.severity_level === 'medium' ? 'default' : 'outline'}>
                        {aiResult.severity_level}
                      </Badge>
                    </div>
                  </div>
                  {aiResult.all_types && Object.keys(aiResult.all_types).length > 1 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      All detected: {Object.entries(aiResult.all_types).map(([t, c]) => `${t} (${(c * 100).toFixed(0)}%)`).join(', ')}
                    </p>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Submission Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Report Waste Location
                </CardTitle>
                <CardDescription>
                  Upload an image of waste and provide location details to help keep our city clean
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Waste Image *</Label>
                    <div className="flex flex-col items-center justify-center w-full">
                      {imagePreview ? (
                        <div className="relative w-full">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-gray-300"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setSelectedImage(null)
                              setImagePreview("")
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label
                          htmlFor="image"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-12 h-12 mb-4 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG, JPEG (MAX. 10MB)
                            </p>
                          </div>
                          <Input
                            id="image"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                          />
                        </label>
                      )}
                    </div>
                  </div>                  {/* Waste Type - AI Detected */}
                  <div className="space-y-2">
                    <Label>Waste Type</Label>
                    <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/30">
                      <Brain className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Auto-detected by AI</p>
                        <p className="text-xs text-muted-foreground">
                          Our YOLO model will classify the waste type automatically when you submit the report.
                          Supported types: Plastic, Metal, Cardboard/Paper, Bottle/Cup
                        </p>
                      </div>
                    </div>
                  </div>{/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        type="text"
                        placeholder="e.g., Saddar, Karachi or GPS coordinates"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* GPS Coordinates with Auto-Detect Button */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>GPS Coordinates *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGetLocation}
                        disabled={isGettingLocation}
                        className="gap-2"
                      >
                        <Navigation className={`h-4 w-4 ${isGettingLocation ? 'animate-spin' : ''}`} />
                        {isGettingLocation ? "Detecting..." : "Auto-Detect Location"}
                      </Button>
                    </div>
                      {locationError && (
                      <Alert 
                        variant={locationError.includes("will ask for") ? "default" : "destructive"} 
                        className="py-2.5"
                      >
                        {locationError.includes("will ask for") ? (
                          <Navigation className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertDescription className="text-xs leading-relaxed">
                          {locationError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude" className="text-sm text-muted-foreground">Latitude</Label>
                        <Input
                          id="latitude"
                          type="text"
                          placeholder="e.g., 24.8607"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude" className="text-sm text-muted-foreground">Longitude</Label>
                        <Input
                          id="longitude"
                          type="text"
                          placeholder="e.g., 67.0011"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click "Auto-Detect Location" to automatically fill coordinates and address from your device's GPS.
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Additional Details (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide any additional information about the waste location..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || !selectedImage}
                  >
                    {isSubmitting ? (
                      <>Submitting Report...</>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Recent Reports */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Your Recent Reports
                </CardTitle>
                <CardDescription>
                  Track your submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingReports ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Loading reports...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trash2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No reports yet</p>
                    <p className="text-xs mt-1">Submit your first waste report</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {reports.map((report) => (
                      <div
                        key={report.report_id}
                        className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
                      >                        {report.image_url && (
                          <img
                            src={`http://192.168.100.3:5000${report.image_url}`}
                            alt="Waste report"
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                        )}
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {report.waste_type || 'Pending AI'}
                            </Badge>
                            <Badge
                              variant={report.status === "resolved" ? "default" : "outline"}
                              className="text-xs"
                            >
                              {report.status}
                            </Badge>
                          </div>
                          {report.confidence_score != null && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Brain className="h-3 w-3" />
                              AI Confidence: {(report.confidence_score * 100).toFixed(0)}%
                              {report.severity_level && ` · ${report.severity_level}`}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                          </p>                          <p className="text-xs text-muted-foreground">
                            {new Date(report.submitted_at || report.created_at || '').toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="shadow-lg mt-6 bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm">How It Works</CardTitle>
              </CardHeader>              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>1. <strong>Upload</strong> a photo of waste accumulation</p>
                <p>2. <strong>Detect</strong> your GPS location</p>
                <p>3. <strong>Submit</strong> your report</p>
                <p>4. <strong>AI classifies</strong> waste type automatically</p>
                <p>5. <strong>Track</strong> cleanup progress</p>
                <p className="pt-2 text-primary flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  Our YOLO AI model detects: Plastic, Metal, Cardboard/Paper, Bottle/Cup
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
