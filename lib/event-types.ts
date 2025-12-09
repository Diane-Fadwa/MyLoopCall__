// Type definitions for events and notifications
export interface CalendarEvent {
    id: string
    title: string
    description?: string
    type: "meeting" | "call" | "training" | "other"
    startDate: Date
    endDate: Date
    location?: string
    assignedTo?: string
  }
  
  export interface Notification {
    id: string
    eventId: string
    type: "day-before" | "fifteen-minutes-before"
    status: "pending" | "sent" | "dismissed"
    scheduledFor: Date
    createdAt: Date
  }
  