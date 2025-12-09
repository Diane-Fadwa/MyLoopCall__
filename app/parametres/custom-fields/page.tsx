"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2 } from "lucide-react"

const customFields = [
  { name: "Secteur d'activité", type: "Select", module: "Clients" },
  { name: "Taille de l'entreprise", type: "Select", module: "Clients" },
  { name: "Source du lead", type: "Select", module: "Prospects" },
  { name: "Budget estimé", type: "Nombre", module: "Prospects" },
  { name: "Date préférence contact", type: "Date", module: "Prospects" },
]

export default function CustomFieldsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Champs personnalisés</h1>
          <p className="text-muted-foreground mt-2">Créez des champs adaptés à vos besoins</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un champ
        </Button>
      </div>

      <div className="space-y-3">
        {customFields.map((field) => (
          <Card key={field.name}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{field.name}</p>
                <p className="text-sm text-muted-foreground">
                  {field.type} • Module: {field.module}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
