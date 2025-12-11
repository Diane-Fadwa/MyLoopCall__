// Service API pour la gestion des produits
const API_BASE_URL = "http://localhost:8080/api/v1/produits"

export interface ProduitDTO {
  id?: number
  nom: string
  description?: string
  code: string
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

// Créer un nouveau produit
export async function createProduit(produit: ProduitDTO): Promise<ProduitDTO> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(), // Using getAuthHeaders() to include Bearer token
    body: JSON.stringify(produit),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la création du produit: ${response.statusText}`)
  }

  return response.json()
}

// Mettre à jour un produit existant
export async function updateProduit(id: number, produit: ProduitDTO): Promise<ProduitDTO> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(), // Using getAuthHeaders() to include Bearer token
    body: JSON.stringify(produit),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la mise à jour du produit: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer un produit par ID
export async function getProduitById(id: number): Promise<ProduitDTO> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(), // Using getAuthHeaders() to include Bearer token
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du produit: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer tous les produits
export async function getAllProduits(): Promise<ProduitDTO[]> {
  const response = await fetch(API_BASE_URL, {
    headers: getAuthHeaders(), // Using getAuthHeaders() to include Bearer token
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des produits: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer les produits avec pagination
export async function getAllProduitsPaginated(
  page = 0,
  size = 50,
  sortBy = "nom",
  sortDir = "ASC",
): Promise<PaginatedResponse<ProduitDTO>> {
  const response = await fetch(`${API_BASE_URL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des produits paginés: ${response.statusText}`)
  }

  return response.json()
}

// Supprimer un produit
export async function deleteProduit(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(), // Using getAuthHeaders() to include Bearer token
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression du produit: ${response.statusText}`)
  }
}

// Récupérer les produits actifs
export async function getActiveProduits(): Promise<ProduitDTO[]> {
  const response = await fetch(`${API_BASE_URL}/active`, {
    headers: getAuthHeaders(), // Using getAuthHeaders() to include Bearer token
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des produits actifs: ${response.statusText}`)
  }

  return response.json()
}

// Rechercher des produits par nom
export async function searchProduitsByNom(nom: string): Promise<ProduitDTO[]> {
  const response = await fetch(`${API_BASE_URL}/search?nom=${encodeURIComponent(nom)}`, {
    headers: getAuthHeaders(), // Using getAuthHeaders() to include Bearer token
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la recherche de produits: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer un produit par nom
export async function getProduitByNom(nom: string): Promise<ProduitDTO> {
  const response = await fetch(`${API_BASE_URL}/nom/${encodeURIComponent(nom)}`, {
    headers: getAuthHeaders(), // Using getAuthHeaders() to include Bearer token
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du produit par nom: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer un produit par code
export async function getProduitByCode(code: string): Promise<ProduitDTO> {
  const response = await fetch(`${API_BASE_URL}/code/${encodeURIComponent(code)}`, {
    headers: getAuthHeaders(), // Using getAuthHeaders() to include Bearer token
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du produit par code: ${response.statusText}`)
  }

  return response.json()
}
