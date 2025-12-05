"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"
import { Users, Target, Clock, TrendingUp, Award, Phone } from "lucide-react"

const teamPerformance = [
  { name: "Marie D.", calls: 45, deals: 8, revenue: 23400 },
  { name: "Pierre L.", calls: 38, deals: 6, revenue: 18900 },
  { name: "Claire M.", calls: 52, deals: 12, revenue: 31200 },
  { name: "Thomas P.", calls: 41, deals: 7, revenue: 19800 },
  { name: "Emma G.", calls: 36, deals: 5, revenue: 15600 },
]

const responseTimeData = [
  { range: "< 30s", count: 234, color: "hsl(var(--chart-2))" },
  { range: "30s-1m", count: 156, color: "hsl(var(--chart-1))" },
  { range: "1m-2m", count: 89, color: "hsl(var(--chart-4))" },
  { range: "> 2m", count: 23, color: "hsl(var(--chart-3))" },
]

const kpiMetrics = [
  {
    title: "Taux de Conversion",
    value: "23.8%",
    target: "25%",
    progress: 95.2,
    trend: "+2.1%",
    icon: Target,
    color: "text-chart-2",
  },
  {
    title: "Temps Moyen d'Appel",
    value: "4m 32s",
    target: "5m",
    progress: 90.4,
    trend: "-8s",
    icon: Clock,
    color: "text-chart-1",
  },
  {
    title: "Satisfaction Client",
    value: "4.7/5",
    target: "4.5/5",
    progress: 94,
    trend: "+0.2",
    icon: Award,
    color: "text-chart-5",
  },
]

export function PerformanceWidgets() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Team Performance */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Performance de l'Équipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm">Appels: {data.calls}</p>
                          <p className="text-sm">Contrats: {data.deals}</p>
                          <p className="text-sm">CA: €{data.revenue.toLocaleString()}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Response Time Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Temps de Réponse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={responseTimeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    dataKey="count"
                    stroke="none"
                  >
                    {responseTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                            <p className="text-sm">
                              {payload[0].payload.range}: {payload[0].value} appels
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {responseTimeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.range}</span>
                  </div>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics */}
      {kpiMetrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <Badge variant="secondary" className="text-success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.trend}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Objectif: {metric.target}</span>
                    <span className="font-medium">{metric.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
