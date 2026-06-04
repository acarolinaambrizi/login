# Guia de Boas Práticas — Front-end React

> Stack: React · TypeScript · Vite · Tailwind CSS · shadcn/ui · React Query · React Hook Form · Zod · Supabase
> Para tarefas operacionais, a IA deve usar primeiro o Índice Operacional abaixo e ler apenas a seção relevante.

---

## Índice Operacional para IA

Use este índice para ler apenas a parte necessária do arquivo.

Se a tarefa envolver...

- Estrutura de pastas, onde criar arquivos, organização por contexto
  → leia a seção **1. Estrutura do Projeto**

- Arquivo grande, componente grande, page grande, extração de hook, subcomponentes ou types
  → leia a seção **2. Limite de Tamanho de Arquivos e Componentização**

- JSDoc, comentários, documentação de código, padrão de explicação do *porquê*
  → leia a seção **3. Documentação de Código**

- Criação ou revisão de componente React, props, exports, hierarquia de componentes
  → leia a seção **4. Componentes**

- Estado local, Context API, Zustand, dados da API, React Query, mutações
  → leia a seção **5. Gerenciamento de Estado**

- Formulários, validação, React Hook Form, Zod, submit, defaultValues
  → leia a seção **6. Formulários**

- Rotas, `App.tsx`, rotas protegidas, navegação, `useNavigate`, `ProtectedRoute`
  → leia a seção **7. Roteamento**

- Login, sessão, usuário autenticado, Supabase Auth, `useAuth`
  → leia a seção **8. Autenticação (Supabase Auth)**

- Toasts, feedback de sucesso/erro, loading assíncrono, confirmação de ação
  → leia a seção **9. Feedback ao Usuário**

- Loading, skeleton, erro de query, exibição de erro ao usuário
  → leia a seção **10. Padrões de Tratamento de Erro**

- `React.memo`, `useMemo`, `useCallback`, lazy loading, imagens, performance
  → leia a seção **11. Performance**

- Validação final antes de commit
  → leia a seção **12. Checklist antes de commitar**

### Ordem recomendada de leitura

- Toda tarefa de frontend:
  1. `AI_RULES.md`
  2. `src/contexts/<nome>/README.md`
  3. Seção relevante deste `frontend.md`

- Tarefa full-stack:
  1. `AI_RULES.md`
  2. `src/contexts/<nome>/README.md`
  3. Seção relevante deste `frontend.md`
  4. Seção relevante de `docs/backend.md`

---

## Princípios Fundamentais

1. **Componente com propósito único:** Cada componente faz uma coisa. Se crescer demais, divida.
2. **Arquivos pequenos e focados:** Nenhum arquivo deve ultrapassar **150 linhas**. Acima disso, é sinal de que precisa ser quebrado.
3. **Código autodocumentado:** Todo arquivo, função e componente não trivial deve ter comentários que explicam o *porquê*, não o *o quê*.
4. **Tipagem forte:** TypeScript em tudo. Sem `any`. A tipagem é documentação viva.
5. **Estado como fonte da verdade:** A UI é uma função do estado. Nunca manipule o DOM diretamente.
6. **Servidor é o dono dos dados:** Use TanStack Query para tudo que vem da API. Sem `useEffect` para fetch.
7. **Tailwind first:** Não escreva CSS customizado. Se não consegue com Tailwind, revise a abordagem.

---

## 1. Estrutura do Projeto

```text
/src
├── assets/
├── contexts/                ← Domínios funcionais (ver AI_RULES.md)
│   ├── users/
│   │   ├── README.md        ← Obrigatório — mantido atualizado
│   │   ├── components/
│   │   ├── hooks/
│   │   └── users.types.ts
│   └── <feature>/
│       ├── README.md
│       └── ...
├── components/
│   ├── common/              # WelcomeModal, ConfirmDialog, EmptyState...
│   ├── layout/              # Header, Sidebar, PageWrapper...
│   └── ui/                  # shadcn/ui — NÃO EDITAR
├── hooks/                   # Hooks globais: useAuth, useDebounce, usePermissions...
├── integrations/
│   └── supabase/            # client.ts + types gerados
├── lib/                     # utils.ts, formatters.ts, constants.ts
├── pages/                   # Composição de contextos → rotas
├── App.tsx                  # Providers + React Router
├── main.tsx
└── globals.css
```

