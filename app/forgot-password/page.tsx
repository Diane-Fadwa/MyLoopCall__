"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Mail, ArrowLeft, Check } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { forgotPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-4">
            <Image src="/logo-myloop.png" alt="MY LOOP CALL" fill className="object-contain" priority />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-center">MY LOOP CALL</h1>
          <p className="text-gray-600 text-center mt-2">Centre d'Appel CRM</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Réinitialiser le mot de passe</h2>
              <p className="text-gray-600 mb-6">
                Entrez votre adresse email et nous vous enverrons les instructions pour réinitialiser votre mot de
                passe.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white h-11"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer les instructions"}
                </Button>
              </form>

              {/* Back to Login */}
              <Link href="/login" className="flex items-center justify-center mt-6 text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Retour à la connexion</span>
              </Link>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Email envoyé!</h2>
              <p className="text-gray-600 mb-6 text-center">
                Vérifiez votre boîte de réception pour les instructions de réinitialisation du mot de passe.
              </p>

              <Link href="/login">
                <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition">
                  Retour à la connexion
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">© 2025 MY LOOP CALL. Tous droits réservés.</p>
      </div>
    </div>
  )
}
