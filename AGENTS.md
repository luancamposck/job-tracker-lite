# AGENTS.md — Job Tracker Lite

> Guia para agentes (Codex) contribuírem com consistência, velocidade e qualidade.
> Prioridade: entregas pequenas, incrementais, com UI bonita e código bem organizado.

## Visão geral do projeto

**Job Tracker Lite** é uma SPA para organizar e acompanhar candidaturas a vagas de emprego.
O usuário consegue cadastrar vagas, acompanhar status do processo seletivo e visualizar um dashboard com estatísticas.

Objetivo: ser um projeto **enxuto, rápido de evoluir e com “cara de produto”**, valorizando:
- organização por domínio (Feature-First)
- UI rápida e consistente com Tailwind + shadcn/ui
- persistência local via localStorage (por enquanto)
- qualidade (Biome, hooks de commit e mensagens padronizadas)

## Stack

- **Vite** (SPA)
- **React 19** + **TypeScript**
- **@vitejs/plugin-react-swc** (SWC)
- **React Router** (navegação)
- **Tailwind CSS**
- **shadcn/ui** (Radix + componentes copiáveis)
- **Biome** (format/lint/imports)
- (opcional) **Husky + lint-staged + commitlint** para padronizar commits

> NÃO usar CSS Modules neste projeto.

## Princípios de arquitetura

### Feature-First (obrigatório)
Organizar por domínio/feature em vez de “pastas por tipo” globais.

Estrutura base sugerida:

src/
  app/
    router.tsx
    App.tsx
    providers/
  features/
    jobs/
      api/
      model/
      hooks/
      ui/
        pages/
        components/
    job-tags/
      api/
      model/
      hooks/
      ui/
  shared/
    ui/
    lib/
    styles/

### Responsabilidades (regras de dependência)
- `features/*/ui` → renderização, componentes, páginas. **Não** acessa localStorage direto.
- `features/*/hooks` → orquestração (estado, side-effects, chama api + model).
- `features/*/model` → regras e estruturas puras (types/schemas). **Não** depende de React nem de browser APIs.
- `features/*/api` → acesso a dados (localStorage hoje, HTTP amanhã). **Sem UI**.
- `shared/*` → reutiluizável e sem domínio. **Não depende de features**.

Permissões de import (ideal):
- ui → hooks
- hooks → api + model + shared
- api → shared
- model → shared (se fizer sentido)

Evitar:
- api → ui
- model → react
- shared → features

### “Camadas” no front (mapeamento mental)
- Repo/Datasource = `features/<feature>/api/*`
- Regras/Use-cases = `features/<feature>/model/*`
- Orquestração “action-like” = `features/<feature>/hooks/*`
- UI = `features/<feature>/ui/*`

## UI (Tailwind + shadcn/ui)

### Regras de UI
- Usar **shadcn/ui** para componentes base: Button, Input, Select, Dialog, DropdownMenu, Tabs, Toast/Sonner, etc.
- Preferir compor UI com componentes shadcn ao invés de reinventar do zero.
- Tailwind é a base; manter classes legíveis:
  - usar `cn()` (utilitário do shadcn) para combinar classes
  - evitar strings gigantes: extrair para constantes quando necessário

### Estilo e consistência
- Seguir o tema padrão do shadcn (tokens e classes).
- Evitar estilos “hard-coded” fora do padrão do tema.
- Manter UI responsiva (mobile-first quando fácil).
- Estados básicos em todas as telas:
  - empty state (sem vagas)
  - loading (quando aplicável)
  - erro (mensagem clara)

## Dados & persistência

### LocalStorage (hoje)
- Cada coleção deve usar uma `key` explícita e versionada.
  Exemplo:
  - `job-tracker-lite:jobs:v1`
  - `job-tracker-lite:tags:v1`

- A camada `api/` é a única autorizada a ler/escrever localStorage.
- Validação de entrada/saída e normalização ficam em `model/` e `hooks/`.

### API (futuro)
- Ao criar funções em `api/`, manter uma interface estável para trocar localStorage por HTTP com pouco retrabalho.
- Evitar lógica de UI e regras de negócio dentro de `api/`.

## Qualidade (Biome)

- Antes de finalizar qualquer mudança, rodar:
  - `npm run lint`

- Formatação e lint devem estar limpos.
- Não introduzir linters paralelos (sem ESLint/Prettier junto).

## Commits (se o projeto tiver commitlint)

Seguir Conventional Commits:
- `feat(scope): ...`
- `fix(scope): ...`
- `refactor(scope): ...`
- `docs(scope): ...`
- `chore: ...`

Exemplos:
- `feat(jobs): add create job dialog`
- `fix(storage): handle corrupted JSON fallback`
- `refactor(ui): simplify filters layout`
- `docs(readme): add screenshots and roadmap`
- `chore: setup biome + hooks`

Preferir commits pequenos e temáticos (5–15 min de trabalho cada).

## Fluxos de trabalho

### Como adicionar uma feature nova
1) Criar pasta:
   `src/features/<feature>/`
2) Criar subpastas mínimas:
   - `model/` (types e schema)
   - `api/` (datasource)
   - `hooks/` (orquestração)
   - `ui/pages` e `ui/components` (telas e componentes)
3) Conectar rota no `src/app/router.tsx` (se necessário)
4) Criar UI mínima com estado e persistência
5) Atualizar README se a feature for relevante

### Como adicionar um campo em uma entidade (ex: Job)
1) Alterar types/schema em `features/jobs/model`
2) Ajustar normalização/mappers se existir
3) Ajustar funções em `features/jobs/api` (se necessário)
4) Ajustar UI/form e exibição
5) Garantir compatibilidade com dados antigos no localStorage:
   - defaults para campos novos
   - fallback se JSON estiver quebrado

## Diretrizes para o agente

### Fazer
- Trabalhar incrementalmente: implementar o mínimo funcional e evoluir.
- Manter limites claros entre `ui`, `hooks`, `model` e `api`.
- Preferir shadcn/ui para componentes base.
- Manter consistência de nomes, rotas e estados.
- Escrever código legível e com bons nomes (PT/EN consistente no projeto).

### Não fazer
- Não acessar localStorage direto em UI.
- Não criar “pasta global components” para tudo (use `shared/ui` ou `features/*/ui`).
- Não adicionar libs pesadas sem necessidade.
- Não misturar padrões (ex: Redux + Zustand) sem justificativa.

## Comandos úteis

- Rodar dev:
  - `npm run dev`
- Build:
  - `npm run build`
- Preview:
  - `npm run preview`
- Check (format + lint):
  - `npm run check`
- Adicionar component Shadcn:
  - `npm run ui:add`

## Definition of Done (DoD)

Uma tarefa está pronta quando:
- Implementação funciona no fluxo proposto
- Código respeita Feature-First e limites de dependência
- UI usa Tailwind + shadcn de forma consistente
- `npm run check` passa
- UI tem estados mínimos (empty/loading/erro quando aplicável)
- Não há console errors/warnings óbvios

### Convenções obrigatórias de declaração
- **Componentes React**: SEMPRE `export const MyComponent = () => { ... }`
- **Funções utilitárias** (helpers/formatters/mappers): SEMPRE `export function myFunction() { ... }`

Exemplos:

✅ Componente:
export const JobsPage = () => {
  return <div />;
};

✅ Função util:
export function formatDate(date: Date) {
  return date.toISOString();
}

---
Fim.
