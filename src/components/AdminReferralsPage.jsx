import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import {
  Users,
  DollarSign,
  TrendingUp,
  UserCheck,
  Filter
} from 'lucide-react'

export default function AdminReferralsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'referred'
  const [stats, setStats] = useState({
    totalClients: 0,
    totalInvested: 0,
    totalProfit: 0,
    referredClients: 0,
    directClients: 0
  })

  // Buscar todos os clientes
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)

      // Buscar todos os clientes (Categoria = 'cliente' ou NULL)
      const { data: clientsData, error: clientsError } = await supabase
        .from('profiles')
        .select('*')
        .not('email', 'in', '("douglasnoticias@gmail.com", "kennymateus20@gmail.com")')
        .order('created_at', { ascending: false })

      if (clientsError) {
        console.error('Erro ao buscar clientes:', clientsError)
        return
      }

      // Buscar o nome do consultor para todos os clientes de uma vez
      const referralCodes = [...new Set((clientsData || []).map(c => c.referred_by_code).filter(Boolean))]
      let consultantsMap = {}

      if (referralCodes.length > 0) {
        const { data: consultantsData, error: consultantsError } = await supabase
          .from('profiles')
          .select('name, referral_code')
          .in('referral_code', referralCodes)
          .eq('Categoria', 'consultor') // Adicionar filtro de categoria para garantir que só consultores sejam buscados

        if (!consultantsError && consultantsData) {
          consultantsMap = consultantsData.reduce((acc, curr) => {
            acc[curr.referral_code] = curr.name
            return acc
          }, {})
        }
      }

      const clientsWithConsultant = (clientsData || []).map(client => ({
        ...client,
        consultantName: client.referred_by_code ? consultantsMap[client.referred_by_code] || null : null
      }))

      setClients(clientsWithConsultant)

      // Calcular estatísticas
      const totalInvested = clientsWithConsultant.reduce(
        (sum, client) => sum + (client.initial_balance || 0),
        0
      )

      const totalProfit = clientsWithConsultant.reduce((sum, client) => {
        const profit = (client.balance || 0) - (client.initial_balance || 0)
        return sum + (profit > 0 ? profit : 0)
      }, 0)

      const referredClients = clientsWithConsultant.filter(
        (client) => client.referred_by_code
      ).length

      setStats({
        totalClients: clientsWithConsultant.length,
        totalInvested,
        totalProfit,
        referredClients,
        directClients: clientsWithConsultant.length - referredClients // Manter o cálculo para consistência, mas não será usado no filtro
      })
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const calculateProfit = (balance, initialBalance) => {
    const profit = (balance || 0) - (initialBalance || 0)
    return profit > 0 ? profit : 0
  }

  // Filtrar clientes
  const filteredClients = clients.filter((client) => {
    if (filter === 'referred') return client.referred_by_code
    if (filter === 'all') return true
    return false // Não deve chegar aqui, mas garante que apenas 'all' e 'referred' funcionem
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Indicações - Visão Geral</h2>
        <p className="text-gray-600 mt-1">
          Visualize todos os clientes e suas origens de cadastro
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalClients}
            </div>
            <p className="text-xs text-muted-foreground">
              Todos os clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Indicados</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.referredClients}
            </div>
            <p className="text-xs text-muted-foreground">
              Cadastrados por consultores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(stats.totalInvested)}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma dos investimentos iniciais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.totalProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lucro acumulado dos clientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({stats.totalClients})
            </button>
            <button
              onClick={() => setFilter('referred')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'referred'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Indicados ({stats.referredClients})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filter === 'all' && 'Todos os clientes cadastrados no sistema'}
            {filter === 'referred' && 'Clientes cadastrados por consultores'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum cliente encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Consultor</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Investimento</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Saldo Atual</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Lucro</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => {
                    const profit = calculateProfit(client.balance, client.initial_balance)

                    return (
                      <tr key={client.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{client.name}</p>
                            <p className="text-xs text-gray-500">{client.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {client.consultantName ? (
                            <Badge variant="default">{client.consultantName}</Badge>
                          ) : (
                            <Badge variant="outline">N/A</Badge>
                          )}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-700">
                          {formatCurrency(client.initial_balance)}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-700">
                          {formatCurrency(client.balance)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={profit > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                            {formatCurrency(profit)}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                            {client.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-medium">
                    <td className="py-3 px-4" colSpan="2">
                      Total ({filteredClients.length} clientes)
                    </td>
                    <td className="text-right py-3 px-4 text-purple-600">
                      {formatCurrency(
                        filteredClients.reduce((sum, c) => sum + (c.initial_balance || 0), 0)
                      )}
                    </td>
                    <td className="text-right py-3 px-4 text-blue-600">
                      {formatCurrency(
                        filteredClients.reduce((sum, c) => sum + (c.balance || 0), 0)
                      )}
                    </td>
                    <td className="text-right py-3 px-4 text-green-600">
                      {formatCurrency(
                        filteredClients.reduce((sum, c) => sum + calculateProfit(c.balance, c.initial_balance), 0)
                      )}
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
