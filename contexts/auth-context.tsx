"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  email: string
  name: string
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
      setUser(JSON.parse(storedUser))
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
    // Simulate API call
    if (email === "admin@myloop.com" && password === "YMadmin2025") {
      const userData: User = {
        email,
        name: "Administrator",
      }
      localStorage.setItem("myloop_user", JSON.stringify(userData))
      setUser(userData)
      router.push("/")
    } else {
      throw new Error("Invalid email or password")
    }
  }

  const logout = () => {
    localStorage.removeItem("myloop_user")
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
