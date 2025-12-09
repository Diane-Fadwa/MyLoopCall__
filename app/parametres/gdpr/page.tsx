"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function GDPRPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">GDPR</h1>
        <p className="text-muted-foreground mt-2">Gérez la conformité GDPR</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Politique de confidentialité</CardTitle>
            <CardDescription>Configurez votre politique de conformité</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Consentement obligatoire</label>
              <select className="w-full mt-2 px-3 py-2 border rounded">
                <option>Oui</option>
                <option>Non</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Durée de conservation (jours)</label>
              <input
                type="number"
                placeholder="365"
                className="w-full mt-2 px-3 py-2 border rounded"
                defaultValue="365"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestion des données</CardTitle>
            <CardDescription>Outils de gestion des données personnelles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full bg-transparent">
              Exporter les données GDPR
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Supprimer les données GDPR
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Générer rapport conformité
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
