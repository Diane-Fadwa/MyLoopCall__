"use client"

import type React from "react"
import { Trash2, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CalendarEvent } from "@/lib/event-types"

interface EventDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<CalendarEvent, "id">) => void
  onDelete?: (eventId: string) => void
  initialDate?: Date
  initialEvent?: CalendarEvent
}

export function EventDialog({ isOpen, onClose, onSave, onDelete, initialDate, initialEvent }: EventDialogProps) {
  const [title, setTitle] = useState(initialEvent?.title || "")
  const [description, setDescription] = useState(initialEvent?.description || "")
  const [type, setType] = useState<CalendarEvent["type"]>(initialEvent?.type || "meeting")
  const [location, setLocation] = useState(initialEvent?.location || "")
  const [assignedTo, setAssignedTo] = useState(initialEvent?.assignedTo || "")

  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")

  useEffect(() => {
    if (!isOpen) return

    let start: Date
    let end: Date

    if (initialEvent) {
      start = new Date(initialEvent.startDate)
      end = new Date(initialEvent.endDate)
    } else if (initialDate) {
      start = new Date(initialDate)
      start.setHours(9, 0, 0, 0)
      end = new Date(initialDate)
      end.setHours(10, 0, 0, 0)
    } else {
      start = new Date()
      start.setHours(9, 0, 0, 0)
      end = new Date()
      end.setHours(10, 0, 0, 0)
    }

    setStartDate(start.toISOString().split("T")[0])
    setStartTime(start.toTimeString().slice(0, 5))
    setEndDate(end.toISOString().split("T")[0])
    setEndTime(end.toTimeString().slice(0, 5))
  }, [isOpen, initialEvent, initialDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Le titre est requis")
      return
    }

    const start = new Date(`${startDate}T${startTime}`)
    const end = new Date(`${endDate}T${endTime}`)

    if (end <= start) {
      alert("La date/heure de fin doit être après le début")
      return
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      type,
      location: location.trim(),
      assignedTo: assignedTo.trim(),
      startDate: start,
      endDate: end,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setType("meeting")
    setLocation("")
    setAssignedTo("")
    onClose()
  }

  const handleDelete = () => {
    if (initialEvent && window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      onDelete?.(initialEvent.id)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background">
          <h2 className="text-xl font-semibold text-foreground">
            {initialEvent ? "Modifier l'événement" : "Créer un événement"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Titre *</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'événement"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails supplémentaires..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Type and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CalendarEvent["type"])}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="meeting">Réunion</option>
                <option value="call">Appel</option>
                <option value="training">Formation</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Lieu</label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lieu ou visioconférence"
                className="w-full"
              />
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Assigné à</label>
            <Input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Nom de la personne"
              className="w-full"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date de début</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Heure de début</label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date de fin</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Heure de fin</label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {initialEvent && onDelete && (
              <Button type="button" variant="destructive" onClick={handleDelete} className="flex-0">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Annuler
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground">
              {initialEvent ? "Mettre à jour" : "Créer l'événement"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
