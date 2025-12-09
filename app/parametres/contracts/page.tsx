"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function ContratsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contrats</h1>
          <p className="text-muted-foreground mt-2">Gérez les paramètres des contrats</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau modèle
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Types de contrats</CardTitle>
            <CardDescription>Définissez les types de contrats disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Service", "Maintenance", "Support", "Licence", "Partenariat"].map((type) => (
                <div key={type} className="flex items-center justify-between p-2 border rounded">
                  <span>{type}</span>
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
            <CardTitle>Modèles de contrats</CardTitle>
            <CardDescription>Gérez les modèles disponibles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Modèle Standard", "Modèle Premium", "Modèle OEM"].map((template) => (
              <div key={template} className="flex items-center justify-between p-2 border rounded">
                <span>{template}</span>
                <Button variant="outline" size="sm">
                  Utiliser
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
