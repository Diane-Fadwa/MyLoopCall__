"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

const daysOfWeek = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."]

const getCalendarDays = (month: number, year: number) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({ date: prevMonthLastDay - i, isCurrentMonth: false, events: [] })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const events = []
    if (i === 15) events.push({ title: "Réunion équipe", type: "meeting" })
    if (i === 18) events.push({ title: "Appel client", type: "call" })
    if (i === 25) events.push({ title: "Formation", type: "training" })
    days.push({ date: i, isCurrentMonth: true, events })
  }

  // Next month days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ date: i, isCurrentMonth: false, events: [] })
  }

  return days
}

const monthNames = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
]

export function CalendarView() {
  const today = new Date()
  const [currentView, setCurrentView] = useState("Mois")
  const [selectedDate, setSelectedDate] = useState(today.getDate())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [filterOpen, setFilterOpen] = useState(false)

  const calendarDays = getCalendarDays(currentMonth, currentYear)

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((prev) => prev - 1)
    } else {
      setCurrentMonth((prev) => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((prev) => prev + 1)
    } else {
      setCurrentMonth((prev) => prev + 1)
    }
  }

  const handleViewChange = (view: string) => {
    setCurrentView(view)
  }

  const handleToday = () => {
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDate(today.getDate())
  }

  const handleFilter = () => {
    setFilterOpen(!filterOpen)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["Jour", "Semaine", "Mois"].map((view) => (
            <Button
              key={view}
              variant={currentView === view ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewChange(view)}
              className="text-xs font-medium transition-all"
            >
              {view}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleFilter}
            className="text-xs transition-all hover:bg-muted/50 bg-transparent"
          >
            <Filter className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Filtrer Par</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
            className="h-8 w-8 p-0 transition-all hover:bg-muted/50 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="h-8 w-8 p-0 transition-all hover:bg-muted/50 bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[150px] text-center text-foreground capitalize">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleToday}
            className="text-xs transition-all hover:bg-secondary/90"
          >
            Aujourd'hui
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 bg-card/30 p-4 rounded-lg border border-border/50">
        {/* Days of week header */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "min-h-[70px] sm:min-h-[90px] p-2 sm:p-3 border border-border/30 cursor-pointer rounded-md hover:bg-accent/50 transition-all duration-200 hover:border-primary/50",
              !day.isCurrentMonth && "text-muted-foreground bg-muted/10",
              day.date === selectedDate &&
                day.isCurrentMonth &&
                "bg-primary/15 border-primary/50 ring-2 ring-primary/20",
            )}
            onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
          >
            <div className="text-xs sm:text-sm font-semibold text-foreground">{day.date}</div>
            <div className="mt-1 space-y-1">
              {day.events.map((event, eventIndex) => (
                <Badge
                  key={eventIndex}
                  variant="secondary"
                  className={cn(
                    "text-xs px-1.5 py-0.5 h-5 text-[10px] sm:text-xs w-full text-center",
                    event.type === "meeting" && "bg-chart-1/20 text-chart-1",
                    event.type === "call" && "bg-chart-2/20 text-chart-2",
                    event.type === "training" && "bg-chart-4/20 text-chart-4",
                  )}
                >
                  <span className="truncate text-[9px] sm:text-xs">{event.title}</span>
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground text-center pt-2">
        {currentView === "Mois" && `Affichage: ${currentView} - ${monthNames[currentMonth]} ${currentYear}`}
        {currentView === "Semaine" &&
          `Affichage: ${currentView} (Semaine du ${selectedDate} ${monthNames[currentMonth]} ${currentYear})`}
        {currentView === "Jour" &&
          `Affichage: ${currentView} - ${selectedDate} ${monthNames[currentMonth]} ${currentYear}`}
      </div>
    </div>
  )
}
