# SaaS de Inglês com Ebooks + Tutor de IA — Design

Data: 2026-11-17
Status: aprovado em 2026-11-17 ("começa a construir")

## 1. Intenção e o porquê

Uma plataforma de assinatura para brasileiros aprenderem inglês **sem professor humano**:
o conteúdo vem de **ebooks** (organizados em níveis e capítulos) e a prática vem de um
**tutor de IA por chat** que, a cada capítulo, passa exercícios sobre aquele conteúdo,
corrige as respostas e tira dúvidas.

Posicionamento: **mais barato que a Fluency**. Sem professores humanos, o custo
operacional é baixo, e é isso que permite o preço menor. A página de vendas deve
deixar essa comparação clara.

Referências:
- **Fluency (Mega Black)**: estrutura da página de vendas (promessa forte, método,
  depoimentos, oferta com ancoragem de preço, garantia, FAQ, CTA repetido).
- **Cambly**: a ideia de praticar com "alguém" a qualquer hora. Aqui esse papel é
  da IA, por chat.

## 2. Objetivos, não-objetivos, anti-objetivos

**Objetivos (MVP)**
- Página de vendas que converte, com preço visivelmente abaixo da Fluency.
- Cadastro/login e assinatura paga (cartão + PIX).
- Área do aluno: trilha por níveis → ebooks → capítulos, com progresso.
- Leitor de capítulo com o **tutor de IA ao lado**, ciente do capítulo aberto.
- Painel admin para cadastrar níveis, ebooks e capítulos (colar/importar markdown).
- Controle de custo da IA (limite de mensagens por dia).

**Não-objetivos (fora do MVP)**
- Conversa por voz / correção de pronúncia.
- Aulas ao vivo, professores humanos, marketplace.
- App mobile nativo (o site é responsivo).
- Geração automática dos ebooks dentro da plataforma (o dono gera por fora).
- Programa de afiliados, gamificação avançada, certificados.

**Anti-objetivos (seria fracasso mesmo funcionando)**
- O tutor responder de forma genérica, ignorando o capítulo que o aluno está lendo.
- A IA fazer o exercício pelo aluno em vez de corrigir e explicar.
- O custo de IA por aluno passar de uma fração pequena do preço da assinatura.
- Parecer um clone da Fluency: a estrutura é referência, mas marca, textos e
  visual são próprios.

## 3. Restrições

- Público brasileiro: interface em português, preços em R$, PIX obrigatório.
- Os ebooks ainda não existem. O sistema precisa funcionar com **conteúdo de exemplo**
  e aceitar os ebooks reais depois, em **markdown por capítulo**.
- Orçamento de IA apertado, porque o preço é baixo. Usar um modelo barato e rápido
  e limitar mensagens.
- LGPD: política de privacidade e termos, e exclusão de conta.

## 4. Abordagens consideradas

| | Abordagem | Prós | Contras |
|---|---|---|---|
| **A (escolhida)** | Plataforma própria: Next.js + Supabase + Stripe + Claude, na Vercel | Experiência integrada (ler e praticar no mesmo lugar), controle total, cara de produto | Mais código para manter |
| B | Hotmart/Kiwify para pagamento e área de membros + app de IA separado | Lança mais rápido, afiliados prontos | Duas plataformas, aluno pula entre elas, taxas mais altas, experiência quebrada |

O dono escolheu **A**. O diferencial do produto é "leio e a IA me corrige ali do lado",
e isso só fica bom numa plataforma única.

## 5. O que foi decidido

- **Aprendizado:** ebooks + tutor de IA **por chat** (sem voz no MVP).
- **Formato do ebook:** capítulos em **markdown** guardados no banco. Download em PDF
  é opcional e fica para depois.
- **Plataforma:** abordagem A.
- **Diferencial comercial:** preço menor que a Fluency.

## 6. Proposta de produto (chamadas minhas, sujeitas a correção)

**Marca:** SpeakUp, com o tutor "Max". Já existe uma landing page própria em `index.html` (commits de 2026-11-17), que vira a página de vendas.

**Planos:** Mensal R$ 49/mês e Anual Pro 12x R$ 49. **Sem teste grátis** (decisão do dono em 2026-11-17): sem assinatura não há capítulos nem mensagens com o Max. Vale o direito de arrependimento de 7 dias do CDC (reembolso), que não é teste grátis.

**Trilha:** níveis A1 → A2 → B1 → B2 → C1. Cada nível tem 1 ou mais ebooks, e cada
ebook tem capítulos. Progresso por capítulo: não iniciado → lido → exercícios feitos.

