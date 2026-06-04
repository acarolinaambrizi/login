# Guia de Boas Práticas — Back-end com Supabase

> Stack: Supabase · PostgreSQL · RLS · RPC · PostgREST
> Para tarefas operacionais, a IA deve usar primeiro o Índice Operacional abaixo e ler apenas a seção relevante.

---

## Índice Operacional para IA

Use este índice para ler apenas a parte necessária do arquivo.

Se a tarefa envolver...

- Criação ou alteração de tabela, naming, colunas obrigatórias, modelagem
  → leia a seção **1. Schema e Design de Tabelas**

- Chaves estrangeiras, `ON DELETE RESTRICT`, `ON DELETE CASCADE`, soft delete
  → leia a seção **1.3 Chaves Estrangeiras e Regras de Exclusão**

- RLS, policies, controle de acesso, acesso por admin, acesso por organização
  → leia a seção **2. Segurança — Row Level Security (RLS)**

- Trigger de `updated_at`, automações, criação de perfil, sincronização com `auth.users`
  → leia a seção **3. Automação com Triggers e Funções**

- RPC, função SQL, lógica transacional, `SECURITY INVOKER`, `SECURITY DEFINER`
  → leia a seção **4. Lógica de Negócio com RPC**

- Exposição de dados ao frontend, views, contrato estável entre back e front
  → leia a seção **5. Exposição de Dados para o Front-end**

- Validação de nova tabela
  → leia a seção **6. Checklist de Nova Tabela**

- Criação de migration nova, convenções de nome, fluxo com Supabase CLI
  → leia a seção **7. Migrações**

- Regras específicas do Dyad, `SECURITY_RULES.md`, proteção de migrations
  → leia a seção **8. Notas Específicas para o Dyad**

### Ordem recomendada de leitura

- Toda tarefa de backend:
  1. `AI_RULES.md`
  2. `src/contexts/<name>/README.md` do contexto afetado
  3. Seção relevante deste `backend.md`

- Tarefa full-stack:
  1. `AI_RULES.md`
  2. `src/contexts/<name>/README.md`
  3. Seção relevante deste `backend.md`
  4. Seção relevante de `docs/frontend.md`

### Regras de navegação

- Não ler o arquivo inteiro sem necessidade.
- Consultar apenas a seção correspondente à tarefa.
- Em tarefas de schema, segurança e dados sensíveis, revisar também o impacto no front-end e no `README.md` do contexto.

---

## Princípios Fundamentais

1. **Segurança por padrão:** Acesso negado sempre. Toda permissão é concedida explicitamente via RLS.
2. **Integridade no banco:** Validação, consistência e regras de negócio vivem no PostgreSQL — não no front-end.
3. **Fonte única de verdade:** Operações atômicas e lógica complexa ficam em funções RPC.
4. **Convenções consistentes:** Qualquer desenvolvedor deve entender o schema ao olhar pela primeira vez.
5. **Acesso controlado por papel:** Nenhum usuário acessa o sistema sem aprovação de um admin.

---

## 1. Schema e Design de Tabelas

### 1.1 Arquitetura de Schemas do Projeto

O projeto utiliza o schema `user_management` para dados de usuários:

```text
auth.users              → Supabase Auth (gerenciado pelo Supabase)
user_management.app_users    → Perfil estendido (email, full_name, avatar_url, is_active)
user_management.roles        → Papéis disponíveis (ex: Admin, Analista, Solicitante)
user_management.user_roles   → Relação N:N usuário ↔ papel
```

O front-end nunca acessa tabelas diretamente — usa exclusivamente RPCs com `SECURITY DEFINER`.

### 1.2 Convenções de Nomenclatura

