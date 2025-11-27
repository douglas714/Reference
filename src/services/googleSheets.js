// Serviço para integração com Google Sheets
// Para usar a API do Google Sheets, é necessário configurar as credenciais

const SHEET_ID = '2PACX-1vRdCp9LlekFWe68xqy4Xf-ng6Jh3stq56haG992PpuemBQgHYQM5UdSSh49t5YIkS-M7EfMyTc2I2tm'
const SHEET_NAME = 'Rentabilidade Mensal'
const API_KEY = 'YOUR_GOOGLE_SHEETS_API_KEY' // Não usado para pub?output=csv

// Função alternativa usando CSV export (mais confiável)
export const fetchSheetDataCSV = async () => {
  try {
    const csvURL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?output=csv`
    const response = await fetch(csvURL)
    const csvText = await response.text()
    
    const lines = csvText.split('\n')
    
    const processedData = []
    let acumulado = 0
    
    // As rentabilidades mensais estão nas linhas 2 a 13 (índices 1 a 12 no array lines)
    // A rentabilidade total está na linha 15 (índice 14 no array lines)

    for (let i = 1; i <= 12; i++) { // Loop de Janeiro (índice 1) a Dezembro (índice 12)
      const line = lines[i].trim()
      if (line) {
        const values = line.split(',')
        const mes = values[0].replace(/"/g, '')
        const rentabilidade = parseFloat(values[1].replace("\"", "").replace("%", "").replace(",", ".")) || 0
        
        // O cálculo do acumulado aqui é para o gráfico de evolução mensal
        if (rentabilidade > 0) {
          acumulado = acumulado * (1 + rentabilidade / 100) + rentabilidade
        }
        
        processedData.push({
          mes: mes.substring(0, 3),
          mesCompleto: mes,
          rentabilidade: rentabilidade,
          acumulado: parseFloat(acumulado.toFixed(2))
        })
      }
    }
    
    // Pega a rentabilidade total da linha 15 (índice 14)
    const totalLine = lines[14].trim()
    const totalValues = totalLine.split(',')
    const totalReturnFromSheet = parseFloat(totalValues[1].replace("\"", "").replace("%", "").replace(",", ".")) || 0

    return {
      monthlyData: processedData,
      totalReturnFromSheet: totalReturnFromSheet
    }

  } catch (error) {
    console.error('Erro ao buscar dados CSV:', error)
    return {
      monthlyData: [], // Retorna array vazio em caso de erro
      totalReturnFromSheet: 0
    }
  }
}

// Função para obter a rentabilidade do mês atual
export const fetchCurrentMonthProfitability = async () => {
  try {
    const data = await fetchSheetDataCSV()
    const currentMonthIndex = new Date().getMonth() // 0 = Janeiro, 11 = Dezembro
    
    // A rentabilidade do mês atual é o último item da lista que tem rentabilidade > 0
    // Ou, de forma mais simples, o item correspondente ao mês atual (se a planilha estiver sempre atualizada)
    // Vamos assumir que a planilha está em ordem e o último mês preenchido é o atual
    
    const monthlyData = data.monthlyData.filter(item => item.rentabilidade > 0)
    if (monthlyData.length > 0) {
      // Retorna a rentabilidade do último mês preenchido
      return monthlyData[monthlyData.length - 1].rentabilidade
    }
    
    return 0 // Retorna 0 se não houver dados
  } catch (error) {
    console.error('Erro ao buscar rentabilidade do mês atual:', error)
    return 0
  }
}

// Função principal que tenta diferentes métodos
export const fetchMonthlyProfitability = async () => {
  try {
    // Tenta primeiro o método CSV (mais confiável)
    const data = await fetchSheetDataCSV()
    return data
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    // Retorna dados de fallback
    return {
      monthlyData: [], // Retorna array vazio em caso de erro
      totalReturnFromSheet: 0
    }
  }
}


const getFallbackData = () => {
  return [
    { mes: 'Jan', mesCompleto: 'Janeiro', rentabilidade: 0, acumulado: 0 },
    { mes: 'Fev', mesCompleto: 'Fevereiro', rentabilidade: 0, acumulado: 0 },
    { mes: 'Mar', mesCompleto: 'Março', rentabilidade: 0, acumulado: 0 },
    { mes: 'Abr', mesCompleto: 'Abril', rentabilidade: 0, acumulado: 0 },
    { mes: 'Mai', mesCompleto: 'Maio', rentabilidade: 0, acumulado: 0 },
    { mes: 'Jun', mesCompleto: 'Junho', rentabilidade: 0, acumulado: 0 },
    { mes: 'Jul', mesCompleto: 'Julho', rentabilidade: 0, acumulado: 0 },
    { mes: 'Ago', mesCompleto: 'Agosto', rentabilidade: 0, acumulado: 0 },
    { mes: 'Set', mesCompleto: 'Setembro', rentabilidade: 0, acumulado: 0 },
    { mes: 'Out', mesCompleto: 'Outubro', rentabilidade: 0, acumulado: 0 },
    { mes: 'Nov', mesCompleto: 'Novembro', rentabilidade: 0, acumulado: 0 },
    { mes: 'Dez', mesCompleto: 'Dezembro', rentabilidade: 0, acumulado: 0 },
  ]
}

