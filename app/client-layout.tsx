"use client"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AuthProvider } from "@/contexts/auth-context"
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context"
import type React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { NotificationToast } from "@/components/notification-toast"
import { ThemeInitializer } from "@/components/theme-initializer"

function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const { collapsed } = useSidebar()
  const pathname = usePathname()

  const isPublicPage = ["/login", "/forgot-password"].includes(pathname)

  if (isPublicPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background">
      <div
        className={cn(
          "hidden lg:block flex-shrink-0 border-r border-gray-200 transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
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
        <SidebarProvider>
          <ThemeInitializer />
          <Suspense fallback={<div>Loading...</div>}>
            <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
            <NotificationToast />
          </Suspense>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default ClientLayout
