"use client"

import { useState, useEffect } from "react"
import { Download, FileSpreadsheet, FileText, Plus, Search, Trash2, CalendarIcon } from "lucide-react"
import { useSidebar } from "@/contexts/sidebar-context"
// </CHANGE> Removed local imports and added API imports
// import { getAgents } from "@/lib/admin-data"
// import { prospectsService, type Prospect } from "@/lib/prospects-data"
import {
  createProspect,
  updateProspect,
  deleteProspect,
  getAllProspectsPaginated, // New API function
  type ProspectDTO,
} from "@/lib/api/prospects-api"
import { getAllProduits } from "@/lib/api/produits-api"
import { getAllAgents } from "@/lib/api/agents-api"
import { getAllInstallateurs } from "@/lib/api/installateurs-api"

// Use dynamic data for ZONES and PROFILs, and load products/installers from localStorage
const CONFIRMATEURS = ["YACINE", "SAFA", "LEILA"]
const STATUTS = ["VALIDE", "ANNULATION", "RAPPEL YACINE", "NRP"]
// Define ZONES and PROFILS here or import them if they are defined elsewhere
const ZONES = ["H1", "H2", "H3"] // Example definition, adjust as needed
const PROFILS = ["BLEU", "JAUNE", "VIOLET", "ROSE"] // Example definition, adjust as needed

