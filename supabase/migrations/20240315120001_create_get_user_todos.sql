"CREATE OR REPLACE FUNCTION public.get_user_todos()
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

-- Grant execute permission to authenticated role so the function can be called from the API
GRANT EXECUTE ON FUNCTION public.get_user_todos TO authenticated;
"