**Regras:**
- Um arquivo por componente, nomeado igual ao componente: `UserCard.tsx`.
- Pages ficam em `/pages`, nunca em `/components`.
- Hooks customizados sempre começam com `use`: `usePackageData.ts`.

---

## 2. Limite de Tamanho de Arquivos e Componentização

### 2.1 Limites por tipo de arquivo

| Tipo de arquivo | Limite recomendado | Limite máximo absoluto |
|---|---|---|
| Componente React | 100 linhas | 150 linhas |
| Hook customizado | 80 linhas | 120 linhas |
| Page | 80 linhas | 120 linhas |
| Arquivo de serviço/util | 60 linhas | 100 linhas |
| Arquivo de constantes/types | sem limite rígido | — |

> **Regra prática:** Se você está com dificuldade de encontrar onde começa ou termina uma responsabilidade dentro do arquivo, ele já está grande demais.

### 2.2 Como quebrar componentes grandes

Quando um componente ultrapassa o limite, quebre seguindo esta ordem:

1. **Extraia lógica para um hook** — todo `useState`, `useEffect`, handlers e derivações saem do componente para um `use<Nome>.ts`.
2. **Extraia seções de JSX** — blocos visuais distintos viram subcomponentes no mesmo diretório da feature.
3. **Extraia tipos** — interfaces e types vão para um `<feature>.types.ts`.

```text
# Exemplo: UserManagementPage ficou grande → quebrar assim:

components/users/
├── UserManagementPage.tsx      # ≤ 80 linhas — só composição
├── UserTable.tsx               # Tabela de usuários
├── UserTableRow.tsx            # Uma linha da tabela
├── UserFilters.tsx             # Barra de filtros
├── UserFormDialog.tsx          # Dialog de criar/editar
└── users.types.ts              # Interfaces e types da feature

hooks/
└── useUserManagement.ts        # Toda a lógica: queries, mutations, estado local
```

### 2.3 Exemplo de decomposição

```tsx
// ❌ Errado — componente com 200+ linhas fazendo tudo
export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  // ... 50 linhas de lógica ...
  return (
    <div>
      {/* ... 100 linhas de JSX misturado com lógica ... */}
    </div>
  );
}

// ✅ Correto — page como pura composição (≤ 80 linhas)
/**
 * Página de gerenciamento de usuários.
 * Composição de: UserFilters + UserTable + UserFormDialog.
 * Lógica centralizada em useUserManagement().
 */
export default function UserManagementPage() {
  const { users, isLoading, filters, setFilters, dialog } = useUserManagement();

  return (
    <PageWrapper title="Usuários">
      <UserFilters filters={filters} onChange={setFilters} />
      <UserTable users={users} isLoading={isLoading} onEdit={dialog.open} />
      <UserFormDialog open={dialog.isOpen} onClose={dialog.close} />
    </PageWrapper>
  );
}
```

---

## 3. Documentação de Código

### 3.1 O que documentar e como

**Regra central:** Documente o *porquê*, não o *o quê*. O código já diz o que faz. O comentário explica a intenção, a restrição ou a decisão arquitetural.

```tsx
// ❌ Comentário inútil — descreve o óbvio
// Incrementa o contador
setCount(count + 1);

// ✅ Comentário útil — explica a decisão
// Incrementa em 1 e não em valor arbitrário porque o backend
// processa apenas incrementos unitários por limitação da API legada.
setCount(count + 1);
```

### 3.2 Padrão de documentação por tipo de arquivo

**Componentes React — JSDoc no topo + props documentadas:**

