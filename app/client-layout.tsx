"use client"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AuthProvider } from "@/contexts/auth-context"
import type React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()

  // Public pages that should not have sidebar/header
  const isPublicPage = ["/login", "/forgot-password"].includes(pathname)

  if (isPublicPage) {
    return <>{children}</>
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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default ClientLayout
