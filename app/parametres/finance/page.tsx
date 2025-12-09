"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function FinancePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Finance</h1>
          <p className="text-muted-foreground mt-2">Gérez les paramètres financiers</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter paramètre
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration de facturation</CardTitle>
            <CardDescription>Paramètres généraux de facturation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Devise</label>
              <select className="w-full mt-2 px-3 py-2 border rounded">
                <option>EUR €</option>
                <option>USD $</option>
                <option>GBP £</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">TVA par défaut</label>
              <input
                type="number"
                placeholder="20"
                className="w-full mt-2 px-3 py-2 border rounded"
                defaultValue="20"
              />
            </div>
            <Button>Enregistrer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conditions de paiement</CardTitle>
            <CardDescription>Délais de paiement et modalités</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Net 30", "Net 60", "Immédiat", "À la commande"].map((term) => (
              <div key={term} className="flex items-center justify-between p-2 border rounded">
                <span>{term}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm">
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
