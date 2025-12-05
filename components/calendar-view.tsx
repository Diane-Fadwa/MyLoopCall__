"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

const daysOfWeek = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."]

const calendarData = {
  month: "septembre",
  year: 2025,
  days: [
    { date: 31, isCurrentMonth: false, events: [] },
    { date: 1, isCurrentMonth: true, events: [] },
    { date: 2, isCurrentMonth: true, events: [] },
    { date: 3, isCurrentMonth: true, events: [] },
    { date: 4, isCurrentMonth: true, events: [] },
    { date: 5, isCurrentMonth: true, events: [] },
    { date: 6, isCurrentMonth: true, events: [] },
    { date: 7, isCurrentMonth: true, events: [] },
    { date: 8, isCurrentMonth: true, events: [] },
    { date: 9, isCurrentMonth: true, events: [] },
    { date: 10, isCurrentMonth: true, events: [] },
    { date: 11, isCurrentMonth: true, events: [] },
    { date: 12, isCurrentMonth: true, events: [] },
    { date: 13, isCurrentMonth: true, events: [] },
    { date: 14, isCurrentMonth: true, events: [] },
    { date: 15, isCurrentMonth: true, events: [{ title: "Réunion équipe", type: "meeting" }] },
    { date: 16, isCurrentMonth: true, events: [] },
    { date: 17, isCurrentMonth: true, events: [] },
    { date: 18, isCurrentMonth: true, events: [{ title: "Appel client", type: "call" }] },
    { date: 19, isCurrentMonth: true, events: [] },
    { date: 20, isCurrentMonth: true, events: [] },
    { date: 21, isCurrentMonth: true, events: [] },
    { date: 22, isCurrentMonth: true, events: [] },
    { date: 23, isCurrentMonth: true, events: [] },
    { date: 24, isCurrentMonth: true, events: [] },
    { date: 25, isCurrentMonth: true, events: [{ title: "Formation", type: "training" }] },
    { date: 26, isCurrentMonth: true, events: [] },
    { date: 27, isCurrentMonth: true, events: [{ title: "Aujourd'hui", type: "today" }] },
    { date: 28, isCurrentMonth: true, events: [] },
    { date: 29, isCurrentMonth: true, events: [] },
    { date: 30, isCurrentMonth: true, events: [] },
    { date: 1, isCurrentMonth: false, events: [] },
    { date: 2, isCurrentMonth: false, events: [] },
    { date: 3, isCurrentMonth: false, events: [] },
    { date: 4, isCurrentMonth: false, events: [] },
  ],
}

const viewOptions = ["Mois", "Semaine", "Jour"]

export function CalendarView() {
  const [currentView, setCurrentView] = useState("Mois")
  const [selectedDate, setSelectedDate] = useState(27)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-card-foreground">Calendrier</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {viewOptions.map((view) => (
              <Button
                key={view}
                variant={currentView === view ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView(view)}
                className="text-xs"
              >
                {view}
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="text-xs">
              <Filter className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Filtrer Par</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="bg-secondary text-secondary-foreground text-xs">
                  Aujourd'hui
                </Button>
                <Button variant="ghost" size="sm" className="text-xs hidden sm:flex">
                  Déployer
                </Button>
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">
              {calendarData.month} {calendarData.year}
            </h2>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Days of week header */}
            {daysOfWeek.map((day) => (
              <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarData.days.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border border-border/50 cursor-pointer hover:bg-accent/50 transition-colors",
                  !day.isCurrentMonth && "text-muted-foreground bg-muted/20",
                  day.date === selectedDate && day.isCurrentMonth && "bg-primary/10 border-primary/50",
                )}
                onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
              >
                <div className="text-xs sm:text-sm font-medium">{day.date}</div>
                <div className="mt-1 space-y-1">
                  {day.events.map((event, eventIndex) => (
                    <Badge
                      key={eventIndex}
                      variant="secondary"
                      className={cn(
                        "text-xs px-1 py-0 h-4 sm:h-5 text-[10px] sm:text-xs",
                        event.type === "meeting" && "bg-chart-1/20 text-chart-1",
                        event.type === "call" && "bg-chart-2/20 text-chart-2",
                        event.type === "training" && "bg-chart-4/20 text-chart-4",
                        event.type === "today" && "bg-primary/20 text-primary",
                      )}
                    >
                      <span className="truncate">{event.title}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
