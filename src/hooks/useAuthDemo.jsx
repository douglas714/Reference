import { useState, useEffect, createContext, useContext } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

// Simulação de dados para demonstração
const DEMO_USER = {
  id: 'demo-user-123',
  email: 'douglasnoticias@gmail.com',
  email_confirmed_at: new Date().toISOString(),
}

const DEMO_PROFILE = {
  id: 'demo-user-123',
  role: 'Trader',
  name: 'Douglas Notícias',
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      console.log('useAuth: Tentativa de login com:', email)
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar credenciais de demonstração
      if (email === 'douglasnoticias@gmail.com' && password === '123456') {
        console.log('useAuth: Login bem-sucedido (demo)')
        
        // Salvar no localStorage para persistência
        localStorage.setItem('demo_user', JSON.stringify(DEMO_USER))
        localStorage.setItem('demo_profile', JSON.stringify(DEMO_PROFILE))
        
        setUser(DEMO_USER)
        setProfile(DEMO_PROFILE)
        
        return { data: { user: DEMO_USER } }
      } else {
        console.log('useAuth: Credenciais inválidas')
        return { error: { message: 'Credenciais inválidas' } }
      }
    } catch (error) {
      console.error('useAuth: Erro inesperado no login:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('useAuth: Realizando logout')
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Limpar localStorage
      localStorage.removeItem('demo_user')
      localStorage.removeItem('demo_profile')
      
      // Limpar estados locais
      setUser(null)
      setProfile(null)
      console.log('useAuth: Logout realizado com sucesso')
      return { success: true }
    } catch (error) {
      console.error('useAuth: Erro inesperado no logout:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('useAuth: Inicializando autenticação...')
        
        // Simular delay de inicialização
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Verificar se há sessão salva no localStorage
        const savedUser = localStorage.getItem('demo_user')
        const savedProfile = localStorage.getItem('demo_profile')
        
        if (savedUser && savedProfile && mounted) {
          const userData = JSON.parse(savedUser)
          const profileData = JSON.parse(savedProfile)
          
          console.log('useAuth: Sessão encontrada no localStorage:', userData.email)
          setUser(userData)
          setProfile(profileData)
        } else {
          console.log('useAuth: Nenhuma sessão encontrada')
        }
      } catch (error) {
        console.error('useAuth: Erro na inicialização:', error)
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  const value = {
    user,
    profile,
    loading,
    initialized,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

