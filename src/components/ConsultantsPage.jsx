import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import {
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw,
  UserCheck,
  AlertCircle
} from 'lucide-react'

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState([])
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(null)
  const [stats, setStats] = useState({
    totalConsultants: 0,
    totalReferrals: 0,
    totalEarnings: 0
  })

  // Buscar consultores e suas estatísticas
  useEffect(() => {
    fetchConsultants()
  }, [])

  const fetchConsultants = async () => {
    try {
      setLoading(true)

      // Buscar estatísticas de consultores da View corrigida
      // A view agora deve estar corrigida para considerar ambos os campos e o trim
      const { data: statsData, error: statsError } = await supabase
        .from('referral_stats')
        .select('*')
        .order('consultant_name', { ascending: true })

      if (statsError) {
        console.error('Erro ao buscar estatísticas de consultores:', statsError)
        alert(`Erro ao buscar estatísticas de consultores: ${statsError.message}. Verifique as políticas RLS.`)
        return
      }
      
      const consultantsWithStats = (statsData || []).map(stat => ({
        id: stat.consultant_id,
        name: stat.consultant_name,
        email: stat.consultant_email,
        referral_code: stat.referral_code,
        referralCount: stat.total_referrals,
        // Usar total_earnings da view, que deve estar correta
        monthlyEarnings: stat.total_earnings, 
        consultant_earnings: stat.consultant_earnings,
        last_earnings_reset: stat.last_earnings_reset
      }))

      setConsultants(consultantsWithStats)

      // Calcular estatísticas gerais
      const totalReferrals = consultantsWithStats.reduce((sum, c) => sum + c.referralCount, 0)
      const totalEarnings = consultantsWithStats.reduce((sum, c) => sum + c.monthlyEarnings, 0)

      setStats({
        totalConsultants: consultantsWithStats.length,
        totalReferrals,
        totalEarnings
      })
    } catch (error) {
      console.error('Erro ao buscar consultores:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetEarnings = async (consultantId) => {
    if (!confirm('Tem certeza que deseja resetar os ganhos deste consultor? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      setResetting(consultantId)

      const { error } = await supabase
        .from('profiles')
        .update({
          consultant_earnings: 0,
          last_earnings_reset: new Date().toISOString()
        })
        .eq('id', consultantId)

      if (error) {
        console.error('Erro ao resetar ganhos:', error)
        alert('Erro ao resetar ganhos. Tente novamente.')
        return
      }

      // Atualizar lista
      await fetchConsultants()
      alert('Ganhos resetados com sucesso!')
    } catch (error) {
      console.error('Erro ao resetar ganhos:', error)
      alert('Erro ao resetar ganhos. Tente novamente.')
    } finally {
      setResetting(null)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatDate = (date) => {
    if (!date) return 'Nunca'
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando consultores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Consultores</h2>
        <p className="text-gray-600 mt-1">
          Visualize e gerencie todos os consultores e suas comissões
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Consultores</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalConsultants}
            </div>
            <p className="text-xs text-muted-foreground">
              Consultores ativos no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Indicações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalReferrals}
            </div>
            <p className="text-xs text-muted-foreground">
              Clientes indicados por consultores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ganhos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(stats.totalEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">
              Comissões do mês atual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta Informativo */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Atenção:</strong> Os ganhos mostrados são calculados em tempo real com base 
          no lucro atual dos clientes indicados. Use o botão "Resetar" após efetuar o pagamento 
          ao consultor para zerar o contador e registrar a data do pagamento.
        </AlertDescription>
      </Alert>

      {/* Lista de Consultores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Consultores</CardTitle>
          <CardDescription>
            Todos os consultores cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {consultants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum consultor cadastrado</p>
              <p className="text-sm mt-1">Altere a categoria de um usuário para "consultor" no Supabase</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Consultor</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Código</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Indicados</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Ganhos do Mês</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Último Reset</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {consultants.map((consultant) => (
                    <tr key={consultant.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{consultant.name}</p>
                          <p className="text-xs text-gray-500">{consultant.email}</p>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="outline" className="font-mono">
                          {consultant.referral_code || 'N/A'}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="secondary">
                          {consultant.referralCount}
                        </Badge>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-purple-600 font-medium">
                          {formatCurrency(consultant.monthlyEarnings)}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4 text-sm text-gray-600">
                        {formatDate(consultant.last_earnings_reset)}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetEarnings(consultant.id)}
                          disabled={resetting === consultant.id || consultant.monthlyEarnings === 0}
                        >
                          {resetting === consultant.id ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Resetando...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Resetar
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-medium">
                    <td className="py-3 px-4">Total</td>
                    <td className="text-center py-3 px-4"></td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="secondary">{stats.totalReferrals}</Badge>
                    </td>
                    <td className="text-right py-3 px-4 text-purple-600">
                      {formatCurrency(stats.totalEarnings)}
                    </td>
                    <td className="text-center py-3 px-4"></td>
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
