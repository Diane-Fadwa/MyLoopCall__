"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Phone, Mail, UserPlus, DollarSign, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "call",
    user: "Marie Dubois",
    action: "Appel entrant terminé",
    target: "Jean Martin",
    time: "Il y a 2 min",
    status: "success",
    icon: Phone,
  },
  {
    id: 2,
    type: "lead",
    user: "Pierre Leroy",
    action: "Nouveau prospect ajouté",
    target: "Sophie Bernard",
    time: "Il y a 5 min",
    status: "info",
    icon: UserPlus,
  },
  {
    id: 3,
    type: "deal",
    user: "Claire Moreau",
    action: "Contrat signé",
    target: "€12,500",
    time: "Il y a 8 min",
    status: "success",
    icon: DollarSign,
  },
  {
    id: 4,
    type: "email",
    user: "Thomas Petit",
    action: "Email de suivi envoyé",
    target: "Lucas Roux",
    time: "Il y a 12 min",
    status: "pending",
    icon: Mail,
  },
  {
    id: 5,
    type: "call",
    user: "Emma Garnier",
    action: "Appel manqué",
    target: "Julie Blanc",
    time: "Il y a 15 min",
    status: "warning",
    icon: Phone,
  },
  {
    id: 6,
    type: "lead",
    user: "Nicolas Simon",
    action: "Prospect qualifié",
    target: "Antoine Michel",
    time: "Il y a 18 min",
    status: "success",
    icon: UserPlus,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "text-success"
    case "warning":
      return "text-warning"
    case "pending":
      return "text-muted-foreground"
    default:
      return "text-primary"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return "bg-success/10 text-success border-success/20"
    case "warning":
      return "bg-warning/10 text-warning border-warning/20"
    case "pending":
      return "bg-muted text-muted-foreground border-border"
    default:
      return "bg-primary/10 text-primary border-primary/20"
  }
}

export function RealTimeActivity() {
  return (
    <Card className="col-span-1 lg:col-span-2 xl:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Activité en Temps Réel
        </CardTitle>
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
          En direct
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80 px-6">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 pb-4 border-b border-border/50 last:border-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${getStatusColor(activity.status)}`} />
                      <span className="text-sm font-medium">{activity.user}</span>
                      <Badge variant="outline" className={`text-xs ${getStatusBadge(activity.status)}`}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} • <span className="font-medium">{activity.target}</span>
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
