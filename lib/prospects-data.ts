export type Prospect = {
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
    mobile: string
    commentaire: string
    confirmateur: string
    statut: string
    installateur: string
  }
  
  const STORAGE_KEY = "crm_prospects"
  
  const defaultProspects: Prospect[] = [
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
      adresse: "12 rue de la Paix",
      codePostal: "75001",
      ville: "Paris",
      mobile: "0612345678",
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
      adresse: "45 avenue Victor Hugo",
      codePostal: "69003",
      ville: "Lyon",
      mobile: "0623456789",
      commentaire: "Intéressée par la prime énergie",
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
      adresse: "8 boulevard Saint-Michel",
      codePostal: "31000",
      ville: "Toulouse",
      mobile: "0634567890",
      commentaire: "",
      confirmateur: "LEILA",
      statut: "VALIDE",
      installateur: "AIR RENOV",
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
      adresse: "23 rue Gambetta",
      codePostal: "13001",
      ville: "Marseille",
      mobile: "0645678901",
      commentaire: "Maison de 150m²",
      confirmateur: "YACINE",
      statut: "VALIDE",
      installateur: "FABRICE",
    },
    {
      id: 5,
      date: "09/12/2025",
      rappelLe: "10/12/2025",
      heure: "17:00 sinon envoyer SMS",
      produit: "ITE",
      agent: "YVES",
      zone: "H2",
      profil: "BLEU",
      nom: "El Marnissi",
      prenom: "AMAR",
      adresse: "67 rue de la République",
      codePostal: "06000",
      ville: "Nice",
      mobile: "0656789012",
      commentaire: "",
      confirmateur: "SAFA",
      statut: "ANNULATION",
      installateur: "THEO",
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
      adresse: "34 cours Cambronne",
      codePostal: "44000",
      ville: "Nantes",
      mobile: "0667890123",
      commentaire: "Disponible le matin",
      confirmateur: "LEILA",
      statut: "RAPPEL YACINE",
      installateur: "JAJA SOLID R",
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
      adresse: "91 rue du Faubourg Saint-Honoré",
      codePostal: "67000",
      ville: "Strasbourg",
      mobile: "0678901234",
      commentaire: "",
      confirmateur: "YACINE",
      statut: "VALIDE",
      installateur: "AZREN ISOLATION",
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
      adresse: "15 place de la Bourse",
      codePostal: "33000",
      ville: "Bordeaux",
      mobile: "0689012345",
      commentaire: "Toiture orientée sud",
      confirmateur: "SAFA",
      statut: "NRP",
      installateur: "ISOTHERM",
    },
  ]
  
  export const prospectsService = {
    getProspects(): Prospect[] {
      if (typeof window === "undefined") return defaultProspects
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProspects))
        return defaultProspects
      }
      return JSON.parse(stored)
    },
  
    saveProspects(prospects: Prospect[]): void {
      if (typeof window === "undefined") return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects))
      window.dispatchEvent(new Event("prospectsChanged"))
    },
  
    addProspect(prospect: Omit<Prospect, "id">): void {
      const prospects = this.getProspects()
      const newId = Math.max(...prospects.map((p) => p.id), 0) + 1
      const newProspect = { ...prospect, id: newId }
      this.saveProspects([...prospects, newProspect])
    },
  
    updateProspect(id: number, updates: Partial<Prospect>): void {
      const prospects = this.getProspects()
      const updated = prospects.map((p) => (p.id === id ? { ...p, ...updates } : p))
      this.saveProspects(updated)
    },
  
    deleteProspect(id: number): void {
      const prospects = this.getProspects()
      this.saveProspects(prospects.filter((p) => p.id !== id))
    },
  
    getStatutCounts() {
      const prospects = this.getProspects()
      const counts: Record<string, number> = {}
      prospects.forEach((p) => {
        counts[p.statut] = (counts[p.statut] || 0) + 1
      })
      return counts
    },
  }
  