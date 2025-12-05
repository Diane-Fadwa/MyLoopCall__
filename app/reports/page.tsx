"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronRight,
  FileText,
  BarChart3,
  DollarSign,
  CreditCard,
  Users,
  FileBarChart,
  Gift,
  MessageSquare,
  User,
} from "lucide-react"

const salesReports = [
  { id: "billing", title: "Rapport de facturation", icon: FileText },
  { id: "article", title: "Rapport article", icon: FileBarChart },
  { id: "payments", title: "Paiements reçus", icon: CreditCard },
  { id: "credit-notes", title: "Rapport des notes de crédit", icon: FileText },
  { id: "offers", title: "Rapport des offres", icon: Gift },
  { id: "quotes", title: "Rapports de Devis", icon: MessageSquare },
  { id: "client", title: "Rapport Client", icon: User },
]

const graphicReports = [
  { id: "total-revenue", title: "Revenu total", icon: DollarSign },
  { id: "payment-modes", title: "Modes de paiement (transactions)", icon: CreditCard },
  { id: "client-categories", title: "Valeur totale par type de catégories clients", icon: Users },
]

export default function ReportsPage() {
  const [openSections, setOpenSections] = useState<string[]>(["sales", "graphics"])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Reports */}
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-sm">
          <Collapsible open={openSections.includes("sales")} onOpenChange={() => toggleSection("sales")}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto hover:bg-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Rapport de Ventes</h2>
                  {openSections.includes("sales") ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 ml-auto" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4 space-y-2">
              {salesReports.map((report) => {
                const Icon = report.icon
                return (
                  <Collapsible key={report.id}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{report.title}</span>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Graphic Reports */}
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-sm">
          <Collapsible open={openSections.includes("graphics")} onOpenChange={() => toggleSection("graphics")}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto hover:bg-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Rapport via graphique</h2>
                  {openSections.includes("graphics") ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 ml-auto" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4 space-y-2">
              {graphicReports.map((report) => {
                const Icon = report.icon
                return (
                  <Collapsible key={report.id}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left hover:bg-green-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{report.title}</span>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  )
}
