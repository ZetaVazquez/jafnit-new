
-- Eliminar los usuarios admin existentes que no tienen roles asignados correctamente
DELETE FROM auth.users WHERE email IN ('consultajafn@gmail.com', 'josefiguenu@gmail.com');

-- Nota: Esto también eliminará automáticamente sus perfiles y roles relacionados
-- debido a las claves foráneas CASCADE que tenemos configuradas
