import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2 } from 'lucide-react'
import logoImage from '../assets/logo.jpeg'

export default function ForgotPasswordPage({ onBackToLogin }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { sendPasswordResetEmail } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const { error } = await sendPasswordResetEmail(email)

      if (error) {
        setError('Erro ao enviar o e-mail de redefinição. Verifique o e-mail e tente novamente.')
      } else {
        setMessage('Um e-mail de redefinição de senha foi enviado para o seu endereço de e-mail.')
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen investbet-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md investbet-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={logoImage} 
              alt="InvestBet Capital" 
              className="investbet-logo"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Redefinir Senha
          </CardTitle>
          <CardDescription className="text-gray-600">
            Insira seu e-mail para receber as instruções de redefinição de senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar E-mail de Redefinição'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              className="w-full" 
              onClick={onBackToLogin}
              disabled={isLoading}
            >
              Voltar para o Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
