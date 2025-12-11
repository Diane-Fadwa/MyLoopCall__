"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { getRoles, saveRoles, type Role } from "@/lib/admin-data"

const AVAILABLE_PAGES = [
  "Tableau de bord",
  "Clients",
  "Commercial",
  "Prospects",
  "Utilitaires",
  "Rapports",
  "Paramètres",
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    permissions: AVAILABLE_PAGES.map((page) => ({ page, canView: false, canEdit: false })),
  })

  useEffect(() => {
    setRoles(getRoles())
  }, [])

  const handleAdd = () => {
    setEditingRole(null)
    setFormData({
      nom: "",
      description: "",
      permissions: AVAILABLE_PAGES.map((page) => ({ page, canView: false, canEdit: false })),
    })
    setShowModal(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      nom: role.nom,
      description: role.description,
      permissions: role.permissions,
    })
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
      const updatedRoles = roles.filter((r) => r.id !== id)
      setRoles(updatedRoles)
      saveRoles(updatedRoles)
    }
  }

  const handleSubmit = () => {
    if (!formData.nom.trim()) {
      alert("Le nom du rôle est requis")
      return
    }

    let updatedRoles: Role[]
    if (editingRole) {
      updatedRoles = roles.map((r) =>
        r.id === editingRole.id
          ? { ...editingRole, nom: formData.nom, description: formData.description, permissions: formData.permissions }
          : r,
      )
    } else {
      const newRole: Role = {
        id: Math.max(0, ...roles.map((r) => r.id)) + 1,
        nom: formData.nom,
        description: formData.description,
        permissions: formData.permissions,
      }
      updatedRoles = [...roles, newRole]
    }

    setRoles(updatedRoles)
    saveRoles(updatedRoles)
    setShowModal(false)
  }

  const handlePermissionChange = (page: string, field: "canView" | "canEdit", value: boolean) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.map((p) => (p.page === page ? { ...p, [field]: value } : p)),
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rôles</h1>
          <p className="text-muted-foreground mt-2">Gérez les rôles et les permissions</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau rôle
        </Button>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{role.nom}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(role)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(role.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">Permissions</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {role.permissions.map((perm) => (
                    <div key={perm.page} className="flex items-center gap-2">
                      <span className="text-muted-foreground">{perm.page}:</span>
                      <span>{perm.canEdit ? "Lecture/Écriture" : perm.canView ? "Lecture seule" : "Aucun accès"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">{editingRole ? "Modifier le rôle" : "Nouveau rôle"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom du rôle</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex: Chef de projet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Description du rôle..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-medium">Page</th>
                        <th className="text-center p-3 font-medium">Lecture</th>
                        <th className="text-center p-3 font-medium">Écriture</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.permissions.map((perm) => (
                        <tr key={perm.page} className="border-t">
                          <td className="p-3">{perm.page}</td>
                          <td className="text-center p-3">
                            <input
                              type="checkbox"
                              checked={perm.canView}
                              onChange={(e) => handlePermissionChange(perm.page, "canView", e.target.checked)}
                              className="w-4 h-4"
                            />
                          </td>
                          <td className="text-center p-3">
                            <input
                              type="checkbox"
                              checked={perm.canEdit}
                              onChange={(e) => handlePermissionChange(perm.page, "canEdit", e.target.checked)}
                              className="w-4 h-4"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-2 sticky bottom-0 bg-white">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>Enregistrer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
