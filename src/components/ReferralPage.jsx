import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import {
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  CheckCircle2,
  Link as LinkIcon,
  UserPlus
} from 'lucide-react'

export default function ReferralPage() {
  const { profile } = useAuth()
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalInvested: 0,
    totalEarnings: 0
  })

  // Gerar link de referência
  const referralLink = profile?.referral_code 
    ? `${window.location.origin}/?ref=${profile.referral_code}`
    : ''

  // Buscar indicados do consultor
  useEffect(() => {
  const fetchReferrals = async () => {
    if (!profile?.referral_code && !profile?.name) return

    try {
      setLoading(true)

      // 1. Buscar estatísticas do consultor na View referral_stats
      const { data: statsData, error: statsError } = await supabase
        .from('referral_stats')
        .select('total_referrals, total_profit, total_earnings')
        .eq('referral_code', profile.referral_code?.trim())
        .single()

      if (statsError) {
        console.error('Erro ao buscar estatísticas do consultor:', statsError)
        // Não alertar, pois pode ser que o consultor não tenha indicados
      }

      const stats = statsData || { total_referrals: 0, total_earnings: 0 }

      // 2. Buscar todos os clientes indicados por este consultor
      // Buscar por código de referência OU por nome no campo indicacao
      // O filtro por Categoria='cliente' foi removido para incluir clientes que viraram consultores
      const { data: referralsByCode, error: errorByCode } = await supabase
        .from('profiles')
        .select('*')
        .or(`referred_by_code.eq.${profile.referral_code?.trim()},indicacao.eq.${profile.name?.trim()}`)
        .order('created_at', { ascending: false })

      if (errorByCode) {
        console.error('Erro ao buscar indicados:', errorByCode)
        
        // Tentar busca alternativa caso a primeira falhe
        const { data: referralsData, error: referralsError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (referralsError) {
          alert(`Erro ao buscar indicados: ${referralsError.message}. Verifique as políticas RLS.`)
          return
        }

        // Filtrar manualmente os indicados
        const filteredReferrals = (referralsData || []).filter(r => {
          const refCode = r.referred_by_code?.trim()
          const indication = r.indicacao?.trim()
          const myCode = profile.referral_code?.trim()
          const myName = profile.name?.trim()
          
          return refCode === myCode || indication === myName
        })
        
        setReferrals(filteredReferrals)
        
        // Calcular estatísticas
        const totalInvested = filteredReferrals.reduce(
          (sum, ref) => sum + (ref.initial_balance || 0),
          0
        )
        
        const totalEarnings = filteredReferrals.reduce((sum, ref) => {
          const profit = (ref.balance || 0) - (ref.initial_balance || 0)
          return sum + (profit > 0 ? profit * 0.10 : 0)
        }, 0)

        setStats({
          totalReferrals: filteredReferrals.length,
          totalInvested,
          totalEarnings
        })
        
        setLoading(false)
        return
      }

      const referrals = referralsByCode || []
      setReferrals(referrals)

      // 3. Calcular estatísticas
      const totalInvested = referrals.reduce(
        (sum, ref) => sum + (ref.initial_balance || 0),
        0
      )
      
      const totalEarnings = referrals.reduce((sum, ref) => {
        const profit = (ref.balance || 0) - (ref.initial_balance || 0)
        return sum + (profit > 0 ? profit * 0.10 : 0)
      }, 0)

      setStats({
        totalReferrals: referrals.length,
        totalInvested,
        totalEarnings
      })
    } catch (error) {
      console.error('Erro geral ao buscar indicados:', error)
    } finally {
      setLoading(false)
    }
  }

    fetchReferrals()
  }, [profile])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const calculateProfit = (balance, initialBalance) => {
    const profit = (balance || 0) - (initialBalance || 0)
    return profit > 0 ? profit : 0
  }

  const calculateEarnings = (balance, initialBalance) => {
    const profit = calculateProfit(balance, initialBalance)
    return profit * 0.10
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando indicações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Sistema de Indicações</h2>
        <p className="text-gray-600 mt-1">
          Compartilhe seu link e ganhe 10% sobre o lucro mensal de cada cliente indicado
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Indicados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalReferrals}
            </div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados pelo seu link
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalInvested)}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma dos investimentos iniciais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seus Ganhos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(stats.totalEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">
              10% do lucro dos seus indicados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Link de Referência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Seu Link de Indicação
          </CardTitle>
          <CardDescription>
            Compartilhe este link com seus contatos para ganhar comissões
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
            <Button onClick={copyToClipboard} variant="outline">
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>

          <Alert>
            <UserPlus className="h-4 w-4" />
            <AlertDescription>
              <strong>Como funciona:</strong> Quando alguém se cadastrar usando seu link, 
              você receberá 10% do lucro mensal desse cliente. O lucro é calculado como 
              (Saldo Atual - Investimento Inicial).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Lista de Indicados */}
      <Card>
        <CardHeader>
          <CardTitle>Seus Indicados</CardTitle>
          <CardDescription>
            Lista de todos os clientes cadastrados pelo seu link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Você ainda não tem indicados</p>
              <p className="text-sm mt-1">Compartilhe seu link para começar a ganhar comissões</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Nome</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Investimento</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Saldo Atual</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Lucro</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Seu Ganho</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => {
                    const profit = calculateProfit(referral.balance, referral.initial_balance)
                    const earnings = calculateEarnings(referral.balance, referral.initial_balance)
                    
                    return (
                      <tr key={referral.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{referral.name}</p>
                            <p className="text-xs text-gray-500">{referral.email}</p>
                            {/* NOVO: Exibir a categoria se não for cliente */}
                            {referral.Categoria !== 'cliente' && (
                                <Badge variant="secondary" className="mt-1">
                                    {referral.Categoria}
                                </Badge>
                            )}
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-gray-700">
                          {formatCurrency(referral.initial_balance)}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-700">
                          {formatCurrency(referral.balance)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={profit > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                            {formatCurrency(profit)}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className="text-purple-600 font-medium">
                            {formatCurrency(earnings)}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                            {referral.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-medium">
                    <td className="py-3 px-4">Total</td>
                    <td className="text-right py-3 px-4 text-green-600">
                      {formatCurrency(stats.totalInvested)}
                    </td>
                    <td className="text-right py-3 px-4"></td>
                    <td className="text-right py-3 px-4"></td>
                    <td className="text-right py-3 px-4 text-purple-600">
                      {formatCurrency(stats.totalEarnings)}
                    </td>
                    <td className="text-center py-3 px-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
