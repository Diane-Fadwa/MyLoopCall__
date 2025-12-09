"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ConfigurationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configuration</h1>
        <p className="text-muted-foreground mt-2">Paramètres généraux de l'application</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'entreprise</CardTitle>
            <CardDescription>Données générales de votre entreprise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom de l'entreprise</label>
              <input type="text" placeholder="Nom" className="w-full mt-2 px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Email de contact</label>
              <input type="email" placeholder="email@example.com" className="w-full mt-2 px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="text-sm font-medium">Téléphone</label>
              <input type="tel" placeholder="+33 1 23 45 67 89" className="w-full mt-2 px-3 py-2 border rounded" />
            </div>
            <Button>Enregistrer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>Paramètres de sécurité de votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Changer mon mot de passe</Button>
            <Button variant="outline">Authentification à deux facteurs</Button>
            <Button variant="outline">Sessions actives</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
