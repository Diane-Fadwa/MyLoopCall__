"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserPlus,
  Settings,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Menu,
  ChevronDown,
  ChevronUp,
  Activity,
  Save,
  Target,
  DollarSign,
  LucideContrast as FileContract,
  Calculator,
  Mail,
  Palette,
  Shield,
  UserCog,
  Navigation,
  Wrench,
} from "lucide-react"

const navigation = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Commercial", href: "/commercial", icon: Briefcase },
  { name: "Prospects", href: "/prospects", icon: UserPlus },
  {
    name: "Utilitaires",
    href: "/utilitaires",
    icon: Settings,
    children: [
      { name: "Journal d'activité", href: "/journal", icon: Activity },
      { name: "Sauvegarde", href: "/utilitaires/sauvegarde", icon: Save },
    ],
  },
  { name: "Rapports", href: "/reports", icon: BarChart3 },
  {
    name: "Paramètres",
    href: "/parametres",
    icon: FileText,
    children: [
      { name: "Collaborateurs", href: "/parametres/collaborateurs", icon: Users },
      { name: "Clients", href: "/parametres/clients", icon: Users },
      { name: "Support", href: "/parametres/support", icon: Settings },
      { name: "Prospects", href: "/parametres/prospects", icon: Target },
      { name: "Finance", href: "/parametres/finance", icon: DollarSign },
      { name: "Contrats", href: "/parametres/contrats", icon: FileContract },
      { name: "Estimate request", href: "/parametres/estimate", icon: Calculator },
      { name: "Modules", href: "/parametres/modules", icon: Wrench },
      { name: "Modules d'emails", href: "/parametres/emails", icon: Mail },
      { name: "Champs personnalisés", href: "/parametres/champs", icon: Settings },
      { name: "GDPR", href: "/parametres/gdpr", icon: Shield },
      { name: "Rôles", href: "/parametres/roles", icon: UserCog },
      { name: "Réglage Navigation", href: "/parametres/navigation", icon: Navigation },
      { name: "Style de thème", href: "/parametres/theme", icon: Palette },
      { name: "Configuration", href: "/parametres/config", icon: Settings },
    ],
  },
]

function SidebarContent({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (value: boolean) => void }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()
  const { user } = useAuth()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  const isCurrentPath = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <div className={cn("flex flex-col h-full bg-sidebar border-r border-sidebar-border", collapsed ? "w-16" : "w-64")}>
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image src="/logo-myloop.png" alt="MY LOOP CALL" fill className="object-contain" />
            </div>
            <span className="text-sidebar-foreground font-semibold text-lg">MYLOOPCALL</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          {!collapsed && <ThemeToggle />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent hidden lg:flex"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedItems.includes(item.name)
          const hasChildren = item.children && item.children.length > 0
          const isCurrent = isCurrentPath(item.href)

          return (
            <div key={item.name}>
              {hasChildren && !collapsed ? (
                <Button
                  variant={isCurrent ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left px-3",
                    isCurrent
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => toggleExpanded(item.name)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  <span className="flex-1">{item.name}</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              ) : (
                <Link href={item.href} className="block">
                  <Button
                    variant={isCurrent ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left",
                      collapsed ? "px-2" : "px-3",
                      isCurrent
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                    {!collapsed && <span className="flex-1">{item.name}</span>}
                  </Button>
                </Link>
              )}

              {hasChildren && isExpanded && !collapsed && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    const isChildCurrent = isCurrentPath(child.href)
                    return (
                      <Link key={child.name} href={child.href} className="block">
                        <Button
                          variant={isChildCurrent ? "default" : "ghost"}
                          size="sm"
                          className={cn(
                            "w-full justify-start text-left text-sm",
                            isChildCurrent
                              ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <ChildIcon className="h-3 w-3 mr-2" />
                          <span>{child.name}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent collapsed={false} setCollapsed={() => {}} />
        </SheetContent>
      </Sheet>
    </>
  )
}