export default function ProspectsPage() {
  const { collapsed } = useSidebar()

  const [prospects, setProspects] = useState<ProspectDTO[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0) // API uses 0-based pages
  const [itemsPerPage, setItemsPerPage] = useState(50)
  const [sortBy, setSortBy] = useState("id")
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("DESC")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [produits, setProduits] = useState<string[]>([])
  const [agents, setAgents] = useState<string[]>([])
  const [installateurs, setInstallateurs] = useState<string[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterAgent, setFilterAgent] = useState("")
  const [filterConfirmateur, setFilterConfirmateur] = useState("")
  const [filterStatut, setFilterStatut] = useState("")
  const [filterProduit, setFilterProduit] = useState("")
  // Removed itemsPerPage and currentPage from here as they are managed above
  const [editingProspect, setEditingProspect] = useState<ProspectDTO | null>(null) // Not currently used but kept for potential future use
  const [showDateModal, setShowDateModal] = useState(false)
  const [dateModalField, setDateModalField] = useState<"date" | "rappelLe">("date")
  const [editingProspectId, setEditingProspectId] = useState<number | null>(null)
  const [tempDate, setTempDate] = useState("")
  const [showTextModal, setShowTextModal] = useState(false)
  const [textModalField, setTextModalField] = useState<"adresse" | "commentaire">("adresse")
  const [tempText, setTempText] = useState("")

  const [newProspect, setNewProspect] = useState<
    Omit<
      ProspectDTO,
      "id" | "produit" | "agent" | "installateur" | "numeroMobile" | "codePostal" | "heure" | "commentaires"
    > & {
      produit: string
      agent: string
      installateur: string
      numeroMobile?: string // Use string for input, convert later
      codePostal?: string // Use string for input, convert later
      heure: string // Keep as string for input
      commentaire: string // Keep as string for input
    }
  >({
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

  const fetchProspects = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("[v0] === Starting fetchProspects ===")
      console.log("[v0] Current page:", currentPage)
      console.log("[v0] Items per page:", itemsPerPage)
      console.log("[v0] Auth token exists:", !!localStorage.getItem("authToken"))

      const data = await getAllProspectsPaginated(currentPage, itemsPerPage, "id", "DESC")

      console.log("[v0] Data received:", data)

      if (data && data.content && Array.isArray(data.content)) {
        const transformedProspects = data.content.map((p: any) => ({
          id: p.id || 0,
          date: p.date || "",
          rappelLe: p.rappelLe || "",
          heure: p.heure || "",
          produit: p.produit?.nom || "",
          agent: p.agent?.nom || "",
          zone: p.zone || "",
          profil: p.profil || "",
          nom: p.nom || "",
          prenom: p.prenom || "",
          adresse: p.adresse || "",
          codePostal: p.codePostal?.toString() || "",
          ville: p.ville || "",
          mobile: p.numeroMobile?.toString() || "",
          commentaire: p.commentaire || "",
          confirmateur: p.confirmateur || "",
          statut: p.statut || "",
          installateur: p.installateur?.nom || "",
        }))

        setProspects(transformedProspects)
        setTotalElements(data.totalElements || 0)
        setTotalPages(data.totalPages || 0)
        console.log("[v0] Successfully loaded", transformedProspects.length, "prospects")
      } else {
        console.warn("[v0] No data or empty content array")
        setProspects([])
        setTotalElements(0)
        setTotalPages(0)
      }
    } catch (err) {
      console.error("[v0] FATAL ERROR in fetchProspects:", err)
      setError("Impossible de charger les prospects. Vérifiez que le serveur backend est démarré.")
      setProspects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProspects()
  }, [currentPage, itemsPerPage]) // Only re-fetch when page or itemsPerPage changes

  const getFilteredProspects = () => {
    let filtered = prospects

    if (searchTerm) {
      // Use searchTerm instead of searchQuery
      filtered = filtered.filter(
        (p) =>
          p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.mobile?.toString().includes(searchTerm),
      )
    }

    if (filterAgent && filterAgent !== "") {
      // Changed "Tous" to "" for comparison as "" is the default value
      filtered = filtered.filter((p) => p.agent === filterAgent)
    }

    if (filterConfirmateur && filterConfirmateur !== "") {
      // Changed "Tous" to ""
      filtered = filtered.filter((p) => p.confirmateur === filterConfirmateur)
    }

    if (filterStatut && filterStatut !== "") {
      // Changed "Tous" to ""
      filtered = filtered.filter((p) => p.statut === filterStatut)
    }

    if (filterProduit && filterProduit !== "") {
      // Changed "Tous" to ""
      filtered = filtered.filter((p) => p.produit === filterProduit)
    }

    return filtered
  }

  const filteredProspects = getFilteredProspects()

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [produitsResponse, agentsResponse, installateursResponse] = await Promise.all([
          getAllProduits(),
          getAllAgents(),
          getAllInstallateurs(),
        ])

        // Handle paginated responses by extracting the content array
        const produitsArray = Array.isArray(produitsResponse) ? produitsResponse : produitsResponse?.content || []
        const agentsArray = Array.isArray(agentsResponse) ? agentsResponse : agentsResponse?.content || []
        const installateursArray = Array.isArray(installateursResponse)
          ? installateursResponse
          : installateursResponse?.content || []

        setProduits(produitsArray.map((p: any) => p.nom))
        setAgents(agentsArray.map((a: any) => a.nom))
        setInstallateurs(installateursArray.map((i: any) => i.nom))
      } catch (err) {
        console.error("[v0] Error loading dropdown data:", err)
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des données des listes déroulantes")
      }
    }

    loadDropdownData()
  }, [])

  // Removed the useEffect that resets currentPage on filter change as filtering is client-side now

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

  const handleAddProspect = async () => {
    try {
      // Transform frontend data to API format
      const prospectToCreate: ProspectDTO = {
        date: newProspect.date ? new Date(formatDateForInput(newProspect.date)).toISOString() : undefined,
        rappelLe: newProspect.rappelLe ? new Date(formatDateForInput(newProspect.rappelLe)).toISOString() : undefined,
        produit: { nom: newProspect.produit },
        agent: { nom: newProspect.agent },
        zone: newProspect.zone,
        profil: newProspect.profil,
        nom: newProspect.nom,
        prenom: newProspect.prenom,
        adresse: newProspect.adresse,
        codePostal: newProspect.codePostal ? Number.parseInt(newProspect.codePostal) : undefined,
        ville: newProspect.ville,
        numeroMobile: newProspect.mobile ? Number.parseInt(newProspect.mobile) : undefined,
        // Combine heure and commentaire for the API, assuming 'heure' takes precedence if present
        commentaire: `${newProspect.heure}${newProspect.commentaire ? " - " + newProspect.commentaire : ""}`,
        confirmateur: newProspect.confirmateur,
        statut: newProspect.statut,
        installateur: { nom: newProspect.installateur },
      }

      await createProspect(prospectToCreate)

      // Refresh prospects list
      await fetchProspects()

      // Reset form
      setNewProspect({
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
      setShowForm(false)
    } catch (err) {
      console.error("[v0] Error adding prospect:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout du prospect")
    }
  }

  const handleFieldChange = async (
    id: number,
    field: keyof ProspectDTO | "heure" | "mobile" | "codePostal",
    value: string,
  ) => {
    try {
      const prospect = prospects.find((p) => p.id === id)
      if (!prospect) return

      // Prepare the update payload, transforming frontend types to API expected types
      const prospectToUpdate: Partial<ProspectDTO> = {
        id: id,
      }

      if (field === "date") {
        prospectToUpdate.date = value ? new Date(formatDateForInput(value)).toISOString() : undefined
      } else if (field === "rappelLe") {
        prospectToUpdate.rappelLe = value ? new Date(formatDateForInput(value)).toISOString() : undefined
      } else if (field === "produit") {
        prospectToUpdate.produit = { nom: value }
      } else if (field === "agent") {
        prospectToUpdate.agent = { nom: value }
      } else if (field === "installateur") {
        prospectToUpdate.installateur = { nom: value }
      } else if (field === "codePostal") {
        prospectToUpdate.codePostal = value ? Number.parseInt(value) : undefined
      } else if (field === "mobile") {
        // Assuming 'mobile' maps to 'numeroMobile'
        prospectToUpdate.numeroMobile = value ? Number.parseInt(value) : undefined
      } else if (
        field === "zone" ||
        field === "profil" ||
        field === "nom" ||
        field === "prenom" ||
        field === "adresse" ||
        field === "ville" ||
        field === "confirmateur" ||
        field === "statut"
      ) {
        // These fields map directly or are already in the correct format
        ;(prospectToUpdate as any)[field] = value
      } else if (field === "heure") {
        // If updating 'heure', we need to update 'commentaire' field in API
        // Construct the new comment by combining existing comment with updated heure
        const existingComment = prospect.commentaire || ""
        const currentHeure = prospects.find((p) => p.id === id)?.heure || ""
        const heureValue = value
        let updatedComment = existingComment

        if (heureValue) {
          if (currentHeure && existingComment.startsWith(currentHeure)) {
            // Replace existing heure in comment
            updatedComment = existingComment.replace(currentHeure, heureValue)
          } else {
            // Prepend heure if it's new or not at the start
            updatedComment = `${heureValue} - ${existingComment.replace(/^\s*-\s*/, "")}` // Ensure hyphen and space only if comment exists
          }
        } else {
          // If heure is cleared, remove it from the comment if it exists at the start
          if (currentHeure && existingComment.startsWith(currentHeure)) {
            updatedComment = existingComment
              .replace(currentHeure, "")
              .replace(/^\s*-\s*/, "")
              .trim()
          }
        }
        prospectToUpdate.commentaire = updatedComment
      } else if (field === "commentaire") {
        // If updating 'commentaire', and 'heure' field exists, we need to ensure 'heure' is preserved
        const existingHeure = prospects.find((p) => p.id === id)?.heure || ""
        let updatedComment = value

        if (existingHeure) {
          // Check if the existing heure is at the start of the value
          if (value.startsWith(existingHeure)) {
            // If it is, no change needed for heure's part in comment
          } else if (value.includes(existingHeure)) {
            // If heure is somewhere in the middle, we need to ensure it's properly formatted.
            // This is a complex case and might need refinement based on actual data structure.
            // For now, assume simple concatenation.
            updatedComment = `${existingHeure} - ${value.replace(/^\s*-\s*/, "")}`
          } else {
            // If heure is not present in the new comment, prepend it
            updatedComment = `${existingHeure} - ${value.replace(/^\s*-\s*/, "")}`
          }
        }
        prospectToUpdate.commentaire = updatedComment
      }

      // Ensure that fields that should be objects are correctly structured if they are being updated
      if (prospectToUpdate.produit && typeof prospectToUpdate.produit !== "object")
        prospectToUpdate.produit = { nom: prospectToUpdate.produit as any }
      if (prospectToUpdate.agent && typeof prospectToUpdate.agent !== "object")
        prospectToUpdate.agent = { nom: prospectToUpdate.agent as any }
      if (prospectToUpdate.installateur && typeof prospectToUpdate.installateur !== "object")
        prospectToUpdate.installateur = { nom: prospectToUpdate.installateur as any }

      await updateProspect(id, prospectToUpdate as ProspectDTO) // Cast to ProspectDTO for update call

      // Update local state - this part needs to reflect the actual data structure being displayed
      // For example, if `heure` is displayed directly but stored in `commentaire` for API,
      // we need to extract it or update the displayed `heure` in the state.
      setProspects((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const updatedP = { ...p }

            // Update specific fields based on input
            if (field === "date" || field === "rappelLe") {
              updatedP[field] = value
            } else if (
              field === "produit" ||
              field === "agent" ||
              field === "zone" ||
              field === "profil" ||
              field === "nom" ||
              field === "prenom" ||
              field === "adresse" ||
              field === "ville" ||
              field === "confirmateur" ||
              field === "statut"
            ) {
              updatedP[field] = value
            } else if (field === "codePostal" || field === "mobile") {
              updatedP[field] = value
            } else if (field === "heure") {
              updatedP.heure = value // Update displayed heure
              const existingComment = p.commentaire || ""
              const currentHeure = p.heure || ""
              let newComment = existingComment
              if (value) {
                if (currentHeure && existingComment.startsWith(currentHeure)) {
                  newComment = existingComment.replace(currentHeure, value)
                } else {
                  newComment = `${value} - ${existingComment.replace(/^\s*-\s*/, "")}`
                }
              } else {
                if (currentHeure && existingComment.startsWith(currentHeure)) {
                  newComment = existingComment
                    .replace(currentHeure, "")
                    .replace(/^\s*-\s*/, "")
                    .trim()
                }
              }
              updatedP.commentaire = newComment
            } else if (field === "commentaire") {
              updatedP.commentaire = value
              const existingHeure = p.heure || ""
              let newComment = value
              if (existingHeure && !value.includes(existingHeure)) {
                newComment = `${existingHeure} - ${value.replace(/^\s*-\s*/, "")}`
              }
              updatedP.commentaire = newComment
            }
            return updatedP
          }
          return p
        }),
      )
    } catch (err) {
      console.error("[v0] Error updating prospect:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour du prospect")
    }
  }

  const handleDeleteProspect = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce prospect ?")) {
      try {
        await deleteProspect(id)
        await fetchProspects()
      } catch (err) {
        console.error("[v0] Error deleting prospect:", err)
        setError(err instanceof Error ? err.message : "Erreur lors de la suppression du prospect")
      }
    }
  }

  const openDateModal = (prospectId: number, field: "date" | "rappelLe", currentValue: string) => {
    setEditingProspectId(prospectId)
    setDateModalField(field)
    // Ensure current date is in YYYY-MM-DD format for the input/calendar
    setTempDate(formatDateForInput(currentValue))
    setShowDateModal(true)
  }

  const saveDateChange = () => {
    if (editingProspectId !== null) {
      // Call handleFieldChange with the appropriate field and the tempDate value
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
      ...filteredProspects.map(
        // Use filteredProspects for export
        (p) =>
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
      // Use filteredProspects for export
      // Use fetched prospects for export
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
    // Resetting filters no longer needs to reset the page as filtering is client-side
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
      // Ensure initial date is in a format the Date object can parse
      if (currentDate && currentDate.includes("-")) {
        // Already YYYY-MM-DD
        return new Date(currentDate)
      } else if (currentDate && currentDate.includes("/")) {
        // DD/MM/YYYY
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
      // Format date as YYYY-MM-DD for consistency with input[type=date]
      const selected = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
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

            // Compare formatted date for selection
            const formattedCurrentDay = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const isSelected = currentDate === formattedCurrentDay

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(0) // Reset to the first page when changing items per page
  }

  return (
    <div className="p-6 space-y-6">
      {" "}
      {/* Changed margin to space-y for better vertical spacing */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prospects</h1>
          <p className="text-muted-foreground">Gérez vos prospects et rendez-vous</p>{" "}
          {/* Changed text-gray-600 to text-muted-foreground for consistency */}
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nouveau prospect
          </button>
        </div>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
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

        <button onClick={resetFilters} className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
          Réinitialiser les filtres
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Afficher par:</span>{" "}
          {/* Changed text-gray-600 to text-muted-foreground */}
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
          {/* Display count based on filtered results */}
          <div className="mb-4 text-sm text-muted-foreground">
            Affichage de {filteredProspects.length} prospects sur {totalElements}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || loading}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Précédent
          </button>
          <span className="text-sm">
            Page {currentPage + 1} sur {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || loading}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des prospects...</p>{" "}
            {/* Changed text-gray-600 to text-muted-foreground */}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
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
              {/* Iterate over filteredProspects */}
              {filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 min-w-[120px]">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={prospect.date}
                        // onChange={(e) => handleFieldChange(prospect.id, "date", e.target.value)} // Direct input for date is tricky with API format, use calendar
                        className="w-full px-2 py-1 border rounded text-sm"
                        readOnly // Make readOnly to enforce calendar usage
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
                        // onChange={(e) => handleFieldChange(prospect.id, "rappelLe", e.target.value)} // Direct input for date is tricky with API format, use calendar
                        className="w-full px-2 py-1 border rounded text-sm"
                        readOnly // Make readOnly to enforce calendar usage
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
                      value={prospect.heure} // Displaying 'heure' directly
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
                      <option value="">Sélectionnez un produit</option>
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
                      <option value="">Sélectionnez un agent</option>
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
                      <option value="">Sélectionnez une zone</option>
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
                      <option value="">Sélectionnez un profil</option>
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
                      <option value="">Sélectionnez un confirmateur</option>
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
                      <option value="">Sélectionnez un statut</option>
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
                      <option value="">Sélectionnez un installateur</option>
                      {installateurs.map((inst) => (
                        <option key={inst} value={inst}>
                          {inst}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 min-w-[100px]">
                    <button onClick={() => handleDeleteProspect(prospect.id)} className="p-2 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination controls moved outside the loading check to always be visible */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Afficher par:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
          <span className="text-sm text-muted-foreground">
            Affichage de {currentPage * itemsPerPage + 1} à {Math.min((currentPage + 1) * itemsPerPage, totalElements)}{" "}
            sur {totalElements} prospects
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || loading}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Précédent
          </button>
          <span className="text-sm">
            Page {currentPage + 1} sur {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || loading}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      </div>
      {showForm && ( // Control the form visibility with showForm state
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Nouveau prospect</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddProspect()
              }}
            >
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
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Ajouter
                </button>
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
