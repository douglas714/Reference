# Sistema de Indicações - InvestBet Trader

## 📋 Visão Geral

Este documento contém todas as instruções para implementar e configurar o sistema completo de indicações no InvestBet Trader.

## 🎯 Funcionalidades Implementadas

### 1. Para Consultores
- ✅ Aba "Indicações" visível apenas para usuários com categoria "consultor"
- ✅ Geração automática de link de referência único
- ✅ Visualização de todos os clientes indicados
- ✅ Cálculo automático de comissões (10% do lucro mensal)
- ✅ Estatísticas em tempo real (total de indicados, investimentos, ganhos)

### 2. Para Administrador (douglasnoticias@gmail.com)
- ✅ Aba "Consultores" para gestão de todos os consultores
- ✅ Aba "Gestão de Indicações" para visão geral de todos os clientes
- ✅ Botão para resetar ganhos após pagamento
- ✅ Registro de data do último reset
- ✅ Filtros por tipo de cadastro (indicado ou direto)

### 3. Sistema de Cadastro
- ✅ Captura automática de código de referência via URL (?ref=CODIGO)
- ✅ Preenchimento automático dos campos "Indicacao" e "referred_by_code"
- ✅ Suporte para cadastro direto (sem indicação)

## 🚀 Passo a Passo para Implementação

### PASSO 1: Executar Script SQL no Supabase

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto InvestBet Trader
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `supabase_migration.sql`
6. Cole no editor SQL
7. Clique em **Run** para executar o script

**O que este script faz:**
- Adiciona novos campos na tabela `profiles`:
  - `categoria` (cliente ou consultor)
  - `indicacao` (nome do consultor que indicou)
  - `referral_code` (código único do consultor)
  - `referred_by_code` (código do consultor que indicou)
  - `initial_balance` (investimento inicial)
  - `consultant_earnings` (ganhos acumulados)
  - `last_earnings_reset` (data do último reset)
- Cria função para gerar códigos de referência únicos
- Cria trigger para gerar código automaticamente para consultores
- Configura políticas de segurança (RLS)
- Cria view para facilitar consultas

### PASSO 2: Atualizar Código do Projeto

Os seguintes arquivos foram criados/modificados:

**Arquivos Novos:**
- `src/components/ReferralPage.jsx` - Página de indicações para consultores
- `src/components/ConsultantsPage.jsx` - Página de gestão de consultores (admin)
- `src/components/AdminReferralsPage.jsx` - Página de gestão de indicações (admin)

**Arquivos Modificados:**
- `src/components/Dashboard.jsx` - Adicionadas novas abas com controle de acesso
- `src/components/SignUpPage.jsx` - Captura código de referência da URL
- `src/hooks/useAuth.jsx` - Processa indicação no cadastro

**Todos os arquivos já estão atualizados no projeto.**

### PASSO 3: Testar o Sistema Localmente

1. Abra o terminal na pasta do projeto
2. Instale as dependências (se ainda não instalou):
   ```bash
   pnpm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

4. Acesse http://localhost:5173 no navegador

### PASSO 4: Criar Usuário Consultor para Testes

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor** > **profiles**
3. Encontre um usuário existente ou crie um novo
4. Edite o registro e altere o campo `categoria` para `consultor`
5. Salve as alterações
6. O sistema irá gerar automaticamente um `referral_code` para este usuário

**Observação:** O código de referência é gerado automaticamente pelo trigger do banco de dados quando a categoria é alterada para "consultor".

### PASSO 5: Testar Fluxo de Indicação

#### 5.1. Como Consultor:
1. Faça login com o usuário que tem categoria "consultor"
2. Verifique se a aba "Indicações" aparece no menu
3. Clique na aba "Indicações"
4. Copie o link de referência exibido
5. Faça logout

#### 5.2. Cadastro com Indicação:
1. Abra uma aba anônima/privada do navegador
2. Cole o link de referência copiado
3. O link deve ter o formato: `http://localhost:5173/?ref=XXXXXXXX`
4. Clique em "Criar Conta"
5. Preencha todos os dados e complete o cadastro
6. Verifique no Supabase se o campo `indicacao` foi preenchido com o nome do consultor
7. Verifique se o campo `referred_by_code` contém o código do consultor

#### 5.3. Verificar Indicação:
1. Faça login novamente com o usuário consultor
2. Acesse a aba "Indicações"
3. Verifique se o novo cliente aparece na lista
4. Confirme se os dados estão corretos

### PASSO 6: Testar Painel Administrativo

1. Faça login com o email `douglasnoticias@gmail.com`
2. Verifique se as abas "Consultores" e "Gestão de Indicações" aparecem
3. Acesse "Consultores" e verifique a lista de consultores
4. Acesse "Gestão de Indicações" e verifique todos os clientes
5. Teste os filtros (Todos, Indicados, Cadastro Direto)

### PASSO 7: Testar Cálculo de Comissões

1. No Supabase, edite um cliente indicado:
   - Defina `initial_balance` = 1000.00
   - Defina `balance` = 1200.00
   - Lucro = 200.00
   - Comissão do consultor = 20.00 (10% de 200)

2. Acesse o painel do consultor:
   - Verifique se o lucro do cliente aparece como R$ 200,00
   - Verifique se o ganho do consultor aparece como R$ 20,00

3. Acesse o painel administrativo:
   - Verifique se os ganhos do consultor aparecem corretamente
   - Teste o botão "Resetar" para zerar os ganhos

### PASSO 8: Deploy para Produção

