import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'

import { Card, CardContent } from './ui/card'
import { 
  MessageCircle, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  QrCode,
  Upload
} from 'lucide-react'

export default function DepositForm() {

  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    amount: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
    
    if (!amount || parseFloat(amount.replace(/\./g, '').replace(',', '.')) < 100) {
      alert('O valor mínimo para depósito é de R$ 100,00.')
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
      // Preparar dados para WhatsApp
      const { fullName, cpf, amount } = formData
      const whatsappNumber = '5522997291348'
      
      const message = `💰 *SOLICITAÇÃO DE DEPÓSITO - InvestBet Capital*

👤 *Nome Completo:* ${fullName}
📄 *CPF:* ${cpf}
💵 *Valor do Depósito:* R$ ${amount}

📅 *Data da Solicitação:* ${new Date().toLocaleDateString('pt-BR')}

---
Esta é uma solicitação automática gerada pelo sistema.

📎 *Abaixo segue comprovante*`

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
      {/* Informação sobre a rentabilidade */}
      <Alert className="border-green-200 bg-green-50">
        <AlertDescription className="text-green-800">
          <strong>Regra de Rentabilidade:</strong>
          <p className="mt-2">
            A rentabilidade do novo depósito só ocorrerá no mesmo mês se a rentabilidade atual estiver **até 7%**. 
            Neste caso, ainda poderá render até 3% na conta.
          </p>
          <p className="mt-2">
            Caso a rentabilidade atual já tenha batido **7% ou mais**, a rentabilidade do novo depósito passará a contar a partir do **dia 1º do mês seguinte**.
          </p>
        </AlertDescription>
      </Alert>

      {/* Informações importantes sobre depósito */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>Atualização do Saldo:</strong><br />
            O saldo é atualizado em até 24 horas após a validação do depósito.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            <strong>Comprovante Obrigatório:</strong><br />
            Você deve enviar o comprovante de pagamento via WhatsApp.
          </AlertDescription>
        </Alert>
      </div>

      {/* QR Code para depósito */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <QrCode className="h-5 w-5" />
              <h3 className="text-lg font-semibold">QR Code para Depósito</h3>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/qr-code-pix.jpg" 
                  alt="QR Code PIX" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              Escaneie o QR Code acima para realizar o depósito via PIX
            </p>
            
            {/* Dados do PIX */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
              <h4 className="font-semibold text-blue-800 mb-3">Dados para PIX Manual:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Destinatário:</span>
                  <span className="text-gray-800">Douglas Francisco Tabella</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">CPF:</span>
                  <span className="text-gray-800">***.437.607-**</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Chave PIX:</span>
                  <span className="text-gray-800 break-all">86b73193-e9b8-4f82-86d7-a6cd3607a319</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de depósito */}
      <Card>
        <CardContent className="pt-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Solicitação Enviada com Sucesso!
              </h3>
              <p className="text-gray-600">
                Sua solicitação foi enviada via WhatsApp. Não esqueça de enviar o comprovante!
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
                <Label htmlFor="amount">Valor do Depósito (R$) *</Label>
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
                  <strong>Atenção:</strong> Ao clicar em "Fazer Depósito", você será redirecionado para o WhatsApp 
                  com uma mensagem pré-preenchida. Envie a mensagem junto com o comprovante de pagamento.
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
                    Fazer Depósito via WhatsApp
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
          <strong>Instruções para Depósito:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Realize o pagamento via PIX usando o QR Code acima</li>
            <li>• Preencha o formulário com seus dados corretos</li>
            <li>• Envie a solicitação via WhatsApp junto com o comprovante</li>
            <li>• Seu saldo será atualizado em até 24 horas após validação</li>
            <li>• Em caso de dúvidas, entre em contato conosco pelo WhatsApp</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}

