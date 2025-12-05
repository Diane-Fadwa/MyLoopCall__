"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProspectsChart } from "@/components/prospects-chart"
import { KPICards } from "@/components/kpi-cards"
import { CalendarView } from "@/components/calendar-view"
import { BarChart3, Calendar, RefreshCw, Download, Filter, Plus, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function Dashboard() {
  const [isExporting, setIsExporting] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [filterText, setFilterText] = useState("")

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    setIsExporting(true)
    setShowExportMenu(false)
    console.log(`[v0] Exporting data as ${format.toUpperCase()}`)

    // Simulate export
    setTimeout(() => {
      setIsExporting(false)
      // In a real app, this would generate and download the file
      console.log(`[v0] Export completed for ${format}`)
    }, 1000)
  }

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleAddProspect = () => {
    console.log("[v0] Add prospect clicked")
    // In a real app, this would open a modal or navigate to a form
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    console.log("[v0] Searching for:", value)
  }

  const handleRefresh = () => {
    console.log("[v0] Refreshing dashboard data")
    // In a real app, this would fetch fresh data
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-lg text-muted-foreground font-medium">Vue d'ensemble de votre activité commerciale</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 px-3 py-1.5"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
            Données en temps réel
          </Badge>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-col space-y-3">
        {/* Search and Main Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <Button
            onClick={handleAddProspect}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>

          <Button
            onClick={handleFilter}
            variant="outline"
            size="sm"
            className="hover:bg-muted/50 transition-all duration-200 shadow-sm bg-transparent"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>

          <div className="relative group">
            <Button
              onClick={() => setShowExportMenu(!showExportMenu)}
              variant="outline"
              size="sm"
              className="hover:bg-muted/50 transition-all duration-200 shadow-sm"
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Export..." : "Exporter"}
            </Button>
            <div
              className={cn(
                "absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 transition-all duration-200",
                showExportMenu ? "opacity-100 visible" : "opacity-0 invisible",
              )}
            >
              <button
                onClick={() => handleExport("pdf")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-accent text-foreground first:rounded-t-lg transition-colors"
              >
                Exporter en PDF
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-accent text-foreground transition-colors"
              >
                Exporter en Excel
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-accent text-foreground last:rounded-b-lg transition-colors"
              >
                Exporter en CSV
              </button>
            </div>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="hover:bg-muted/50 transition-all duration-200 shadow-sm bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Filter Panel - Show actual filter when open */}
        {isFilterOpen && (
          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Filtrer par statut</label>
              <input
                type="text"
                placeholder="Entrer un filtre..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button onClick={() => setIsFilterOpen(false)} variant="outline" className="sm:mt-6">
              <Check className="h-4 w-4 mr-2" />
              Appliquer
            </Button>
          </div>
        )}
      </div>

      <KPICards />

      <div className="space-y-8">
        {/* Prospects Chart - Full Width */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl font-semibold">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <span>Aperçu des prospects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ProspectsChart />
          </CardContent>
        </Card>

        {/* Calendar Card - Full Width */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl font-semibold">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <span>Calendrier</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CalendarView />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