```tsx
/**
 * Exibe o badge de status de um usuário.
 *
 * Usado em: UserTable, UserCard, UserDetailsPanel.
 *
 * @param status - Status atual do usuário no sistema.
 * @param className - Classes Tailwind adicionais (opcional).
 */
export interface StatusBadgeProps {
  /** Status vindo do banco — reflete user_management.app_users.status */
  status: "pending" | "active" | "suspended";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = {
    pending:   { label: "Pendente",   classes: "bg-yellow-100 text-yellow-800" },
    active:    { label: "Ativo",      classes: "bg-green-100 text-green-800"   },
    suspended: { label: "Suspenso",   classes: "bg-red-100 text-red-800"       },
  };

  const { label, classes } = config[status];

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", classes, className)}>
      {label}
    </span>
  );
};
```

**Hooks customizados — JSDoc + comentário por seção:**

```tsx
/**
 * Gerencia toda a lógica da página de usuários:
 * busca, filtros, paginação e ações de mutação.
 *
 * Depende de: useQuery (TanStack), supabase client, toast (sonner).
 * Consumido por: UserManagementPage.
 */
export function useUserManagement() {
  const [filters, setFilters] = useState<UserFilters>(DEFAULT_FILTERS);
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false });

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => fetchUsers(filters),
  });

  const { mutate: updateUser } = useMutation({ ... });

  return { users, isLoading, filters, setFilters, dialog: dialogState };
}
```

**Funções utilitárias — JSDoc completo:**

```tsx
/**
 * Formata um valor numérico como moeda brasileira (BRL).
 *
 * @param value - Valor em centavos (integer) ou reais (float).
 * @param inCents - Se true, divide por 100 antes de formatar. Default: false.
 * @returns String formatada. Ex: "R$ 1.234,56"
 *
 * @example
 * formatCurrency(1234.56)        // → "R$ 1.234,56"
 * formatCurrency(123456, true)   // → "R$ 1.234,56"
 */
export function formatCurrency(value: number, inCents = false): string {
  const amount = inCents ? value / 100 : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}
```

### 3.3 Comentários de seção em arquivos maiores

Para arquivos que se aproximam do limite, use separadores de seção:

```tsx
// ============================================================
// TIPOS E INTERFACES
// ============================================================

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

// ============================================================
// SUBCOMPONENTES INTERNOS
// ============================================================
```

### 3.4 O que NÃO documentar

- Código óbvio (`// retorna o nome do usuário` acima de `return user.name`)
- Código morto (delete, não comente)
- `TODO` sem dono e sem data — use issues do projeto

---

## 4. Componentes

### 4.1 Criação

```tsx
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        status === "active"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-600",
        className
      )}
    >
      {status === "active" ? "Ativo" : "Inativo"}
    </span>
  );
};
```

### 4.2 Hierarquia de componentes

- `src/components/ui/` → base do shadcn/ui (não editar)
- `src/components/common/` → wrappers e extensões dos componentes base
- `src/components/<feature>/` → composição específica do domínio
- `src/pages/` → composição de layout + feature components

### 4.3 Quando criar um novo componente

Crie um novo componente quando:
- O JSX tem mais de ~60 linhas
- A mesma estrutura aparece em 2+ lugares
- Uma seção tem seu próprio estado independente

### 4.4 Exports

```tsx
export default function DashboardPage() { ... }

export const UserCard = () => { ... }
```

---

## 5. Gerenciamento de Estado

### 5.1 Quando usar cada abordagem

| Tipo de estado | Solução |
|---|---|
| UI local simples (toggle, input) | `useState` |
| UI local complexa (máquina de estados) | `useReducer` |
| Dados da API | TanStack Query |
| Estado global de UI (tema, sidebar) | Context API |
| Estado global complexo | Zustand (se necessário) |

### 5.2 TanStack Query — padrão obrigatório para API

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPackage: NewPackageInput) => {
      const { data, error } = await supabase
        .from("packages")
        .insert(newPackage)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Pacote criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar pacote: ${error.message}`);
    },
  });
}
```

**Regras do React Query:**
- `queryKey` deve ser granular: `["packages", userId]` não apenas `["packages"]`.
- Sempre trate `isLoading` e `isError` nos componentes que consomem queries.
- Após mutações, invalide as queries afetadas com `invalidateQueries`.
- Nunca use `useEffect` + `useState` para buscar dados — sempre React Query.

---

## 6. Formulários

### 6.1 Padrão React Hook Form + Zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const packageSchema = z.object({
  name: z.string().min(3, "Mínimo de 3 caracteres."),
  code: z.coerce.number().positive("Deve ser um número positivo."),
  description: z.string().optional(),
});

