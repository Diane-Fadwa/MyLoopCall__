// Service API pour la gestion des installateurs
const API_BASE_URL = "http://localhost:8080/api/v1/installateurs"

export interface InstallateurDTO {
  id?: number
  nom: string
  email?: string
  telephone?: string
  adresse?: string
  ville?: string
  codePostal?: string
  siret?: string
  actif?: boolean
  createdAt?: string
  updatedAt?: string
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

// Créer un nouvel installateur
export async function createInstallateur(installateur: InstallateurDTO): Promise<InstallateurDTO> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(installateur),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la création de l'installateur: ${response.statusText}`)
  }

  return response.json()
}

// Mettre à jour un installateur existant
export async function updateInstallateur(id: number, installateur: InstallateurDTO): Promise<InstallateurDTO> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(installateur),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la mise à jour de l'installateur: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer un installateur par ID
export async function getInstallateurById(id: number): Promise<InstallateurDTO> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de l'installateur: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer tous les installateurs
export async function getAllInstallateurs(): Promise<InstallateurDTO[]> {
  const response = await fetch(API_BASE_URL, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des installateurs: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer les installateurs avec pagination
export async function getAllInstallateursPaginated(
  page = 0,
  size = 50,
  sortBy = "nom",
  sortDir = "ASC",
): Promise<PaginatedResponse<InstallateurDTO>> {
  const response = await fetch(
    `${API_BASE_URL}/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
    {
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des installateurs paginés: ${response.statusText}`)
  }

  return response.json()
}

// Supprimer un installateur
export async function deleteInstallateur(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression de l'installateur: ${response.statusText}`)
  }
}

// Récupérer les installateurs actifs
export async function getActiveInstallateurs(): Promise<InstallateurDTO[]> {
  const response = await fetch(`${API_BASE_URL}/active`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des installateurs actifs: ${response.statusText}`)
  }

  return response.json()
}

// Rechercher des installateurs par nom
export async function searchInstallateursByNom(nom: string): Promise<InstallateurDTO[]> {
  const response = await fetch(`${API_BASE_URL}/search?nom=${encodeURIComponent(nom)}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la recherche d'installateurs: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer un installateur par nom
export async function getInstallateurByNom(nom: string): Promise<InstallateurDTO> {
  const response = await fetch(`${API_BASE_URL}/nom/${encodeURIComponent(nom)}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de l'installateur par nom: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer les installateurs par ville
export async function getInstallateursByVille(ville: string): Promise<InstallateurDTO[]> {
  const response = await fetch(`${API_BASE_URL}/ville/${encodeURIComponent(ville)}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des installateurs par ville: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer un installateur par SIRET
export async function getInstallateurBySiret(siret: string): Promise<InstallateurDTO> {
  const response = await fetch(`${API_BASE_URL}/siret/${encodeURIComponent(siret)}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de l'installateur par SIRET: ${response.statusText}`)
  }

  return response.json()
}
