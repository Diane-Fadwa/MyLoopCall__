// Service API pour la gestion des agents
const API_BASE_URL = "http://localhost:8080/api/v1/agents"

export interface AgentDTO {
  id?: number
  nom: string
  email?: string
  telephone?: string
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

// Créer un nouvel agent
export async function createAgent(agent: AgentDTO): Promise<AgentDTO> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(agent),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la création de l'agent: ${response.statusText}`)
  }

  return response.json()
}

// Mettre à jour un agent existant
export async function updateAgent(id: number, agent: AgentDTO): Promise<AgentDTO> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(agent),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la mise à jour de l'agent: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer un agent par ID
export async function getAgentById(id: number): Promise<AgentDTO> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de l'agent: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer tous les agents
export async function getAllAgents(): Promise<AgentDTO[]> {
  const response = await fetch(API_BASE_URL, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des agents: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer les agents avec pagination
export async function getAllAgentsPaginated(
  page = 0,
  size = 50,
  sortBy = "nom",
  sortDir = "ASC",
): Promise<PaginatedResponse<AgentDTO>> {
  const response = await fetch(
    `${API_BASE_URL}/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
    {
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des agents paginés: ${response.statusText}`)
  }

  return response.json()
}

// Supprimer un agent
export async function deleteAgent(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression de l'agent: ${response.statusText}`)
  }
}

// Récupérer les agents actifs
export async function getActiveAgents(): Promise<AgentDTO[]> {
  const response = await fetch(`${API_BASE_URL}/active`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des agents actifs: ${response.statusText}`)
  }

  return response.json()
}

// Rechercher des agents par nom
export async function searchAgentsByNom(nom: string): Promise<AgentDTO[]> {
  const response = await fetch(`${API_BASE_URL}/search?nom=${encodeURIComponent(nom)}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la recherche d'agents: ${response.statusText}`)
  }

  return response.json()
}

// Récupérer un agent par nom
export async function getAgentByNom(nom: string): Promise<AgentDTO> {
  const response = await fetch(`${API_BASE_URL}/nom/${encodeURIComponent(nom)}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de l'agent par nom: ${response.statusText}`)
  }

  return response.json()
}
