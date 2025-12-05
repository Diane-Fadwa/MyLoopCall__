"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const prospectsData = [
  { name: "ANNULATION PAC", value: 15, color: "#ef4444" },
  { name: "INJOIGNABLE", value: 8, color: "#8b5cf6" },
  { name: "RAPPEL PV", value: 12, color: "#3b82f6" },
  { name: "FACTURER PAC", value: 6, color: "#6b7280" },
  { name: "RAPPEL PAC", value: 18, color: "#ec4899" },
  { name: "RAPPEL VACINE", value: 25, color: "#10b981" },
  { name: "ANNULATION PV", value: 10, color: "#f59e0b" },
  { name: "NRP", value: 4, color: "#84cc16" },
  { name: "EN ATTENTE DE DOC", value: 7, color: "#06b6d4" },
  { name: "FACTURE PV", value: 9, color: "#f97316" },
  { name: "NOUVEAU", value: 14, color: "#a855f7" },
  { name: "VALIDATION PAC", value: 11, color: "#22c55e" },
  { name: "VALIDE PV", value: 13, color: "#eab308" },
  { name: "Prospects perdus", value: 8, color: "#dc2626" },
]

const RADIAN = Math.PI / 180
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
        <p className="text-muted-foreground text-sm">
          {((data.value / prospectsData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% du total
        </p>
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
  const total = prospectsData.reduce((sum, item) => sum + item.value, 0)

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
