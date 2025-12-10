"use client"

import type React from "react"
import { useState, useMemo } from "react"
import {
  PlusCircle,
  Pencil,
  Trash2,
  FileText,
  FileSpreadsheet,
  File,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const PRODUITS = ["PAC", "PV", "ITE", "PAC ET ISOLATION", "MENUISERIE", "PRODUIT", "COMBLES"]
const AGENTS = ["DIBA", "YVES", "LEILA", "MATAR", "KHALIDOU", "SAFA", "NAJOUA", "ABDOULAZIZ"]
const ZONES = ["H1", "H2", "H3"]
const PROFILS = ["BLEU", "JAUNE", "VIOLET", "ROSE"]
const CONFIRMATEURS = ["YACINE", "SAFA", "LEILA"]
const STATUTS = ["VALIDE", "ANNULATION", "RAPPEL YACINE", "NRP"]
const INSTALLATEURS = [
  "ARTHEM",
  "HOME CONCEPT",
  "AIR RENOV",
  "FABRICE",
  "THEO",
  "JAJA SOLID R",
  "AZREN ISOLATION",
  "ISOTHERM",
  "AMINE CAS",
  "SOFIANE TUNISIEN LYON",
  "SHEIREL HOME ECO",
]

const getProduitColor = (produit: string) => {
  const colorMap: { [key: string]: string } = {
    PAC: "bg-green-200 text-green-900",
    PV: "bg-red-700 text-white",
    ITE: "bg-blue-300 text-blue-900",
    "PAC ET ISOLATION": "bg-gray-400 text-gray-900",
    MENUISERIE: "bg-orange-300 text-orange-900",
    PRODUIT: "bg-purple-300 text-purple-900",
    COMBLES: "bg-yellow-300 text-yellow-900",
  }
  return colorMap[produit] || "bg-gray-200 text-gray-900"
}

const getAgentColor = (agent: string) => {
  const colorMap: { [key: string]: string } = {
    DIBA: "bg-purple-400 text-white",
    YVES: "bg-pink-300 text-pink-900",
    LEILA: "bg-indigo-300 text-indigo-900",
    MATAR: "bg-teal-600 text-white",
    KHALIDOU: "bg-yellow-400 text-yellow-900",
    SAFA: "bg-rose-300 text-rose-900",
    NAJOUA: "bg-purple-500 text-white",
    ABDOULAZIZ: "bg-cyan-400 text-cyan-900",
  }
  return colorMap[agent] || "bg-gray-200 text-gray-900"
}

const getZoneColor = (zone: string) => {
  const colorMap: { [key: string]: string } = {
    H1: "bg-green-700 text-white",
    H2: "bg-pink-300 text-pink-900",
    H3: "bg-orange-400 text-orange-900",
  }
  return colorMap[zone] || "bg-gray-200 text-gray-900"
}

const getProfilColor = (profil: string) => {
  const colorMap: { [key: string]: string } = {
    BLEU: "bg-blue-600 text-white",
    JAUNE: "bg-yellow-400 text-yellow-900",
    VIOLET: "bg-purple-500 text-white",
    ROSE: "bg-pink-400 text-pink-900",
  }
  return colorMap[profil] || "bg-gray-200 text-gray-900"
}

const getStatutColor = (statut: string) => {
  const colorMap: { [key: string]: string } = {
    VALIDE: "bg-green-600 text-white",
    ANNULATION: "bg-red-600 text-white",
    "RAPPEL YACINE": "bg-orange-500 text-white",
    NRP: "bg-gray-500 text-white",
  }
  return colorMap[statut] || "bg-gray-200 text-gray-900"
}

interface Prospect {
  id: number
  date: string
  rappelLe: string
  heure: string
  produit: string
  agent: string
  zone: string
  profil: string
  nom: string
  prenom: string
  adresse: string
  codePostal: string
  ville: string
  numeroMobile: string
  commentaire: string
  confirmateur: string
  statut: string
  installateur: string
}

const initialProspects: Prospect[] = [
  {
    id: 1,
    date: "10/12/2025",
    rappelLe: "10/12/2025",
    heure: "15:30",
    produit: "PAC",
    agent: "YVES",
    zone: "H2",
    profil: "BLEU",
    nom: "VIDEAU",
    prenom: "PHILIPPE",
    adresse: "",
    codePostal: "10150",
    ville: "",
    numeroMobile: "0618248760",
    commentaire: "",
    confirmateur: "YACINE",
    statut: "VALIDE",
    installateur: "ARTHEM",
  },
  {
    id: 2,
    date: "09/12/2025",
    rappelLe: "10/12/2025",
    heure: "17:00",
    produit: "PAC ET ISOLATION",
    agent: "DIBA",
    zone: "H1",
    profil: "BLEU",
    nom: "CHOISELAT",
    prenom: "CLARA",
    adresse: "1 IMPASSE DES BONNETIERS",
    codePostal: "10350",
    ville: "PRUNAY BELLEVILLE",
    numeroMobile: "0325215365",
    commentaire: "Prop// plus 15ans//80m2//chauffage fioul condensation //la chaudière a plus 10ans",
    confirmateur: "SAFA",
    statut: "VALIDE",
    installateur: "HOME CONCEPT",
  },
  {
    id: 3,
    date: "09/12/2025",
    rappelLe: "10/12/2025",
    heure: "17:00",
    produit: "PAC",
    agent: "KHALIDOU",
    zone: "H1",
    profil: "BLEU",
    nom: "CHARBONNEL",
    prenom: "RAYNAL",
    adresse: "34 imp des roses mouleyre",
    codePostal: "15270",
    ville: "lanobre",
    numeroMobile: "0656753306",
    commentaire: "PRO +15 ANS SH// 120 m² à étage MAISON NON MITOYENNE GAZ DE VILLE EN PANNE",
    confirmateur: "SAFA",
    statut: "NRP",
    installateur: "ISOTHERM",
  },
  {
    id: 4,
    date: "10/12/2025",
    rappelLe: "10/12/2025",
    heure: "17:00",
    produit: "PAC ET ISOLATION",
    agent: "KHALIDOU",
    zone: "H2",
    profil: "BLEU",
    nom: "LAULAN",
    prenom: "JEAN BERNARD",
    adresse: "5 RUE ANATOLE FRANCE",
    codePostal: "33210",
    ville: "Langon",
    numeroMobile: "609727887",
    commentaire: "propriétair maison individuelle +15ans// superficie hbt chauffée 114m²",
    confirmateur: "SAFA",
    statut: "VALIDE",
    installateur: "AIR RENOV",
  },
  {
    id: 5,
    date: "09/12/2025",
    rappelLe: "10/12/2025",
    heure: "17:00",
    produit: "ITE",
    agent: "YVES",
    zone: "H2",
    profil: "BLEU",
    nom: "El Marnissi",
    prenom: "AMAR",
    adresse: "AVENUE Henri IV",
    codePostal: "47130",
    ville: "Saint-Laurent",
    numeroMobile: "626831012",
    commentaire: "MR A 5 MAISONS A FAIRE ISOLE // COMBLES +PAC AIR EAU DANS CHAQUE MAISON",
    confirmateur: "SAFA",
    statut: "NRP",
    installateur: "HOME CONCEPT",
  },
  {
    id: 6,
    date: "08/12/2025",
    rappelLe: "10/12/2025",
    heure: "18:00",
    produit: "ITE",
    agent: "NAJOUA",
    zone: "H2",
    profil: "JAUNE",
    nom: "Thao",
    prenom: "LAURENT",
    adresse: "1995 Rte de Montbartier",
    codePostal: "82700",
    ville: "Montech",
    numeroMobile: "664152700",
    commentaire: "pro//PAC INSTALLER A 2013 ///maison de 115m ///PLIEN PIED",
    confirmateur: "SAFA",
    statut: "NRP",
    installateur: "HOME CONCEPT",
  },
  {
    id: 7,
    date: "09/12/2025",
    rappelLe: "10/12/2025",
    heure: "18:00",
    produit: "PV",
    agent: "DIBA",
    zone: "H2",
    profil: "BLEU",
    nom: "WILFRIED",
    prenom: "THIBAUT",
    adresse: "11 RUE TOUSSAINT CHALOU",
    codePostal: "49000",
    ville: "SAINTE-GEMMES-SUR-LOIRE",
    numeroMobile: "634252090",
    commentaire: "Prop//plus 15ans//230m2// chauffage gaz //la chaudière elle a 2ans",
    confirmateur: "SAFA",
    statut: "NRP",
    installateur: "AIR RENOV",
  },
  {
    id: 8,
    date: "09/12/2025",
    rappelLe: "10/12/2025",
    heure: "18:30",
    produit: "PV",
    agent: "YVES",
    zone: "H1",
    profil: "BLEU",
    nom: "FOURNIER",
    prenom: "MATHILDE",
    adresse: "51 Av. du Maréchal Foch",
    codePostal: "77450",
    ville: "MONTRY",
    numeroMobile: "698702610",
    commentaire: "PRO MAISON +2ANS // CHAUF ELECT ET GAZ // FACTURE ELECT +120 EUROS PAR MOIS",
    confirmateur: "SAFA",
    statut: "VALIDE",
    installateur: "SHEIREL HOME ECO",
  },
]

const formatDateToDisplay = (dateStr: string) => {
  if (!dateStr) return ""
  if (dateStr.includes("/")) return dateStr
  const [year, month, day] = dateStr.split("-")
  return `${day}/${month}/${year}`
}

const formatDateToInput = (dateStr: string) => {
  if (!dateStr) return ""
  if (dateStr.includes("-")) return dateStr
  const [day, month, year] = dateStr.split("/")
  return `${year}-${month}-${day}`
}

// Helper function to format date for display, ensuring correct format
const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr) return ""
  try {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-indexed
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch (error) {
    console.error("Error formatting date:", dateStr, error)
    return dateStr // Return original string if parsing fails
  }
}

