export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type NewTodoInput = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>;
