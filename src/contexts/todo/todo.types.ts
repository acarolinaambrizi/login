/**
 * Representa uma tarefa do usuário.
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
  completed: boolean;
}

/**
 * Dados para atualizar uma tarefa existente.
 */
export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * Variáveis para a mutação de edição de tarefa.
 */
export interface EditTodoVariables {
  id: string;
  updates: UpdateTodoInput;
}