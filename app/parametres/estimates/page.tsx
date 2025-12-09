"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function EstimatePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Demandes de devis</h1>
          <p className="text-muted-foreground mt-2">Gérez les demandes de devis</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter modèle
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Champs du formulaire</CardTitle>
            <CardDescription>Configurez les champs du formulaire de devis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Nom entreprise", "Contact", "Email", "Téléphone", "Description projet", "Budget"].map((field) => (
              <div key={field} className="flex items-center gap-2">
                <input type="checkbox" id={`estimate-${field}`} defaultChecked className="rounded" />
                <label htmlFor={`estimate-${field}`}>{field}</label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Délais de traitement</CardTitle>
            <CardDescription>Configuration des délais de réponse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Délai standard (jours)</label>
              <input type="number" placeholder="3" className="w-full mt-2 px-3 py-2 border rounded" defaultValue="3" />
            </div>
            <div>
              <label className="text-sm font-medium">Délai urgent (jours)</label>
              <input type="number" placeholder="1" className="w-full mt-2 px-3 py-2 border rounded" defaultValue="1" />
            </div>
            <Button>Enregistrer</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
