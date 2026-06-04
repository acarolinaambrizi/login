"use client";

import { useTodos } from "@/contexts/todo/hooks/useTodos";
import { AddTodoForm } from "./AddTodoForm";
import { TodoItem } from "./TodoItem";
import { toast } from "sonner";

export function TodoList() {
  const {
    todos,
    isLoading,
    isError,
    error,
    addTodo,
    editTodo,
    removeTodo,
  } = useTodos();

  const handleAdd = async (title: string, description?: string) => {
    await addTodo({ title, description });
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await editTodo({ id, updates: { completed } });
      toast.success("Status atualizado");
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao atualizar status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeTodo(id);
      toast.success("Tarefa removida");
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao remover tarefa");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-destructive">
        Erro ao carregar tarefas: {error?.message}
      </p>
    );
  }

  return (
    <section>
      <AddTodoForm onAdd={handleAdd} />
      {todos.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Nenhuma tarefa ainda. Crie a sua!
        </p>
      ) : (
        <div className="grid gap-4">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}