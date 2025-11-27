import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import AuthPage from './components/AuthPage'
import ContractPage from './components/ContractPage'
import Dashboard from './components/Dashboard'
import './App.css'
import UpdatePasswordPage from './components/UpdatePasswordPage'

function AppContent() {
  const { user, profile, loading, initialized } = useAuth()
  const [contractAccepted, setContractAccepted] = useState(false)
  
  useEffect(() => {
    console.log('AppContent: Estado atual:', { user: !!user, profile: !!profile, loading, initialized, contractAccepted })

    // Verificar se o contrato foi aceito quando o usuário estiver logado
    if (user && initialized) {
      const accepted = localStorage.getItem(`contract_accepted_${user.id}`)
      setContractAccepted(!!accepted)
      console.log('AppContent: Contrato aceito:', !!accepted)
    } else if (!user && initialized) {
      // Resetar estado do contrato quando não há usuário
      setContractAccepted(false)
    }
  }, [user, profile, loading, initialized])

  const handleContractAccept = () => {
    if (user) {
      localStorage.setItem(`contract_accepted_${user.id}`, 'true')
      setContractAccepted(true)
      console.log('AppContent: Contrato aceito e salvo no localStorage.')
    }
  }

  // Mostrar loading enquanto não inicializado ou carregando
  if (!initialized || loading) {
    console.log('AppContent: Renderizando tela de carregamento')
    return (
      <div className="min-h-screen investbet-gradient flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando...</p>
          <p className="text-sm mt-2 opacity-75">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Lógica para lidar com o redirecionamento do Supabase (tratamento de hash)
  const hash = window.location.hash;
  const isRecovery = hash.includes("type=recovery");

  // 1. Prioridade máxima: se for um fluxo de recuperação, renderize a página de atualização de senha.
  if (isRecovery || window.location.pathname === '/update-password') {
    console.log("AppContent: Fluxo de recuperação detectado, renderizando UpdatePasswordPage");
    return <UpdatePasswordPage />;
  }

  // 2. Mostrar loading enquanto não inicializado ou carregando
  if (!initialized || loading) {
    console.log('AppContent: Renderizando tela de carregamento')
    return (
      <div className="min-h-screen investbet-gradient flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando...</p>
          <p className="text-sm mt-2 opacity-75">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // 3. Usuário não logado
  if (!user) {
    console.log('AppContent: Renderizando AuthPage (sem usuário)')
    return <AuthPage />
  }

  // 4. Usuário logado mas contrato não aceito
  if (user && !contractAccepted) {
    console.log('AppContent: Renderizando ContractPage (contrato não aceito)')
    return <ContractPage onAccept={handleContractAccept} />
  }

  // 5. Usuário logado e contrato aceito
  if (user && contractAccepted) {
    console.log('AppContent: Renderizando Dashboard (tudo pronto)')
    return <Dashboard />
  }

  // Fallback
  console.warn('AppContent: Estado inesperado, renderizando AuthPage')
  return <AuthPage />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
