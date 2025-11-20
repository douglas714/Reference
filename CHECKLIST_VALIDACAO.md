# ✅ Checklist de Validação - Sistema de Indicações

## 📋 Instruções de Uso

Este checklist deve ser seguido **rigorosamente** antes de colocar o sistema em produção. Marque cada item após a validação.

---

## 1️⃣ CONFIGURAÇÃO DO BANCO DE DADOS

### 1.1. Execução do Script SQL
- [ ] Script `supabase_migration.sql` executado sem erros
- [ ] Todos os campos foram adicionados na tabela `profiles`
- [ ] Função `generate_referral_code()` foi criada
- [ ] Trigger `trigger_set_referral_code` foi criado
- [ ] View `referral_stats` foi criada
- [ ] Políticas RLS foram configuradas

### 1.2. Verificação dos Campos
Acesse **Table Editor** > **profiles** e verifique se os seguintes campos existem:
- [ ] `categoria` (VARCHAR)
- [ ] `indicacao` (VARCHAR)
- [ ] `referral_code` (VARCHAR)
- [ ] `referred_by_code` (VARCHAR)
- [ ] `initial_balance` (DECIMAL)
- [ ] `consultant_earnings` (DECIMAL)
- [ ] `last_earnings_reset` (TIMESTAMP)

### 1.3. Teste do Trigger
- [ ] Criar/editar um usuário e definir `categoria` = 'consultor'
- [ ] Verificar se `referral_code` foi gerado automaticamente
- [ ] Verificar se o código tem 8 caracteres alfanuméricos
- [ ] Verificar se o código é único (não existe outro igual)

---

## 2️⃣ CONTROLE DE ACESSO

### 2.1. Acesso de Cliente (Usuário Comum)
- [ ] Login com usuário categoria "cliente"
- [ ] Verificar que aba "Indicações" NÃO aparece
- [ ] Verificar que aba "Consultores" NÃO aparece
- [ ] Verificar que aba "Gestão de Indicações" NÃO aparece
- [ ] Verificar acesso apenas às abas padrão (Visão Geral, Depósito, Saque, etc.)

### 2.2. Acesso de Consultor
- [ ] Login com usuário categoria "consultor"
- [ ] Verificar que aba "Indicações" APARECE
- [ ] Verificar que aba "Consultores" NÃO aparece
- [ ] Verificar que aba "Gestão de Indicações" NÃO aparece
- [ ] Clicar na aba "Indicações" e verificar se carrega corretamente

### 2.3. Acesso de Administrador
- [ ] Login com email "douglasnoticias@gmail.com"
- [ ] Verificar que aba "Indicações" APARECE (se for consultor também)
- [ ] Verificar que aba "Consultores" APARECE
- [ ] Verificar que aba "Gestão de Indicações" APARECE
- [ ] Clicar em cada aba e verificar se carregam corretamente

---

## 3️⃣ FUNCIONALIDADES DO CONSULTOR

### 3.1. Página de Indicações
- [ ] Link de referência é exibido corretamente
- [ ] Link tem o formato: `http://[dominio]/?ref=XXXXXXXX`
- [ ] Botão "Copiar" funciona corretamente
- [ ] Mensagem "Copiado!" aparece após clicar em copiar
- [ ] Cards de estatísticas exibem valores corretos:
  - [ ] Total de Indicados
  - [ ] Total Investido
  - [ ] Seus Ganhos

### 3.2. Lista de Indicados
- [ ] Tabela exibe todos os clientes indicados pelo consultor
- [ ] Colunas exibidas corretamente:
  - [ ] Nome e Email
  - [ ] Investimento Inicial
  - [ ] Saldo Atual
  - [ ] Lucro (calculado corretamente)
  - [ ] Ganho do Consultor (10% do lucro)
  - [ ] Status (Ativo/Inativo)
- [ ] Linha de total exibe soma correta
- [ ] Mensagem aparece quando não há indicados

---

## 4️⃣ FUNCIONALIDADES DO ADMINISTRADOR

### 4.1. Página de Consultores
- [ ] Lista exibe todos os consultores cadastrados
- [ ] Cards de estatísticas exibem valores corretos:
  - [ ] Total de Consultores
  - [ ] Total de Indicações
  - [ ] Total de Ganhos
- [ ] Tabela exibe corretamente:
  - [ ] Nome e Email do consultor
  - [ ] Código de referência
  - [ ] Número de indicados
  - [ ] Ganhos do mês
  - [ ] Data do último reset
  - [ ] Botão "Resetar"

