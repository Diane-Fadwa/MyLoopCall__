"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import {
  getAllInstallateursPaginated,
  createInstallateur,
  updateInstallateur,
  deleteInstallateur,
  type InstallateurDTO,
} from "@/lib/api/installateurs-api"
import { saveInstallateurs } from "@/lib/admin-data"

export default function InstallateursPage() {
  const [installateurs, setInstallateurs] = useState<InstallateurDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(50)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [sortBy, setSortBy] = useState("nom")
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("ASC")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInstallateur, setEditingInstallateur] = useState<InstallateurDTO | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    siret: "",
    actif: true,
  })

  const fetchInstallateurs = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Fetching installateurs with pagination:", { currentPage, pageSize, sortBy, sortDir })
      const data = await getAllInstallateursPaginated(currentPage, pageSize, sortBy, sortDir)
      console.log("[v0] Received installateurs data:", data)

      if (data && data.content) {
        setInstallateurs(data.content)
        setTotalPages(data.totalPages)
        setTotalElements(data.totalElements)

        // Sync avec localStorage pour la page prospects
        saveInstallateurs(data.content)
        window.dispatchEvent(new Event("adminDataChanged"))
      } else {
        setInstallateurs([])
      }
    } catch (err) {
      console.error("[v0] Error fetching installateurs:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la récupération des installateurs")
      setInstallateurs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstallateurs()
  }, [currentPage, pageSize, sortBy, sortDir])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === "ASC" ? "DESC" : "ASC")
    } else {
      setSortBy(field)
      setSortDir("ASC")
    }
    setCurrentPage(0)
  }

  const handleAdd = () => {
    setEditingInstallateur(null)
    setFormData({
      nom: "",
      email: "",
      telephone: "",
      adresse: "",
      ville: "",
      codePostal: "",
      siret: "",
      actif: true,
    })
    setIsModalOpen(true)
  }

  const handleEdit = (installateur: InstallateurDTO) => {
    setEditingInstallateur(installateur)
    setFormData({
      nom: installateur.nom,
      email: installateur.email || "",
      telephone: installateur.telephone || "",
      adresse: installateur.adresse || "",
      ville: installateur.ville || "",
      codePostal: installateur.codePostal || "",
      siret: installateur.siret || "",
      actif: installateur.actif ?? true,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet installateur ?")) {
      try {
        await deleteInstallateur(id)
        fetchInstallateurs()
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erreur lors de la suppression")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingInstallateur && editingInstallateur.id) {
        await updateInstallateur(editingInstallateur.id, formData)
      } else {
        await createInstallateur(formData)
      }
      setIsModalOpen(false)
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        adresse: "",
        ville: "",
        codePostal: "",
        siret: "",
        actif: true,
      })
      fetchInstallateurs()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la sauvegarde")
    }
  }

  if (loading && installateurs.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">Chargement des installateurs...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Installateurs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalElements} installateur{totalElements > 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter un installateur
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Afficher par:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(0)
            }}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} sur {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("nom")}
              >
                <div className="flex items-center gap-1">
                  Nom
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code Postal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SIRET</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {installateurs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  Aucun installateur trouvé
                </td>
              </tr>
            ) : (
              installateurs.map((installateur) => (
                <tr key={installateur.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{installateur.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{installateur.email || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{installateur.telephone || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{installateur.ville || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{installateur.codePostal || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{installateur.siret || "-"}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        installateur.actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {installateur.actif ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => handleEdit(installateur)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => installateur.id && handleDelete(installateur.id)}
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingInstallateur ? "Modifier l'installateur" : "Ajouter un installateur"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Code Postal</label>
                  <input
                    type="text"
                    value={formData.codePostal}
                    onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SIRET</label>
                  <input
                    type="text"
                    value={formData.siret}
                    onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <textarea
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.actif}
                      onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Installateur actif</span>
                  </label>
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
