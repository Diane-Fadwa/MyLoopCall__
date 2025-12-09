"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit } from "lucide-react"

export default function CollaborateursPage() {
  const collaborateurs = [
    { id: 1, name: "Jean Dupont", role: "Admin", email: "jean@example.com" },
    { id: 2, name: "Marie Martin", role: "Manager", email: "marie@example.com" },
    { id: 3, name: "Pierre Bernard", role: "Utilisateur", email: "pierre@example.com" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Collaborateurs</h1>
          <p className="text-muted-foreground mt-2">Gérez les utilisateurs et les droits d'accès</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter collaborateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des collaborateurs</CardTitle>
          <CardDescription>Gérez les accès et les rôles des utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Nom</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Rôle</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collaborateurs.map((collab) => (
                  <tr key={collab.id} className="border-b hover:bg-muted/50">
                    <td className="py-2">{collab.name}</td>
                    <td className="py-2">{collab.email}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 rounded bg-muted text-xs">{collab.role}</span>
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
