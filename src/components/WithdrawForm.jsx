import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Card, CardContent } from './ui/card'
import { 
  MessageCircle, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  CreditCard // Adicionado para o ícone PIX
} from 'lucide-react'

export default function WithdrawForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    amount: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [pixRegistered, setPixRegistered] = useState(false)

  useEffect(() => {
    // Verifica se o PIX já foi registrado no localStorage
    const isRegistered = localStorage.getItem('investbet_pix_registered') === 'true'
    setPixRegistered(isRegistered)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Formatação específica para CPF
    if (name === 'cpf') {
      const formattedCpf = value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona primeiro ponto
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona segundo ponto
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Adiciona hífen
        .substring(0, 14) // Limita a 14 caracteres
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedCpf
      }))
    } else if (name === 'amount') {
      // Formatação para valor monetário
      const numericValue = value.replace(/\D/g, '')
      const formattedValue = (numericValue / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateForm = () => {
    const { fullName, cpf, amount } = formData
    
    if (!fullName.trim()) {
      alert('Por favor, preencha o nome completo.')
      return false
    }
    
    if (!cpf || cpf.length !== 14) {
      alert('Por favor, preencha um CPF válido.')
      return false
    }
    
    if (!amount || parseFloat(amount.replace(/\./g, '').replace(',', '.')) <= 0) {
      alert('Por favor, informe um valor válido para saque.')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Preparar dados para WhatsApp (Solicitação de Saque de Capital)
      const { fullName, cpf, amount } = formData
      const whatsappNumber = '5522997291348'
      
      const message = `🏦 *SOLICITAÇÃO DE SAQUE DE CAPITAL - InvestBet Capital*\n\n👤 *Nome Completo:* ${fullName}\n📄 *CPF:* ${cpf}\n💰 *Valor do Saque:* R$ ${amount}\n\n📅 *Data da Solicitação:* ${new Date().toLocaleDateString('pt-BR')}\n\n---\nEsta é uma solicitação automática gerada pelo sistema.`

      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank')
      
      // Mostrar mensagem de sucesso
      setShowSuccess(true)
      
      // Limpar formulário após 3 segundos
      setTimeout(() => {
        setFormData({
          fullName: '',
          cpf: '',
          amount: ''
        })
        setShowSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error('Erro ao processar solicitação:', error)
      alert('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Informações importantes sobre saque */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>Prazo de Processamento:</strong><br />
            O pagamento da rentabilidade é feito automaticamente todo dia 1° de cada mês.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>Tempo de Pagamento:</strong><br />
            O valor é creditado em até 24 horas após o processamento automático.
          </AlertDescription>
        </Alert>
      </div>

      {/* NOVO: Cadastro PIX para Rentabilidade */}
      {!pixRegistered ? (
        <Card className="border-2 border-green-400 bg-green-50">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-700">
                Cadastrar PIX para Recebimento de Rendimentos
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              Para receber sua rentabilidade automaticamente todo dia 1° do mês, é obrigatório 
              o cadastro da sua chave PIX. Clique no botão abaixo para ser redirecionado ao formulário de cadastro.
            </p>
            <a 
              href="https://forms.gle/cCfr8k2orVucscsa6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
              onClick={(e) => {
                // Impede a navegação padrão do <a> para que o onClick do botão funcione corretamente\n                e.preventDefault()\n                // Abre o link do formulário em uma nova aba\n                window.open("https://forms.gle/cCfr8k2orVucscsa6", "_blank")\n                // Simula o registro após o clique
                localStorage.setItem('investbet_pix_registered', 'true')
                setPixRegistered(true)
              }}
            >
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Cadastrar PIX Agora
              </Button>
            </a>
          </CardContent>
        </Card>
      ) : (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>PIX Cadastrado!</strong> Você já cadastrou sua chave PIX para o recebimento automático dos rendimentos.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulário de saque de CAPITAL */}
      <Card>
        <CardContent className="pt-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Solicitação de Saque de Capital Enviada com Sucesso!
              </h3>
              <p className="text-gray-600">
                Sua solicitação de saque de capital foi enviada via WhatsApp. Aguarde o contato da nossa equipe.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor do Saque de Capital (R$) * (Disponível após 12 meses de investimento)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Atenção:</strong> Ao clicar em "Solicitar Saque", você será redirecionado para o WhatsApp 
                  com uma mensagem pré-preenchida contendo seus dados. Envie a mensagem para finalizar a solicitação.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Solicitar Saque via WhatsApp
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Informações adicionais */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-800">
          <strong>Informações Importantes:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• O pagamento da rentabilidade é processado automaticamente no primeiro dia útil de cada mês.</li>
            <li>• O prazo para recebimento da rentabilidade é de até 24 horas após o processamento automático.</li>
            <li>• <strong>Saque do Capital:</strong> Só pode ser realizado após 12 meses (365 dias) do investimento inicial.</li>
            <li>• <strong>Antes de 12 meses:</strong> Apenas o pagamento automático da rentabilidade é realizado. O capital fica bloqueado.</li>
            <li>• Certifique-se de que todos os dados estão corretos antes de enviar</li>
            <li>• Em caso de dúvidas, entre em contato conosco pelo WhatsApp</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
