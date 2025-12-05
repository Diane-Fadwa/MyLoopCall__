"use client"

import { Search, Plus, Bell, User, Share, Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"

export function Header() {
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

        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
