
-- Asegurar que los triggers y funciones estén correctamente configurados
-- Recrear la función para manejar nuevos usuarios con roles automáticos
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Verificar si es uno de los emails de admin
  IF NEW.email IN ('josefiguenu@gmail.com', 'consultajafn@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role);
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user'::app_role);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recrear la función para crear perfiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Usuario'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Eliminar triggers existentes si existen
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear triggers
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Limpiar la función anterior que no funcionó
DROP FUNCTION IF EXISTS create_admin_users();
