"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ParametresPage() {
  const sections = [
    {
      title: "Collaborateurs",
      description: "Gérez les utilisateurs et les droits d'accès",
      href: "/parametres/collaborateurs",
    },
    { title: "Clients", description: "Configurez les paramètres des clients", href: "/parametres/clients" },
    { title: "Prospects", description: "Gérez les paramètres des prospects", href: "/parametres/prospects" },
    { title: "Rôles", description: "Gérez les rôles et les permissions", href: "/parametres/roles" },
    { title: "Finance", description: "Gérez les paramètres financiers", href: "/parametres/finance" },
    { title: "Contrats", description: "Gérez les paramètres des contrats", href: "/parametres/contrats" },
    { title: "Devis", description: "Gérez les demandes de devis", href: "/parametres/estimate" },
    { title: "Champs personnalisés", description: "Créez des champs personnalisés", href: "/parametres/champs" },
    { title: "Support", description: "Gérez les paramètres de support", href: "/parametres/support" },
    { title: "Modules", description: "Activez ou désactivez les modules", href: "/parametres/modules" },
    { title: "Modèles d'emails", description: "Créez et modifiez les modèles d'emails", href: "/parametres/emails" },
    { title: "Configuration", description: "Paramètres généraux de l'application", href: "/parametres/config" },
    { title: "GDPR", description: "Gérez la conformité GDPR", href: "/parametres/gdpr" },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-2">Gérez tous les paramètres de votre CRM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