type PackageFormData = z.infer<typeof packageSchema>;

export function AddPackageForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: createPackage, isPending } = useCreatePackage();

  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: { name: "", code: 0 },
  });

  const onSubmit = (data: PackageFormData) => {
    createPackage(data, { onSuccess });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Pacote</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Plano Básico" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
```

**Regras de formulários:**
- Use os componentes `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` do shadcn/ui.
- O schema Zod é a fonte de verdade para validação **e** tipagem.
- Nunca desabilite o botão de submit sem dar feedback visual (spinner, texto alternativo).
- Formulários de edição devem popular `defaultValues` com os dados existentes.

---

## 7. Roteamento

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/packages" element={<PackagesPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Regras:**
- Todas as rotas ficam em `App.tsx`. Ponto.
- Use `<Outlet />` dentro do `ProtectedRoute` para renderizar rotas filhas.
- Para redirecionamento programático, use `useNavigate()`.

---

## 8. Autenticação (Supabase Auth)

```tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
```

---

## 9. Feedback ao Usuário

Use sempre `sonner` para notificações de resultado de ações:

```tsx
import { toast } from "sonner";

toast.success("Registro salvo com sucesso!");

toast.error("Falha ao salvar. Tente novamente.");

toast.promise(saveRecord(), {
  loading: "Salvando...",
  success: "Salvo!",
  error: "Erro ao salvar.",
});
```

**Regras:**
- Toda mutação de dados deve ter feedback de sucesso e erro.
- Evite `alert()` e `confirm()` nativos. Use `Dialog` do shadcn/ui para confirmações.
- Estados de carregamento devem ser visíveis (skeleton, spinner ou texto).

---

## 10. Padrões de Tratamento de Erro

```tsx
const { data, isLoading, isError, error } = usePackages();

if (isLoading) return <PackagesSkeleton />;

if (isError) return (
  <div className="text-center py-8 text-muted-foreground">
    Erro ao carregar dados: {error.message}
  </div>
);
```

- Sempre crie um componente de skeleton realista (não apenas "Carregando...").
- Erros de rede devem ser visíveis mas não assustadores.
- Erros de validação são responsabilidade do Zod + React Hook Form (inline).

---

## 11. Performance

- Use `React.memo()` somente quando houver re-render desnecessário comprovado.
- Use `useMemo` e `useCallback` com parcimônia — só quando o cálculo é caro ou a referência importa.
- Imagens: sempre use `width` e `height` explícitos. Prefira formatos modernos (WebP).
- Lazy loading: use `React.lazy()` + `Suspense` para pages pesadas.

---

## 12. Checklist antes de commitar

- [ ] Nenhum arquivo ultrapassa 150 linhas
- [ ] Componentes grandes foram decompostos em subcomponentes
- [ ] Todo componente, hook e função utilitária tem JSDoc
- [ ] Comentários explicam o *porquê*, não o *o quê*
- [ ] README do contexto atualizado (se houve mudança de arquitetura ou lógica)
- [ ] `.env` **não** está entre os arquivos staged (`git status` para confirmar)
- [ ] `.env.example` atualizado se novas variáveis foram adicionadas
- [ ] `CHANGELOG.md` atualizado se for um release
- [ ] `package.json` com versão incrementada se for um release
- [ ] Sem `any` no TypeScript
- [ ] Sem `console.log` esquecido
- [ ] Formulário com validação Zod funcionando
- [ ] Estados de loading e erro tratados
- [ ] Feedback ao usuário (toast) em ações de mutação
- [ ] Variáveis de ambiente em `.env`, nunca hardcoded
- [ ] Rotas novas adicionadas em `App.tsx`
- [ ] `Index.tsx` atualizado se há novo componente principal