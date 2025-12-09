"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ClientsParametresPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Paramètres Clients</h1>
          <p className="text-muted-foreground mt-2">Configurez les paramètres de gestion des clients</p>
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
            <CardDescription>Définissez les champs obligatoires lors de la création d'un client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Nom", "Email", "Téléphone", "Adresse", "Type de client"].map((field) => (
              <div key={field} className="flex items-center gap-2">
                <input type="checkbox" id={field} defaultChecked className="rounded" />
                <label htmlFor={field}>{field}</label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline de vente</CardTitle>
            <CardDescription>Définissez les étapes du pipeline pour les clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Lead", "Prospect", "Devis envoyé", "En négociation", "Client"].map((stage) => (
                <div key={stage} className="flex items-center justify-between p-2 border rounded">
                  <span>{stage}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Éditer
                    </Button>
                    <Button variant="outline" size="sm">
                      Supprimer
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
