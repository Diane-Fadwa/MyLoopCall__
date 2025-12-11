"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { prospectsService } from "@/lib/prospects-data"

const STATUS_COLORS: Record<string, string> = {
  VALIDE: "#10b981",
  ANNULATION: "#ef4444",
  "RAPPEL YACINE": "#3b82f6",
  NRP: "#f59e0b",
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="500"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-2xl">
        <p className="text-popover-foreground font-semibold text-base">{data.name}</p>
        <p className="text-primary font-medium">
          Valeur: <span className="font-bold">{data.value}</span>
        </p>
        <p className="text-muted-foreground text-sm">{((data.value / payload[0].total) * 100).toFixed(1)}% du total</p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
      {payload?.map((entry: any, index: number) => (
        <div
          key={index}
          className="flex items-center space-x-3 text-sm group hover:bg-muted/30 p-2 rounded-lg transition-colors duration-200"
        >
          <div
            className="w-4 h-4 rounded-md flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-card-foreground truncate font-medium" title={entry.value}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function ProspectsChart() {
  const [prospectsData, setProspectsData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const loadData = () => {
      const counts = prospectsService.getStatutCounts()
      const data = Object.entries(counts).map(([statut, count]) => ({
        name: statut,
        value: count,
        color: STATUS_COLORS[statut] || "#6b7280",
      }))
      setProspectsData(data)
      setTotal(data.reduce((sum, item) => sum + item.value, 0))
    }

    loadData()

    const handleProspectsChange = () => loadData()
    window.addEventListener("prospectsChanged", handleProspectsChange)
    return () => window.removeEventListener("prospectsChanged", handleProspectsChange)
  }, [])

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-10">
        {/* Chart */}
        <div className="w-full lg:w-1/2 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={prospectsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={140}
                innerRadius={70}
                fill="#8884d8"
                dataKey="value"
                stroke="none"
              >
                {prospectsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats and Legend */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="text-center lg:text-left p-6 rounded-xl bg-muted/30 border border-border/50">
            <div className="text-4xl font-bold text-card-foreground mb-2">{total}</div>
            <div className="text-muted-foreground text-lg font-medium">Total des prospects</div>
          </div>

          <CustomLegend payload={prospectsData.map((item) => ({ value: item.name, color: item.color }))} />
        </div>
      </div>
    </div>
  )
}
