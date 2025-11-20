import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { X, FileText } from 'lucide-react'
import logoImage from '../assets/logo.jpeg'

export default function ContractModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-xl font-bold text-gray-800">
                Contrato e Termos de Uso
              </CardTitle>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={logoImage} 
              alt="InvestBet Capital" 
              className="w-8 h-8 object-contain rounded"
            />
            <CardDescription className="text-gray-600">
              InvestBet Capital - Termos de Uso e Contrato de Serviços
            </CardDescription>
          </div>
          
          <ScrollArea className="h-96 w-full border rounded-md p-4 bg-gray-50">
            <div className="space-y-4 text-sm text-gray-700 pr-4">
              <div className="text-center mb-6">
                <h2 className="font-bold text-lg text-gray-800 mb-2">
                  CONTRATO DE PRESTAÇÃO DE SERVIÇOS
                </h2>
                <h3 className="font-semibold text-base text-gray-700">
                  InvestBet Capital - Execução de Operações em Apostas Esportivas
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-base mb-2">1. PARTES CONTRATANTES</h4>
                  <p className="mb-2">
                    <strong>CONTRATADA:</strong> InvestBet Capital, empresa atuante exclusivamente no segmento de 
                    apostas esportivas por meio de traders profissionais, não prestando serviços financeiros, de 
                    investimento ou quaisquer atividades reguladas pela CVM ou Banco Central.
                  </p>
                  <p>
                    <strong>CONTRATANTE:</strong> Usuário que aceita integralmente os termos deste contrato.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">2. OBJETO DO CONTRATO</h4>
                  <p>
                    Este instrumento tem por objeto a prestação de serviços de execução de operações em apostas 
                    esportivas, com caráter de entretenimento, mediante utilização dos valores enviados pelo 
                    CONTRATANTE exclusivamente para essa finalidade.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">3. POLÍTICA DE SEGURANÇA E DEVOLUÇÃO PROPORCIONAL DO CAPITAL</h4>
                  <p className="mb-2 italic text-gray-600">
                    📌 Cláusula antecipada estrategicamente para gerar máxima confiança ao cliente.
                  </p>
                  <p className="mb-2">
                    <strong>3.1.</strong> Embora a CONTRATADA não garanta lucros, a empresa adota internamente uma 
                    Política de Segurança de Capital, destinada a proteger o CONTRATANTE em cenários extremos e 
                    altamente improváveis.
                  </p>
                  <p className="mb-2">
                    <strong>3.2.</strong> Os rendimentos mensais eventualmente recebidos pelo CONTRATANTE serão 
                    considerados como amortização natural do capital inicial.
                  </p>
                  <p className="mb-2">
                    <strong>Exemplo:</strong><br />
                    Se o CONTRATANTE aportar R$ 10.000,00, e ao longo de alguns meses receber R$ 5.000,00 em 
                    rendimentos, entende-se que 50% do capital inicial já foi retornado.
                  </p>
                  <p className="mb-2">
                    <strong>3.3.</strong> Caso ocorra qualquer evento excepcional que impossibilite a continuidade 
                    das operações — como falha grave, problema operacional ou encerramento imprevisto — a CONTRATADA 
                    se compromete a devolver ao CONTRATANTE o valor proporcional do capital ainda não amortizado.
                  </p>
                  <p className="mb-2">
                    <strong>Seguindo o exemplo anterior:</strong><br />
                    O CONTRATANTE receberia R$ 5.000,00 restantes.
                  </p>
                  <p className="mb-2">
                    <strong>3.4.</strong> Essa política garante que, mesmo no pior cenário, o CONTRATANTE não sairá 
                    no prejuízo total, preservando seu capital proporcionalmente.
                  </p>
                  <p>
                    <strong>3.5.</strong> A CONTRATADA reforça que o objetivo central é operar com segurança, 
                    responsabilidade e eficiência, buscando evitar qualquer situação de risco que demande ativação 
                    desta política.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">4. NATUREZA JURÍDICA E ISENÇÃO REGULATÓRIA</h4>
                  <p className="mb-2">A CONTRATADA:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>não presta consultoria financeira;</li>
                    <li>não administra investimentos;</li>
                    <li>não garante rentabilidade;</li>
                    <li>não realiza atividades sujeitas à CVM ou Banco Central.</li>
                  </ul>
                  <p className="mt-2">
                    As operações têm natureza exclusivamente recreativa no âmbito das apostas esportivas.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">5. SERVIÇOS PRESTADOS</h4>
                  <p className="mb-2">A CONTRATADA executará:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>análises estatísticas de eventos esportivos;</li>
                    <li>definição e aplicação de estratégias de apostas;</li>
                    <li>execução das operações com os valores enviados pelo CONTRATANTE;</li>
                    <li>fornecimento de informações gerais de desempenho quando aplicável.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">6. RISCOS E AUSÊNCIA DE GARANTIA</h4>
                  <p className="mb-2">
                    <strong>6.1.</strong> A participação em apostas esportivas envolve riscos significativos.
                  </p>
                  <p className="mb-2">
                    <strong>6.2.</strong> Resultados passados não asseguram resultados futuros.
                  </p>
                  <p>
                    <strong>6.3.</strong> O CONTRATANTE declara ciência plena dos riscos e participa por sua livre escolha.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">7. OBRIGAÇÕES DO CONTRATANTE</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Fornecer informação verdadeira;</li>
                    <li>Avaliar sua capacidade financeira antes de enviar valores;</li>
                    <li>Reconhecer os riscos envolvidos;</li>
                    <li>Cumprir as disposições deste contrato.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">8. OBRIGAÇÕES DA CONTRATADA</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Empregar melhores esforços profissionais;</li>
                    <li>Utilizar os valores exclusivamente para apostas esportivas;</li>
                    <li>Proteger os dados do CONTRATANTE;</li>
                    <li>Cumprir integralmente a Política de Segurança e Devolução (Cláusula 3).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">9. POLÍTICA DE VALORES, SALDO E SAQUES</h4>
                  <p>
                    Os procedimentos de saques seguirão as normas internas da CONTRATADA, respeitando prazos 
                    operacionais e eventuais ajustes necessários. Custos e taxas serão informados previamente.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">10. PRIVACIDADE – LGPD</h4>
                  <p>
                    A CONTRATADA garante proteção total dos dados pessoais conforme a Lei Geral de Proteção de 
                    Dados (LGPD).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">11. VIGÊNCIA E RESCISÃO</h4>
                  <p className="mb-2">
                    Contrato entra em vigor na aceitação pelo CONTRATANTE.
                  </p>
                  <p className="mb-2">
                    Qualquer parte pode rescindir com 30 dias de aviso prévio.
                  </p>
                  <p>
                    Na rescisão, aplica-se a Cláusula 3 para devolução proporcional do capital.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">12. ALTERAÇÕES DOS TERMOS</h4>
                  <p className="mb-2">
                    A CONTRATADA pode atualizar este contrato mediante aviso.
                  </p>
                  <p>
                    A continuidade do uso implica aceitação automática.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">13. FORO</h4>
                  <p>
                    Fica eleito o foro da comarca da sede da CONTRATADA para quaisquer disputas.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-base mb-2">14. DISPOSIÇÕES GERAIS</h4>
                  <p className="mb-2">
                    O contrato substitui versões anteriores.
                  </p>
                  <p>
                    Cláusulas inválidas não prejudicam o restante.
                  </p>
                </div>

                <div className="rounded-md border border-red-200 bg-red-50 p-3">
                  <h4 className="font-semibold text-sm text-red-700 mb-2">AVISO LEGAL FINAL</h4>
                  <p className="text-xs text-red-700">
                    A InvestBet Capital não garante lucros, não presta serviços financeiros, não está sob 
                    regulamentação da CVM ou Banco Central. A participação envolve riscos.
                  </p>
                </div>

                <div className="border-t pt-4 mt-6">
                  <p className="text-center text-xs text-gray-500">
                    Documento gerado automaticamente em {new Date().toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-center text-xs text-gray-500 mt-1">
                    InvestBet Capital - Todos os direitos reservados
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="px-6">
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
