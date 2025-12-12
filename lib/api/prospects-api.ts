// Service API pour la gestion des prospects
const API_BASE_URL = "http://localhost:8080/api/v1/prospects"

export interface ProspectDTO {
  id?: number
  date?: string
  rappelLe?: string
  produit?: {
    id?: number
    nom: string
    code?: string
  }
  agent?: {
    id?: number
    nom: string
    email?: string
  }
  zone?: string
  profil?: string
  nom?: string
  prenom?: string
  adresse?: string
  codePostal?: number
  ville?: string
  numeroMobile?: number
  commentaire?: string
  confirmateur?: string
  statut?: string
  installateur?: {
    id?: number
    nom: string
    ville?: string
  }
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("myloop_token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Créer un nouveau prospect
export async function createProspect(prospect: ProspectDTO): Promise<ProspectDTO> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(prospect),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la création du prospect: ${response.statusText}`)
  }

  return response.json()
}

// Mettre à jour un prospect existant
export async function updateProspect(id: number, prospect: ProspectDTO): Promise<ProspectDTO> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(prospect),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la mise à jour du prospect: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer un prospect par ID
export async function getProspectById(id: number): Promise<ProspectDTO> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du prospect: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer tous les prospects avec pagination
export async function getAllProspectsPaginated(
  page = 0,
  size = 50,
  sortBy = "date",
  sortDir = "DESC",
): Promise<PaginatedResponse<ProspectDTO>> {
  try {
    const url = `${API_BASE_URL}/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    console.log("[v0] Making request to:", url)

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Error response:", errorText)

      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
      }
    }

    const jsonData = await response.json()
    console.log("[v0] Success - received", jsonData.content?.length || 0, "prospects")

    return jsonData
  } catch (error) {
    console.error("[v0] Exception:", error)
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: size,
      number: page,
    }
  }
}

// Supprimer un prospect
export async function deleteProspect(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression du prospect: ${response.statusText}`)
  }
}

// Rechercher des prospects par nom, prénom ou téléphone
export async function searchProspects(term: string): Promise<ProspectDTO[]> {
  const response = await fetch(`${API_BASE_URL}/search?term=${encodeURIComponent(term)}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la recherche de prospects: ${response.statusText}`)
  }

  return response.json()
}

// Filtrer les prospects avec pagination
export async function filterProspects(
  filters: {
    agent?: string
    confirmateur?: string
    statut?: string
    produit?: string
    search?: string
  },
  page = 0,
  size = 50,
  sortBy = "id",
  sortDir = "DESC",
): Promise<PaginatedResponse<ProspectDTO>> {
  try {
    const params = new URLSearchParams()

    // Only add parameters if they have values and are not "Tous"
    if (filters.agent && filters.agent !== "Tous") params.append("agent", filters.agent)
    if (filters.confirmateur && filters.confirmateur !== "Tous") params.append("confirmateur", filters.confirmateur)
    if (filters.statut && filters.statut !== "Tous") params.append("statut", filters.statut)
    if (filters.produit && filters.produit !== "Tous") params.append("produit", filters.produit)
    if (filters.search) params.append("search", filters.search)

    params.append("page", page.toString())
    params.append("size", size.toString())
    params.append("sortBy", sortBy)
    params.append("sortDir", sortDir)

    console.log("[v0] Filter request URL:", `${API_BASE_URL}/filter?${params.toString()}`)

    const response = await fetch(`${API_BASE_URL}/filter?${params.toString()}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Filter error response:", errorText)
      throw new Error(`Erreur lors du filtrage des prospects: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Filter response data:", data)
    return data
  } catch (error) {
    console.error("[v0] Error in filterProspects:", error)
    throw error
  }
}

// Filtrer tous les prospects sans pagination
export async function filterProspectsAll(filters: {
  agent?: string
  confirmateur?: string
  statut?: string
  produit?: string
  search?: string
}): Promise<ProspectDTO[]> {
  try {
    const params = new URLSearchParams()

    // Only add parameters if they have values and are not "Tous"
    if (filters.agent && filters.agent !== "Tous") params.append("agent", filters.agent)
    if (filters.confirmateur && filters.confirmateur !== "Tous") params.append("confirmateur", filters.confirmateur)
    if (filters.statut && filters.statut !== "Tous") params.append("statut", filters.statut)
    if (filters.produit && filters.produit !== "Tous") params.append("produit", filters.produit)
    if (filters.search) params.append("search", filters.search)

    console.log("[v0] FilterAll request URL:", `${API_BASE_URL}/filter/all?${params.toString()}`)

    const response = await fetch(`${API_BASE_URL}/filter/all?${params.toString()}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] FilterAll error response:", errorText)
      throw new Error(`Erreur lors du filtrage des prospects: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("[v0] Error in filterProspectsAll:", error)
    throw error
  }
}