// Helper to parse date string from DD/MM/YYYY to Date object
const parseDisplayDate = (dateStr: string): Date => {
  if (!dateStr) return new Date()
  const [day, month, year] = dateStr.split("/").map(Number)
  return new Date(year, month - 1, day)
}

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [filterAgent, setFilterAgent] = useState("")
  const [filterConfirmateur, setFilterConfirmateur] = useState("")
  const [filterStatut, setFilterStatut] = useState("")
  const [filterProduit, setFilterProduit] = useState("")

  const [itemsPerPage, setItemsPerPage] = useState(50)
  const [currentPage, setCurrentPage] = useState(1)

  const [formData, setFormData] = useState<Prospect>({
    id: 0, // Will be replaced on add
    date: "",
    rappelLe: "",
    heure: "",
    produit: "PAC",
    agent: "DIBA",
    zone: "H1",
    profil: "BLEU",
    nom: "",
    prenom: "",
    adresse: "",
    codePostal: "",
    ville: "",
    numeroMobile: "",
    commentaire: "",
    confirmateur: "YACINE",
    statut: "VALIDE",
    installateur: "ARTHEM",
  })

  const [calendarView, setCalendarView] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() })

  const getDaysInMonth = (month: number, year: number) => {
    return new Array(31)
      .fill(null)
      .map((_, i) => new Date(year, month, i + 1))
      .filter((date) => date.getMonth() === month)
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handleCalendarDateSelect = (day: number) => {
    const selectedDate = new Date(calendarView.year, calendarView.month, day)
    const formatted = selectedDate.toISOString().split("T")[0]
    setDatePickerState({ ...datePickerState, currentValue: formatted })
    saveDateFromPicker(formatted)
  }

  const changeCalendarMonth = (delta: number) => {
    let newMonth = calendarView.month + delta
    let newYear = calendarView.year

    if (newMonth > 11) {
      newMonth = 0
      newYear++
    } else if (newMonth < 0) {
      newMonth = 11
      newYear--
    }

    setCalendarView({ month: newMonth, year: newYear })
  }

  const [datePickerState, setDatePickerState] = useState<{
    isOpen: boolean
    prospectId: number
    field: "date" | "rappelLe"
    currentValue: string
  }>({ isOpen: false, prospectId: 0, field: "date", currentValue: "" })

  const [textModalState, setTextModalState] = useState<{
    isOpen: boolean
    prospectId: number
    field: "commentaire" | "adresse"
    currentValue: string
  }>({ isOpen: false, prospectId: 0, field: "commentaire", currentValue: "" })

  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.nom && formData.prenom && formData.numeroMobile) {
      const prospectData = {
        ...formData,
        date: formatDateToDisplay(formData.date),
        rappelLe: formatDateToDisplay(formData.rappelLe),
      }

      if (editingId !== null) {
        setProspects(prospects.map((p) => (p.id === editingId ? { id: editingId, ...prospectData } : p)))
        setEditingId(null)
      } else {
        setProspects([...prospects, { id: Math.max(...prospects.map((p) => p.id), 0) + 1, ...prospectData }])
      }
      setFormData({
        id: 0,
        date: "",
        rappelLe: "",
        heure: "",
        produit: "PAC",
        agent: "DIBA",
        zone: "H1",
        profil: "BLEU",
        nom: "",
        prenom: "",
        adresse: "",
        codePostal: "",
        ville: "",
        numeroMobile: "",
        commentaire: "",
        confirmateur: "YACINE",
        statut: "VALIDE",
        installateur: "ARTHEM",
      })
      setShowForm(false)
    }
  }

  const handleDeleteProspect = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce prospect ?")) {
      setProspects(prospects.filter((p) => p.id !== id))
    }
  }

  const handleEditProspect = (prospect: Prospect) => {
    setEditingId(prospect.id)
    setFormData({ ...prospect })
    setShowForm(true)
  }

  const handleFieldChange = (id: number, field: string, value: string) => {
    setProspects(prospects.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      const matchesSearch =
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.numeroMobile.includes(searchTerm)

      const matchesAgent = !filterAgent || p.agent === filterAgent
      const matchesConfirmateur = !filterConfirmateur || p.confirmateur === filterConfirmateur
      const matchesStatut = !filterStatut || p.statut === filterStatut
      const matchesProduit = !filterProduit || p.produit === filterProduit

      return matchesSearch && matchesAgent && matchesConfirmateur && matchesStatut && matchesProduit
    })
  }, [prospects, searchTerm, filterAgent, filterConfirmateur, filterStatut, filterProduit])

  const totalPages = Math.ceil(filteredProspects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProspects = filteredProspects.slice(startIndex, endIndex)

  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
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
          p.adresse,
          p.codePostal,
          p.ville,
          p.numeroMobile,
          `"${p.commentaire.replace(/"/g, '""')}"`,
          p.confirmateur,
          p.statut,
          p.installateur,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `prospects_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const exportToExcel = () => {
    exportToCSV() // Excel can open CSV files
  }

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prospects</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #000; color: white; }
          @media print {
            body { margin: 0; }
            @page { size: landscape; }
          }
        </style>
      </head>
      <body>
        <h1>Liste des Prospects</h1>
        <table>
          <thead>
            <tr>
              <th>DATE</th>
              <th>RAPPEL LE</th>
              <th>HEURE</th>
              <th>PRODUIT</th>
              <th>AGENT</th>
              <th>ZONE</th>
              <th>PROFIL</th>
              <th>Nom</th>
              <th>Prenom</th>
              <th>Adresse</th>
              <th>CP</th>
              <th>Ville</th>
              <th>Mobile</th>
              <th>Commentaire</th>
              <th>CONFIRMATEUR</th>
              <th>STATUT</th>
              <th>INSTALLATEUR</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProspects
              .map(
                (p) => `
              <tr>
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
                <td>${p.numeroMobile}</td>
                <td>${p.commentaire}</td>
                <td>${p.confirmateur}</td>
                <td>${p.statut}</td>
                <td>${p.installateur}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  // Set calendar view when opening date picker
  const openDatePicker = (prospectId: number, field: "date" | "rappelLe", currentValue: string) => {
    const dateValue = currentValue ? parseDisplayDate(currentValue) : new Date()
    setCalendarView({ month: dateValue.getMonth(), year: dateValue.getFullYear() })
    setDatePickerState({
      isOpen: true,
      prospectId,
      field,
      currentValue: formatDateToInput(currentValue),
    })
  }

  const saveDateFromPicker = (newDate: string) => {
    if (newDate) {
      const formattedDate = formatDateDisplay(newDate) // Use the new helper function
      handleFieldChange(datePickerState.prospectId, datePickerState.field, formattedDate)
    }
    setDatePickerState({ isOpen: false, prospectId: 0, field: "date", currentValue: "" })
  }

  const openTextModal = (prospectId: number, field: "commentaire" | "adresse", currentValue: string) => {
    setTextModalState({
      isOpen: true,
      prospectId,
      field,
      currentValue,
    })
  }

  const saveTextFromModal = () => {
    handleFieldChange(textModalState.prospectId, textModalState.field, textModalState.currentValue)
    setTextModalState({ isOpen: false, prospectId: 0, field: "commentaire", currentValue: "" })
  }

  return (
    <div className="p-6 space-y-6 transition-all duration-300">
      {" "}
      {/* Added transition */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prospects</h1>
          <p className="text-gray-500 mt-1">Gérez vos prospects et rendez-vous</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 mr-2">
            <Button onClick={exportToPDF} variant="outline" size="sm" title="Exporter en PDF">
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button onClick={exportToCSV} variant="outline" size="sm" title="Exporter en CSV">
              <File className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button onClick={exportToExcel} variant="outline" size="sm" title="Exporter en Excel">
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Excel
            </Button>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau prospect
          </Button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
            <Input
              placeholder="Nom, prénom ou téléphone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
            <select
              value={filterAgent}
              onChange={(e) => handleFilterChange(setFilterAgent, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              {AGENTS.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmateur</label>
            <select
              value={filterConfirmateur}
              onChange={(e) => handleFilterChange(setFilterConfirmateur, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              {CONFIRMATEURS.map((confirmateur) => (
                <option key={confirmateur} value={confirmateur}>
                  {confirmateur}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={filterStatut}
              onChange={(e) => handleFilterChange(setFilterStatut, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              {STATUTS.map((statut) => (
                <option key={statut} value={statut}>
                  {statut}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
            <select
              value={filterProduit}
              onChange={(e) => handleFilterChange(setFilterProduit, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              {PRODUITS.map((produit) => (
                <option key={produit} value={produit}>
                  {produit}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => {
              setFilterAgent("")
              setFilterConfirmateur("")
              setFilterStatut("")
              setFilterProduit("")
              setSearchTerm("")
              setCurrentPage(1)
            }}
            variant="outline"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </div>
      {showForm && (
        <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingId ? "Modifier le prospect" : "Ajouter un nouveau prospect"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <form onSubmit={handleAddProspect} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              type="date"
              value={formatDateToInput(formData.date)}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Input
              type="date"
              value={formatDateToInput(formData.rappelLe)}
              onChange={(e) => setFormData({ ...formData, rappelLe: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <textarea
              value={formData.heure}
              onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
              placeholder="Ex: 17:00 sinon envoie SMS"
              className="px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              rows={1}
            />
            <select
              value={formData.produit}
              onChange={(e) => setFormData({ ...formData, produit: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PRODUITS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={formData.agent}
              onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AGENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <select
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            <select
              value={formData.profil}
              onChange={(e) => setFormData({ ...formData, profil: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PROFILS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Input
              type="text"
              placeholder="Nom *"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="text"
              placeholder="Prénom *"
              required
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="text"
              placeholder="Adresse"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="text"
              placeholder="Code Postal"
              value={formData.codePostal}
              onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="text"
              placeholder="Ville"
              value={formData.ville}
              onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="tel"
              placeholder="Numéro de mobile *"
              required
              value={formData.numeroMobile}
              onChange={(e) => setFormData({ ...formData, numeroMobile: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="text"
              placeholder="Commentaire"
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-1 md:col-span-2"
            />
            <select
              value={formData.confirmateur}
              onChange={(e) => setFormData({ ...formData, confirmateur: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CONFIRMATEURS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={formData.installateur}
              onChange={(e) => setFormData({ ...formData, installateur: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {INSTALLATEURS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors col-span-1 md:col-span-2 lg:col-span-3"
            >
              {editingId ? "Modifier le prospect" : "Ajouter le prospect"}
            </Button>
          </form>
        </div>
      )}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Afficher par:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
          <span className="text-sm text-gray-700 ml-4">
            Affichage de {startIndex + 1} à {Math.min(endIndex, filteredProspects.length)} sur{" "}
            {filteredProspects.length} prospects
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-700">
            Page {currentPage} sur {totalPages || 1}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            variant="outline"
            size="sm"
          >
            Suivant
          </Button>
        </div>
      </div>
      <Dialog
        open={datePickerState.isOpen}
        onOpenChange={(open) =>
          !open && setDatePickerState({ isOpen: false, prospectId: 0, field: "date", currentValue: "" })
        }
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Sélectionner une date</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={() => changeCalendarMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="font-semibold text-lg">
                {new Date(calendarView.year, calendarView.month).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={() => changeCalendarMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: getFirstDayOfMonth(calendarView.month, calendarView.year) }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Calendar Days */}
              {getDaysInMonth(calendarView.month, calendarView.year).map((date) => {
                const day = date.getDate()
                const isToday = date.toDateString() === new Date().toDateString()
                const isSelected =
                  datePickerState.currentValue ===
                  new Date(calendarView.year, calendarView.month, day).toISOString().split("T")[0]

                return (
                  <button
                    key={day}
                    onClick={() => handleCalendarDateSelect(day)}
                    className={`
                      p-2 text-center rounded-lg transition-all hover:bg-blue-50 relative
                      ${isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                      ${isToday && !isSelected ? "border-2 border-blue-400" : ""}
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setDatePickerState({ isOpen: false, prospectId: 0, field: "date", currentValue: "" })}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={textModalState.isOpen}
        onOpenChange={(open) =>
          !open && setTextModalState({ isOpen: false, prospectId: 0, field: "commentaire", currentValue: "" })
        }
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{textModalState.field === "commentaire" ? "Commentaire" : "Adresse"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <textarea
              value={textModalState.currentValue}
              onChange={(e) => setTextModalState({ ...textModalState, currentValue: e.target.value })}
              className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
              placeholder={
                textModalState.field === "commentaire" ? "Entrez votre commentaire..." : "Entrez l'adresse..."
              }
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  setTextModalState({ isOpen: false, prospectId: 0, field: "commentaire", currentValue: "" })
                }
              >
                Annuler
              </Button>
              <Button onClick={saveTextFromModal}>Enregistrer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Table */}
      <div className="border rounded-lg bg-white shadow-sm overflow-x-auto transition-all duration-300">
        {" "}
        {/* Added transition */}
        <div className="min-w-max">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold min-w-[120px]">DATE</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[120px]">RAPPEL LE</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[180px]">HEURE</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[160px]">PRODUIT</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[140px]">AGENT</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[100px]">ZONE</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[100px]">PROFIL</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[120px]">Nom</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[120px]">Prenom</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[200px]">Adresse</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[100px]">Code postal</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[140px]">Ville</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[130px]">Mobile</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[250px]">Commentaire</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[140px]">CONFIRMATEUR</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[150px]">STATUT</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[180px]">INSTALLATEUR</th>
                <th className="px-4 py-3 text-left font-semibold min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProspects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 min-w-[120px]">
                    <button
                      onClick={() => openDatePicker(prospect.id, "date", prospect.date)}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded w-full text-left"
                    >
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{prospect.date}</span>
                    </button>
                  </td>
                  <td className="px-4 py-2 min-w-[120px]">
                    <button
                      onClick={() => openDatePicker(prospect.id, "rappelLe", prospect.rappelLe)}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded w-full text-left"
                    >
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{prospect.rappelLe}</span>
                    </button>
                  </td>
                  <td className="px-4 py-2 min-w-[180px]">
                    <Input
                      type="text"
                      value={prospect.heure}
                      onChange={(e) => handleFieldChange(prospect.id, "heure", e.target.value)}
                      placeholder="Ex: 17h00 sinon envoie SMS"
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[160px]">
                    <select
                      value={prospect.produit}
                      onChange={(e) => handleFieldChange(prospect.id, "produit", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 ${getProduitColor(prospect.produit)}`}
                    >
                      {PRODUITS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[140px]">
                    <select
                      value={prospect.agent}
                      onChange={(e) => handleFieldChange(prospect.id, "agent", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 ${getAgentColor(prospect.agent)}`}
                    >
                      {AGENTS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[100px]">
                    <select
                      value={prospect.zone}
                      onChange={(e) => handleFieldChange(prospect.id, "zone", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 ${getZoneColor(prospect.zone)}`}
                    >
                      {ZONES.map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[100px]">
                    <select
                      value={prospect.profil}
                      onChange={(e) => handleFieldChange(prospect.id, "profil", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 ${getProfilColor(prospect.profil)}`}
                    >
                      {PROFILS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[120px]">
                    <Input
                      type="text"
                      value={prospect.nom}
                      onChange={(e) => handleFieldChange(prospect.id, "nom", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[120px]">
                    <Input
                      type="text"
                      value={prospect.prenom}
                      onChange={(e) => handleFieldChange(prospect.id, "prenom", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[200px]">
                    <button
                      onClick={() => openTextModal(prospect.id, "adresse", prospect.adresse)}
                      className="w-full px-2 py-1 text-left text-sm hover:bg-gray-100 rounded truncate"
                      title={prospect.adresse}
                    >
                      {prospect.adresse || "Cliquez pour éditer"}
                    </button>
                  </td>
                  <td className="px-4 py-2 min-w-[100px]">
                    <Input
                      type="text"
                      value={prospect.codePostal}
                      onChange={(e) => handleFieldChange(prospect.id, "codePostal", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[140px]">
                    <Input
                      type="text"
                      value={prospect.ville}
                      onChange={(e) => handleFieldChange(prospect.id, "ville", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[130px]">
                    <Input
                      type="text"
                      value={prospect.numeroMobile}
                      onChange={(e) => handleFieldChange(prospect.id, "numeroMobile", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 min-w-[250px]">
                    <button
                      onClick={() => openTextModal(prospect.id, "commentaire", prospect.commentaire)}
                      className="w-full px-2 py-1 text-left text-xs hover:bg-gray-100 rounded truncate"
                      title={prospect.commentaire}
                    >
                      {prospect.commentaire || "Cliquez pour éditer"}
                    </button>
                  </td>
                  <td className="px-4 py-2 min-w-[140px]">
                    <select
                      value={prospect.confirmateur}
                      onChange={(e) => handleFieldChange(prospect.id, "confirmateur", e.target.value)}
                      className="w-full px-3 py-2 rounded-md text-sm font-medium cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {CONFIRMATEURS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[150px]">
                    <select
                      value={prospect.statut}
                      onChange={(e) => handleFieldChange(prospect.id, "statut", e.target.value)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 ${getStatutColor(prospect.statut)}`}
                    >
                      {STATUTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[180px]">
                    <select
                      value={prospect.installateur}
                      onChange={(e) => handleFieldChange(prospect.id, "installateur", e.target.value)}
                      className="w-full px-3 py-2 rounded-md text-sm font-medium cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {INSTALLATEURS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[100px]">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditProspect(prospect)}
                        className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteProspect(prospect.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Affichage de {startIndex + 1} à {Math.min(endIndex, filteredProspects.length)} sur {filteredProspects.length}{" "}
          prospects
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-700">
            Page {currentPage} sur {totalPages || 1}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            variant="outline"
            size="sm"
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
