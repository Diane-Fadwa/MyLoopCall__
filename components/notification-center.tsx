"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { eventService } from "@/lib/event-service"
import type { Notification } from "@/lib/event-types"

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = eventService.getNotifications()
      setNotifications(allNotifications)
      const unread = allNotifications.filter((n) => n.status === "pending").length
      setUnreadCount(unread)
    }

    loadNotifications()
    setIsLoaded(true)
    const interval = setInterval(loadNotifications, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleDismiss = (id: string) => {
    eventService.dismissNotification(id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getEventTitle = (eventId: string) => {
    const event = eventService.getEvents().find((e) => e.id === eventId)
    return event?.title || "Événement"
  }

  const getNotificationMessage = (notification: Notification) => {
    const title = getEventTitle(notification.eventId)
    if (notification.type === "day-before") {
      return `${title} - Demain`
    } else {
      return `${title} - Dans 15 minutes`
    }
  }

  if (!isLoaded) return null

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-card border border-border rounded-lg shadow-lg z-50 overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Pas de notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 hover:bg-muted/50 transition-colors flex items-start justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {getNotificationMessage(notification)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.type === "day-before" ? "Rappel : demain" : "Rappel : dans 15 minutes"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDismiss(notification.id)}
                    className="text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
