# SpeakUp Fase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App Next.js navegável: landing SpeakUp em `/`, cadastro demo, trilha de níveis, leitor de capítulos com o tutor Max por chat.

**Architecture:** Next.js App Router. A landing atual (`index.html`) passa a ser servida como arquivo estático em `/` via rewrite. O conteúdo vem de arquivos markdown em `content/<nivel>/<ebook>/<nn-capitulo>.md`, lidos por `lib/content.ts`. O tutor é uma rota de servidor com streaming: usa a Anthropic quando existe `ANTHROPIC_API_KEY` e responde em modo demo quando não existe. Sessão demo guardada em cookie.

**Tech Stack:** Next.js 15, TypeScript, Tailwind v4, `@anthropic-ai/sdk`, `gray-matter`, `react-markdown`, Vitest.

**Spec:** `docs/specs/2026-11-17-ingles-saas-design.md`

## Global Constraints
- Interface em pt-BR. Marca SpeakUp, tutor "Max". Cores e fontes iguais às da landing (`--blue:#2563ff`, `--navy:#0a2463`, `--yellow:#ffd23f`, Bricolage Grotesque / DM Sans).
- Limite do tutor: 60 mensagens/dia para assinante e 10 no total no teste.
- O tutor corrige e explica em português e nunca entrega a resposta pronta do exercício.

## Review Focus
- Slug de capítulo inexistente → 404, não erro 500.
- Chat sem `ANTHROPIC_API_KEY` → resposta demo, nunca erro.
- Limite estourado → mensagem clara em pt-BR (HTTP 429).
- Acesso a `/app/*` sem sessão → redireciona para `/cadastro`.
- Leitor e chat no celular (375px) → sem rolagem horizontal; chat em gaveta.

---

### Task 1: Scaffold + landing em `/`
**Files:** `package.json`, `next.config.ts`, `public/landing.html` (cópia de `index.html` com CTAs `#planos` dos planos/hero → `/cadastro`), `app/layout.tsx`, `app/globals.css`
- [ ] create-next-app (TS, Tailwind, App Router, sem src/)
- [ ] rewrite `beforeFiles`: `/` → `/landing.html`
- [ ] `npm run build` passa; `GET /` devolve a landing
- [ ] Commit

### Task 2: Conteúdo
**Files:** `lib/content.ts`, `content/**`, `lib/content.test.ts`
**Produces:** `getLevels(): Level[]`, `getChapter(level, ebook, chapter): Chapter | null`, `getAdjacent(...)`. Tipos: `Level{slug,title,cefr,ebooks:Ebook[]}`, `Ebook{slug,title,chapters:ChapterMeta[]}`, `ChapterMeta{slug,title,order,free}`, `Chapter extends ChapterMeta{content,level,ebook}`.
- [ ] Testes: níveis ordenados A1→C1; `getChapter` inexistente → `null`; o primeiro capítulo de cada nível é `free`
- [ ] Implementar com `gray-matter`; seed: 1 ebook com 2–3 capítulos por nível
- [ ] Commit

### Task 3: Limite de uso
**Files:** `lib/usage.ts`, `lib/usage.test.ts`
**Produces:** `checkLimit(plan:'trial'|'pro', used:{today:number,total:number}): {ok:boolean, remaining:number}`
- [ ] Testes: pro 59/60 → ok, 60 → bloqueado; trial total 10 → bloqueado
- [ ] Implementar e commitar

### Task 4: Sessão demo + cadastro
**Files:** `lib/session.ts`, `app/cadastro/page.tsx`, `middleware.ts`
- [ ] Cookie `speakup_session` (JSON: nome, nível, plano, contagem de uso); middleware protege `/app`
- [ ] Commit

### Task 5: Área do aluno
**Files:** `app/app/layout.tsx`, `app/app/page.tsx` (painel + "continuar"), `app/app/trilha/page.tsx`
- [ ] Commit

### Task 6: Leitor + tutor
**Files:** `app/app/[level]/[ebook]/[chapter]/page.tsx`, `components/TutorChat.tsx`, `app/api/tutor/route.ts`, `lib/tutor-prompt.ts`
- [ ] `buildSystemPrompt(chapter, level)` com as regras do spec
- [ ] Rota: valida o limite (429), faz streaming da Anthropic ou cai no modo demo
- [ ] Chat com botões rápidos "Me passe exercícios", "Corrija minha frase" e "Explique de novo"; gaveta no mobile
- [ ] Verificar no navegador; commit
