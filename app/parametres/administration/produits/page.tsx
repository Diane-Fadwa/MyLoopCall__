"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import {
  type ProduitDTO,
  getAllProduitsPaginated,
  createProduit,
  updateProduit,
  deleteProduit,
} from "@/lib/api/produits-api"

export default function ProduitsPage() {
  const [produits, setProduits] = useState<ProduitDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(50)
  const [sortBy, setSortBy] = useState("nom")
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("ASC")

  useEffect(() => {
    loadProduits()
  }, [currentPage, pageSize, sortBy, sortDir])

  const loadProduits = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAllProduitsPaginated(currentPage, pageSize, sortBy, sortDir)
      if (data && data.content) {
        setProduits(data.content)
        setTotalPages(data.totalPages || 0)
        setTotalElements(data.totalElements || 0)
      } else {
        console.warn("[v0] Invalid data structure received:", data)
        setProduits([])
        setTotalPages(0)
        setTotalElements(0)
      }
      window.dispatchEvent(new Event("adminDataChanged"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des produits")
      console.error("[v0] Error loading produits:", err)
      setProduits([])
    } finally {
      setIsLoading(false)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduit, setEditingProduit] = useState<ProduitDTO | null>(null)
  const [formData, setFormData] = useState({ nom: "", code: "", description: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = () => {
    setEditingProduit(null)
    setFormData({ nom: "", code: "", description: "" })
    setIsModalOpen(true)
  }

  const handleEdit = (produit: ProduitDTO) => {
    setEditingProduit(produit)
    setFormData({ nom: produit.nom, code: produit.code, description: produit.description || "" })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduit(id)
        await loadProduits()
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erreur lors de la suppression")
        console.error("[v0] Error deleting produit:", err)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const produitData: ProduitDTO = {
        nom: formData.nom,
        code: formData.code,
        description: formData.description || undefined,
        actif: true,
      }

      if (editingProduit && editingProduit.id) {
        await updateProduit(editingProduit.id, produitData)
      } else {
        await createProduit(produitData)
      }

      await loadProduits()
      setIsModalOpen(false)
      setFormData({ nom: "", code: "", description: "" })
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'enregistrement")
      console.error("[v0] Error saving produit:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === "ASC" ? "DESC" : "ASC")
    } else {
      setSortBy(field)
      setSortDir("ASC")
    }
    setCurrentPage(0)
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

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button onClick={loadProduits} className="ml-4 underline">
            Réessayer
          </button>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">
            Afficher par:
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(0)
              }}
              className="ml-2 px-3 py-1 border rounded-lg"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
          <span className="text-sm text-gray-600">
            Total: {totalElements} produit{totalElements > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0 || isLoading}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1 || isLoading}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("nom")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                >
                  Nom {sortBy === "nom" && (sortDir === "ASC" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("code")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                >
                  Code {sortBy === "code" && (sortDir === "ASC" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!produits || produits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                produits.map((produit) => (
                  <tr key={produit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{produit.nom}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{produit.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{produit.description || "-"}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button onClick={() => handleEdit(produit)} className="text-blue-600 hover:text-blue-900 mr-4">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => produit.id && handleDelete(produit.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
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
