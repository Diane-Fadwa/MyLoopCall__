"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { getInstallateurs, saveInstallateurs } from "@/lib/admin-data"

export default function InstallateursPage() {
  const [installateurs, setInstallateurs] = useState<any[]>([])

  useEffect(() => {
    setInstallateurs(getInstallateurs())
  }, [])

  useEffect(() => {
    if (installateurs.length > 0) {
      saveInstallateurs(installateurs)
      window.dispatchEvent(new Event("adminDataChanged"))
    }
  }, [installateurs])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInstallateur, setEditingInstallateur] = useState<any | null>(null)
  const [formData, setFormData] = useState({ nom: "", specialite: "", email: "", telephone: "", ville: "" })

  const handleAdd = () => {
    setEditingInstallateur(null)
    setFormData({ nom: "", specialite: "", email: "", telephone: "", ville: "" })
    setIsModalOpen(true)
  }

  const handleEdit = (installateur: any) => {
    setEditingInstallateur(installateur)
    setFormData({
      nom: installateur.nom,
      specialite: installateur.specialite,
      email: installateur.email,
      telephone: installateur.telephone,
      ville: installateur.ville,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet installateur ?")) {
      setInstallateurs(installateurs.filter((i) => i.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingInstallateur) {
      setInstallateurs(installateurs.map((i) => (i.id === editingInstallateur.id ? { ...i, ...formData } : i)))
    } else {
      const newId = Math.max(...installateurs.map((i) => i.id), 0) + 1
      setInstallateurs([...installateurs, { id: newId, ...formData }])
    }
    setIsModalOpen(false)
    setFormData({ nom: "", specialite: "", email: "", telephone: "", ville: "" })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Installateurs</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter un installateur
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {installateurs.map((installateur) => (
              <tr key={installateur.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{installateur.nom}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{installateur.specialite}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{installateur.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{installateur.telephone}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{installateur.ville}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleEdit(installateur)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(installateur.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingInstallateur ? "Modifier l'installateur" : "Ajouter un installateur"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Spécialité</label>
                  <input
                    type="text"
                    value={formData.specialite}
                    onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingInstallateur ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