| Objeto | Convenção | Exemplo |
|---|---|---|
| Tabelas | `snake_case` plural | `app_users`, `roles`, `user_roles` |
| Colunas | `snake_case` singular | `user_id`, `avatar_url`, `full_name` |
| Funções RPC | `snake_case` verbo | `handle_new_user`, `update_user_avatar_url` |
| Triggers | `snake_case` descritivo | `on_auth_user_created`, `set_timestamp` |
| Policies | Texto livre descritivo | `"Users can read their own items"` |
| Schemas | `snake_case` | `public`, `user_management` |

### 1.3 Estrutura Padrão de Tabela

Toda tabela **DEVE** conter:

```sql
CREATE TABLE user_management.example_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  -- outras colunas
);

ALTER TABLE user_management.example_items ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON user_management.example_items
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
```

### 1.4 Chaves Estrangeiras e Regras de Exclusão

**Padrão → `ON DELETE RESTRICT`** (protege integridade)

```sql
ALTER TABLE user_management.user_roles
ADD CONSTRAINT user_roles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES user_management.app_users(id) ON DELETE RESTRICT;
```

**Exceção → `ON DELETE CASCADE`** somente com confirmação explícita

```sql
-- app_users referencia auth.users com CASCADE pois o perfil deve ser removido junto
user_management.app_users.id → auth.users(id) ON DELETE CASCADE
```

---

## 2. Segurança — Row Level Security (RLS)

**Regra de Ouro:** RLS ativo em toda tabela com dados sensíveis. Zero exceções.

O projeto possui um event trigger `rls_auto_enable` que ativa RLS automaticamente em toda tabela criada no schema `public`.

### 2.1 Padrões de Políticas

**Padrão 1 — Acesso via RPC (usado no projeto)**

O front-end nunca acessa tabelas diretamente. Usa RPCs com `SECURITY DEFINER` que contornam o RLS de forma controlada:

```sql
CREATE OR REPLACE FUNCTION public.get_user_dashboard_data()
RETURNS TABLE(id uuid, email text, full_name text, avatar_url text, status text, user_roles json)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'user_management' AS $$
BEGIN
    RETURN QUERY
    SELECT ... FROM user_management.app_users ...
    WHERE up.id = auth.uid()
      AND up.is_active = TRUE
      AND public.is_domain_allowed(up.email) = TRUE;
END;
$$;
```

**Padrão 2 — Acesso de Administrador**

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_management.user_roles ur
    JOIN user_management.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, user_management;
```

### 2.2 Checklist de RLS

- [ ] RLS ativado na tabela
- [ ] Event trigger `rls_auto_enable` garante RLS em tabelas public
- [ ] RPCs com SECURITY DEFINER expõem dados de forma controlada
- [ ] Testado com usuário sem permissão (deve retornar 0 rows, não erro)

---

## 3. Automação com Triggers e Funções

### 3.1 `updated_at` automático

```sql
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3.2 Auto-registro de Usuário

