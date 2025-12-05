"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Upload, List, Grid3X3, Search, ChevronDown, X } from "lucide-react"

const STATUSES = [
  "ANNULATION PAC",
  "INJOIGNABLE",
  "RAPPEL PV",
  "FACTURER PAC",
  "RAPPEL PAC",
  "RAPPEL YACINE",
  "ANNULATION PV",
  "NRP",
  "EN ATTENTE DE DOC",
  "FACTURE PV",
  "NOUVEAU",
  "VALIDATION PAC",
  "VALIDE PV",
  "Prospects perdus",
]

const SOURCES = ["PV", "PAC", "SSC"]
const ASSIGNEES = ["Tous", "Yacine", "Administration"]

const initialProspects = [
  {
    id: 1,
    name: "Akram Ben Halima",
    email: "",
    postalCode: "10150",
    phone: "0618248760",
    assignedTo: "Administration",
    status: "RAPPEL YACINE",
    source: "PV",
    interest: "PV",
  },
  {
    id: 2,
    name: "mohammed kabeli",
    email: "mohamedelkabeli@sfr.fr",
    postalCode: "09200",
    phone: "0615787766",
    assignedTo: "Yacine",
    status: "RAPPEL PV",
    source: "PAC",
    interest: "PV",
  },
  {
    id: 3,
    name: "JUSTIN ROMIYO",
    email: "",
    postalCode: "58000",
    phone: "0651945599",
    assignedTo: "Administration",
    status: "RAPPEL PV",
    source: "PV",
    interest: "PV",
  },
  {
    id: 4,
    name: "AMELLAL SAMIRA",
    email: "sam.momo@hotmail.fr",
    postalCode: "19100",
    phone: "0618580566",
    assignedTo: "Administration",
    status: "VALIDATION PAC",
    source: "PAC",
    interest: "PV",
  },
  {
    id: 5,
    name: "ROUHULLAH MOUSSAI",
    email: "",
    postalCode: "31270",
    phone: "0782856745",
    assignedTo: "Yacine",
    status: "RAPPEL YACINE",
    source: "SSC",
    interest: "PV",
  },
]

const getStatusColor = (status: string) => {
  const colorMap: { [key: string]: string } = {
    "RAPPEL YACINE": "bg-green-100 text-green-800 border-green-200",
    "RAPPEL PV": "bg-blue-100 text-blue-800 border-blue-200",
    "VALIDATION PAC": "bg-emerald-100 text-emerald-800 border-emerald-200",
    INJOIGNABLE: "bg-red-100 text-red-800 border-red-200",
    NOUVEAU: "bg-yellow-100 text-yellow-800 border-yellow-200",
  }
  return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200"
}

