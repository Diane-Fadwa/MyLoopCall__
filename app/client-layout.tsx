"use client"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AuthProvider } from "@/contexts/auth-context"
import type React from "react"
import { useAuthCheck } from "@/hooks/use-auth-checks"

// Separate component to use useAuth hook after AuthProvider
function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthCheck()

  if (!isAuthenticated && typeof window !== "undefined") {
    return <>{children}</> // Let AuthProvider handle redirect
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <><ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
              <Suspense fallback={<div>Loading...</div>}>
                  <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
              </Suspense>
          </AuthProvider>
      </ThemeProvider><Analytics /></>
  )
}
