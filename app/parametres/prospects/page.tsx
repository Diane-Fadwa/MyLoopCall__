"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function ProspectsParametresPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prospects</h1>
          <p className="text-muted-foreground mt-2">Gérez les paramètres des prospects</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau paramètre
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Champs obligatoires</CardTitle>
            <CardDescription>Définissez les champs obligatoires pour les prospects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Nom", "Entreprise", "Email", "Téléphone", "Source"].map((field) => (
              <div key={field} className="flex items-center gap-2">
                <input type="checkbox" id={`prospect-${field}`} defaultChecked className="rounded" />
                <label htmlFor={`prospect-${field}`}>{field}</label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sources de prospects</CardTitle>
            <CardDescription>Gérez les sources d'acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Site web", "Recommandation", "Appel sortant", "Salon professionnel", "Autre"].map((source) => (
                <div key={source} className="flex items-center justify-between p-2 border rounded">
                  <span>{source}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
