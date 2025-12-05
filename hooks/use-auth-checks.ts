"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function useAuthCheck() {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Pages publiques qui ne nécessitent pas l'authentification
  const publicPages = ["/login", "/forgot-password"]
  const isPublicPage = publicPages.includes(pathname)

  // Si c'est une page publique, on n'a pas besoin d'être authentifié
  if (isPublicPage) {
    return { isAuthenticated: true }
  }

  // Si ce n'est pas une page publique, on vérifie l'authentification
  return { isAuthenticated: mounted && isAuthenticated, isLoading }
}
