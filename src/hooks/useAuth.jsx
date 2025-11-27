import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Função auxiliar para buscar o perfil
  const fetchProfile = async (userId) => {
    console.log('useAuth: Buscando perfil para o usuário:', userId);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('useAuth: Erro ao buscar perfil. Isso pode ser um problema de RLS:', profileError);
      return null;
    }
    
    console.log('useAuth: Perfil retornado do Supabase:', profileData);
    return profileData;
  };


  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('useAuth: Erro no login:', error)
        return { error }
      }

      console.log('useAuth: Login realizado com sucesso:', data)
      return { data }
    } catch (error) {
      console.error('useAuth: Erro inesperado no login:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, name, phone, cpf, referralCode = null) => {
    try {
      setLoading(true)
      console.log('useAuth: Tentativa de cadastro com:', email)
      
      // 1. Limpar o código de referência antes de usar
      const cleanReferralCode = referralCode ? referralCode.trim() : null

      // 2. Buscar o consultor pelo código limpo
      let consultantName = null
      if (cleanReferralCode) {
        const { data: consultant, error: consultantError } = await supabase
          .from('profiles')
          .select('name')
          .eq('referral_code', cleanReferralCode)
          .eq('Categoria', 'consultor')
          .single()
        
        if (!consultantError && consultant) {
          consultantName = consultant.name
          console.log('Consultor encontrado:', consultantName)
        } else {
          console.log('Código de referência inválido ou consultor não encontrado. Erro:', consultantError)
        }
      }

      // 3. Cadastrar o usuário no Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        console.log('useAuth: Erro no cadastro:', error.message)
        return { error }
      }
      
      // 4. Criar perfil do usuário
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              name: name,
              phone: phone,
              cpf: cpf,
              balance: 0,
              // monthly_profit: 0, // Removido: Coluna não existe na migração SQL
              // accumulated_profit: 0, // Removido: Coluna não existe na migração SQL
              status: 'active',
              contract_accepted: false,
              Categoria: 'cliente',
              indicacao: consultantName,
              referred_by_code: cleanReferralCode,
              initial_balance: 0,
            }
          ])
        
        if (profileError) {
          console.error('useAuth: Erro ao criar perfil:', profileError)
          // Retorne o erro para o componente
          return { error: profileError }
        }
      }
      
      console.log('useAuth: Cadastro bem-sucedido')
      return { data }
    } catch (error) {
      console.error('useAuth: Erro inesperado no cadastro:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const sendPasswordResetEmail = async (email) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      })

      if (error) {
        console.error('useAuth: Erro ao enviar email de redefinição:', error)
        return { error }
      }

      console.log('useAuth: Email de redefinição enviado com sucesso')
      return { success: true }
    } catch (error) {
      console.error('useAuth: Erro inesperado ao enviar email de redefinição:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const updateUserPassword = async (newPassword) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        console.error('useAuth: Erro ao atualizar senha:', error)
        return { error }
      }

      console.log('useAuth: Senha atualizada com sucesso')
      return { data }
    } catch (error) {
      console.error('useAuth: Erro inesperado ao atualizar senha:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('useAuth: Erro no logout:', error)
        return { error }
      }

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
    let mounted = true;
    
    // Use uma função assíncrona para gerenciar a inicialização
    const handleAuth = async () => {
      console.log('useAuth: Inicializando autenticação...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (mounted) {
        if (session) {
          console.log('useAuth: Sessão encontrada:', session.user);
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        } else {
          console.log('useAuth: Nenhuma sessão encontrada');
        }
        setLoading(false);
        setInitialized(true);
      }
    };

    handleAuth();

    // Listener para mudanças subsequentes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        console.log('useAuth: Mudança de estado de autenticação:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id).then(profileData => {
            if (mounted) {
              setProfile(profileData);
            }
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
    updateUserPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