1. Certifique-se de que todos os testes foram concluídos com sucesso
2. Faça o build do projeto:
   ```bash
   pnpm build
   ```

3. Faça o deploy dos arquivos da pasta `dist` para seu servidor/hosting

4. Verifique se as variáveis de ambiente do Supabase estão corretas no ambiente de produção

## ✅ Checklist de Testes Obrigatórios

- [ ] Script SQL executado sem erros no Supabase
- [ ] Aba "Indicações" aparece apenas para consultores
- [ ] Abas administrativas aparecem apenas para douglasnoticias@gmail.com
- [ ] Link de referência é gerado corretamente
- [ ] Cadastro com link de referência preenche campos corretamente
- [ ] Cadastro sem link de referência deixa campos NULL
- [ ] Lista de indicados aparece corretamente para o consultor
- [ ] Cálculo de lucro e comissões está correto
- [ ] Botão de reset de ganhos funciona corretamente
- [ ] Filtros na página administrativa funcionam
- [ ] Sistema funciona corretamente em produção

## 🔒 Segurança

O sistema implementa as seguintes medidas de segurança:

1. **Row Level Security (RLS)** no Supabase:
   - Usuários só podem ver seus próprios dados
   - Consultores podem ver dados de seus indicados
   - Admin pode ver todos os dados

2. **Controle de Acesso no Frontend**:
   - Abas são renderizadas condicionalmente
   - Verificação de categoria e email

3. **Validação de Código de Referência**:
   - Código é validado antes de criar a indicação
   - Apenas códigos de consultores ativos são aceitos

## 📊 Estrutura de Dados

### Campos Adicionados na Tabela `profiles`:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `categoria` | VARCHAR(20) | "cliente" ou "consultor" |
| `indicacao` | VARCHAR(255) | Nome do consultor que indicou |
| `referral_code` | VARCHAR(50) | Código único do consultor |
| `referred_by_code` | VARCHAR(50) | Código do consultor que indicou |
| `initial_balance` | DECIMAL(10,2) | Investimento inicial do cliente |
| `consultant_earnings` | DECIMAL(10,2) | Ganhos acumulados do consultor |
| `last_earnings_reset` | TIMESTAMP | Data do último reset de ganhos |

## 🧮 Cálculo de Comissões

**Fórmula:**
```
Lucro do Cliente = Saldo Atual - Investimento Inicial
Comissão do Consultor = Lucro do Cliente × 10%
```

**Exemplo:**
- Investimento Inicial: R$ 1.000,00
- Saldo Atual: R$ 1.300,00
- Lucro: R$ 300,00
- Comissão: R$ 30,00

**Observações:**
- Apenas lucros positivos geram comissão
- Se o saldo for menor que o investimento inicial, a comissão é R$ 0,00
- As comissões são calculadas em tempo real

## 🔄 Fluxo de Reset de Ganhos

1. Admin visualiza os ganhos do mês de cada consultor
2. Admin efetua o pagamento ao consultor (fora do sistema)
3. Admin clica no botão "Resetar" na página de Consultores
4. Sistema confirma a ação
5. Sistema zera o campo `consultant_earnings`
6. Sistema registra a data atual em `last_earnings_reset`
7. Consultor continua acumulando novos ganhos a partir de zero

## 🆘 Solução de Problemas

### Problema: Aba "Indicações" não aparece para consultor
**Solução:** Verifique no Supabase se o campo `categoria` está definido como "consultor" (em minúsculas).

### Problema: Link de referência não funciona
**Solução:** 
1. Verifique se o consultor tem um `referral_code` no Supabase
2. Se não tiver, execute: `UPDATE profiles SET categoria = 'consultor' WHERE id = 'ID_DO_USUARIO'`
3. O trigger irá gerar o código automaticamente

### Problema: Indicação não é registrada no cadastro
**Solução:**
1. Verifique se o código de referência na URL está correto
2. Verifique os logs do console do navegador
3. Verifique se o consultor existe e está ativo

### Problema: Comissões não aparecem corretamente
**Solução:**
1. Verifique se `initial_balance` está preenchido no Supabase
2. Verifique se `balance` está atualizado
3. Verifique o cálculo: (balance - initial_balance) × 0.10

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este documento primeiro
2. Verifique os logs do console do navegador (F12)
3. Verifique os logs do Supabase
4. Entre em contato com o desenvolvedor

## 📝 Notas Importantes

1. **Código de Referência:**
   - É gerado automaticamente pelo banco de dados
   - Tem 8 caracteres alfanuméricos
   - É único para cada consultor

2. **Categoria de Usuário:**
   - Deve ser alterada manualmente no Supabase
   - Valores aceitos: "cliente" ou "consultor"
   - Ao alterar para "consultor", o código é gerado automaticamente

3. **Email do Administrador:**
   - Hardcoded como "douglasnoticias@gmail.com"
   - Para adicionar outros admins, modifique o código em `Dashboard.jsx`

4. **Investimento Inicial:**
   - Deve ser preenchido manualmente no Supabase
   - Representa o primeiro depósito do cliente
   - É usado para calcular o lucro

5. **Saldo Atual:**
   - Deve ser atualizado conforme os depósitos/saques
   - É usado para calcular o lucro
   - Lucro = Saldo Atual - Investimento Inicial

## 🎉 Conclusão

O sistema de indicações está completo e pronto para uso. Siga todos os passos deste documento para garantir uma implementação bem-sucedida.

**Boa sorte!** 🚀
