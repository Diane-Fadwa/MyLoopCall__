"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { EventDialog } from "@/components/event-dialog"
import { eventService } from "@/lib/event-service"
import type { CalendarEvent } from "@/lib/event-types"
import { prospectsService, type Prospect } from "@/lib/prospects-data"

const daysOfWeek = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."]

const convertProspectsToEvents = (prospects: Prospect[]): CalendarEvent[] => {
  return prospects.map((prospect) => {
    const [day, month, year] = prospect.rappelLe.split("/")
    const fullYear = year.length === 2 ? `20${year}` : year
    return {
      id: `prospect-${prospect.id}`,
      title: `${prospect.nom} ${prospect.prenom} - ${prospect.produit}`,
      startDate: `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
      endDate: `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
      type: "call",
      description: `Agent: ${prospect.agent}\nStatut: ${prospect.statut}\nHeure: ${prospect.heure}`,
    }
  })
}

const getCalendarDays = (month: number, year: number, events: CalendarEvent[]) => {
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
    const currentDate = new Date(year, month, i)
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return eventDate.getDate() === i && eventDate.getMonth() === month && eventDate.getFullYear() === year
    })
    days.push({ date: i, isCurrentMonth: true, events: dayEvents })
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
  const [eventDialogOpen, setEventDialogOpen] = useState(false)
  const [selectedDateForEvent, setSelectedDateForEvent] = useState<Date | undefined>()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>()
  const [isLoaded, setIsLoaded] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    const loadEvents = () => {
      const manualEvents = eventService.getEvents()
      const prospectEvents = convertProspectsToEvents(prospectsService.getProspects())
      setEvents([...manualEvents, ...prospectEvents])
    }

    loadEvents()
    setIsLoaded(true)

    const handleProspectsChange = () => loadEvents()
    window.addEventListener("prospectsChanged", handleProspectsChange)
    return () => window.removeEventListener("prospectsChanged", handleProspectsChange)
  }, [])

  const calendarDays = getCalendarDays(currentMonth, currentYear, events)

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

  const handleOpenEventDialog = (date: number) => {
    const eventDate = new Date(currentYear, currentMonth, date)
    setSelectedDateForEvent(eventDate)
    setSelectedEvent(undefined)
    setEventDialogOpen(true)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setEventDialogOpen(true)
  }

  const handleSaveEvent = (event: Omit<CalendarEvent, "id">) => {
    if (selectedEvent) {
      eventService.updateEvent(selectedEvent.id, event)
    } else {
      eventService.addEvent(event)
    }
    const manualEvents = eventService.getEvents()
    const prospectEvents = convertProspectsToEvents(prospectsService.getProspects())
    setEvents([...manualEvents, ...prospectEvents])
    setEventDialogOpen(false)
    setSelectedEvent(undefined)
  }

  const handleDeleteEvent = (eventId: string) => {
    eventService.deleteEvent(eventId)
    const manualEvents = eventService.getEvents()
    const prospectEvents = convertProspectsToEvents(prospectsService.getProspects())
    setEvents([...manualEvents, ...prospectEvents])
    setEventDialogOpen(false)
    setSelectedEvent(undefined)
  }

  if (!isLoaded) {
    return (
      <div className="space-y-6 min-h-[500px] flex items-center justify-center text-muted-foreground">
        Chargement...
      </div>
    )
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
              "min-h-[70px] sm:min-h-[90px] p-2 sm:p-3 border border-border/30 rounded-md hover:bg-accent/50 transition-all duration-200 hover:border-primary/50 cursor-pointer",
              !day.isCurrentMonth && "text-muted-foreground bg-muted/10",
              day.date === selectedDate &&
                day.isCurrentMonth &&
                "bg-primary/15 border-primary/50 ring-2 ring-primary/20",
            )}
            onClick={() => {
              if (day.isCurrentMonth) {
                setSelectedDate(day.date)
              }
              handleOpenEventDialog(day.date)
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs sm:text-sm font-semibold text-foreground">{day.date}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenEventDialog(day.date)
                }}
                className="text-muted-foreground hover:text-primary transition-colors opacity-0 hover:opacity-100"
                title="Ajouter un événement"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-1">
              {day.events.map((event) => (
                <Badge
                  key={event.id}
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditEvent(event)
                  }}
                  className={cn(
                    "text-xs px-1.5 py-0.5 h-5 text-[10px] sm:text-xs w-full text-center cursor-pointer hover:opacity-80",
                    event.type === "meeting" && "bg-chart-1/20 text-chart-1",
                    event.type === "call" && "bg-chart-2/20 text-chart-2",
                    event.type === "training" && "bg-chart-4/20 text-chart-4",
                    event.type === "other" && "bg-chart-3/20 text-chart-3",
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

      <EventDialog
        isOpen={eventDialogOpen}
        onClose={() => {
          setEventDialogOpen(false)
          setSelectedEvent(undefined)
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialDate={selectedDateForEvent}
        initialEvent={selectedEvent}
      />
    </div>
  )
}
