"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import Background from "./Background"
import LogoSection from "./LogoSection"
import useLoginForm from "./useLoginForm"
import authenticate, { getErrorMessage } from "./authenticate"
import getInfoDate from "@/components/ui/date"

/**
 * Login page component.
 * Handles user credential collection and submits them to the backend
 * via an axios POST request.
 */
export default function Login() {
  const { currentYear } = getInfoDate()
  const router = useRouter()

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Local form state: NIP (username) and password
  const { formData, handleChange } = useLoginForm()

  /**
   * Submit handler.
   * - Prevents default form submission
   * - Resets previous error and sets loading flag
   * - POSTs credentials to /api/login
   * - If success user would usually redirect or store auth data
   * - IF failed I will show a simple client-side error message
   *  @param {Event} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = await authenticate(formData)
      // Token is automatically stored in httpOnly cookie
      // No need to manually store token in localStorage
      // 2. Redirect to /dashboard
      router.push("/dashboard")
    } catch (error) {
      // server answered != 2xx
      // If the user can't reach the server
      // else generic error
      setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with UNM overlay */}
      <Background />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <LogoSection />

        {/* Login Form Card */}
        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-0 animate-slide-up">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              Login
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Input
                  required
                  name="nip"
                  maxLength={18}
                  minLength={18}
                  type="text"
                  placeholder="NIP"
                  value={formData.nip}
                  disabled={isLoading}
                  onChange={handleChange}
                  className="h-12 bg-gray-100 border-0 rounded-xl px-4 text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-orange-500 transition-all font-inter"
                />
              </div>

              <div className="space-y-2">
                <Input
                  required
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  disabled={isLoading}
                  onChange={handleChange}
                  className="h-12 bg-gray-100 border-0 rounded-xl px-4 text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-orange-500 transition-all font-inter"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 font-poppins"
              >
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pt-0">
            <p className="drop-shadow text-gray-500 text-sm">
              ©{currentYear} Logbook System. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
