import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2 } from 'lucide-react'
import logoImage from '../assets/logo.jpeg'
import SignUpPage from './SignUpPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import './AuthPage.css'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError('Email ou senha incorretos. Tente novamente.')
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (showSignUp) {
    return <SignUpPage onBackToLogin={() => setShowSignUp(false)} />
  }

  if (showForgotPassword) {
    return <ForgotPasswordPage onBackToLogin={() => setShowForgotPassword(false)} />
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
            InvestBet Capital
          </CardTitle>
          <CardDescription className="text-gray-600">
            Terceirização de Trader Esportivo
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
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="text-right">
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => setShowForgotPassword(true)}
                  disabled={isLoading}
                >
                  Esqueceu a Senha?
                </Button>
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
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
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              className="w-full" 
              onClick={() => setShowSignUp(true)}
              disabled={isLoading}
            >
              Criar Nova Conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

