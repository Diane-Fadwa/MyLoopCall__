"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react"
import { getRoles } from "@/lib/admin-data"
import {
  type AgentDTO,
  getAllAgentsPaginated,
  createAgent,
  updateAgent,
  deleteAgent,
  type PaginatedResponse,
} from "@/lib/api/agents-api"

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentDTO[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(50)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [sortBy, setSortBy] = useState("nom")
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("ASC")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<AgentDTO | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    actif: true,
    role: "Utilisateur",
  })

  const fetchAgents = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Fetching agents from API with pagination...")
      const data: PaginatedResponse<AgentDTO> = await getAllAgentsPaginated(currentPage, pageSize, sortBy, sortDir)
      console.log("[v0] Agents data received:", data)

      if (data && data.content) {
        const savedOrder = localStorage.getItem("agentsOrder")
        let orderedAgents = data.content

        if (savedOrder) {
          try {
            const orderArray: number[] = JSON.parse(savedOrder)
            // Reorder agents based on saved order
            orderedAgents = orderArray
              .map((id) => data.content.find((agent) => agent.id === id))
              .filter((agent): agent is AgentDTO => agent !== undefined)

            // Add any new agents that aren't in the saved order
            const newAgents = data.content.filter((agent) => !orderArray.includes(agent.id!))
            orderedAgents = [...orderedAgents, ...newAgents]
          } catch (e) {
            console.error("[v0] Error parsing saved order:", e)
          }
        }

        setAgents(orderedAgents)
        setTotalPages(data.totalPages)
        setTotalElements(data.totalElements)
      } else {
        setAgents([])
      }
    } catch (err) {
      console.error("[v0] Error fetching agents:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      setAgents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
    const rolesData = getRoles()
    setRoles(rolesData.map((r) => r.nom))
  }, [currentPage, pageSize, sortBy, sortDir])

  const handleAdd = () => {
    setEditingAgent(null)
    setFormData({ nom: "", email: "", telephone: "", actif: true, role: "Utilisateur" })
    setIsModalOpen(true)
  }

  const handleEdit = (agent: AgentDTO) => {
    setEditingAgent(agent)
    setFormData({
      nom: agent.nom,
      email: agent.email || "",
      telephone: agent.telephone || "",
      actif: agent.actif ?? true,
      role: "Utilisateur", // Note: role not in DTO, using default
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet agent ?")) {
      try {
        await deleteAgent(id)
        fetchAgents()
      } catch (err) {
        console.error("[v0] Error deleting agent:", err)
        alert("Erreur lors de la suppression de l'agent")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const agentData: AgentDTO = {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        actif: formData.actif,
      }

      if (editingAgent && editingAgent.id) {
        await updateAgent(editingAgent.id, agentData)
      } else {
        await createAgent(agentData)
      }

      setIsModalOpen(false)
      setFormData({ nom: "", email: "", telephone: "", actif: true, role: "Utilisateur" })
      fetchAgents()
    } catch (err) {
      console.error("[v0] Error saving agent:", err)
      alert("Erreur lors de l'enregistrement de l'agent")
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newAgents = [...agents]
    const draggedAgent = newAgents[draggedIndex]
    newAgents.splice(draggedIndex, 1)
    newAgents.splice(index, 0, draggedAgent)
    setAgents(newAgents)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    if (agents.length > 0) {
      const orderArray = agents.map((agent) => agent.id).filter((id): id is number => id !== undefined)
      localStorage.setItem("agentsOrder", JSON.stringify(orderArray))
      console.log("[v0] Saved agent order:", orderArray)
    }
    setDraggedIndex(null)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "ASC" ? "DESC" : "ASC")
    } else {
      setSortBy(column)
      setSortDir("ASC")
    }
    setCurrentPage(0)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(0)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Chargement des agents...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Agents</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter un agent
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Afficher par page:</label>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="px-3 py-1 border rounded-lg bg-white text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600">
            Total: {totalElements} agent{totalElements > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Précédent
          </button>
          <span className="text-sm">
            Page {currentPage + 1} / {totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Suivant
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-12"></th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("nom")}
              >
                <div className="flex items-center gap-1">
                  Nom
                  {sortBy === "nom" && (
                    <span>
                      {sortDir === "ASC" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Aucun agent trouvé
                </td>
              </tr>
            ) : (
              agents.map((agent, index) => (
                <tr
                  key={agent.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`hover:bg-gray-50 ${draggedIndex === index ? "opacity-50" : ""}`}
                >
                  <td className="px-4 py-4 text-center cursor-move">
                    <GripVertical className="h-5 w-5 text-gray-400 inline-block" />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{agent.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{agent.email || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{agent.telephone || "-"}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        agent.actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {agent.actif ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => handleEdit(agent)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => agent.id && handleDelete(agent.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingAgent ? "Modifier l'agent" : "Ajouter un agent"}</h2>
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
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.actif}
                    onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">Agent actif</label>
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
                  {editingAgent ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
