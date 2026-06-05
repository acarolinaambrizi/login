-- ==========================================================
-- Funções RPC para gerenciamento de tarefas
-- ==========================================================

-- Função para buscar todas as tarefas do usuário autenticado
CREATE OR REPLACE FUNCTION public.get_user_todos()
RETURNS TABLE(
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  completed BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    id,
    user_id,
    title,
    description,
    completed,
    created_at,
    updated_at
  FROM public.todos
  WHERE user_id = auth.uid();
END;
$$;

-- Função para criar uma nova tarefa
CREATE OR REPLACE FUNCTION public.create_todo(
  p_title TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  completed BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_todo RECORD;
BEGIN
  INSERT INTO public.todos (user_id, title, description)
  VALUES (auth.uid(), p_title, p_description)
  RETURNING * INTO new_todo;
  
  RETURN QUERY SELECT
    new_todo.id,
    new_todo.user_id,
    new_todo.title,
    new_todo.description,
    new_todo.completed,
    new_todo.created_at,
    new_todo.updated_at;
END;
$$;

-- Função para atualizar uma tarefa existente
CREATE OR REPLACE FUNCTION public.update_todo(
  p_id UUID,
  p_title TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_completed BOOLEAN DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  completed BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_todo RECORD;
BEGIN
  UPDATE public.todos
  SET
    title = COALESCE(p_title, title),
    description = COALESCE(p_description, description),
    completed = COALESCE(p_completed, completed)
  WHERE id = p_id AND user_id = auth.uid()
  RETURNING * INTO updated_todo;
  
  RETURN QUERY SELECT
    updated_todo.id,
    updated_todo.user_id,
    updated_todo.title,
    updated_todo.description,
    updated_todo.completed,
    updated_todo.created_at,
    updated_todo.updated_at;
END;
$$;

-- Função para deletar uma tarefa
CREATE OR REPLACE FUNCTION public.delete_todo(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.todos
  WHERE id = p_id AND user_id = auth.uid();
END;
$$;

-- ==========================================================
-- Concessões de acesso para as funções RPC
-- ==========================================================
GRANT EXECUTE ON FUNCTION public.get_user_todos TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_todo TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_todo TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_todo TO authenticated;