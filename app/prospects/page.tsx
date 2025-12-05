"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Upload, List, Grid3X3, Search, ChevronDown } from "lucide-react"

const prospects = [
  {
    id: 1,
    name: "Akram Ben Halima",
    email: "",
    postalCode: "10150",
    phone: "0618248760",
    status: "RAPPEL YACINE",
    statusColor: "bg-green-100 text-green-800 border-green-200",
    source: "PV",
    interest: "",
  },
  {
    id: 2,
    name: "mohammed kabeli",
    email: "mohamedelkabeli@sfr.fr",
    postalCode: "09200",
    phone: "0615787766",
    status: "RAPPEL PV",
    statusColor: "bg-blue-100 text-blue-800 border-blue-200",
    source: "PAC + Chaudière Electrique PAC 16",
    interest: "",
  },
  {
    id: 3,
    name: "JUSTIN ROMIYO",
    email: "",
    postalCode: "58000",
    phone: "0651945599",
    status: "RAPPEL PV",
    statusColor: "bg-blue-100 text-blue-800 border-blue-200",
    source: "PV",
    interest: "",
  },
  {
    id: 4,
    name: "AMELLAL SAMIRA",
    email: "sam.momo@hotmail.fr",
    postalCode: "19100",
    phone: "0618580566",
    status: "VALIDATION PAC",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    source: "PAC + Chaudière Electrique LA PLATEFORME DES ENERGIES",
    interest: "",
  },
  {
    id: 5,
    name: "ROUHULLAH MOUSSAI",
    email: "",
    postalCode: "31270",
    phone: "0782856745",
    status: "RAPPEL YACINE",
    statusColor: "bg-green-100 text-green-800 border-green-200",
    source: "SSC",
    interest: "",
  },
]

export default function ProspectsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
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

      {/* Filters */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-white border-0 shadow-sm">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Filtrer par</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                <SelectValue placeholder="Attribuer à" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="yacine">Yacine</SelectItem>
                <SelectItem value="admin">Administration</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                <SelectValue placeholder="Annulation PAC, INJOIGNABLE, ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="rappel-yacine">Rappel Yacine</SelectItem>
                <SelectItem value="rappel-pv">Rappel PV</SelectItem>
                <SelectItem value="validation-pac">Validation PAC</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sources</SelectItem>
                <SelectItem value="pv">PV</SelectItem>
                <SelectItem value="pac">PAC</SelectItem>
                <SelectItem value="ssc">SSC</SelectItem>
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
          <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
            Exporter
          </Button>
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
            {prospects.map((prospect) => (
              <TableRow key={prospect.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                <TableCell>
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-gray-600 to-gray-800">
                    <AvatarFallback className="text-white text-xs font-medium">
                      {prospect.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
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
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-gray-600 to-gray-800">
                    <AvatarFallback className="text-white text-xs font-medium">A</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={`${prospect.statusColor} font-medium px-3 py-1 rounded-full border`}>
                      {prospect.status}
                    </Badge>
                    <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 max-w-xs">
                  <div className="truncate" title={prospect.source}>
                    {prospect.source || "----"}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-blue-600 font-medium">{prospect.interest || "PV"}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
