import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Users } from 'lucide-react'

// Este componente simula a listagem de "Indicações - Visão Geral"
// Ele lista todos os perfis, exceto o do administrador logado.
export default function ClientListPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return

      try {
        setLoading(true)

        // CORREÇÃO: Remover o filtro estrito por Categoria='cliente'
        // Listar todos os perfis, exceto o do administrador logado
        const { data: clientsData, error: clientsError } = await supabase
          .from('profiles')
          .select('*')
          .neq('email', user.email) // Filtra o próprio administrador
          .order('name', { ascending: true })

        if (clientsError) {
          console.error('Erro ao buscar clientes:', clientsError)
          alert(`Erro ao buscar clientes: ${clientsError.message}. Verifique as políticas RLS.`)
          return
        }

        setClients(clientsData || [])
      } catch (error) {
        console.error('Erro geral ao buscar clientes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [user])

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
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes (Visão Geral)</CardTitle>
          <CardDescription>
            Todos os clientes cadastrados no sistema (incluindo consultores promovidos)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum cliente encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Consultor</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Investimento</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Saldo Atual</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Lucro</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => {
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
                          {client.indicacao || 'N/A'}
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
                          <Badge variant={client.Categoria === 'consultor' ? 'default' : 'secondary'}>
                            {client.Categoria}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-medium">
                    <td className="py-3 px-4">Total ({clients.length} clientes)</td>
                    <td className="py-3 px-4"></td>
                    <td className="text-right py-3 px-4 text-green-600">
                      {formatCurrency(clients.reduce((sum, c) => sum + (c.initial_balance || 0), 0))}
                    </td>
                    <td className="text-right py-3 px-4">
                      {formatCurrency(clients.reduce((sum, c) => sum + (c.balance || 0), 0))}
                    </td>
                    <td className="text-right py-3 px-4">
                      {formatCurrency(clients.reduce((sum, c) => sum + calculateProfit(c.balance, c.initial_balance), 0))}
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
