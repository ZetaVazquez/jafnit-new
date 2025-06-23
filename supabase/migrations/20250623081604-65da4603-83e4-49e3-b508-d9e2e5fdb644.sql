
-- Función simplificada para crear usuarios administradores usando solo columnas existentes
CREATE OR REPLACE FUNCTION create_admin_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id_1 uuid;
    admin_user_id_2 uuid;
BEGIN
    -- Verificar si ya existen usuarios con estos emails
    SELECT id INTO admin_user_id_1 FROM auth.users WHERE email = 'josefiguenu@gmail.com';
    SELECT id INTO admin_user_id_2 FROM auth.users WHERE email = 'consultajafn@gmail.com';
    
    -- Si no existen, los crear directamente en auth.users
    IF admin_user_id_1 IS NULL THEN
        admin_user_id_1 := gen_random_uuid();
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role,
            aud
        ) VALUES (
            admin_user_id_1,
            '00000000-0000-0000-0000-000000000000',
            'josefiguenu@gmail.com',
            crypt('monforte2024', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "José Antonio Figueroa"}',
            false,
            'authenticated',
            'authenticated'
        );
    END IF;
    
    IF admin_user_id_2 IS NULL THEN
        admin_user_id_2 := gen_random_uuid();
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role,
            aud
        ) VALUES (
            admin_user_id_2,
            '00000000-0000-0000-0000-000000000000',
            'consultajafn@gmail.com',
            crypt('monforte2024', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Consulta JA"}',
            false,
            'authenticated',
            'authenticated'
        );
    END IF;
    
    -- Asegurar roles de admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES 
        (admin_user_id_1, 'admin'::app_role),
        (admin_user_id_2, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Crear perfiles
    INSERT INTO public.profiles (id, name, email)
    VALUES 
        (admin_user_id_1, 'José Antonio Figueroa', 'josefiguenu@gmail.com'),
        (admin_user_id_2, 'Consulta JA', 'consultajafn@gmail.com')
    ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        email = EXCLUDED.email;
        
END;
$$;

-- Ejecutar la función
SELECT create_admin_users();

-- Limpiar la función temporal
DROP FUNCTION create_admin_users();
