'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api-client"

export default function LoginPage() {
  const router = useRouter()

  // ── Login state ──────────────────────────────────────────────
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  // ── Signup state ─────────────────────────────────────────────
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirm, setSignupConfirm] = useState("")
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirm, setShowSignupConfirm] = useState(false)
  const [signupError, setSignupError] = useState("")
  const [signupSuccess, setSignupSuccess] = useState("")
  const [isSignupLoading, setIsSignupLoading] = useState(false)

  // ── Active tab ───────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("login")

  // ── Handlers ─────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoginLoading(true)
    try {
      await api.auth.login({ email, password })
      setTimeout(() => router.push("/user-dashboard"), 500)
    } catch (err: any) {
      setLoginError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoginLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError("")
    setSignupSuccess("")

    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match.")
      return
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.")
      return
    }

    setIsSignupLoading(true)
    try {
      await api.auth.register({
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
        role: "citizen",
      })
      setSignupSuccess("Account created! Redirecting to sign in…")
      // Clear fields
      setSignupName(""); setSignupEmail(""); setSignupPhone("")
      setSignupPassword(""); setSignupConfirm("")
      // Pre-fill login email, switch tab
      setEmail(signupEmail)
      setTimeout(() => {
        setSignupSuccess("")
        setActiveTab("login")
      }, 1800)
    } catch (err: any) {
      setSignupError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsSignupLoading(false)
    }
  }

  // ── UI ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        {/* Header */}
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Welcome to CleanAI</CardTitle>
            <CardDescription className="text-base mt-1">
              Citizen Reporting Portal
            </CardDescription>
          </div>
        </CardHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Create Account</TabsTrigger>
            </TabsList>
          </div>

          {/* ── SIGN IN ─────────────────────────────────────── */}
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoginLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoginLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  <p className="font-medium mb-1">Demo Credentials:</p>
                  <p>Email: <span className="font-mono">hamza@cleanai.com</span></p>
                  <p>Password: <span className="font-mono">hamza</span></p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 pt-0">
                <Button type="submit" className="w-full" disabled={isLoginLoading}>
                  {isLoginLoading ? "Signing in…" : "Sign In"}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  <a href="/" className="hover:text-primary transition-colors">← Back to Home</a>
                </div>
              </CardFooter>
            </form>
          </TabsContent>

          {/* ── CREATE ACCOUNT ──────────────────────────────── */}
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
                    placeholder="e.g. Hamza Khan"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    disabled={isSignupLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    disabled={isSignupLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">
                    Phone <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+92 300 0000000"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    disabled={isSignupLoading}
                  />
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
                      disabled={isSignupLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword((v) => !v)}
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
                      disabled={isSignupLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showSignupConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 pt-0">
                <Button type="submit" className="w-full" disabled={isSignupLoading}>
                  {isSignupLoading ? "Creating account…" : "Create Account"}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
