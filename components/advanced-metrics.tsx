"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, DollarSign, Target, Phone } from "lucide-react"

const revenueData = [
  { time: "00:00", value: 2400, previous: 2200 },
  { time: "04:00", value: 1398, previous: 1500 },
  { time: "08:00", value: 9800, previous: 8900 },
  { time: "12:00", value: 3908, previous: 3500 },
  { time: "16:00", value: 4800, previous: 4200 },
  { time: "20:00", value: 3800, previous: 3900 },
  { time: "24:00", value: 4300, previous: 4100 },
]

const callVolumeData = [
  { time: "Lun", calls: 145, answered: 132 },
  { time: "Mar", calls: 167, answered: 154 },
  { time: "Mer", calls: 189, answered: 178 },
  { time: "Jeu", calls: 203, answered: 195 },
  { time: "Ven", calls: 178, answered: 165 },
  { time: "Sam", calls: 98, answered: 89 },
  { time: "Dim", calls: 67, answered: 61 },
]

const conversionData = [
  { stage: "Prospects", value: 1247, color: "hsl(var(--chart-1))" },
  { stage: "Qualifiés", value: 892, color: "hsl(var(--chart-2))" },
  { stage: "Propositions", value: 456, color: "hsl(var(--chart-3))" },
  { stage: "Négociations", value: 234, color: "hsl(var(--chart-4))" },
  { stage: "Fermés", value: 123, color: "hsl(var(--chart-5))" },
]

export function AdvancedMetrics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Revenue Tracking */}
      <Card className="col-span-1 lg:col-span-2 xl:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">€847,392</div>
              <Badge variant="secondary" className="text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </Badge>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                            <p className="text-sm">€{payload[0].value?.toLocaleString()}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground">vs €754,231 mois précédent</div>
          </div>
        </CardContent>
      </Card>

      {/* Call Volume */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volume d'Appels</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">1,047</div>
              <Badge variant="secondary" className="text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2%
              </Badge>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={callVolumeData}>
                  <Line type="monotone" dataKey="calls" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="answered" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                            <p className="text-xs">Appels: {payload[0].value}</p>
                            <p className="text-xs">Répondus: {payload[1]?.value}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground">Taux de réponse: 89.3%</div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entonnoir de Conversion</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {conversionData.map((stage, index) => {
              const percentage = index === 0 ? 100 : (stage.value / conversionData[0].value) * 100
              return (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{stage.stage}</span>
                    <span className="font-medium">{stage.value}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">{percentage.toFixed(1)}%</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
