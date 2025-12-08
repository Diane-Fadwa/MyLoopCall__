"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react"
import { parseFile } from "@/lib/import-utils"

interface ImportDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: Record<string, string>[]) => void
  title: string
  description: string
}

export function ImportDialog({ isOpen, onOpenChange, onImport, title, description }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [mappings, setMappings] = useState<Record<string, string>>({})
  const [headers, setHeaders] = useState<string[]>([])
  const [step, setStep] = useState<"upload" | "map" | "confirm">("upload")
  const [error, setError] = useState<string>("")
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setFile(null)
      setMappings({})
      setHeaders([])
      setStep("upload")
      setError("")
      setRows([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [isOpen])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("")
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    try {
      const data = await parseFile(selectedFile)
      setFile(selectedFile)
      setHeaders(data.headers)
      setRows(data.rows)
      setStep("map")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement du fichier")
    }
  }

  const handleMappingChange = (fileColumn: string, appField: string) => {
    setMappings((prev) => ({
      ...prev,
      [fileColumn]: appField,
    }))
  }

  const handleImport = () => {
    const mappedData = rows.map((row) => {
      const mapped: Record<string, string> = {}
      Object.entries(mappings).forEach(([fileColumn, appField]) => {
        if (appField && appField !== "ignore") {
          mapped[appField] = row[fileColumn] || ""
        }
      })
      return mapped
    })

    onImport(mappedData)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mx-4">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Upload Step */}
            {step === "upload" && (
              <>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="mb-4">
                    <p className="text-lg font-medium text-gray-800">Sélectionner un fichier</p>
                    <p className="text-sm text-gray-600 mt-1">CSV ou Excel (XLSX)</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                  />
                  <Button variant="default">Parcourir les fichiers</Button>
                  <p className="text-xs text-gray-500 mt-4">Ou glissez-déposez votre fichier ici</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">Format attendu :</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Première ligne : en-têtes (noms des colonnes)</li>
                    <li>• CSV séparé par des virgules</li>
                    <li>• Excel avec données en ligne</li>
                  </ul>
                </div>
              </>
            )}

            {/* Mapping Step */}
            {step === "map" && (
              <>
                <div>
                  <p className="font-medium text-gray-800 mb-3">Mapper les colonnes du fichier aux champs :</p>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {headers.map((header) => (
                      <div
                        key={header}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{header}</p>
                        </div>
                        <span className="text-gray-400 text-sm flex-shrink-0">→</span>
                        <div className="flex-1 min-w-0">
                          <select
                            value={mappings[header] || "ignore"}
                            onChange={(e) => handleMappingChange(header, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="ignore">Ignorer</option>
                            {getAvailableFields().map((field) => (
                              <option key={field} value={field}>
                                {field}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {rows.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Aperçu ({rows.length} lignes)</p>
                    <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                      {rows.slice(0, 3).map((row, idx) => (
                        <div key={idx} className="py-1 border-b border-gray-200">
                          {Object.values(row).slice(0, 3).join(" | ")}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Confirm Step */}
            {step === "confirm" && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-800">Prêt à importer</p>
                <p className="text-sm text-gray-600 mt-2">{rows.length} enregistrements seront importés</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            {step === "upload" && (
              <Button disabled={!file} onClick={() => file && setStep("map")}>
                Continuer
              </Button>
            )}
            {step === "map" && (
              <>
                <Button variant="outline" onClick={() => setStep("upload")}>
                  Retour
                </Button>
                <Button onClick={() => setStep("confirm")}>Aperçu</Button>
              </>
            )}
            {step === "confirm" && (
              <Button onClick={handleImport} className="bg-green-600 hover:bg-green-700 text-white">
                Importer
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function getAvailableFields(): string[] {
  return [
    "societe",
    "contactPrincipal",
    "emailPrincipal",
    "telephone",
    "categories",
    "interessePar",
    "dateRDV",
    "name",
    "email",
    "postalCode",
    "phone",
    "assignedTo",
    "status",
    "source",
    "interest",
  ]
}
