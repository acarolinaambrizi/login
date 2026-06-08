import { supabase } from "@/integrations/supabase/client";
import type { NewTodoInput, Todo } from "../todo.types";

/**
 * Busca todas as tarefas do usuário autenticado.
 */
export async function fetchTodos(): Promise<Todo[]> {
  const { data, error } = await supabase.rpc("get_user_todos");
  if (error) throw error;
  return data as Todo[];
}

/**
 * Cria uma nova tarefa.
 */
export async function createTodo(input: NewTodoInput): Promise<Todo> {
  const { data, error } = await supabase.rpc("create_todo", {
    p_title: input.title,
    p_description: input.description ?? null,
  });
  if (error) throw error;
  return data as Todo;
}

/**
 * Atualiza uma tarefa existente.
 */
export async function updateTodo(
  id: string,
  updates: { title?: string; description?: string; completed?: boolean }
): Promise<Todo> {
  const { data, error } = await supabase.rpc("update_todo", {
    p_id: id,
    p_title: updates.title ?? null,
    p_description: updates.description ?? null,
    p_completed: updates.completed ?? null,
  });
  if (error) throw error;
  return data as Todo;
}

/**
 * Remove uma tarefa.
 */
export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.rpc("delete_todo", { p_id: id });
  if (error) throw error;
}