-- Crear función para verificar si un usuario existe en auth.users
CREATE OR REPLACE FUNCTION public.user_exists(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verificar si el usuario existe en auth.users
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = user_uuid
  );
END;
$$;

-- Crear vista para obtener solo perfiles de usuarios activos
CREATE OR REPLACE VIEW public.active_profiles AS
SELECT p.*
FROM public.profiles p
WHERE public.user_exists(p.id) = true;