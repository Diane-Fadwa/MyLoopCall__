"use client"

import { Search, Plus, Share, Check, Clock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { NotificationCenter } from "@/components/notification-center"

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [userMenuOpen])

  // Don't show header on login/forgot-password pages
  if (["/login", "/forgot-password"].includes(pathname)) {
    return null
  }

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.email?.substring(0, 2).toUpperCase() || "AD"

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user?.email || "User"

  const handleLogout = () => {
    setUserMenuOpen(false)
    logout()
  }

  return (
    <header className="flex items-center justify-between p-4 bg-card border-b border-border">
      {/* Mobile menu and Search */}
      <div className="flex items-center space-x-4 flex-1">
        {/* Mobile Sidebar Trigger */}
        <div className="lg:hidden">
          <Sidebar />
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Rechercher..." className="pl-10 bg-input border-border" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button variant="ghost" size="sm" className="hidden md:flex">
          <Share className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" className="hidden md:flex">
          <Check className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm">
          <Clock className="h-4 w-4" />
        </Button>

        <Button size="sm" className="bg-primary hover:bg-primary/90 hidden sm:flex">
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Ajouter</span>
        </Button>

        <Button size="sm" className="bg-primary hover:bg-primary/90 sm:hidden">
          <Plus className="h-4 w-4" />
        </Button>

        {/* NotificationCenter */}
        <NotificationCenter />

        {/* User Menu */}
        {isAuthenticated && user && (
          <div className="relative" ref={menuRef}>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="flex flex-col space-y-1 p-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