**Tutor de IA:**
- O prompt do sistema recebe: nível do aluno, texto do capítulo atual e as regras
  (corrigir explicando em português, não entregar a resposta pronta, propor
  exercícios do capítulo, manter o foco no conteúdo).
- Botões rápidos: "Me passe exercícios", "Corrija minha frase", "Explique de novo".
- Histórico salvo por aluno e por capítulo.
- Limite: 60 mensagens/dia por assinante, 10 no total no teste grátis.
- Modelo: Claude Haiku (o mais barato e rápido da família atual). Preço e ID confirmados
  na implementação.

**Telas:**
1. Landing page de vendas: hero com promessa, como funciona (ler → praticar →
   evoluir), demo do tutor, comparação de preço, planos, garantia, depoimentos
   (placeholders marcados como exemplo), FAQ, CTA.
2. Cadastro / login (e-mail + senha e Google).
3. Checkout (Stripe Checkout com cartão e PIX).
4. Painel do aluno: nível atual, progresso, "continuar de onde parou".
5. Trilha: níveis → ebooks → capítulos.
6. Leitor de capítulo + chat do tutor (lado a lado no desktop; no celular o chat
   abre como gaveta).
7. Conta: assinatura (portal do Stripe), dados, excluir conta.
8. Admin: CRUD de níveis/ebooks/capítulos, importação de `.md`, lista de alunos.

```
┌──────────────────────────────────────────────────────────┐
│ ← B1 · Ebook 2 · Cap. 3: Present Perfect      [▓▓▓░░] 60%│
├───────────────────────────────┬──────────────────────────┤
│  # Present Perfect            │ 🤖 Tutor                  │
│  Usamos o present perfect     │ Pronto para praticar?    │
│  para...                      │ [Exercícios] [Corrigir]  │
│                               │                          │
│  > I have lived here for...   │ Você: I have went...     │
│                               │ Tutor: Quase! "went" é   │
│                               │ passado simples; aqui... │
│        [Marcar como lido →]   │ [ digite...        ] ➤   │
└───────────────────────────────┴──────────────────────────┘
```

## 7. Arquitetura

- **Next.js (App Router, TypeScript) + Tailwind**, deploy na Vercel.
- **Supabase:** Auth, Postgres com Row Level Security.
- **Stripe:** Checkout, Billing (assinatura), Customer Portal, webhook que atualiza o
  status da assinatura no banco.
- **Anthropic API:** rota de servidor `/api/tutor` com streaming. Verifica a
  assinatura e o limite diário antes de chamar o modelo.

**Tabelas principais:**
`profiles` (id, nome, nível, is_admin), `subscriptions` (user_id, stripe ids, status,
plano, período), `levels`, `ebooks` (level_id, título, ordem, capa),
`chapters` (ebook_id, título, ordem, content_md, is_free), `progress`
(user_id, chapter_id, status), `tutor_messages` (user_id, chapter_id, role, content,
created_at), `usage_daily` (user_id, data, contagem).

**Acesso:** capítulo `is_free` é aberto a quem tem conta. Os demais exigem
assinatura `active` ou `trialing`.

**Conteúdo de exemplo:** seed com 1 ebook curto por nível (2–3 capítulos cada)
para a plataforma funcionar antes dos ebooks reais.

## 8. Deixado para o implementador

- Biblioteca de componentes (proposta: shadcn/ui) e o visual (paleta e tipografia
  próprias).
- Renderização de markdown e estilo do leitor.
- Estrutura exata das pastas e testes (lógica de acesso, limite de uso e webhook do
  Stripe precisam de testes).
- Textos finais da landing (rascunho feito pelo implementador, revisado pelo dono).

## 9. Pendências do dono (não bloqueiam o início)

- Nome e marca definitivos.
- Preços finais.
- Contas: Stripe (com PIX habilitado), Supabase, Anthropic e Vercel.
- Os ebooks reais, em markdown por capítulo.

## 10. Fase 1 (esta entrega)

Para o dono avaliar antes de criar as contas: Next.js com a landing atual servida em `/`, cadastro em modo demo (sem senha), trilha, leitor e tutor. Os capítulos ficam em arquivos markdown em `content/`. O tutor usa a API da Anthropic quando existe `ANTHROPIC_API_KEY` e, sem ela, responde em modo demonstração. Supabase, Stripe e o admin entram na fase 2.

**Diferenças entre a landing e o MVP (decisão do dono):** a landing promete voz/pronúncia, app mobile, certificados, níveis até C2, áudios e o plano Empresas. Nada disso está no MVP.
