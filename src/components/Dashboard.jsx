import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
  LogOut,
  DollarSign,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Calendar,
  FileText,
  MessageCircle,
  Crown,
  Gift,
  Zap,
  Star,
  UserPlus,
  Users,
  Settings
} from 'lucide-react'
import logoImage from '../assets/logo.jpeg'
import WithdrawForm from './WithdrawForm'
import DepositForm from './DepositForm'
import ContractModal from './ContractModal'
import MonthlyProfitability from './MonthlyProfitability'
import ReferralPage from './ReferralPage'
import ConsultantsPage from './ConsultantsPage'
import AdminReferralsPage from './AdminReferralsPage'

export default function Dashboard() {
  const { user, profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [showContract, setShowContract] = useState(false)

  // Verificar se é consultor
  const isConsultant = profile?.Categoria === 'consultor'
  
  // Verificar se é administrador
  const isAdmin = profile?.email === 'douglasnoticias@gmail.com'

  const handleSignOut = async () => {
    await signOut()
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src={logoImage} 
                alt="InvestBet Capital" 
                className="w-10 h-10 object-contain rounded"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">InvestBet Capital</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.name || user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap justify-center gap-2 w-full">
            <TabsTrigger value="overview" className="flex-grow text-xs sm:text-sm whitespace-nowrap">Visão Geral</TabsTrigger>
            <TabsTrigger value="deposit" className="flex-grow text-xs sm:text-sm whitespace-nowrap">Depósito</TabsTrigger>
            <TabsTrigger value="withdraw" className="flex-grow text-xs sm:text-sm whitespace-nowrap">Saque</TabsTrigger>
            <TabsTrigger value="profitability" className="flex-grow text-xs sm:text-sm whitespace-nowrap">Rentabilidade Mensal</TabsTrigger>
            <TabsTrigger value="signals" className="flex-grow text-xs sm:text-sm whitespace-nowrap">Sala de Sinal</TabsTrigger>
            
            {/* Aba de Indicações - Apenas para consultores */}
            {isConsultant && (
              <TabsTrigger value="referrals" className="flex-grow text-xs sm:text-sm whitespace-nowrap">
                <UserPlus className="h-4 w-4 mr-1 inline" />
                Indicações
              </TabsTrigger>
            )}
            
            {/* Abas Administrativas - Apenas para douglasnoticias@gmail.com */}
            {isAdmin && (
              <>
                <TabsTrigger value="consultants" className="flex-grow text-xs sm:text-sm whitespace-nowrap">
                  <Users className="h-4 w-4 mr-1 inline" />
                  Consultores
                </TabsTrigger>
                <TabsTrigger value="admin-referrals" className="flex-grow text-xs sm:text-sm whitespace-nowrap">
                  <Settings className="h-4 w-4 mr-1 inline" />
                  Gestão de Indicações
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
              {/* Saldo Atual */}
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(profile?.balance || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Disponível para operações
                  </p>
                </CardContent>
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
              </Card>

              {/* Lucro Mensal */}
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lucro do Mês</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPercentage(profile?.monthly_profit || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Performance do mês atual
                  </p>
                </CardContent>
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
              </Card>
            </div>

            {/* Informações da Conta */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nome</p>
                      <p className="text-sm">{profile?.name || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm">{profile?.email || user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefone</p>
                      <p className="text-sm">{profile?.phone || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <Badge variant={profile?.status === "active" ? "default" : "secondary"}>
                        {profile?.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Botão discreto para acessar o contrato */}
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setShowContract(true)}
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      <FileText className="h-3 w-3" />
                      Ver contrato e termos
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Resumo de Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Rendimento Mensal</span>
                      <div className="flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          {formatPercentage(profile?.monthly_profit || 0)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Capital Disponível</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(profile?.balance || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Gerencie seu saldo e operações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button 
                    onClick={() => setActiveTab('deposit')}
                    className="flex-1"
                    size="lg"
                  >
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Fazer Depósito
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('withdraw')}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <ArrowDownRight className="h-4 w-4 mr-2" />
                    Solicitar Saque do Capital
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposit">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Fazer Depósito
                </CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para fazer seu depósito
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DepositForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownRight className="h-5 w-5" />
                  Solicitar Saque do Capital
                </CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para solicitar seu saque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WithdrawForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profitability">
            <MonthlyProfitability />
          </TabsContent>

          <TabsContent value="signals">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Seção do Grupo Free */}
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <MessageCircle className="h-6 w-6" />
                    Grupo Free - Comece Agora!
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Acesso gratuito aos nossos sinais básicos e comunidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-3">🎯 O que você recebe no Grupo Free:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Sinais básicos diários</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Análises de mercado semanais</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Comunidade ativa de traders</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Dicas e estratégias básicas</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Suporte da comunidade</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Acesso 24/7</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
                      onClick={() => window.open('https://t.me/investbetoficial/1', '_blank')}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Entrar no Grupo Free
                    </Button>
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      100% Gratuito - Sem compromisso
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Seção VIP com Promoção Especial */}
              <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    <Gift className="h-3 w-3 mr-1" />
                    OFERTA ESPECIAL
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <Crown className="h-6 w-6" />
                    Sala VIP - Para Investidores Sérios
                  </CardTitle>
                  <CardDescription className="text-amber-600">
                    Maximize seus resultados com nossa sala de sinais exclusiva
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Oferta Especial em Destaque */}
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-xl text-center relative">
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-yellow-400 text-red-600 rounded-full p-2 animate-bounce">
                        <Star className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">🔥 PROMOÇÃO EXCLUSIVA PARA INVESTIDORES!</h3>
                    <p className="text-lg mb-4">
                      <span className="line-through opacity-75">R$ 69,90/mês</span>
                      <span className="text-3xl font-bold ml-4">R$ 1,00</span>
                    </p>
                    <p className="text-sm bg-white/20 rounded-lg p-2 inline-block">
                      Apenas no primeiro mês para quem já investe conosco
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-200">
                    <h3 className="text-xl font-semibold text-amber-900 mb-4">
                      🚀 Por que escolher o VIP?
                    </h3>
                    
                    <div className="space-y-4 text-amber-800">
                      <p className="leading-relaxed">
                        Nossa <strong>Sala de Sinal VIP</strong> foi desenvolvida para investidores que desejam 
                        maximizar sua rentabilidade através de análises técnicas profissionais e sinais de alta precisão.
                      </p>
                      
                      <p className="leading-relaxed">
                        Fazendo por conta própria, você terá a possibilidade de uma <strong>rentabilidade ainda maior</strong>, 
                        pois uma plataforma complementa a outra para garantir uma performance superior no final do mês.
                      </p>

                      <div className="bg-white/80 p-4 rounded-lg border-l-4 border-amber-400">
                        <h4 className="font-semibold text-amber-900 mb-2">⚠️ Importante:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Esta oferta é <strong>exclusiva</strong> para quem já está ativo no investimento</li>
                          <li>• Caso contrário, você será removido e o valor promocional será devolvido</li>
                          <li>• Após o primeiro mês, o valor retorna para R$ 69,90/mês</li>
                          <li>• Cancele quando quiser, sem multas ou taxas</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/80 p-5 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        ✅ O que você recebe no VIP:
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span><strong>Sinais de alta precisão</strong> (90%+ assertividade)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span><strong>Análises técnicas diárias</strong> detalhadas</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span><strong>Suporte especializado</strong> 1:1</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span><strong>Estratégias avançadas</strong> exclusivas</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span><strong>Alertas em tempo real</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span><strong>Grupo exclusivo</strong> de traders VIP</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/80 p-5 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        📈 Resultados comprovados:
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span><strong>Maior rentabilidade mensal</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span><strong>Redução significativa de riscos</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span><strong>Aprendizado contínuo</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span><strong>Resultados consistentes</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span><strong>Média de 15-25% ao mês</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span><strong>Suporte 24/7</strong></span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Call to Action Duplo */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-4 text-lg font-semibold"
                        onClick={() => window.open('https://pay.kirvano.com/e9b87434-7802-48b4-9c92-4488056b411b', '_blank')}
                      >
                        <Crown className="h-5 w-5 mr-2" />
                        Assinar VIP por R$ 1,00
                      </Button>
                      <p className="text-xs text-amber-600 mt-2">
                        Oferta especial para investidores ativos
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 px-6 py-4 text-lg font-semibold"
                        onClick={() => window.open('https://t.me/investbetoficial/1', '_blank')}
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Começar no Free
                      </Button>
                      <p className="text-xs text-green-600 mt-2">
                        Teste gratuitamente primeiro
                      </p>
                    </div>
                  </div>

                  {/* Depoimentos/Social Proof */}
                  <div className="bg-white/60 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-3 text-center">💬 O que nossos investidores dizem:</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-3 rounded border-l-4 border-green-400">
                        <p className="italic">"Desde que entrei no VIP, minha rentabilidade aumentou 40%. Os sinais são precisos e o suporte é excepcional!"</p>
                        <p className="text-right text-green-600 font-medium mt-2">- Carlos M., Investidor há 2 anos</p>
                      </div>
                      <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                        <p className="italic">"Comecei no grupo free e em 1 mês já migrei para o VIP. Vale cada centavo, os resultados falam por si só."</p>
                        <p className="text-right text-blue-600 font-medium mt-2">- Ana P., Nova investidora</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comparação Free vs VIP */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">📊 Comparação: Free vs VIP</CardTitle>
                  <CardDescription className="text-center">
                    Veja as diferenças e escolha o melhor para você
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left">Recursos</th>
                          <th className="border border-gray-300 p-3 text-center bg-green-50">
                            <div className="flex items-center justify-center gap-2">
                              <MessageCircle className="h-4 w-4 text-green-600" />
                              Grupo Free
                            </div>
                          </th>
                          <th className="border border-gray-300 p-3 text-center bg-amber-50">
                            <div className="flex items-center justify-center gap-2">
                              <Crown className="h-4 w-4 text-amber-600" />
                              Sala VIP
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">Sinais diários</td>
                          <td className="border border-gray-300 p-3 text-center">✅ Básicos</td>
                          <td className="border border-gray-300 p-3 text-center">✅ Alta precisão</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-3 font-medium">Análises técnicas</td>
                          <td className="border border-gray-300 p-3 text-center">✅ Semanais</td>
                          <td className="border border-gray-300 p-3 text-center">✅ Diárias detalhadas</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">Suporte</td>
                          <td className="border border-gray-300 p-3 text-center">✅ Comunidade</td>
                          <td className="border border-gray-300 p-3 text-center">✅ Especializado 1:1</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-3 font-medium">Estratégias avançadas</td>
                          <td className="border border-gray-300 p-3 text-center">❌</td>
                          <td className="border border-gray-300 p-3 text-center">✅ Exclusivas</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">Alertas em tempo real</td>
                          <td className="border border-gray-300 p-3 text-center">❌</td>
                          <td className="border border-gray-300 p-3 text-center">✅ Instantâneos</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-3 font-medium">Rentabilidade média</td>
                          <td className="border border-gray-300 p-3 text-center">5-10% ao mês</td>
                          <td className="border border-gray-300 p-3 text-center">15-25% ao mês</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">Investimento</td>
                          <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">GRATUITO</td>
                          <td className="border border-gray-300 p-3 text-center text-red-600 font-bold">R$ 1,00 (1º mês)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Indicações - Apenas para consultores */}
          {isConsultant && (
            <TabsContent value="referrals">
              <ReferralPage />
            </TabsContent>
          )}

          {/* Abas Administrativas - Apenas para douglasnoticias@gmail.com */}
          {isAdmin && (
            <>
              <TabsContent value="consultants">
                <ConsultantsPage />
              </TabsContent>
              
              <TabsContent value="admin-referrals">
                <AdminReferralsPage />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Modal do Contrato */}
      <ContractModal 
        isOpen={showContract} 
        onClose={() => setShowContract(false)} 
      />
    </div>
  )
}

