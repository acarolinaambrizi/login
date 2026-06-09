import { supabase } from "@/integrations/supabase/client";
import type { NewTodoInput, Todo } from "../todo.types";

/**
 * Busca todas as tarefas do usuário autenticado.
 */
export async function fetchTodos(): Promise<Todo[]> {
  try {
    const { data, error } = await supabase.rpc("get_user_todos");
    if (error) throw error;
    return data as Todo[];
  } catch (error: any) {
    console.error("Error fetching todos:", error);
    throw new Error(error?.message || "Failed to fetch todos");
  }
}

/**
 * Cria uma nova tarefa.
 */
export async function createTodo(input: NewTodoInput): Promise<Todo> {
  try {
    const { data, error } = await supabase.rpc("create_todo", {
      p_title: input.title,
      p_description: input.description ?? null,
      p_completed: input.completed ?? false,
    });
    if (error) throw error;
    return data as Todo;
  } catch (error: any) {
    console.error("Error creating todo:", error);
    throw new Error(error?.message || "Failed to create todo");
  }
}

/**
 * Atualiza uma tarefa existente.
 */
export async function updateTodo(
  id: string,
  updates: { title?: string; description?: string; completed?: boolean }
): Promise<Todo> {
  try {
    const { data, error } = await supabase.rpc("update_todo", {
      p_id: id,
      p_title: updates.title ?? null,
      p_description: updates.description ?? null,
      p_completed: updates.completed ?? null,
    });
    if (error) throw error;
    return data as Todo;
  } catch (error: any) {
    console.error("Error updating todo:", error);
    throw new Error(error?.message || "Failed to update todo");
  }
}

/**
 * Remove uma tarefa.
 */
export async function deleteTodo(id: string): Promise<void> {
  try {
    const { error } = await supabase.rpc("delete_todo", { p_id: id });
    if (error) throw error;
  } catch (error: any) {
    console.error("Error deleting todo:", error);
    throw new Error(error?.message || "Failed to delete todo");
  }
}
