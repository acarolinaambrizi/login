# Contexto de Tarefas (Todo)

## Arquitetura

Este contexto gerencia a funcionalidade de tarefas do app "Meu To Do".

### Tabelas

- `todos` - Tabela de tarefas do usuário
  - `id` (UUID) - ID único da tarefa
  - `user_id` (UUID) - Referência ao usuário
  - `title` (TEXT) - Título da tarefa
  - `description` (TEXT) - Descrição detalhada (opcional)
  - `completed` (BOOLEAN) - Status de conclusão
  - `created_at` (TIMESTAMP) - Data de criação
  - `updated_at` (TIMESTAMP) - Data de atualização

### RPCs

- `get_user_todos()` - Lista todas as tarefas do usuário autenticado
- `create_todo(title, description)` - Cria uma nova tarefa
- `update_todo(id, updates)` - Atualiza uma tarefa existente
- `delete_todo(id)` - Remove uma tarefa

### Decisões Técnicas

- Todas as operações de tarefas são feitas via RPC com SECURITY DEFINER
- RLS é aplicado automaticamente via trigger no schema `public`
- Validação de domínio não aplicada (tarefas são abertas a todos os usuários autenticados)
</arg_value>
<arg_key>path</arg_key>
<arg_value>src/contexts/todo/README.md</arg_value>
</tool_call>
<dyad-add-dependency packages="@tanstack/react-query"></dyad-add-dependency>

<dyad-write path="src/contexts/todo/todo.types.ts" description="Tipos usados no contexto de tarefas">
/**
 * Tipos do contexto de tarefas.
 *
 * @property id - Identificador único da tarefa (UUID).
 * @property user_id - Identificador do usuário dono da tarefa.
 * @property title - Título da tarefa.
 * @property description - Descrição opcional da tarefa.
 * @property completed - Indica se a tarefa está concluída.
 * @property created_at - Data de criação.
 * @property updated_at - Data de última atualização.
 */
export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Dados necessários para criar uma nova tarefa.
 */
export interface NewTodoInput {
  title: string;
  description?: string;
}

/**
 * Campos que podem ser atualizados em uma tarefa existente.
 */
export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
}