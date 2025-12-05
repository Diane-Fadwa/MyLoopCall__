"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Download, RefreshCw, Search } from "lucide-react"

const activities = [
  {
    id: 1,
    description: "User Successfully Logged In [User Id: 1, Is Staff Member: Yes, IP: 41.250.214.246]",
    date: "2025-09-27 16:05:19",
    collaborator: "Administration 1",
  },
  {
    id: 2,
    description: "User Successfully Logged In [User Id: 1, Is Staff Member: Yes, IP: 41.250.214.246]",
    date: "2025-09-27 14:01:16",
    collaborator: "Administration 1",
  },
  {
    id: 3,
    description: "New Lead Added [ID: 3653]",
    date: "2025-09-26 17:47:45",
    collaborator: "Administration 1",
  },
  {
    id: 4,
    description: "Lead Updated [ID: 3643]",
    date: "2025-09-26 14:58:25",
    collaborator: "Administration 1",
  },
  {
    id: 5,
    description: "Lead Updated [ID: 3515]",
    date: "2025-09-26 14:42:58",
    collaborator: "Administration 1",
  },
  {
    id: 6,
    description: "Lead Updated [ID: 3599]",
    date: "2025-09-26 14:39:58",
    collaborator: "Administration 1",
  },
  {
    id: 7,
    description: "Lead Updated [ID: 3648]",
    date: "2025-09-26 14:11:03",
    collaborator: "Administration 1",
  },
  {
    id: 8,
    description: "Lead Updated [ID: 3644]",
    date: "2025-09-26 14:09:09",
    collaborator: "Administration 1",
  },
  {
    id: 9,
    description: "Lead Updated [ID: 3617]",
    date: "2025-09-26 14:06:46",
    collaborator: "Administration 1",
  },
  {
    id: 10,
    description: "Lead Updated [ID: 3650]",
    date: "2025-09-26 14:02:14",
    collaborator: "Administration 1",
  },
  {
    id: 11,
    description: "Lead Updated [ID: 3652]",
    date: "2025-09-26 14:01:49",
    collaborator: "Administration 1",
  },
  {
    id: 12,
    description: "Lead Updated [ID: 3628]",
    date: "2025-09-26 14:00:57",
    collaborator: "Administration 1",
  },
  {
    id: 13,
    description: "Lead Updated [ID: 3651]",
    date: "2025-09-26 13:52:01",
    collaborator: "IBERA CALL",
  },
]

export default function JournalPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrer par date</span>
          </div>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-48 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>

        <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Download className="h-4 w-4 mr-2" />
          Effacer journal
        </Button>
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

      {/* Activity Table */}
      <Card className="bg-white border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-700 w-1/2">Description</TableHead>
              <TableHead className="font-semibold text-gray-700">
                <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors">
                  Date
                  <RefreshCw className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Collaborateur</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                <TableCell className="py-4">
                  <div className="text-gray-700 leading-relaxed">{activity.description}</div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-gray-600 font-medium">{activity.date}</div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-gray-700 font-medium">{activity.collaborator}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
