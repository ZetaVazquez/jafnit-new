-- Eliminar la vista problemática con SECURITY DEFINER
DROP VIEW IF EXISTS public.active_profiles;

-- Recrear la vista sin SECURITY DEFINER para evitar problemas de seguridad
-- En su lugar, creamos una función que puede ser usada de forma segura
CREATE OR REPLACE FUNCTION public.get_active_profiles()
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  password text,
  description text,
  profile_image_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.email, p.password, p.description, p.profile_image_url, p.created_at, p.updated_at
  FROM public.profiles p
  WHERE public.user_exists(p.id) = true;
END;
$$;