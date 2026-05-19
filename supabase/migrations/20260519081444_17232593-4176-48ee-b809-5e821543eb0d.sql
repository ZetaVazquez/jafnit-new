UPDATE auth.users 
SET encrypted_password = crypt('Monforte2024', gen_salt('bf')),
    updated_at = now()
WHERE email = 'zaida.colorderosa@gmail.com';