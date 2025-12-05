"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Upload, Users, Search, RefreshCw, Filter, X } from "lucide-react"

interface Client {
  id: number
  societe: string
  contactPrincipal: string
  emailPrincipal: string
  telephone: string
  actif: boolean
  categories: string
  dateCreation: string
  interessePar: string
  dateRDV: string
  derniereActivite: string
}

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [excludeInactive, setExcludeInactive] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [nextId, setNextId] = useState(1)

  const [formData, setFormData] = useState({
    societe: "",
    contactPrincipal: "",
    emailPrincipal: "",
    telephone: "",
    actif: true,
    categories: "",
    dateCreation: new Date().toISOString().split("T")[0],
    interessePar: "",
    dateRDV: "",
    derniereActivite: "",
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddClient = () => {
    // Validate required fields
    if (!formData.societe || !formData.contactPrincipal || !formData.emailPrincipal || !formData.telephone) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const newClient: Client = {
      id: nextId,
      ...formData,
    }

    setClients([...clients, newClient])
    setNextId(nextId + 1)
    setShowForm(false)

    // Reset form
    setFormData({
      societe: "",
      contactPrincipal: "",
      emailPrincipal: "",
      telephone: "",
      actif: true,
      categories: "",
      dateCreation: new Date().toISOString().split("T")[0],
      interessePar: "",
      dateRDV: "",
      derniereActivite: "",
    })
  }

  const displayedClients = excludeInactive ? clients.filter((c) => c.actif) : clients

  function handleExport(arg0: string): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un client
          </Button>
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer des clients
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent"
          >
            <Users className="h-4 w-4 mr-2" />
            Contacts
          </Button>
        </div>

        <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Ajouter un nouveau client</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Société - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Société *</label>
              <Input
                placeholder="Nom de la société"
                value={formData.societe}
                onChange={(e) => handleInputChange("societe", e.target.value)}
                className="border-gray-300 focus:border-blue-400"
              />
            </div>

            {/* Contact Principal - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact principal *</label>
              <Input
                placeholder="Nom du contact"
                value={formData.contactPrincipal}
                onChange={(e) => handleInputChange("contactPrincipal", e.target.value)}
                className="border-gray-300 focus:border-blue-400"
              />
            </div>

            {/* Email Principal - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail principal *</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.emailPrincipal}
                onChange={(e) => handleInputChange("emailPrincipal", e.target.value)}
                className="border-gray-300 focus:border-blue-400"
              />
            </div>

            {/* Téléphone - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <Input
                placeholder="+33 1 23 45 67 89"
                value={formData.telephone}
                onChange={(e) => handleInputChange("telephone", e.target.value)}
                className="border-gray-300 focus:border-blue-400"
              />
            </div>

            {/* Catégories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégories</label>
              <Input
                placeholder="Ex: Entreprise, Startup..."
                value={formData.categories}
                onChange={(e) => handleInputChange("categories", e.target.value)}
                className="border-gray-300 focus:border-blue-400"
              />
            </div>

            {/* Intéressé par */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intéressé par</label>
              <Input
                placeholder="Ex: Services, Produits..."
                value={formData.interessePar}
                onChange={(e) => handleInputChange("interessePar", e.target.value)}
                className="border-gray-300 focus:border-blue-400"
              />
            </div>

            {/* Date de RDV */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de RDV</label>
              <Input
                type="date"
                value={formData.dateRDV}
                onChange={(e) => handleInputChange("dateRDV", e.target.value)}
                className="border-gray-300 focus:border-blue-400"
              />
            </div>

            {/* Actif */}
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="actif"
                checked={formData.actif}
                onCheckedChange={(checked) => handleInputChange("actif", checked as boolean)}
                className="border-gray-300"
              />
              <label htmlFor="actif" className="text-sm font-medium text-gray-700 cursor-pointer">
                Actif
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-gray-300">
              Annuler
            </Button>
            <Button
              onClick={handleAddClient}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              Ajouter le client
            </Button>
          </div>
        </Card>
      )}

      {/* Client Synthesis */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Synthèse des Clients</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">{clients.length}</div>
            <div className="text-sm text-gray-600">Nombre total de clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{clients.filter((c) => c.actif).length}</div>
            <div className="text-sm text-green-700">Clients Actifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{clients.filter((c) => !c.actif).length}</div>
            <div className="text-sm text-red-700">Clients Inactifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">65</div>
            <div className="text-sm text-blue-700">Contacts Actifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600 mb-1">0</div>
            <div className="text-sm text-gray-700">Contacts Inactifs</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">0</div>
          <div className="text-sm text-gray-600">Connectés aujourd'hui</div>
        </div>
      </Card>

      {/* Filter Options */}
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="exclude-inactive"
            checked={excludeInactive}
            onCheckedChange={setExcludeInactive}
            className="border-gray-300"
          />
          <label htmlFor="exclude-inactive" className="text-sm font-medium text-gray-700 cursor-pointer">
            Exclure les inactifs Clients
          </label>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select defaultValue="100">
            <SelectTrigger className="w-20 bg-white border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative group">
            <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
              Exporter
            </Button>
            <div className="absolute left-0 mt-0 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={() => handleExport("csv")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-t border-gray-200"
              >
                Excel
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-t border-gray-200"
              >
                PDF
              </button>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Actions en masse non disponible pour le moment")}
            className="hover:bg-gray-50 bg-transparent"
          >
            Actions en masse
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="hover:bg-gray-50 bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Data Table */}
      <Card className="bg-white border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-700">#</TableHead>
              <TableHead className="font-semibold text-gray-700">Société</TableHead>
              <TableHead className="font-semibold text-gray-700">Contact principal</TableHead>
              <TableHead className="font-semibold text-gray-700">E-mail principal</TableHead>
              <TableHead className="font-semibold text-gray-700">Téléphone</TableHead>
              <TableHead className="font-semibold text-gray-700">Actif</TableHead>
              <TableHead className="font-semibold text-gray-700">Catégories</TableHead>
              <TableHead className="font-semibold text-gray-700">Date de création</TableHead>
              <TableHead className="font-semibold text-gray-700">Intéressé par</TableHead>
              <TableHead className="font-semibold text-gray-700">Date de RDV</TableHead>
              <TableHead className="font-semibold text-gray-700">Dernière activité</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-12 w-12 text-gray-300" />
                    <div className="text-lg font-medium">Aucun enregistrement trouvé</div>
                    <div className="text-sm">Commencez par ajouter votre premier client</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayedClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell className="font-medium text-gray-700">{client.id}</TableCell>
                  <TableCell className="text-gray-600">{client.societe}</TableCell>
                  <TableCell className="text-gray-600">{client.contactPrincipal}</TableCell>
                  <TableCell className="text-blue-600 hover:underline cursor-pointer">
                    {client.emailPrincipal}
                  </TableCell>
                  <TableCell className="text-gray-600">{client.telephone}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${client.actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {client.actif ? "Oui" : "Non"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{client.categories || "-"}</TableCell>
                  <TableCell className="text-gray-600">{client.dateCreation}</TableCell>
                  <TableCell className="text-gray-600">{client.interessePar || "-"}</TableCell>
                  <TableCell className="text-gray-600">{client.dateRDV || "-"}</TableCell>
                  <TableCell className="text-gray-600">{client.derniereActivite || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
