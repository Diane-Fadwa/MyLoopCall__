"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support</h1>
          <p className="text-muted-foreground mt-2">Gérez les paramètres de support</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter catégorie
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Catégories de tickets</CardTitle>
            <CardDescription>Gérez les catégories de support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Bug", "Demande", "Facturation", "Accès", "Autre"].map((category) => (
                <div key={category} className="flex items-center justify-between p-2 border rounded">
                  <span>{category}</span>
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

        <Card>
          <CardHeader>
            <CardTitle>Priorités</CardTitle>
            <CardDescription>Niveaux de priorité pour les tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Basse", "Normale", "Élevée", "Critique"].map((priority) => (
                <div key={priority} className="flex items-center justify-between p-2 border rounded">
                  <span>{priority}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Modifier
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
