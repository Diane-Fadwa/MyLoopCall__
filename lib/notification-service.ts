// Service for browser notifications and audio alerts
export const notificationService = {
    // Request notification permission
    requestPermission: async (): Promise<boolean> => {
      if (typeof window === "undefined") return false
      if (!("Notification" in window)) return false
  
      if (Notification.permission === "granted") return true
      if (Notification.permission === "denied") return false
  
      const permission = await Notification.requestPermission()
      return permission === "granted"
    },
  
    // Show system notification
    showSystemNotification: (title: string, options?: NotificationOptions) => {
      if (typeof window === "undefined") return
      if (!("Notification" in window)) return
  
      if (Notification.permission === "granted") {
        new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          ...options,
        })
      }
    },
  
    // Play notification sound
    playNotificationSound: () => {
      if (typeof window === "undefined") return
  
      try {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
  
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
  
        // Set sound properties
        oscillator.frequency.value = 800 // Frequency in Hz
        oscillator.type = "sine"
  
        // Fade in
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1)
  
        // Fade out
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5)
  
        // Play the beep
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } catch {
        // Fallback: silent if Web Audio API fails
        console.log("[v0] Could not play notification sound")
      }
    },
  }
  