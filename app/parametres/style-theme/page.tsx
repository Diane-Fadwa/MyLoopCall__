"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"

export default function StyleThemePage() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedColorTheme, setSelectedColorTheme] = useState("blue")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const colorThemes = [
    { id: "slate", name: "Slate", colors: ["#020617", "#0f172a", "#1e293b", "#334155", "#475569"] },
    { id: "blue", name: "Bleu", colors: ["#0c4a6e", "#0369a1", "#0ea5e9", "#38bdf8", "#7dd3fc"] },
    { id: "purple", name: "Violet", colors: ["#4c1d95", "#6d28d9", "#8b5cf6", "#a78bfa", "#ddd6fe"] },
    { id: "emerald", name: "Émeraude", colors: ["#064e3b", "#059669", "#10b981", "#34d399", "#a7f3d0"] },
    { id: "rose", name: "Rose", colors: ["#831843", "#be185d", "#ec4899", "#f472b6", "#fbcfe8"] },
    { id: "amber", name: "Ambre", colors: ["#78350f", "#b45309", "#f59e0b", "#fbbf24", "#fde68a"] },
    { id: "cyan", name: "Cyan", colors: ["#164e63", "#0891b2", "#06b6d4", "#22d3ee", "#cffafe"] },
    { id: "teal", name: "Sarcelle", colors: ["#134e4a", "#0d9488", "#14b8a6", "#2dd4bf", "#ccfbf1"] },
    { id: "indigo", name: "Indigo", colors: ["#312e81", "#4f46e5", "#6366f1", "#818cf8", "#e0e7ff"] },
    { id: "fuchsia", name: "Fuchsia", colors: ["#740a63", "#c2185b", "#ec407a", "#f48fb1", "#f8bbd0"] },
    { id: "orange", name: "Orange", colors: ["#7c2d12", "#ea580c", "#f97316", "#fb923c", "#fed7aa"] },
    { id: "lime", name: "Citron", colors: ["#365314", "#65a30d", "#84cc16", "#bef264", "#f4f235"] },
  ]

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Style et Thème</h1>
        <p className="text-muted-foreground mt-2">Personnalisez l'apparence de votre CRM</p>
      </div>

      {/* Mode Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Mode d'affichage
          </CardTitle>
          <CardDescription>Sélectionnez votre mode préféré</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setTheme("light")}
              variant={theme === "light" ? "default" : "outline"}
              className="gap-2"
            >
              <Sun className="w-4 h-4" />
              Mode Jour
            </Button>
            <Button
              onClick={() => setTheme("dark")}
              variant={theme === "dark" ? "default" : "outline"}
              className="gap-2"
            >
              <Moon className="w-4 h-4" />
              Mode Nuit
            </Button>
            <Button
              onClick={() => setTheme("system")}
              variant={theme === "system" ? "default" : "outline"}
              className="gap-2"
            >
              <Monitor className="w-4 h-4" />
              Auto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Colors Section */}
      <Card>
        <CardHeader>
          <CardTitle>Thèmes de couleurs</CardTitle>
          <CardDescription>Choisissez votre palette de couleurs préférée</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {colorThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedColorTheme(theme.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedColorTheme === theme.id
                    ? "border-primary shadow-lg ring-2 ring-primary/50"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="space-y-2">
                  <p className="font-medium text-sm">{theme.name}</p>
                  <div className="flex gap-1">
                    {theme.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Aperçu</CardTitle>
          <CardDescription>Voici comment votre thème actuel s'affiche</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-background border">
              <p className="text-xs text-muted-foreground mb-2">Arrière-plan</p>
              <p className="text-foreground font-medium">Texte principal</p>
            </div>
            <div className="p-4 rounded-lg bg-primary text-primary-foreground">
              <p className="text-xs opacity-75 mb-2">Primaire</p>
              <p className="font-medium">Boutons</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
              <p className="text-xs opacity-75 mb-2">Secondaire</p>
              <p className="font-medium">Éléments</p>
            </div>
            <div className="p-4 rounded-lg bg-success text-success-foreground">
              <p className="text-xs opacity-75 mb-2">Succès</p>
              <p className="font-medium">Valider</p>
            </div>
            <div className="p-4 rounded-lg bg-warning text-warning-foreground">
              <p className="text-xs opacity-75 mb-2">Avertissement</p>
              <p className="font-medium">Attention</p>
            </div>
            <div className="p-4 rounded-lg bg-destructive text-destructive-foreground">
              <p className="text-xs opacity-75 mb-2">Destructif</p>
              <p className="font-medium">Supprimer</p>
            </div>
            <div className="p-4 rounded-lg bg-accent text-accent-foreground">
              <p className="text-xs opacity-75 mb-2">Accent</p>
              <p className="font-medium">Mise en avant</p>
            </div>
            <div className="p-4 rounded-lg bg-muted text-muted-foreground">
              <p className="text-xs opacity-75 mb-2">Muet</p>
              <p className="font-medium">Inactif</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Settings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Paramètres actuels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span>Mode d'affichage</span>
              <span className="font-medium capitalize">{theme === "system" ? `Auto (${systemTheme})` : theme}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span>Thème de couleur</span>
              <span className="font-medium">{colorThemes.find((t) => t.id === selectedColorTheme)?.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
