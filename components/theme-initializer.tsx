"use client"

import { useEffect } from "react"
import { useColorTheme } from "@/hooks/use-color-theme"

export function ThemeInitializer() {
  const { mounted } = useColorTheme()

  useEffect(() => {
    if (!mounted) return

    const saved = localStorage.getItem("crm-color-theme") || "blue"
    const event = new CustomEvent("theme-changed", { detail: saved })
    window.dispatchEvent(event)
  }, [mounted])

  return null
}
