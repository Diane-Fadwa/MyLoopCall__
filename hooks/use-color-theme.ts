"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export interface ColorPalette {
  id: string
  name: string
  primary: string
  primaryForeground: string
  secondary: string
  accent: string
  success: string
  warning: string
  destructive: string
  border: string
  background: string
  foreground: string
  card: string
  muted: string
  sidebarBg: string
  sidebarForeground: string
}

const colorPalettes: ColorPalette[] = [
  {
    id: "blue",
    name: "Bleu Professionnel",
    primary: "#2563eb",
    primaryForeground: "#ffffff",
    secondary: "#f0f9ff",
    accent: "#f0f4f8",
    success: "#16a34a",
    warning: "#eab308",
    destructive: "#dc2626",
    border: "#e5e7eb",
    background: "#ffffff",
    foreground: "#1f2937",
    card: "#ffffff",
    muted: "#f3f4f6",
    sidebarBg: "#1e293b",
    sidebarForeground: "#f1f5f9",
  },
  {
    id: "purple",
    name: "Violet Premium",
    primary: "#7c3aed",
    primaryForeground: "#ffffff",
    secondary: "#f5f3ff",
    accent: "#faf5ff",
    success: "#16a34a",
    warning: "#eab308",
    destructive: "#dc2626",
    border: "#e9d5ff",
    background: "#ffffff",
    foreground: "#1f2937",
    card: "#ffffff",
    muted: "#faf5ff",
    sidebarBg: "#2d1b4e",
    sidebarForeground: "#f1f5f9",
  },
  {
    id: "emerald",
    name: "Émeraude Moderne",
    primary: "#059669",
    primaryForeground: "#ffffff",
    secondary: "#f0fdf4",
    accent: "#ecfdf5",
    success: "#16a34a",
    warning: "#eab308",
    destructive: "#dc2626",
    border: "#d1fae5",
    background: "#ffffff",
    foreground: "#1f2937",
    card: "#ffffff",
    muted: "#f0fdf4",
    sidebarBg: "#064e3b",
    sidebarForeground: "#f1f5f9",
  },
  {
    id: "rose",
    name: "Rose Élégant",
    primary: "#e11d48",
    primaryForeground: "#ffffff",
    secondary: "#ffe4e6",
    accent: "#fff1f2",
    success: "#16a34a",
    warning: "#eab308",
    destructive: "#dc2626",
    border: "#fbcfe8",
    background: "#ffffff",
    foreground: "#1f2937",
    card: "#ffffff",
    muted: "#fff1f2",
    sidebarBg: "#500724",
    sidebarForeground: "#f1f5f9",
  },
  {
    id: "indigo",
    name: "Indigo Sophistiqué",
    primary: "#4f46e5",
    primaryForeground: "#ffffff",
    secondary: "#eef2ff",
    accent: "#f5f3ff",
    success: "#16a34a",
    warning: "#eab308",
    destructive: "#dc2626",
    border: "#e0e7ff",
    background: "#ffffff",
    foreground: "#1f2937",
    card: "#ffffff",
    muted: "#eef2ff",
    sidebarBg: "#312e81",
    sidebarForeground: "#f1f5f9",
  },
  {
    id: "cyan",
    name: "Cyan Moderne",
    primary: "#0891b2",
    primaryForeground: "#ffffff",
    secondary: "#ecf0f1",
    accent: "#f0f9fa",
    success: "#16a34a",
    warning: "#eab308",
    destructive: "#dc2626",
    border: "#cffafe",
    background: "#ffffff",
    foreground: "#1f2937",
    card: "#ffffff",
    muted: "#f0f9fa",
    sidebarBg: "#164e63",
    sidebarForeground: "#f1f5f9",
  },
]

export function useColorTheme() {
  const [currentPalette, setCurrentPalette] = useState<string>("blue")
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const saved = localStorage.getItem("crm-color-theme")
    if (saved) {
      setCurrentPalette(saved)
      applyTheme(saved, theme)
    } else {
      applyTheme("blue", theme)
    }
    setMounted(true)
  }, [theme])

  const applyTheme = (paletteId: string, currentTheme?: string) => {
    const palette = colorPalettes.find((p) => p.id === paletteId)
    if (!palette) return

    const root = document.documentElement
    const isDark =
      currentTheme === "dark" ||
      (currentTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    root.style.setProperty("--primary", palette.primary)
    root.style.setProperty("--primary-foreground", palette.primaryForeground)
    root.style.setProperty("--secondary", palette.secondary)
    root.style.setProperty("--accent", palette.accent)
    root.style.setProperty("--success", palette.success)
    root.style.setProperty("--warning", palette.warning)
    root.style.setProperty("--destructive", palette.destructive)
    root.style.setProperty("--border", palette.border)
    root.style.setProperty("--card", palette.card)
    root.style.setProperty("--muted", palette.muted)

    if (isDark) {
      root.style.setProperty("--sidebar", palette.sidebarBg)
      root.style.setProperty("--sidebar-foreground", palette.sidebarForeground)
      root.style.setProperty("--sidebar-primary", palette.primary)
      root.style.setProperty("--sidebar-accent", `${palette.primary}20`)
    } else {
      root.style.setProperty("--sidebar", palette.sidebarBg)
      root.style.setProperty("--sidebar-foreground", palette.sidebarForeground)
      root.style.setProperty("--sidebar-primary", palette.primary)
      root.style.setProperty("--sidebar-accent", `${palette.primary}15`)
    }
  }

  const selectPalette = (paletteId: string) => {
    setCurrentPalette(paletteId)
    localStorage.setItem("crm-color-theme", paletteId)
    applyTheme(paletteId, theme)
  }

  return {
    currentPalette,
    selectPalette,
    colorPalettes,
    mounted,
  }
}
