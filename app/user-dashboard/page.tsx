'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, MapPin, Trash2, Upload, CheckCircle2, LogOut, Leaf } from "lucide-react"

interface WasteReport {
  id: string
  imageUrl: string
  wasteType: string
  location: string
  description: string
  timestamp: string
  status: "pending" | "submitted"
}

export default function UserDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [wasteType, setWasteType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [reports, setReports] = useState<WasteReport[]>([])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Load existing reports from localStorage
    const savedReports = localStorage.getItem("wasteReports")
    if (savedReports) {
      setReports(JSON.parse(savedReports))
    }
  }, [router])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Create new report
    const newReport: WasteReport = {
      id: Date.now().toString(),
      imageUrl: imagePreview,
      wasteType: wasteType || "Plastic",
      location: location || "Karachi, Pakistan",
      description: description || "No description provided",
      timestamp: new Date().toISOString(),
      status: "submitted"
    }

    // Save to localStorage (for prototype)
    const updatedReports = [newReport, ...reports]
    setReports(updatedReports)
    localStorage.setItem("wasteReports", JSON.stringify(updatedReports))

    // Also save to admin dashboard data
    const existingAdminReports = localStorage.getItem("adminWasteReports")
    const adminReports = existingAdminReports ? JSON.parse(existingAdminReports) : []
    adminReports.unshift(newReport)
    localStorage.setItem("adminWasteReports", JSON.stringify(adminReports))

    // Reset form
    setSelectedImage(null)
    setImagePreview("")
    setWasteType("")
    setLocation("")
    setDescription("")
    setIsSubmitting(false)
    setShowSuccess(true)

    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Your waste report has been submitted successfully! The municipal team will be notified.
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
                  </div>

                  {/* Waste Type */}
                  <div className="space-y-2">
                    <Label htmlFor="wasteType">Waste Type *</Label>
                    <Select value={wasteType} onValueChange={setWasteType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select waste type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Plastic">Plastic Waste</SelectItem>
                        <SelectItem value="Organic">Organic Waste</SelectItem>
                        <SelectItem value="Metal">Metal Waste</SelectItem>
                        <SelectItem value="Paper">Paper/Cardboard</SelectItem>
                        <SelectItem value="Glass">Glass</SelectItem>
                        <SelectItem value="Electronic">Electronic Waste</SelectItem>
                        <SelectItem value="Construction">Construction Debris</SelectItem>
                        <SelectItem value="Mixed">Mixed Waste</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      AI will verify this automatically in production
                    </p>
                  </div>

                  {/* Location */}
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
                    <p className="text-xs text-muted-foreground">
                      GPS coordinates will be auto-detected in production
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
                {reports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trash2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No reports yet</p>
                    <p className="text-xs mt-1">Submit your first waste report</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
                      >
                        <img
                          src={report.imageUrl}
                          alt="Waste report"
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {report.wasteType}
                            </Badge>
                            <Badge
                              variant={report.status === "submitted" ? "default" : "outline"}
                              className="text-xs"
                            >
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(report.timestamp).toLocaleString()}
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
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>1. <strong>Upload</strong> a photo of waste accumulation</p>
                <p>2. <strong>Select</strong> waste type and location</p>
                <p>3. <strong>Submit</strong> your report</p>
                <p>4. <strong>Track</strong> cleanup progress</p>
                <p className="pt-2 text-primary">
                  Our AI will analyze the image and dispatch the nearest cleanup crew!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
