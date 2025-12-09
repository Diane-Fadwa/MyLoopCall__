"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NavigationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Réglage Navigation</h1>
        <p className="text-muted-foreground mt-2">Personnalisez la navigation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu principal</CardTitle>
          <CardDescription>Réorganisez le menu de navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {["Tableau de bord", "Clients", "Prospects", "Réunions", "Finance", "Rapports"].map((item) => (
              <div key={item} className="flex items-center justify-between p-2 border rounded">
                <span>⋮⋮ {item}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    ↑
                  </Button>
                  <Button variant="outline" size="sm">
                    ↓
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
