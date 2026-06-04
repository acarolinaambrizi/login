"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface TodoItemProps {
  /** Dados da tarefa */
  todo: {
    id: string;
    title: string;
    description?: string | null;
    completed: boolean;
  };
  /** Callback para alternar o status de conclusão */
  onToggle: (id: string, completed: boolean) => void;
  /** Callback para remover a tarefa */
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <Card
      className={cn(
        "flex flex-col justify-between p-4",
        todo.completed && "bg-success-100 dark:bg-success-900"
      )}
    >
      <CardHeader className="p-0">
        <CardTitle className={cn(todo.completed && "line-through")}>
          {todo.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-2 flex items-center justify-between">
        {todo.description && (
          <p className="text-sm text-muted-foreground">{todo.description}</p>
        )}
        <div className="flex gap-2">
          <Button
            size="icon"
            variant={todo.completed ? "destructive" : "default"}
            onClick={() => onToggle(todo.id, !todo.completed)}
            aria-label={todo.completed ? "Marcar como incompleta" : "Marcar como concluída"}
          >
            {todo.completed ? <X /> : <Check />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onDelete(todo.id)}
            aria-label="Excluir tarefa"
          >
            <X />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}