"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Upload, Users, Search, RefreshCw, Filter } from "lucide-react"

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [excludeInactive, setExcludeInactive] = useState(true)

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
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

      {/* Client Synthesis */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Synthèse des Clients</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">66</div>
            <div className="text-sm text-gray-600">Nombre total de clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">0</div>
            <div className="text-sm text-green-700">Clients Actifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">66</div>
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
          <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
            Exporter
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
            Actions en masse
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
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
              <TableHead className="font-semibold text-gray-700">
                <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors">
                  Société
                  <RefreshCw className="h-4 w-4" />
                </div>
              </TableHead>
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
            <TableRow>
              <TableCell colSpan={11} className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-12 w-12 text-gray-300" />
                  <div className="text-lg font-medium">Aucun enregistrement trouvé</div>
                  <div className="text-sm">Commencez par ajouter votre premier client</div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
