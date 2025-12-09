"use client"

import { useEffect, useState } from "react"
import { Bell, X } from "lucide-react"
import { eventService } from "@/lib/event-service"
import { notificationService } from "@/lib/notification-service"
import type { Notification } from "@/lib/event-types"

export function NotificationToast() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Request notification permission on mount
    notificationService.requestPermission()

    const checkNotifications = () => {
      const pending = eventService.getPendingNotifications()
      if (pending.length > 0) {
        setNotifications((prev) => {
          const newNotifs = pending.filter((p) => !prev.some((n) => n.id === p.id))
          newNotifs.forEach((n) => {
            eventService.markNotificationAsSent(n.id)

            notificationService.playNotificationSound()
            const event = eventService.getEvents().find((e) => e.id === n.eventId)
            const timeLabel = n.type === "day-before" ? "Demain" : "Dans 15 minutes"
            notificationService.showSystemNotification(`${timeLabel}: ${event?.title}`, {
              body: `Rappel pour ${event?.title}`,
              tag: n.id,
              requireInteraction: true,
            })
          })
          return [...prev, ...newNotifs]
        })
      }
    }

    checkNotifications()
    setIsLoaded(true)
    const interval = setInterval(checkNotifications, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    eventService.dismissNotification(id)
  }

  if (!isLoaded || notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-40">
      {notifications.map((notif) => {
        const event = eventService.getEvents().find((e) => e.id === notif.eventId)
        const timeLabel = notif.type === "day-before" ? "Demain" : "Dans 15 minutes"

        return (
          <div
            key={notif.id}
            className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-bottom"
          >
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{timeLabel}</p>
                <p className="text-sm opacity-90">{event?.title}</p>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