### 4.2. Funcionalidade de Reset
- [ ] Clicar em "Resetar" exibe mensagem de confirmação
- [ ] Confirmar zera os ganhos do consultor
- [ ] Data do último reset é atualizada
- [ ] Botão fica desabilitado quando ganhos = 0
- [ ] Lista é atualizada após o reset

### 4.3. Página de Gestão de Indicações
- [ ] Lista exibe todos os clientes cadastrados
- [ ] Cards de estatísticas exibem valores corretos:
  - [ ] Total de Clientes
  - [ ] Clientes Indicados
  - [ ] Total Investido
  - [ ] Lucro Total
- [ ] Filtros funcionam corretamente:
  - [ ] Todos (exibe todos os clientes)
  - [ ] Indicados (apenas clientes com consultor)
  - [ ] Cadastro Direto (apenas clientes sem consultor)
- [ ] Tabela exibe corretamente:
  - [ ] Nome e Email do cliente
  - [ ] Nome do consultor (ou "N/A")
  - [ ] Investimento Inicial
  - [ ] Saldo Atual
  - [ ] Lucro
  - [ ] Status

---

## 5️⃣ FLUXO DE CADASTRO COM INDICAÇÃO

### 5.1. Preparação
- [ ] Criar/configurar um usuário consultor
- [ ] Verificar que o consultor tem `referral_code` no Supabase
- [ ] Copiar o link de referência da página de indicações

### 5.2. Cadastro
- [ ] Abrir navegador em modo anônimo/privado
- [ ] Acessar o link de referência copiado
- [ ] Verificar se URL contém `?ref=XXXXXXXX`
- [ ] Clicar em "Criar Conta"
- [ ] Preencher todos os campos obrigatórios:
  - [ ] Nome Completo
  - [ ] Email
  - [ ] Telefone
  - [ ] CPF
  - [ ] Senha
- [ ] Submeter o formulário
- [ ] Verificar mensagem de sucesso

### 5.3. Validação no Supabase
- [ ] Acessar Supabase > Table Editor > profiles
- [ ] Encontrar o novo usuário cadastrado
- [ ] Verificar campo `categoria` = "cliente"
- [ ] Verificar campo `indicacao` = nome do consultor
- [ ] Verificar campo `referred_by_code` = código do consultor
- [ ] Verificar campo `initial_balance` = 0.00

### 5.4. Validação no Painel do Consultor
- [ ] Fazer login com o usuário consultor
- [ ] Acessar aba "Indicações"
- [ ] Verificar se o novo cliente aparece na lista
- [ ] Verificar se os dados do cliente estão corretos

---

## 6️⃣ FLUXO DE CADASTRO SEM INDICAÇÃO

### 6.1. Cadastro Direto
- [ ] Abrir navegador em modo anônimo/privado
- [ ] Acessar URL sem parâmetro `?ref=` (ex: `http://[dominio]/`)
- [ ] Clicar em "Criar Conta"
- [ ] Preencher todos os campos e submeter
- [ ] Verificar mensagem de sucesso

### 6.2. Validação no Supabase
- [ ] Acessar Supabase > Table Editor > profiles
- [ ] Encontrar o novo usuário cadastrado
- [ ] Verificar campo `categoria` = "cliente"
- [ ] Verificar campo `indicacao` = NULL
- [ ] Verificar campo `referred_by_code` = NULL

### 6.3. Validação no Painel Administrativo
- [ ] Fazer login como admin
- [ ] Acessar "Gestão de Indicações"
- [ ] Filtrar por "Cadastro Direto"
- [ ] Verificar se o novo cliente aparece
- [ ] Verificar se consultor aparece como "N/A"

---

## 7️⃣ CÁLCULO DE COMISSÕES

### 7.1. Configurar Dados de Teste
No Supabase, editar um cliente indicado:
- [ ] Definir `initial_balance` = 1000.00
- [ ] Definir `balance` = 1300.00
- [ ] Salvar alterações

### 7.2. Validação no Painel do Consultor
- [ ] Fazer login com o consultor
- [ ] Acessar aba "Indicações"
- [ ] Verificar na lista do cliente:
  - [ ] Investimento = R$ 1.000,00
  - [ ] Saldo Atual = R$ 1.300,00
  - [ ] Lucro = R$ 300,00
  - [ ] Seu Ganho = R$ 30,00 (10% de 300)
- [ ] Verificar card "Seus Ganhos" atualizado

### 7.3. Validação no Painel Administrativo
- [ ] Fazer login como admin
- [ ] Acessar "Consultores"
- [ ] Verificar se "Ganhos do Mês" do consultor = R$ 30,00
- [ ] Acessar "Gestão de Indicações"
- [ ] Verificar se lucro do cliente = R$ 300,00

