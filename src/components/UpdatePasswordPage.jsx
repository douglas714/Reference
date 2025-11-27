import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2 } from 'lucide-react'
import logoImage from '../assets/logo.jpeg'
import { supabase } from '../lib/supabase'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState(null)
  const { updateUserPassword } = useAuth()

  useEffect(() => {
    // O Supabase processa o hash da URL para estabelecer a sessão de recuperação.
    // Chamamos getSession para garantir que o Supabase tenha a chance de processar o hash.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Limpa o hash da URL para evitar que o Supabase tente processá-lo novamente
    // e cause um erro de "otp_expired" em recarregamentos.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await updateUserPassword(password)

      if (error) {
        setError('Erro ao atualizar a senha. Tente novamente.')
      } else {
        setMessage('Sua senha foi atualizada com sucesso! Você será redirecionado para a página de login.')
        // Redirecionar após um pequeno atraso
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  // Mantemos a verificação de sessão para o fluxo de e-mail, mas para o fluxo de Dashboard,
  // o usuário já estará logado. O problema é que o Supabase exige que a sessão seja estabelecida
  // via link de e-mail para que a função `updateUser` funcione sem a senha antiga.
  // A solução mais simples é manter o fluxo de e-mail.
  if (!session) {
    return (
      <div className="min-h-screen investbet-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md investbet-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Aguardando Redirecionamento
            </CardTitle>
            <CardDescription className="text-gray-600">
              Por favor, aguarde enquanto validamos o link de redefinição.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
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
            Definir Nova Senha
          </CardTitle>
          <CardDescription className="text-gray-600">
            Insira e confirme sua nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={isLoading || !session}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Atualizar Senha'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
