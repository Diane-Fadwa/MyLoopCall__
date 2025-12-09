"use client"

import { useColorTheme } from "@/hooks/use-color-theme"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"

export default function StyleThemePage() {
  const { theme, setTheme, systemTheme } = useTheme()
  const { currentPalette, selectPalette, colorPalettes, mounted } = useColorTheme()
  const [renderClient, setRenderClient] = useState(false)

  useEffect(() => {
    setRenderClient(true)
  }, [])

  if (!renderClient || !mounted) return null

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Style et Thème</h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Personnalisez l'apparence complète de votre CRM en temps réel
        </p>
      </div>

      {/* Mode Section */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Mode d'affichage
          </CardTitle>
          <CardDescription>Sélectionnez votre préférence d'affichage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setTheme("light")}
              variant={theme === "light" ? "default" : "outline"}
              className="gap-2 h-12 px-6"
              size="lg"
            >
              <Sun className="w-5 h-5" />
              Mode Jour
            </Button>
            <Button
              onClick={() => setTheme("dark")}
              variant={theme === "dark" ? "default" : "outline"}
              className="gap-2 h-12 px-6"
              size="lg"
            >
              <Moon className="w-5 h-5" />
              Mode Nuit
            </Button>
            <Button
              onClick={() => setTheme("system")}
              variant={theme === "system" ? "default" : "outline"}
              className="gap-2 h-12 px-6"
              size="lg"
            >
              <Monitor className="w-5 h-5" />
              Auto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Color Palettes Section */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Palettes de couleurs</CardTitle>
          <CardDescription>Sélectionnez votre thème de couleur préféré (changements en temps réel)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorPalettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => selectPalette(palette.id)}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                  ${
                    currentPalette === palette.id
                      ? "border-primary shadow-lg ring-2 ring-primary/50 scale-105"
                      : "border-border hover:border-primary/50 hover:shadow-md"
                  }
                `}
              >
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-base">{palette.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {palette.id}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: palette.primary }}
                      title="Couleur primaire"
                    />
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: palette.success }}
                      title="Succès"
                    />
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: palette.warning }}
                      title="Avertissement"
                    />
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-border shadow-sm"
                      style={{ backgroundColor: palette.destructive }}
                      title="Destructif"
                    />
                  </div>

                  {currentPalette === palette.id && (
                    <div className="pt-2 text-xs font-semibold text-primary">✓ Thème actif</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Aperçu en direct</CardTitle>
          <CardDescription>
            Visualisez comment votre thème s'applique à tous les éléments de l'interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-background border-2 border-border shadow-sm">
              <p className="text-xs text-muted-foreground font-semibold mb-2">Arrière-plan</p>
              <p className="text-foreground font-medium text-sm">Texte principal</p>
            </div>
            <div className="p-4 rounded-lg bg-primary text-primary-foreground shadow-sm">
              <p className="text-xs opacity-75 mb-2 font-semibold">Primaire</p>
              <p className="font-medium text-sm">Boutons</p>
            </div>
            <div className="p-4 rounded-lg bg-success text-success-foreground shadow-sm">
              <p className="text-xs opacity-75 mb-2 font-semibold">Succès</p>
              <p className="font-medium text-sm">Valider</p>
            </div>
            <div className="p-4 rounded-lg bg-warning text-warning-foreground shadow-sm">
              <p className="text-xs opacity-75 mb-2 font-semibold">Avertissement</p>
              <p className="font-medium text-sm">Attention</p>
            </div>
            <div className="p-4 rounded-lg bg-destructive text-destructive-foreground shadow-sm">
              <p className="text-xs opacity-75 mb-2 font-semibold">Destructif</p>
              <p className="font-medium text-sm">Supprimer</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary text-secondary-foreground shadow-sm">
              <p className="text-xs opacity-75 mb-2 font-semibold">Secondaire</p>
              <p className="font-medium text-sm">Éléments</p>
            </div>
            <div className="p-4 rounded-lg bg-accent text-accent-foreground shadow-sm">
              <p className="text-xs opacity-75 mb-2 font-semibold">Accent</p>
              <p className="font-medium text-sm">Mise en avant</p>
            </div>
            <div className="p-4 rounded-lg bg-card text-card-foreground border-2 border-border shadow-sm">
              <p className="text-xs opacity-75 mb-2 font-semibold">Carte</p>
              <p className="font-medium text-sm">Conteneur</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Settings */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle>Paramètres actuels</CardTitle>
          <CardDescription>Votre configuration active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-4 bg-background rounded-lg border-2 border-border">
              <span className="font-medium">Mode d'affichage</span>
              <span className="text-primary font-semibold capitalize">
                {theme === "system" ? `Auto (${systemTheme})` : theme}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-background rounded-lg border-2 border-border">
              <span className="font-medium">Thème de couleur</span>
              <span className="text-primary font-semibold">
                {colorPalettes.find((t) => t.id === currentPalette)?.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
