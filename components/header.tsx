"use client"

import { Search, Plus, Bell, Share, Check, Clock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  // Don't show header on login/forgot-password pages
  if (["/login", "/forgot-password"].includes(pathname)) {
    return null
  }

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "AD"

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

        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>

        {isAuthenticated && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
