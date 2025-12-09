"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function RolesPage() {
  const roles = [
    { id: 1, name: "Admin", description: "Accès complet au système" },
    { id: 2, name: "Manager", description: "Gestion des équipes et données" },
    { id: 3, name: "Utilisateur", description: "Accès en lecture et édition limitée" },
    { id: 4, name: "Consultant", description: "Accès en lecture seule" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rôles</h1>
          <p className="text-muted-foreground mt-2">Gérez les rôles et les permissions</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau rôle
        </Button>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{role.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
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