export default function ProspectsPage() {
  const [prospects, setProspects] = useState(initialProspects)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    assignedTo: "Tous",
    status: "Tous les statuts",
    source: "Toutes les sources",
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    postalCode: "",
    phone: "",
    assignedTo: "Yacine",
    status: "NOUVEAU",
    source: "PV",
    interest: "",
  })

  const filteredProspects = prospects.filter((prospect) => {
    const matchesSearch =
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.phone.includes(searchTerm)

    const matchesAssignee = filters.assignedTo === "Tous" || prospect.assignedTo === filters.assignedTo

    const matchesStatus = filters.status === "Tous les statuts" || prospect.status === filters.status

    const matchesSource = filters.source === "Toutes les sources" || prospect.source === filters.source

    return matchesSearch && matchesAssignee && matchesStatus && matchesSource
  })

  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.postalCode && formData.phone) {
      const newProspect = {
        id: Math.max(...prospects.map((p) => p.id), 0) + 1,
        ...formData,
      }
      setProspects([...prospects, newProspect])
      setFormData({
        name: "",
        email: "",
        postalCode: "",
        phone: "",
        assignedTo: "Yacine",
        status: "NOUVEAU",
        source: "PV",
        interest: "",
      })
      setShowForm(false)
    }
  }

  const handleExport = (format: string) => {
    if (format === "csv") {
      const headers = ["Nom", "Email", "Code Postal", "Téléphone", "Attribuer à", "Statut", "Source", "Intérêt"]
      const rows = filteredProspects.map((p) => [
        p.name,
        p.email,
        p.postalCode,
        p.phone,
        p.assignedTo,
        p.status,
        p.source,
        p.interest,
      ])

      const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "prospects.csv")
      link.click()
    } else if (format === "excel") {
      const headers = ["Nom", "Email", "Code Postal", "Téléphone", "Attribuer à", "Statut", "Source", "Intérêt"]
      const rows = filteredProspects.map((p) => [
        p.name,
        p.email,
        p.postalCode,
        p.phone,
        p.assignedTo,
        p.status,
        p.source,
        p.interest,
      ])

      const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

      const blob = new Blob([csv], { type: "application/vnd.ms-excel;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "prospects.xlsx")
      link.click()
    } else if (format === "pdf") {
      const htmlContent = `
        <html>
          <head>
            <title>Prospects</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f0f0f0; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Liste des Prospects</h1>
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Code Postal</th>
                  <th>Téléphone</th>
                  <th>Attribuer à</th>
                  <th>Statut</th>
                  <th>Source</th>
                  <th>Intérêt</th>
                </tr>
              </thead>
              <tbody>
                ${filteredProspects
                  .map(
                    (p) => `
                  <tr>
                    <td>${p.name}</td>
                    <td>${p.email}</td>
                    <td>${p.postalCode}</td>
                    <td>${p.phone}</td>
                    <td>${p.assignedTo}</td>
                    <td>${p.status}</td>
                    <td>${p.source}</td>
                    <td>${p.interest}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(htmlContent)
        newWindow.document.close()
        newWindow.print()
      }
    }
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
            Ajouter un prospect
          </Button>
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer des prospects
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-white border border-blue-200 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Ajouter un nouveau prospect</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleAddProspect} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Nom *"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              placeholder="Email *"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              placeholder="Code Postal *"
              required
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              placeholder="Téléphone *"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
            >
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSIGNEES.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Intérêt (optionnel)"
              value={formData.interest}
              onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white col-span-1 md:col-span-2 lg:col-span-3"
            >
              Ajouter le prospect
            </Button>
          </form>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-white border-0 shadow-sm">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Filtrer par</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.assignedTo} onValueChange={(value) => setFilters({ ...filters, assignedTo: value })}>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSIGNEES.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous les statuts">Tous les statuts</SelectItem>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.source} onValueChange={(value) => setFilters({ ...filters, source: value })}>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toutes les sources">Toutes les sources</SelectItem>
                {SOURCES.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="recent">Récents</SelectItem>
                <SelectItem value="old">Anciens</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

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

          <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
            Actions en masse
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
            <Search className="h-4 w-4" />
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
              <TableHead className="font-semibold text-gray-700">Créé Par</TableHead>
              <TableHead className="font-semibold text-gray-700">Nom</TableHead>
              <TableHead className="font-semibold text-gray-700">Email</TableHead>
              <TableHead className="font-semibold text-gray-700">Code Postal</TableHead>
              <TableHead className="font-semibold text-gray-700">Téléphone</TableHead>
              <TableHead className="font-semibold text-gray-700">Attribuer à</TableHead>
              <TableHead className="font-semibold text-gray-700">Statut</TableHead>
              <TableHead className="font-semibold text-gray-700">Source</TableHead>
              <TableHead className="font-semibold text-gray-700">Intérêt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProspects.length > 0 ? (
              filteredProspects.map((prospect) => (
                <TableRow key={prospect.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                  <TableCell>
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-gray-600 to-gray-800">
                      <AvatarFallback className="text-white text-xs font-medium">
                        {prospect.assignedTo[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                      {prospect.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{prospect.email || "—"}</TableCell>
                  <TableCell>
                    <span className="text-blue-600 font-medium">{prospect.postalCode}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-600 font-medium">{prospect.phone}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">{prospect.assignedTo}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(prospect.status)} font-medium px-3 py-1 rounded-full border`}>
                        {prospect.status}
                      </Badge>
                      <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{prospect.source}</TableCell>
                  <TableCell>
                    <span className="text-blue-600 font-medium">{prospect.interest || "—"}</span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  Aucun prospect trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
