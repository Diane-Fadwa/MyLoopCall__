"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Download, FileSpreadsheet, FileText, Plus, Search, Trash2, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/sidebar-context"
import { getAgents } from "@/lib/admin-data"
import { prospectsService, type Prospect } from "@/lib/prospects-data"

// Use dynamic data for ZONES and PROFILs, and load products/installers from localStorage
const CONFIRMATEURS = ["YACINE", "SAFA", "LEILA"]
const STATUTS = ["VALIDE", "ANNULATION", "RAPPEL YACINE", "NRP"]
// Define ZONES and PROFILS here or import them if they are defined elsewhere
const ZONES = ["H1", "H2", "H3"] // Example definition, adjust as needed
const PROFILS = ["BLEU", "JAUNE", "VIOLET", "ROSE"] // Example definition, adjust as needed

export default function ProspectsPage() {
  const { collapsed } = useSidebar()

  const [prospects, setProspects] = useState<Prospect[]>([])
  const [produits, setProduits] = useState<string[]>([])
  const [agents, setAgents] = useState<string[]>([])
  const [installateurs, setInstallateurs] = useState<string[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterAgent, setFilterAgent] = useState("")
  const [filterConfirmateur, setFilterConfirmateur] = useState("")
  const [filterStatut, setFilterStatut] = useState("")
  const [filterProduit, setFilterProduit] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState(50)
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null) // Not currently used but kept for potential future use
  const [showDateModal, setShowDateModal] = useState(false)
  const [dateModalField, setDateModalField] = useState<"date" | "rappelLe">("date")
  const [editingProspectId, setEditingProspectId] = useState<number | null>(null)
  const [tempDate, setTempDate] = useState("")
  const [showTextModal, setShowTextModal] = useState(false)
  const [textModalField, setTextModalField] = useState<"adresse" | "commentaire">("adresse")
  const [tempText, setTempText] = useState("")

  const [newProspect, setNewProspect] = useState<Omit<Prospect, "id">>({
    date: "",
    rappelLe: "",
    heure: "",
    produit: "",
    agent: "",
    zone: "",
    profil: "",
    nom: "",
    prenom: "",
    adresse: "",
    codePostal: "",
    ville: "",
    mobile: "",
    commentaire: "",
    confirmateur: "",
    statut: "",
    installateur: "",
  })
  const [showForm, setShowForm] = useState(false) // State to control the visibility of the new prospect form

  // Load initial data and set up listeners
  useEffect(() => {
    setProspects(prospectsService.getProspects())

    const loadAdminData = () => {
      // Load products and installateurs from localStorage
      const storedProduits = localStorage.getItem("admin_produits")
      setProduits(storedProduits ? JSON.parse(storedProduits).map((p: any) => p.nom) : [])

      const loadedAgents = getAgents()
      setAgents(loadedAgents.filter((a) => a.actif).map((a) => a.nom))

      const storedInstallateurs = localStorage.getItem("admin_installateurs")
      setInstallateurs(storedInstallateurs ? JSON.parse(storedInstallateurs).map((i: any) => i.nom) : [])
    }

    loadAdminData()

    // Listen for custom event when admin data changes
    const handleAdminChange = () => {
      loadAdminData()
    }
    window.addEventListener("adminDataChanged", handleAdminChange)

    return () => {
      window.removeEventListener("adminDataChanged", handleAdminChange)
    }
  }, [])

  // Dynamically update newProspect defaults when data loads
  useEffect(() => {
    setNewProspect((prev) => ({
      ...prev,
      produit: produits[0] || prev.produit,
      agent: agents[0] || prev.agent,
      installateur: installateurs[0] || prev.installateur,
      zone: ZONES[0] || prev.zone,
      profil: PROFILS[0] || prev.profil,
      confirmateur: CONFIRMATEURS[0] || prev.confirmateur,
      statut: STATUTS[0] || prev.statut,
    }))
  }, [produits, agents, installateurs])

  const filteredProspects = prospects.filter((prospect) => {
    const matchesSearch =
      prospect.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.mobile.includes(searchTerm)

    const matchesAgent = !filterAgent || prospect.agent === filterAgent
    const matchesConfirmateur = !filterConfirmateur || prospect.confirmateur === filterConfirmateur
    const matchesStatut = !filterStatut || prospect.statut === filterStatut
    const matchesProduit = !filterProduit || prospect.produit === filterProduit

    return matchesSearch && matchesAgent && matchesConfirmateur && matchesStatut && matchesProduit
  })

  const totalPages = Math.ceil(filteredProspects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProspects = filteredProspects.slice(startIndex, startIndex + itemsPerPage)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterAgent, filterConfirmateur, filterStatut, filterProduit, itemsPerPage])

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return ""
    // Handles YYYY-MM-DD from input type="date"
    if (dateStr.includes("-")) {
      return dateStr
    }
    // Handles DD/MM/YYYY from current logic
    const parts = dateStr.split("/")
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    return "" // Return empty string if format is unexpected
  }

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return ""
    // Handles YYYY-MM-DD from input type="date"
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-")
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`
      }
    }
    // Handles DD/MM/YYYY from current logic
    return dateStr
  }

  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault()
    const prospectToAdd: Omit<Prospect, "id"> = {
      ...newProspect,
      date: formatDateForDisplay(newProspect.date),
      rappelLe: formatDateForDisplay(newProspect.rappelLe),
    }
    prospectsService.addProspect(prospectToAdd)
    setProspects(prospectsService.getProspects())
    setShowForm(false) // Close the form after adding
    setNewProspect({
      // Reset the form
      date: "",
      rappelLe: "",
      heure: "",
      produit: produits[0] || "",
      agent: agents[0] || "",
      zone: ZONES[0] || "",
      profil: PROFILS[0] || "",
      nom: "",
      prenom: "",
      adresse: "",
      codePostal: "",
      ville: "",
      mobile: "",
      commentaire: "",
      confirmateur: CONFIRMATEURS[0] || "",
      statut: STATUTS[0] || "",
      installateur: installateurs[0] || "",
    })
  }

  const handleDeleteProspect = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce prospect ?")) {
      prospectsService.deleteProspect(id)
      setProspects(prospectsService.getProspects())
    }
  }

  const handleFieldChange = (id: number, field: keyof Prospect, value: string) => {
    const updatedProspects = prospects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    setProspects(updatedProspects)
    prospectsService.saveProspects(updatedProspects) // Save to local storage
  }

  const openDateModal = (prospectId: number, field: "date" | "rappelLe", currentValue: string) => {
    setEditingProspectId(prospectId)
    setDateModalField(field)
    setTempDate(currentValue)
    setShowDateModal(true)
  }

  const saveDateChange = () => {
    if (editingProspectId !== null) {
      handleFieldChange(editingProspectId, dateModalField, tempDate)
    }
    setShowDateModal(false)
    setEditingProspectId(null)
    setTempDate("")
  }

  const openTextModal = (prospectId: number, field: "adresse" | "commentaire", currentValue: string) => {
    setEditingProspectId(prospectId)
    setTextModalField(field)
    setTempText(currentValue)
    setShowTextModal(true)
  }

  const saveTextChange = () => {
    if (editingProspectId !== null) {
      handleFieldChange(editingProspectId, textModalField, tempText)
    }
    setShowTextModal(false)
    setEditingProspectId(null)
    setTempText("")
  }

  const exportToPDF = () => {
    window.print()
  }

  const exportToCSV = () => {
    const headers = [
      "DATE",
      "RAPPEL LE",
      "HEURE",
      "PRODUIT",
      "AGENT",
      "ZONE",
      "PROFIL",
      "Nom",
      "Prenom",
      "Adresse",
      "Code postal",
      "Ville",
      "Mobile",
      "Commentaire",
      "CONFIRMATEUR",
      "STATUT",
      "INSTALLATEUR",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredProspects.map((p) =>
        [
          p.date,
          p.rappelLe,
          p.heure,
          p.produit,
          p.agent,
          p.zone,
          p.profil,
          p.nom,
          p.prenom,
          p.adresse.replace(/,/g, " "),
          p.codePostal,
          p.ville,
          p.mobile,
          p.commentaire.replace(/,/g, " "),
          p.confirmateur,
          p.statut,
          p.installateur,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "prospects.csv"
    link.click()
  }

  const exportToExcel = () => {
    const headers = [
      "DATE",
      "RAPPEL LE",
      "HEURE",
      "PRODUIT",
      "AGENT",
      "ZONE",
      "PROFIL",
      "Nom",
      "Prenom",
      "Adresse",
      "Code postal",
      "Ville",
      "Mobile",
      "Commentaire",
      "CONFIRMATEUR",
      "STATUT",
      "INSTALLATEUR",
    ]
    let excelContent = "<table><thead><tr>"
    headers.forEach((h) => {
      excelContent += `<th>${h}</th>`
    })
    excelContent += "</tr></thead><tbody>"

    filteredProspects.forEach((p) => {
      excelContent += `<tr>
        <td>${p.date}</td>
        <td>${p.rappelLe}</td>
        <td>${p.heure}</td>
        <td>${p.produit}</td>
        <td>${p.agent}</td>
        <td>${p.zone}</td>
        <td>${p.profil}</td>
        <td>${p.nom}</td>
        <td>${p.prenom}</td>
        <td>${p.adresse}</td>
        <td>${p.codePostal}</td>
        <td>${p.ville}</td>
        <td>${p.mobile}</td>
        <td>${p.commentaire}</td>
        <td>${p.confirmateur}</td>
        <td>${p.statut}</td>
        <td>${p.installateur}</td>
      </tr>`
    })
    excelContent += "</tbody></table>"

    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "prospects.xls"
    link.click()
  }

  const resetFilters = () => {
    setFilterAgent("")
    setFilterConfirmateur("")
    setFilterStatut("")
    setFilterProduit("")
    setSearchTerm("")
  }

  const getColorClass = (field: string, value: string) => {
    switch (field) {
      case "produit":
        if (value === "PAC") return "bg-green-200 text-green-900"
        if (value === "PV") return "bg-red-600 text-white"
        if (value === "ITE") return "bg-blue-300 text-blue-900"
        if (value === "PAC ET ISOLATION") return "bg-gray-300 text-gray-900"
        if (value === "MENUISERIE") return "bg-yellow-300 text-yellow-900"
        if (value === "PRODUIT") return "bg-purple-300 text-purple-900"
        if (value === "COMBLES") return "bg-orange-300 text-orange-900"
        return "bg-gray-200 text-gray-900"

      case "agent":
        if (value === "YVES") return "bg-pink-200 text-pink-900"
        if (value === "DIBA") return "bg-purple-200 text-purple-900"
        if (value === "KHALIDOU") return "bg-yellow-200 text-yellow-900"
        if (value === "NAJOUA") return "bg-purple-400 text-white"
        if (value === "LEILA") return "bg-pink-300 text-pink-900"
        if (value === "MATAR") return "bg-teal-500 text-white"
        if (value === "SAFA") return "bg-indigo-300 text-indigo-900"
        if (value === "ABDOULAZIZ") return "bg-amber-300 text-amber-900"
        return "bg-gray-200 text-gray-900"

      case "zone":
        if (value === "H1") return "bg-green-600 text-white"
        if (value === "H2") return "bg-pink-300 text-pink-900"
        if (value === "H3") return "bg-yellow-400 text-yellow-900"
        return "bg-gray-200 text-gray-900"

      case "profil":
        if (value === "BLEU") return "bg-blue-600 text-white"
        if (value === "JAUNE") return "bg-yellow-400 text-yellow-900"
        if (value === "VIOLET") return "bg-purple-600 text-white"
        if (value === "ROSE") return "bg-pink-400 text-pink-900"
        return "bg-gray-200 text-gray-900"

      case "confirmateur":
        if (value === "YACINE") return "bg-blue-500 text-white"
        if (value === "SAFA") return "bg-purple-500 text-white"
        if (value === "LEILA") return "bg-pink-500 text-white"
        return "bg-gray-200 text-gray-900"

      case "statut":
        if (value === "VALIDE") return "bg-green-500 text-white"
        if (value === "ANNULATION") return "bg-red-500 text-white"
        if (value === "RAPPEL YACINE") return "bg-orange-500 text-white"
        if (value === "NRP") return "bg-gray-500 text-white"
        return "bg-gray-200 text-gray-900"

      case "installateur":
        return "bg-gray-200 text-gray-700"

      default:
        return ""
    }
  }

  const CalendarPicker = ({
    currentDate,
    onSelectDate,
  }: { currentDate: string; onSelectDate: (date: string) => void }) => {
    const [viewDate, setViewDate] = useState(() => {
      if (currentDate) {
        const parts = currentDate.split("/")
        if (parts.length === 3) {
          return new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
        }
      }
      return new Date()
    })

    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay()
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    const prevMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))
    }

    const nextMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))
    }

    const selectDate = (day: number) => {
      const selected = `${String(day).padStart(2, "0")}/${String(viewDate.getMonth() + 1).padStart(2, "0")}/${viewDate.getFullYear()}`
      onSelectDate(selected)
    }

    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ]

    return (
      <div className="bg-white p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="px-3 py-1 hover:bg-gray-100 rounded">
            ←
          </button>
          <div className="font-semibold">
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </div>
          <button onClick={nextMonth} className="px-3 py-1 hover:bg-gray-100 rounded">
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {["L", "M", "M", "J", "V", "S", "D"].map((day) => (
            <div key={day} className="font-semibold text-gray-600 p-2">
              {day}
            </div>
          ))}
          {Array.from({ length: adjustedFirstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isToday =
              day === new Date().getDate() &&
              viewDate.getMonth() === new Date().getMonth() &&
              viewDate.getFullYear() === new Date().getFullYear()
            const isSelected =
              currentDate ===
              `${String(day).padStart(2, "0")}/${String(viewDate.getMonth() + 1).padStart(2, "0")}/${viewDate.getFullYear()}`

            return (
              <button
                key={day}
                onClick={() => selectDate(day)}
                className={`p-2 rounded hover:bg-blue-100 ${isToday ? "border-2 border-blue-500" : ""} ${
                  isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : ""
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 transition-all duration-300 ${collapsed ? "ml-0" : "ml-0"}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Prospects</h1>
          <p className="text-gray-600">Gérez vos prospects et rendez-vous</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button onClick={() => setShowForm(true)}>
            {" "}
            {/* Changed to control the form visibility */}
            <Plus className="w-4 h-4 mr-2" />
            Nouveau prospect
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rechercher</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nom, prénom ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Agent</label>
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Tous</option>
              {agents.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirmateur</label>
            <select
              value={filterConfirmateur}
              onChange={(e) => setFilterConfirmateur(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Tous</option>
              {CONFIRMATEURS.map((conf) => (
                <option key={conf} value={conf}>
                  {conf}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Tous</option>
              {STATUTS.map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Produit</label>
            <select
              value={filterProduit}
              onChange={(e) => setFilterProduit(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Tous</option>
              {produits.map((prod) => (
                <option key={prod} value={prod}>
                  {prod}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={resetFilters}>
          Réinitialiser les filtres
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Afficher par:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
            <span className="text-sm text-gray-600">
              Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredProspects.length)} sur{" "}
              {filteredProspects.length} prospects
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Précédent
            </Button>
            <span className="text-sm">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 text-left min-w-[120px]">DATE</th>
                <th className="px-4 py-3 text-left min-w-[120px]">RAPPEL LE</th>
                <th className="px-4 py-3 text-left min-w-[180px]">HEURE</th>
                <th className="px-4 py-3 text-left min-w-[180px]">PRODUIT</th>
                <th className="px-4 py-3 text-left min-w-[150px]">AGENT</th>
                <th className="px-4 py-3 text-left min-w-[100px]">ZONE</th>
                <th className="px-4 py-3 text-left min-w-[120px]">PROFIL</th>
                <th className="px-4 py-3 text-left min-w-[150px]">Nom</th>
                <th className="px-4 py-3 text-left min-w-[150px]">Prenom</th>
                <th className="px-4 py-3 text-left min-w-[200px]">Adresse</th>
                <th className="px-4 py-3 text-left min-w-[120px]">Code postal</th>
                <th className="px-4 py-3 text-left min-w-[150px]">Ville</th>
                <th className="px-4 py-3 text-left min-w-[140px]">Numéro de mobile</th>
                <th className="px-4 py-3 text-left min-w-[200px]">Commentaire</th>
                <th className="px-4 py-3 text-left min-w-[150px]">CONFIRMATEUR</th>
                <th className="px-4 py-3 text-left min-w-[180px]">STATUT</th>
                <th className="px-4 py-3 text-left min-w-[180px]">INSTALLATEUR</th>
                <th className="px-4 py-3 text-left min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProspects.map((prospect) => (
                <tr key={prospect.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 min-w-[120px]">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={prospect.date}
                        onChange={(e) => handleFieldChange(prospect.id, "date", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => openDateModal(prospect.id, "date", prospect.date)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <CalendarIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 min-w-[120px]">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={prospect.rappelLe}
                        onChange={(e) => handleFieldChange(prospect.id, "rappelLe", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => openDateModal(prospect.id, "rappelLe", prospect.rappelLe)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <CalendarIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 min-w-[180px]">
                    <textarea
                      value={prospect.heure}
                      onChange={(e) => handleFieldChange(prospect.id, "heure", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm resize-none"
                      rows={1}
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[180px]">
                    <select
                      value={prospect.produit}
                      onChange={(e) => handleFieldChange(prospect.id, "produit", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium ${getColorClass("produit", prospect.produit)}`}
                    >
                      {produits.map((prod) => (
                        <option key={prod} value={prod}>
                          {prod}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[150px]">
                    <select
                      value={prospect.agent}
                      onChange={(e) => handleFieldChange(prospect.id, "agent", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium ${getColorClass("agent", prospect.agent)}`}
                    >
                      {agents.map((agent) => (
                        <option key={agent} value={agent}>
                          {agent}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[100px]">
                    <select
                      value={prospect.zone}
                      onChange={(e) => handleFieldChange(prospect.id, "zone", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium ${getColorClass("zone", prospect.zone)}`}
                    >
                      {ZONES.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[120px]">
                    <select
                      value={prospect.profil}
                      onChange={(e) => handleFieldChange(prospect.id, "profil", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium ${getColorClass("profil", prospect.profil)}`}
                    >
                      {PROFILS.map((profil) => (
                        <option key={profil} value={profil}>
                          {profil}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[150px]">
                    <input
                      type="text"
                      value={prospect.nom}
                      onChange={(e) => handleFieldChange(prospect.id, "nom", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[150px]">
                    <input
                      type="text"
                      value={prospect.prenom}
                      onChange={(e) => handleFieldChange(prospect.id, "prenom", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[200px]">
                    <button
                      onClick={() => openTextModal(prospect.id, "adresse", prospect.adresse)}
                      className="w-full px-2 py-1 border rounded text-sm text-left hover:bg-gray-100 truncate"
                    >
                      {prospect.adresse || "Cliquez pour ajouter"}
                    </button>
                  </td>
                  <td className="px-4 py-2 min-w-[120px]">
                    <input
                      type="text"
                      value={prospect.codePostal}
                      onChange={(e) => handleFieldChange(prospect.id, "codePostal", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[150px]">
                    <input
                      type="text"
                      value={prospect.ville}
                      onChange={(e) => handleFieldChange(prospect.id, "ville", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[140px]">
                    <input
                      type="text"
                      value={prospect.mobile}
                      onChange={(e) => handleFieldChange(prospect.id, "mobile", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[200px]">
                    <button
                      onClick={() => openTextModal(prospect.id, "commentaire", prospect.commentaire)}
                      className="w-full px-2 py-1 border rounded text-sm text-left hover:bg-gray-100 truncate"
                    >
                      {prospect.commentaire || "Cliquez pour ajouter"}
                    </button>
                  </td>
                  <td className="px-4 py-2 min-w-[150px]">
                    <select
                      value={prospect.confirmateur}
                      onChange={(e) => handleFieldChange(prospect.id, "confirmateur", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium ${getColorClass("confirmateur", prospect.confirmateur)}`}
                    >
                      {CONFIRMATEURS.map((conf) => (
                        <option key={conf} value={conf}>
                          {conf}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[180px]">
                    <select
                      value={prospect.statut}
                      onChange={(e) => handleFieldChange(prospect.id, "statut", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium ${getColorClass("statut", prospect.statut)}`}
                    >
                      {STATUTS.map((stat) => (
                        <option key={stat} value={stat}>
                          {stat}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[180px]">
                    <select
                      value={prospect.installateur}
                      onChange={(e) => handleFieldChange(prospect.id, "installateur", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium ${getColorClass("installateur", prospect.installateur)}`}
                    >
                      {installateurs.map((inst) => (
                        <option key={inst} value={inst}>
                          {inst}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[100px]">
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProspect(prospect.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-600">
            Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredProspects.length)} sur{" "}
            {filteredProspects.length} prospects
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Précédent
            </Button>
            <span className="text-sm">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      {showForm && ( // Control the form visibility with showForm state
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Nouveau prospect</h2>
            <form onSubmit={handleAddProspect}>
              {" "}
              {/* Use form and onSubmit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">DATE *</label>
                  <input
                    type="date" // Use type="date" for native date picker
                    value={formatDateForInput(newProspect.date)}
                    onChange={(e) => setNewProspect({ ...newProspect, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">RAPPEL LE *</label>
                  <input
                    type="date" // Use type="date" for native date picker
                    value={formatDateForInput(newProspect.rappelLe)}
                    onChange={(e) => setNewProspect({ ...newProspect, rappelLe: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">HEURE *</label>
                  <input
                    type="text"
                    value={newProspect.heure}
                    onChange={(e) => setNewProspect({ ...newProspect, heure: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Ex: 15:30 ou 17h00 sinon SMS"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">PRODUIT *</label>
                  <select
                    value={newProspect.produit}
                    onChange={(e) => setNewProspect({ ...newProspect, produit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionnez un produit</option> {/* Add default option */}
                    {produits.map((prod) => (
                      <option key={prod} value={prod}>
                        {prod}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">AGENT *</label>
                  <select
                    value={newProspect.agent}
                    onChange={(e) => setNewProspect({ ...newProspect, agent: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionnez un agent</option> {/* Add default option */}
                    {agents.map((agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">ZONE *</label>
                  <select
                    value={newProspect.zone}
                    onChange={(e) => setNewProspect({ ...newProspect, zone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionnez une zone</option> {/* Add default option */}
                    {ZONES.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">PROFIL *</label>
                  <select
                    value={newProspect.profil}
                    onChange={(e) => setNewProspect({ ...newProspect, profil: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionnez un profil</option> {/* Add default option */}
                    {PROFILS.map((profil) => (
                      <option key={profil} value={profil}>
                        {profil}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <input
                    type="text"
                    value={newProspect.nom}
                    onChange={(e) => setNewProspect({ ...newProspect, nom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Prénom *</label>
                  <input
                    type="text"
                    value={newProspect.prenom}
                    onChange={(e) => setNewProspect({ ...newProspect, prenom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Adresse *</label>
                  <input
                    type="text"
                    value={newProspect.adresse}
                    onChange={(e) => setNewProspect({ ...newProspect, adresse: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Code postal *</label>
                  <input
                    type="text"
                    value={newProspect.codePostal}
                    onChange={(e) => setNewProspect({ ...newProspect, codePostal: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ville *</label>
                  <input
                    type="text"
                    value={newProspect.ville}
                    onChange={(e) => setNewProspect({ ...newProspect, ville: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Numéro de mobile *</label>
                  <input
                    type="tel"
                    value={newProspect.mobile}
                    onChange={(e) => setNewProspect({ ...newProspect, mobile: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-1">Commentaire</label>
                  <textarea
                    value={newProspect.commentaire}
                    onChange={(e) => setNewProspect({ ...newProspect, commentaire: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CONFIRMATEUR *</label>
                  <select
                    value={newProspect.confirmateur}
                    onChange={(e) => setNewProspect({ ...newProspect, confirmateur: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionnez un confirmateur</option> {/* Add default option */}
                    {CONFIRMATEURS.map((conf) => (
                      <option key={conf} value={conf}>
                        {conf}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">STATUT *</label>
                  <select
                    value={newProspect.statut}
                    onChange={(e) => setNewProspect({ ...newProspect, statut: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionnez un statut</option> {/* Add default option */}
                    {STATUTS.map((stat) => (
                      <option key={stat} value={stat}>
                        {stat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">INSTALLATEUR *</label>
                  <select
                    value={newProspect.installateur}
                    onChange={(e) => setNewProspect({ ...newProspect, installateur: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionnez un installateur</option> {/* Add default option */}
                    {installateurs.map((inst) => (
                      <option key={inst} value={inst}>
                        {inst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  {" "}
                  {/* Close form on cancel */}
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button> {/* Changed to type="submit" */}
              </div>
            </form>
          </div>
        </div>
      )}

      {showDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-auto">
            <h3 className="text-lg font-semibold mb-4">Sélectionner une date</h3>
            <CalendarPicker currentDate={tempDate} onSelectDate={setTempDate} />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowDateModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">
                Annuler
              </button>
              <button onClick={saveDateChange} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {showTextModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4 capitalize">{textModalField}</h3>
            <textarea
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={8}
              placeholder={`Entrez ${textModalField}...`}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowTextModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">
                Annuler
              </button>
              <button onClick={saveTextChange} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
