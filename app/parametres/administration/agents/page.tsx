"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react"
import { type Agent, getAgents, saveAgents, getRoles } from "@/lib/admin-data"

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    setAgents(getAgents())
    const rolesData = getRoles()
    setRoles(rolesData.map((r) => r.nom))
  }, [])

  useEffect(() => {
    if (agents.length > 0) {
      saveAgents(agents)
      window.dispatchEvent(new Event("adminDataChanged"))
    }
  }, [agents])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [formData, setFormData] = useState({ nom: "", email: "", telephone: "", actif: true, role: "Utilisateur" })

  const handleAdd = () => {
    setEditingAgent(null)
    setFormData({ nom: "", email: "", telephone: "", actif: true, role: "Utilisateur" })
    setIsModalOpen(true)
  }

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent)
    setFormData({
      nom: agent.nom,
      email: agent.email,
      telephone: agent.telephone,
      actif: agent.actif,
      role: agent.role,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet agent ?")) {
      setAgents(agents.filter((a) => a.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAgent) {
      setAgents(agents.map((a) => (a.id === editingAgent.id ? { ...a, ...formData } : a)))
    } else {
      const newId = Math.max(...agents.map((a) => a.id), 0) + 1
      setAgents([...agents, { id: newId, ...formData }])
    }
    setIsModalOpen(false)
    setFormData({ nom: "", email: "", telephone: "", actif: true, role: "Utilisateur" })
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
    setDraggedIndex(null)
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-12"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agents.map((agent, index) => (
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
                <td className="px-6 py-4 text-sm text-gray-500">{agent.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{agent.telephone}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.role === "Admin"
                        ? "bg-purple-100 text-purple-800"
                        : agent.role === "Manager"
                          ? "bg-blue-100 text-blue-800"
                          : agent.role === "Utilisateur"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {agent.role}
                  </span>
                </td>
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
                  <button onClick={() => handleDelete(agent.id)} className="text-red-600 hover:text-red-900">
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
                  <label className="block text-sm font-medium mb-1">Rôle</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                    required
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.role === "Admin" && "Accès complet au système"}
                    {formData.role === "Manager" && "Gestion des équipes et données (ne peut pas enlever Admin)"}
                    {formData.role === "Utilisateur" && "Accès en lecture et édition limitée"}
                    {formData.role === "Consultant" && "Accès en lecture seule"}
                  </p>
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