Ao fazer login via Azure AD, o trigger `on_auth_user_created` cria automaticamente um perfil em `user_management.app_users`:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_management.app_users (id, email, full_name, avatar_url, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    FALSE  -- Usuário começa inativo até aprovação do admin
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, user_management;
```

### 3.3 Auto-enable de RLS

```sql
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT * FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  LOOP
    IF cmd.schema_name = 'public' THEN
      EXECUTE format('ALTER TABLE IF EXISTS %s ENABLE ROW LEVEL SECURITY', cmd.object_identity);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog;
```

---

## 4. Lógica de Negócio com RPC

### 4.1 Quando usar funções RPC

- Operações que afetam múltiplas tabelas (atomicidade)
- Acesso a schemas privados (`user_management`)
- Lógica condicional complexa
- Operações que requerem contornar o RLS de forma controlada

### 4.2 `SECURITY DEFINER` — Padrão do Projeto

Todas as RPCs usam `SECURITY DEFINER` com `SET search_path` explícito para acessar o schema `user_management`:

```sql
SET search_path TO 'public', 'user_management'
```

### 4.3 RPCs Existentes

| RPC | Descrição | Retorno |
|---|---|---|
| `get_user_dashboard_data()` | Perfil do usuário autenticado com papéis. **Valida domínio do email** via `is_domain_allowed()` no WHERE. | TABLE(id, email, full_name, avatar_url, status, user_roles) |
| `update_user_avatar_url(p_user_id, p_avatar_url)` | Atualiza avatar | JSONB com success/message |
| `get_all_roles()` | Lista todos os papéis | SETOF roles |
| `get_all_users()` | Lista todos os usuários (admin) | SETOF app_users |
| `create_app_user(...)` | Cria novo usuário (admin) | JSONB |
| `update_user_and_roles(...)` | Atualiza dados e papéis (admin) | JSONB |

### 4.4 Exemplo de Chamada no Front-end

```ts
const { data, error } = await supabase.rpc("get_user_dashboard_data");
```

---

## 5. Exposição de Dados para o Front-end

### Abordagem Usada — RPCs com SECURITY DEFINER

O projeto acessa dados exclusivamente via RPCs. O front-end nunca faz SELECT direto nas tabelas do schema `user_management`.

**Vantagens:**
- Schema privado completamente oculto do front-end
- Validação e regras de negócio centralizadas no banco
- Mudanças internas não quebram o contrato RPC

### Validação de Domínio como Regra de Negócio na RPC

A validação de domínio é uma regra de negócio que deve ser enforcement no banco. A RPC `get_user_dashboard_data` inclui `AND public.is_domain_allowed(up.email) = TRUE` no WHERE para garantir que:

1. O domínio é validado a cada carga de dados (não apenas no login)
2. Sessões restauradas (que não passam pelo AuthCallback) também têm o domínio verificado
3. Revogar um domínio em `allowed_domains` remove o acesso de todos os usuários daquele domínio imediatamente

### Consideração Futura — Schema de API Dedicado

Para projetos maiores, pode-se criar views em um schema `api`:

```sql
CREATE SCHEMA api;

CREATE OR REPLACE VIEW api.users AS
SELECT
  u.id, u.email, u.full_name, u.avatar_url, u.is_active AS status,
  COALESCE(
    (SELECT json_agg(json_build_object('id', r.id, 'name', r.name))
     FROM user_management.user_roles ur
     JOIN user_management.roles r ON ur.role_id = r.id
     WHERE ur.user_id = u.id),
    '[]'::json
  ) AS user_roles
FROM user_management.app_users u;
```

---

## 6. Checklist de Nova Tabela

Ao criar qualquer nova tabela:

- [ ] Colunas `id`, `created_at`, `updated_at` presentes
- [ ] `ENABLE ROW LEVEL SECURITY`
- [ ] Trigger de `updated_at` (usar `public.trigger_set_timestamp()`)
- [ ] RPCs de acesso criadas com `SECURITY DEFINER` e `SET search_path`
- [ ] Grants para `authenticated` e `service_role` conforme necessário
- [ ] Se no schema `user_management`: `GRANT USAGE ON SCHEMA user_management TO authenticated`

---

## 7. Migrações

- Toda alteração de schema deve ser uma migration versionada: `supabase/migrations/YYYYMMDDHHMMSS_descricao.sql`
- Nunca altere migrations já aplicadas em produção — crie uma nova.
- Nomeie de forma descritiva: `20240315120000_add_avatar_to_app_users.sql`
- Teste toda migration em ambiente local antes de aplicar em produção.

---

## 8. Notas Específicas para o Dyad

### Migrations protegidas

O Dyad não deve nunca alterar arquivos em `supabase/migrations/`. Essa regra está declarada em `AI_RULES.md` na seção de arquivos protegidos. Migrations existentes são imutáveis — sempre criar novas.

### SECURITY DEFINER em RPCs

Todas as RPCs do projeto usam `SECURITY DEFINER` intencionalmente para acessar o schema privado `user_management`. Isso é por design — o front-end nunca acessa as tabelas diretamente.