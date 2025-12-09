"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ModulesPage() {
  const modules = [
    { name: "Gestion Clients", active: true, description: "Module principal de gestion des clients" },
    { name: "Gestion Prospects", active: true, description: "Suivi et conversion des prospects" },
    { name: "Gestion Contrats", active: true, description: "Gestion des contrats et documents" },
    { name: "Finance", active: true, description: "Facturation et suivi financier" },
    { name: "Support Ticket", active: false, description: "Système de ticketing support" },
    { name: "Analytics", active: false, description: "Rapports et tableaux de bord avancés" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Modules</h1>
        <p className="text-muted-foreground mt-2">Gérez les modules disponibles</p>
      </div>

      <div className="grid gap-4">
        {modules.map((module) => (
          <Card key={module.name}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{module.name}</h3>
                    <Badge variant={module.active ? "default" : "secondary"}>
                      {module.active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
