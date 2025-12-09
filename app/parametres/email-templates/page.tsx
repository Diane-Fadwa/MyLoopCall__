"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function EmailsPage() {
  const templates = [
    { id: 1, name: "Bienvenue client", subject: "Bienvenue chez nous" },
    { id: 2, name: "Confirmation devis", subject: "Votre devis #{{number}}" },
    { id: 3, name: "Rappel paiement", subject: "Facture à régler" },
    { id: 4, name: "Ticket support", subject: "Ticket support créé #{{id}}" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Modèles d'emails</h1>
          <p className="text-muted-foreground mt-2">Gérez les modèles d'emails</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau modèle
        </Button>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Objet: {template.subject}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