### 7.4. Teste com Prejuízo
No Supabase, editar o mesmo cliente:
- [ ] Definir `balance` = 800.00 (menor que initial_balance)
- [ ] Salvar alterações

Validar:
- [ ] Lucro aparece como R$ 0,00 (não negativo)
- [ ] Ganho do consultor = R$ 0,00

---

## 8️⃣ RESPONSIVIDADE E UX

### 8.1. Desktop (1920x1080)
- [ ] Layout exibido corretamente
- [ ] Tabelas não quebram
- [ ] Cards alinhados
- [ ] Textos legíveis

### 8.2. Tablet (768x1024)
- [ ] Layout se adapta corretamente
- [ ] Abas do menu responsivas
- [ ] Tabelas com scroll horizontal se necessário
- [ ] Cards empilhados adequadamente

### 8.3. Mobile (375x667)
- [ ] Layout mobile funcional
- [ ] Abas do menu em múltiplas linhas
- [ ] Tabelas com scroll horizontal
- [ ] Botões e textos legíveis
- [ ] Link de referência copiável

---

## 9️⃣ SEGURANÇA

### 9.1. Row Level Security (RLS)
- [ ] Usuário comum não pode ver dados de outros usuários
- [ ] Consultor só vê seus próprios indicados
- [ ] Admin pode ver todos os dados
- [ ] Tentativa de acesso direto via API é bloqueada

### 9.2. Validações
- [ ] Código de referência inválido não cria indicação
- [ ] Consultor inativo não pode receber indicações
- [ ] Campos obrigatórios são validados no cadastro

---

## 🔟 PERFORMANCE

### 10.1. Tempo de Carregamento
- [ ] Página de indicações carrega em menos de 2 segundos
- [ ] Página de consultores carrega em menos de 3 segundos
- [ ] Página de gestão carrega em menos de 3 segundos
- [ ] Filtros respondem instantaneamente

### 10.2. Otimização
- [ ] Consultas ao banco não são excessivas
- [ ] Dados são carregados apenas quando necessário
- [ ] Loading states são exibidos durante carregamento

---

## 1️⃣1️⃣ LOGS E DEBUGGING

### 11.1. Console do Navegador
- [ ] Não há erros no console
- [ ] Avisos (warnings) são aceitáveis
- [ ] Logs de debug estão presentes (podem ser removidos em produção)

### 11.2. Logs do Supabase
- [ ] Verificar logs de autenticação
- [ ] Verificar logs de queries
- [ ] Verificar se não há erros de RLS

---

## 1️⃣2️⃣ DOCUMENTAÇÃO

- [ ] Arquivo `INSTRUCOES_SISTEMA_INDICACOES.md` está completo
- [ ] Arquivo `CHECKLIST_VALIDACAO.md` está completo
- [ ] Arquivo `supabase_migration.sql` está documentado
- [ ] Código está comentado adequadamente

---

## 1️⃣3️⃣ DEPLOY PARA PRODUÇÃO

### 13.1. Pré-Deploy
- [ ] Todos os itens deste checklist foram validados
- [ ] Build do projeto executado sem erros (`pnpm build`)
- [ ] Arquivos da pasta `dist` gerados corretamente
- [ ] Variáveis de ambiente verificadas

### 13.2. Pós-Deploy
- [ ] Sistema acessível na URL de produção
- [ ] Testar login em produção
- [ ] Testar cadastro com indicação em produção
- [ ] Testar todas as funcionalidades em produção
- [ ] Verificar logs de erros em produção

---

## ✅ APROVAÇÃO FINAL

- [ ] **TODOS** os itens acima foram validados
- [ ] Sistema testado por pelo menos 2 pessoas diferentes
- [ ] Não há bugs críticos conhecidos
- [ ] Documentação revisada e aprovada
- [ ] Backup do banco de dados realizado antes do deploy

---

## 📝 Observações e Problemas Encontrados

Use este espaço para anotar qualquer problema encontrado durante a validação:

```
[Anote aqui os problemas encontrados e suas soluções]
```

---

## ✍️ Assinaturas

**Desenvolvedor:**
- Nome: ___________________________
- Data: ___________________________
- Assinatura: ___________________________

**Responsável pela Validação:**
- Nome: ___________________________
- Data: ___________________________
- Assinatura: ___________________________

**Aprovação Final:**
- Nome: ___________________________
- Data: ___________________________
- Assinatura: ___________________________

---

## 🎉 Conclusão

Após completar este checklist, o sistema está pronto para produção!

**Boa sorte!** 🚀
