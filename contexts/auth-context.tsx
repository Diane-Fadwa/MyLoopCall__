"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  profileImage: string | null
  role: string
  token: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("myloop_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("[v0] Error parsing stored user:", error)
        localStorage.removeItem("myloop_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Redirect to login if not authenticated and not already on login/forgot-password
  useEffect(() => {
    if (!isLoading && !user && !["/login", "/forgot-password"].includes(pathname)) {
      router.push("/login")
    }
  }, [isLoading, user, pathname, router])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const userData: User = await response.json()
      localStorage.setItem("myloop_user", JSON.stringify(userData))
      localStorage.setItem("myloop_token", userData.token)
      setUser(userData)
      router.push("/")
    } catch (error) {
      throw error instanceof Error ? error : new Error("Login failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("myloop_user")
    localStorage.removeItem("myloop_token")
    setUser(null)
    router.push("/login")
  }

  const forgotPassword = async (email: string) => {
    // Simulate password reset email
    console.log("[v0] Password reset email sent to:", email)
    // In a real app, this would call an API to send a reset email
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  // Return a safe default context during initial render instead of throwing
  if (context === undefined) {
    return {
      user: null,
      isLoading: true,
      isAuthenticated: false,
      login: async () => Promise.reject(new Error("Auth not initialized")),
      logout: () => {},
      forgotPassword: async () => Promise.reject(new Error("Auth not initialized")),
    } as AuthContextType
  }
  return context
}
