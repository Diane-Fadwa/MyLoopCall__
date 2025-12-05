"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Target, Briefcase, CheckSquare, TrendingUp, TrendingDown, Minus } from "lucide-react"

const kpiData = [
  {
    title: "Factures en attente de paiement",
    value: "0 / 0",
    icon: FileText,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    trend: "neutral",
    trendValue: "0%",
  },
  {
    title: "Cibles converties",
    value: "31 / 237",
    icon: Target,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    trend: "up",
    trendValue: "+13.1%",
    progress: 13.1,
  },
  {
    title: "Projets En cours",
    value: "0 / 0",
    icon: Briefcase,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    trend: "neutral",
    trendValue: "0%",
  },
  {
    title: "La tâche n'est pas terminée",
    value: "1 / 1",
    icon: CheckSquare,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    trend: "down",
    trendValue: "-2%",
    progress: 100,
  },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon
        const TrendIcon = kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus

        return (
          <Card
            key={index}
            className="group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-card-foreground/90 leading-tight">{kpi.title}</CardTitle>
              <div
                className={`p-3 rounded-xl ${kpi.bgColor} shadow-sm group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-card-foreground tracking-tight">{kpi.value}</div>
                  <div
                    className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
                      kpi.trend === "up"
                        ? "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30"
                        : kpi.trend === "down"
                          ? "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30"
                          : "text-muted-foreground bg-muted/50"
                    }`}
                  >
                    <TrendIcon className="h-3 w-3" />
                    <span>{kpi.trendValue}</span>
                  </div>
                </div>

                {kpi.progress !== undefined && (
                  <div className="space-y-2">
                    <Progress value={kpi.progress} className="h-2.5 bg-muted/30" />
                    <div className="flex justify-between text-sm text-muted-foreground font-medium">
                      <span>Progression</span>
                      <span className="font-semibold">{kpi.progress.toFixed(1)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
