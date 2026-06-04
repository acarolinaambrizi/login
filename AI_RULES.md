# AI Rules

> Lido automaticamente pelo Dyad a cada prompt. Mantenha este arquivo **curto e direto** — regras longas diluem as importantes.
> Detalhes de arquitetura estão em `docs/frontend.md`, `docs/backend.md` e nos `README.md` de cada contexto em `src/contexts/`.

---

## Projeto

- React + TypeScript + Vite + Supabase. Stack completa em `docs/frontend.md`.
- Página principal: `src/pages/Index.tsx` — **sempre atualizar** ao adicionar componentes visíveis.
- Rotas: todas em `src/App.tsx`, nunca em outros arquivos.
- Código-fonte: somente dentro de `src/`.

---

## Consulta aos Guias de Detalhe

Ao receber uma tarefa:

1. Leia este `AI_RULES.md` primeiro.
2. Identifique o contexto funcional em `src/contexts/<nome>/`.
3. Se o contexto ainda não existir, crie a estrutura inicial completa do contexto, incluindo `README.md`.
4. Leia o `README.md` do contexto relevante antes de editar código.
5. Consulte apenas a seção necessária dos guias abaixo, usando o **Índice Operacional** no topo de cada arquivo:
   - `docs/frontend.md` → tarefas de UI, páginas, hooks, formulários, rotas, auth e experiência do usuário
   - `docs/backend.md` → tarefas de schema, tabelas, RLS, RPC, triggers, views e migrations
6. Se a tarefa for full-stack, consulte os dois guias.
7. Ao finalizar mudanças de arquitetura, atualize o `README.md` do contexto.

Regra prática:
- Não releia `docs/frontend.md` ou `docs/backend.md` por completo sem necessidade.
- Leia apenas a seção relevante para a tarefa atual.

---

## Stack — Não substituir sem aprovação

- UI: **shadcn/ui** (já instalado). Não editar `src/components/ui/`. Criar wrappers se precisar customizar.
- Estilização: **Tailwind CSS** apenas. Sem CSS customizado. Classes condicionais via `cn()` de `src/lib/utils.ts`.
- Ícones: **lucide-react** (já instalado).
- Formulários: **React Hook Form + Zod**.
- Dados da API: **TanStack Query** — nunca `useEffect` para fetch.
- Notificações: **sonner**.
- Roteamento: **React Router**.

---

## Regras de Código

- TypeScript estrito — sem `any`. Sem `object` em props. Use tipos específicos.
- Componentes: máx. **150 linhas**. Acima disso, extrair hook → subcomponente → types.
- Pages: máx. **120 linhas**, apenas composição — sem lógica.
- Hooks: máx. **120 linhas**.
- JSDoc obrigatório em todo componente, hook e função utilitária.
- Comentários explicam o *porquê*, nunca o óbvio.
- Named exports para componentes de feature. Default export só em pages.
- Imports absolutos com alias `@/`.
- Sem `console.log`. Sem código comentado morto.

---

## Contextos — Arquitetura do Projeto

O projeto é dividido em contextos funcionais em `src/contexts/<nome>/`. Cada contexto tem:
- `README.md` — arquitetura, tabelas usadas, decisões técnicas. **Sempre atualizar após mudanças.**
- `components/`, `hooks/`, `services/`, `<nome>.types.ts`

**Regra obrigatória:** ao criar um novo contexto em `src/contexts/<nome>/`, criar também o `README.md` desse contexto no mesmo commit.

**Ao receber uma tarefa:** leia o `README.md` do contexto relevante antes de editar código.  
**Ao finalizar uma tarefa com mudanças de arquitetura:** atualize o `README.md` do contexto.  
**Se o contexto ainda não existir:** crie a estrutura inicial completa, incluindo `README.md`.

---

## Segurança & Git

- `.env` **nunca commitado**. Está no `.gitignore`. Versionar apenas `.env.example`.
- Nunca expor `service_role` key no front-end. Apenas `anon` key.
- Supabase client: somente `src/integrations/supabase/client.ts`.
- Nunca commitar direto na `main`. Branches: `feature/*`, `fix/*`, `release/*`.

---

## Versionamento

- O Dyad versiona automaticamente cada edição via git. Use o painel de versões para reverter.
- Releases públicos: SemVer em `package.json` + tag git + entrada no `CHANGELOG.md`.

---

## Arquivos Protegidos — Não modificar sem confirmação

- `src/components/ui/*` — componentes shadcn/ui
- `src/integrations/supabase/client.ts` — cliente Supabase
- `supabase/migrations/*` — nunca alterar migrations existentes, apenas criar novas
- `.env` — nunca tocar