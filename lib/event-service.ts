// Service for managing events in localStorage
import type { CalendarEvent, Notification } from "./event-types"

const EVENTS_KEY = "crm_events"
const NOTIFICATIONS_KEY = "crm_notifications"

export const eventService = {
  // Get all events
  getEvents: (): CalendarEvent[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(EVENTS_KEY)
    if (!data) return []
    try {
      return JSON.parse(data).map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }))
    } catch {
      return []
    }
  },

  // Add new event
  addEvent: (event: Omit<CalendarEvent, "id">): CalendarEvent => {
    const events = eventService.getEvents()
    const newEvent: CalendarEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    events.push(newEvent)
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))

    // Create notifications for this event
    eventService.createNotificationsForEvent(newEvent)

    return newEvent
  },

  // Update event
  updateEvent: (id: string, updates: Partial<CalendarEvent>): CalendarEvent | null => {
    const events = eventService.getEvents()
    const index = events.findIndex((e) => e.id === id)
    if (index === -1) return null

    const updated = { ...events[index], ...updates }
    events[index] = updated
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))

    // Remove old notifications and create new ones
    eventService.removeNotificationsForEvent(id)
    eventService.createNotificationsForEvent(updated)

    return updated
  },

  // Delete event
  deleteEvent: (id: string): boolean => {
    const events = eventService.getEvents()
    const filtered = events.filter((e) => e.id !== id)
    if (filtered.length === events.length) return false

    localStorage.setItem(EVENTS_KEY, JSON.stringify(filtered))
    eventService.removeNotificationsForEvent(id)
    return true
  },

  // Get events for a specific date
  getEventsForDate: (date: Date): CalendarEvent[] => {
    const events = eventService.getEvents()
    return events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  },

  // Create notifications for an event
  createNotificationsForEvent: (event: CalendarEvent) => {
    const notifications: Notification[] = []
    const eventDate = new Date(event.startDate)

    // Notification 1: 24 hours before
    const twentyFourHoursBefore = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000)

    notifications.push({
      id: `notif_${event.id}_day`,
      eventId: event.id,
      type: "day-before",
      status: "pending",
      scheduledFor: twentyFourHoursBefore,
      createdAt: new Date(),
    })

    // Notification 2: 15 minutes before
    const fifteenMinBefore = new Date(eventDate.getTime() - 15 * 60 * 1000)

    notifications.push({
      id: `notif_${event.id}_15min`,
      eventId: event.id,
      type: "fifteen-minutes-before",
      status: "pending",
      scheduledFor: fifteenMinBefore,
      createdAt: new Date(),
    })

    const allNotifications = eventService.getNotifications()
    allNotifications.push(...notifications)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications))
  },

  // Remove notifications for an event
  removeNotificationsForEvent: (eventId: string) => {
    const notifications = eventService.getNotifications()
    const filtered = notifications.filter((n) => n.eventId !== eventId)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered))
  },

  // Get all notifications
  getNotifications: (): Notification[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(NOTIFICATIONS_KEY)
    if (!data) return []
    try {
      return JSON.parse(data).map((notif: any) => ({
        ...notif,
        scheduledFor: new Date(notif.scheduledFor),
        createdAt: new Date(notif.createdAt),
      }))
    } catch {
      return []
    }
  },

  // Get pending notifications that should be triggered
  getPendingNotifications: (): Notification[] => {
    const notifications = eventService.getNotifications()
    const now = new Date()
    return notifications.filter((n) => n.status === "pending" && new Date(n.scheduledFor) <= now)
  },

  // Mark notification as sent
  markNotificationAsSent: (id: string) => {
    const notifications = eventService.getNotifications()
    const index = notifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications[index].status = "sent"
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
    }
  },

  // Dismiss notification
  dismissNotification: (id: string) => {
    const notifications = eventService.getNotifications()
    const index = notifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications[index].status = "dismissed"
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
    }
  },
}
