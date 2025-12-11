export type Produit = {
    id: number
    nom: string
    code: string
    description: string
  }
  
  export type Agent = {
    id: number
    nom: string
    email: string
    telephone: string
    actif: boolean
    role: string
  }
  
  export type Installateur = {
    id: number
    nom: string
    specialite: string
    email: string
    telephone: string
    ville: string
  }
  
  export type Role = {
    id: number
    nom: string
    description: string
    permissions: Permission[]
  }
  
  export type Permission = {
    page: string
    canView: boolean
    canEdit: boolean
  }
  
  const STORAGE_KEYS = {
    PRODUITS: "admin_produits",
    AGENTS: "admin_agents",
    INSTALLATEURS: "admin_installateurs",
    ROLES: "admin_roles",
  }
  
  // Initial data
  const INITIAL_PRODUITS: Produit[] = [
    { id: 1, nom: "PAC", code: "PAC", description: "Pompe à chaleur" },
    { id: 2, nom: "PV", code: "PV", description: "Panneaux photovoltaïques" },
    { id: 3, nom: "ITE", code: "ITE", description: "Isolation thermique extérieure" },
    { id: 4, nom: "PAC ET ISOLATION", code: "PAC_ISO", description: "Pompe à chaleur et isolation" },
    { id: 5, nom: "MENUISERIE", code: "MENU", description: "Menuiserie" },
    { id: 6, nom: "PRODUIT", code: "PROD", description: "Produit générique" },
    { id: 7, nom: "COMBLES", code: "COMB", description: "Isolation des combles" },
  ]
  
  const INITIAL_AGENTS: Agent[] = [
    { id: 1, nom: "DIBA", email: "diba@company.com", telephone: "0601020304", actif: true, role: "Admin" },
    { id: 2, nom: "YVES", email: "yves@company.com", telephone: "0602030405", actif: true, role: "Manager" },
    { id: 3, nom: "LEILA", email: "leila@company.com", telephone: "0603040506", actif: true, role: "Manager" },
    { id: 4, nom: "MATAR", email: "matar@company.com", telephone: "0604050607", actif: true, role: "Utilisateur" },
    { id: 5, nom: "KHALIDOU", email: "khalidou@company.com", telephone: "0605060708", actif: true, role: "Utilisateur" },
    { id: 6, nom: "SAFA", email: "safa@company.com", telephone: "0606070809", actif: true, role: "Manager" },
    { id: 7, nom: "NAJOUA", email: "najoua@company.com", telephone: "0607080910", actif: true, role: "Utilisateur" },
    {
      id: 8,
      nom: "ABDOULAZIZ",
      email: "abdoulaziz@company.com",
      telephone: "0608091011",
      actif: true,
      role: "Consultant",
    },
  ]
  
  const INITIAL_INSTALLATEURS: Installateur[] = [
    { id: 1, nom: "ARTHEM", specialite: "PAC", email: "contact@arthem.fr", telephone: "0601020304", ville: "Paris" },
    {
      id: 2,
      nom: "HOME CONCEPT",
      specialite: "Isolation",
      email: "info@homeconcept.fr",
      telephone: "0602030405",
      ville: "Lyon",
    },
    {
      id: 3,
      nom: "AIR RENOV",
      specialite: "PAC",
      email: "contact@airrenov.fr",
      telephone: "0603040506",
      ville: "Marseille",
    },
    {
      id: 4,
      nom: "FABRICE",
      specialite: "Menuiserie",
      email: "fabrice@email.fr",
      telephone: "0604050607",
      ville: "Toulouse",
    },
    { id: 5, nom: "THEO", specialite: "PV", email: "theo@email.fr", telephone: "0605060708", ville: "Nice" },
    {
      id: 6,
      nom: "JAJA SOLID R",
      specialite: "Isolation",
      email: "contact@jajasolidr.fr",
      telephone: "0606070809",
      ville: "Nantes",
    },
    {
      id: 7,
      nom: "AZREN ISOLATION",
      specialite: "Isolation",
      email: "contact@azren.fr",
      telephone: "0607080910",
      ville: "Strasbourg",
    },
    {
      id: 8,
      nom: "ISOTHERM",
      specialite: "Isolation",
      email: "info@isotherm.fr",
      telephone: "0608091011",
      ville: "Bordeaux",
    },
    { id: 9, nom: "AMINE CAS", specialite: "PAC", email: "amine@email.fr", telephone: "0609101112", ville: "Lille" },
    {
      id: 10,
      nom: "SOFIANE TUNISIEN LYON",
      specialite: "Général",
      email: "sofiane@email.fr",
      telephone: "0610111213",
      ville: "Lyon",
    },
    {
      id: 11,
      nom: "SHEIREL HOME ECO",
      specialite: "Écologie",
      email: "contact@sheirelhome.fr",
      telephone: "0611121314",
      ville: "Montpellier",
    },
  ]
  
  const INITIAL_ROLES: Role[] = [
    {
      id: 1,
      nom: "Admin",
      description: "Accès complet au système",
      permissions: [
        { page: "Tableau de bord", canView: true, canEdit: true },
        { page: "Clients", canView: true, canEdit: true },
        { page: "Commercial", canView: true, canEdit: true },
        { page: "Prospects", canView: true, canEdit: true },
        { page: "Utilitaires", canView: true, canEdit: true },
        { page: "Rapports", canView: true, canEdit: true },
        { page: "Paramètres", canView: true, canEdit: true },
      ],
    },
    {
      id: 2,
      nom: "Manager",
      description: "Gestion des équipes et données (comme Admin mais il ne peut pas enlever Admin)",
      permissions: [
        { page: "Tableau de bord", canView: true, canEdit: true },
        { page: "Clients", canView: true, canEdit: true },
        { page: "Commercial", canView: true, canEdit: true },
        { page: "Prospects", canView: true, canEdit: true },
        { page: "Utilitaires", canView: true, canEdit: true },
        { page: "Rapports", canView: true, canEdit: true },
        { page: "Paramètres", canView: true, canEdit: false },
      ],
    },
    {
      id: 3,
      nom: "Utilisateur",
      description: "Accès en lecture et édition limitée",
      permissions: [
        { page: "Tableau de bord", canView: true, canEdit: false },
        { page: "Clients", canView: true, canEdit: true },
        { page: "Commercial", canView: true, canEdit: true },
        { page: "Prospects", canView: true, canEdit: true },
        { page: "Utilitaires", canView: false, canEdit: false },
        { page: "Rapports", canView: true, canEdit: false },
        { page: "Paramètres", canView: false, canEdit: false },
      ],
    },
    {
      id: 4,
      nom: "Consultant",
      description: "Accès en lecture seule",
      permissions: [
        { page: "Tableau de bord", canView: true, canEdit: false },
        { page: "Clients", canView: true, canEdit: false },
        { page: "Commercial", canView: true, canEdit: false },
        { page: "Prospects", canView: true, canEdit: false },
        { page: "Utilitaires", canView: false, canEdit: false },
        { page: "Rapports", canView: true, canEdit: false },
        { page: "Paramètres", canView: false, canEdit: false },
      ],
    },
  ]
  
  // Produits functions
  export function getProduits(): Produit[] {
    if (typeof window === "undefined") return INITIAL_PRODUITS
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUITS)
    return stored ? JSON.parse(stored) : INITIAL_PRODUITS
  }
  
  export function saveProduits(produits: Produit[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PRODUITS, JSON.stringify(produits))
    }
  }
  
  // Agents functions
  export function getAgents(): Agent[] {
    if (typeof window === "undefined") return INITIAL_AGENTS
    const stored = localStorage.getItem(STORAGE_KEYS.AGENTS)
    return stored ? JSON.parse(stored) : INITIAL_AGENTS
  }
  
  export function saveAgents(agents: Agent[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents))
    }
  }
  
  // Installateurs functions
  export function getInstallateurs(): Installateur[] {
    if (typeof window === "undefined") return INITIAL_INSTALLATEURS
    const stored = localStorage.getItem(STORAGE_KEYS.INSTALLATEURS)
    return stored ? JSON.parse(stored) : INITIAL_INSTALLATEURS
  }
  
  export function saveInstallateurs(installateurs: Installateur[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.INSTALLATEURS, JSON.stringify(installateurs))
    }
  }
  
  // Roles functions
  export function getRoles(): Role[] {
    if (typeof window === "undefined") return INITIAL_ROLES
    const stored = localStorage.getItem(STORAGE_KEYS.ROLES)
    return stored ? JSON.parse(stored) : INITIAL_ROLES
  }
  
  export function saveRoles(roles: Role[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles))
      window.dispatchEvent(new Event("adminDataChanged"))
    }
  }
  