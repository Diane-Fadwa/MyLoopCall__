"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProspectsChart } from "@/components/prospects-chart"
import { KPICards } from "@/components/kpi-cards"
import { CalendarView } from "@/components/calendar-view"
import { BarChart3, Calendar, RefreshCw, Download, Filter } from "lucide-react"

export function Dashboard() {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
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
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-muted/50 transition-all duration-200 shadow-sm bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-muted/50 transition-all duration-200 shadow-sm bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-muted/50 transition-all duration-200 shadow-sm bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      <KPICards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Prospects Chart */}
        <Card className="xl:col-span-2 shadow-lg border-0 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
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

        {/* Calendar Card */}
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
