# 🎯 Sistema de Indicações - InvestBet Trader

## 📌 Resumo Executivo

Sistema completo de indicações implementado para o InvestBet Trader, permitindo que consultores ganhem comissões de 10% sobre o lucro mensal de clientes indicados.

## 🚀 Início Rápido

### 1. Execute o Script SQL
```sql
-- Copie e execute o conteúdo de supabase_migration.sql no SQL Editor do Supabase
```

### 2. Instale e Execute
```bash
pnpm install
pnpm dev
```

### 3. Configure um Consultor
No Supabase, altere o campo `categoria` de um usuário para `consultor`.

### 4. Teste o Sistema
- Login como consultor → Veja a aba "Indicações"
- Copie o link de referência
- Cadastre um novo usuário com o link
- Verifique a indicação no painel

## 📁 Arquivos do Sistema

### Novos Componentes
- `src/components/ReferralPage.jsx` - Página de indicações (consultores)
- `src/components/ConsultantsPage.jsx` - Gestão de consultores (admin)
- `src/components/AdminReferralsPage.jsx` - Gestão de indicações (admin)

### Arquivos Modificados
- `src/components/Dashboard.jsx` - Novas abas com controle de acesso
- `src/components/SignUpPage.jsx` - Captura código de referência
- `src/hooks/useAuth.jsx` - Processa indicação no cadastro

### Documentação
- `supabase_migration.sql` - Script de migração do banco
- `INSTRUCOES_SISTEMA_INDICACOES.md` - Instruções completas
- `CHECKLIST_VALIDACAO.md` - Checklist de testes
- `README_SISTEMA_INDICACOES.md` - Este arquivo

## 🎯 Funcionalidades Principais

### Para Consultores
✅ Geração automática de link de referência único  
✅ Visualização de todos os clientes indicados  
✅ Cálculo automático de comissões (10% do lucro)  
✅ Estatísticas em tempo real  

### Para Administrador
✅ Gestão completa de consultores  
✅ Visão geral de todas as indicações  
✅ Reset de ganhos após pagamento  
✅ Filtros e relatórios detalhados  

### Sistema de Cadastro
✅ Captura automática de código via URL (?ref=CODIGO)  
✅ Validação de código de referência  
✅ Suporte para cadastro direto (sem indicação)  

## 🔐 Controle de Acesso

| Usuário | Aba Indicações | Aba Consultores | Aba Gestão |
|---------|----------------|-----------------|------------|
| Cliente | ❌ | ❌ | ❌ |
| Consultor | ✅ | ❌ | ❌ |
| Admin | ✅* | ✅ | ✅ |

*Admin vê a aba Indicações apenas se também for consultor

**Email Admin:** douglasnoticias@gmail.com

## 🧮 Cálculo de Comissões

```
Lucro = Saldo Atual - Investimento Inicial
Comissão = Lucro × 10%
```

**Exemplo:**
- Investimento: R$ 1.000,00
- Saldo Atual: R$ 1.300,00
- Lucro: R$ 300,00
- Comissão: R$ 30,00

## 📊 Estrutura do Banco

Campos adicionados na tabela `profiles`:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| categoria | VARCHAR(20) | "cliente" ou "consultor" |
| indicacao | VARCHAR(255) | Nome do consultor |
| referral_code | VARCHAR(50) | Código único do consultor |
| referred_by_code | VARCHAR(50) | Código usado no cadastro |
| initial_balance | DECIMAL(10,2) | Investimento inicial |
| consultant_earnings | DECIMAL(10,2) | Ganhos acumulados |
| last_earnings_reset | TIMESTAMP | Data do último reset |

## 🔄 Fluxo de Indicação

1. **Consultor** acessa a aba "Indicações"
2. **Consultor** copia o link de referência
3. **Cliente** acessa o link e se cadastra
4. **Sistema** valida o código e registra a indicação
5. **Sistema** calcula comissões automaticamente
6. **Admin** visualiza ganhos e faz o pagamento
7. **Admin** reseta os ganhos após pagamento

## 🛠️ Tecnologias

- **Frontend:** React + Vite
- **UI:** Radix UI + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Segurança:** Row Level Security (RLS)

## 📚 Documentação Completa

Para instruções detalhadas, consulte:
- **INSTRUCOES_SISTEMA_INDICACOES.md** - Passo a passo completo
- **CHECKLIST_VALIDACAO.md** - Testes obrigatórios

## ⚠️ Importante

1. Execute o script SQL **antes** de usar o sistema
2. Configure pelo menos um consultor para testes
3. Preencha `initial_balance` manualmente no Supabase
4. Teste tudo localmente antes do deploy
5. Siga o checklist de validação completo

## 🆘 Problemas Comuns

### Aba não aparece para consultor
→ Verifique se `categoria` = "consultor" (minúsculas)

### Link de referência não funciona
→ Verifique se o consultor tem `referral_code` no Supabase

### Comissões incorretas
→ Verifique se `initial_balance` e `balance` estão preenchidos

## 📞 Suporte

1. Verifique a documentação completa
2. Consulte o checklist de validação
3. Verifique os logs do console (F12)
4. Verifique os logs do Supabase

## ✅ Status do Projeto

- [x] Estrutura do banco de dados
- [x] Componentes do frontend
- [x] Sistema de autenticação
- [x] Controle de acesso
- [x] Cálculo de comissões
- [x] Documentação completa
- [ ] Testes de validação
- [ ] Deploy para produção

## 🎉 Pronto para Usar!

Siga as instruções em `INSTRUCOES_SISTEMA_INDICACOES.md` para implementar o sistema.

**Boa sorte!** 🚀
