import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todo.service";
import type { NewTodoInput, Todo, UpdateTodoInput } from "../todo.types";

/**
 * Hook centralizado para gerenciar o ciclo de vida das tarefas.
 *
 * - `todos` – lista de tarefas carregada.
 * - `isLoading` – estado de carregamento da lista.
 * - `addTodo` – cria uma nova tarefa e invalida a query.
 * - `editTodo` – atualiza uma tarefa existente.
 * - `removeTodo` – exclui uma tarefa.
 */
export function useTodos() {
  const queryClient = useQueryClient();

  const {
    data: todos = [],
    isLoading,
    isError,
    error,
  } = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const { mutateAsync: addTodo } = useMutation(createTodo, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const { mutateAsync: editTodo } = useMutation(
    ({ id, updates }: { id: string; updates: UpdateTodoInput }) =>
      updateTodo(id, updates),
    {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    }
  );

  const { mutateAsync: removeTodo } = useMutation(deleteTodo, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return {
    todos,
    isLoading,
    isError,
    error,
    addTodo,
    editTodo,
    removeTodo,
  };
}