"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { type Produit, getProduits, saveProduits } from "@/lib/admin-data"

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([])

  useEffect(() => {
    setProduits(getProduits())
  }, [])

  useEffect(() => {
    if (produits.length > 0) {
      saveProduits(produits)
      window.dispatchEvent(new Event("adminDataChanged"))
    }
  }, [produits])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null)
  const [formData, setFormData] = useState({ nom: "", code: "", description: "" })

  const handleAdd = () => {
    setEditingProduit(null)
    setFormData({ nom: "", code: "", description: "" })
    setIsModalOpen(true)
  }

  const handleEdit = (produit: Produit) => {
    setEditingProduit(produit)
    setFormData({ nom: produit.nom, code: produit.code, description: produit.description })
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setProduits(produits.filter((p) => p.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduit) {
      setProduits(produits.map((p) => (p.id === editingProduit.id ? { ...p, ...formData } : p)))
    } else {
      const newId = Math.max(...produits.map((p) => p.id), 0) + 1
      setProduits([...produits, { id: newId, ...formData }])
    }
    setIsModalOpen(false)
    setFormData({ nom: "", code: "", description: "" })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter un produit
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {produits.map((produit) => (
              <tr key={produit.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{produit.nom}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{produit.code}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{produit.description}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleEdit(produit)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(produit.id)} className="text-red-600 hover:text-red-900">
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
            <h2 className="text-xl font-bold mb-4">{editingProduit ? "Modifier le produit" : "Ajouter un produit"}</h2>
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
                  <label className="block text-sm font-medium mb-1">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
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
                  {editingProduit ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
