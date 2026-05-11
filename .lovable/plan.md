## Objetivo
Convertir las cuentas ya registradas `consultajafn@gmail.com` y `zaiidav347@gmail.com` en administradores reales, con rol `admin` en la tabla `user_roles` (no solo reconocidos por email en el front).

## Contexto

- En `useAuth.tsx` esos emails ya se tratan como "siempre con suscripción activa", pero el rol real se lee de `user_roles`. Mientras esa fila siga siendo `user`, las RLS de admin (`has_role(auth.uid(), 'admin')`) bloquean el panel de administración y las acciones críticas.
- El trigger `handle_new_user` crea automáticamente la fila en `user_roles` con rol `'user'` al registrarse. Por eso ahora mismo aparecen como clientes.

## Pasos

1. **Verificar que los dos usuarios existen** en `auth.users` y obtener sus `id` (consulta de solo lectura).
2. **Actualizar `user_roles`** de ambos a `'admin'` mediante una migración (un `UPDATE` simple emparejando por `user_id` con el id obtenido de `auth.users` filtrando por email). Si por algún motivo no existiera la fila, se inserta.
3. **Verificación post-cambio**: confirmar con un `SELECT` que ambos tienen `role = 'admin'` en `user_roles`.
4. **Indicaciones de uso**: tras el cambio, los usuarios deben **cerrar sesión y volver a iniciar sesión** para que `useAuth` recargue el rol desde la BD y muestre el `AdminDashboard`.

## Detalles técnicos

- La operación se hace con la herramienta de migración para que quede registrada y aplicada en el entorno publicado (la herramienta de `insert` solo permite `INSERT`, pero aquí necesitamos `UPDATE/UPSERT` sobre `user_roles`).
- No se cambia código de la app — solo datos. No hace falta tocar `useAuth.tsx` ni RLS.
- Si más adelante quieres que un admin pueda promover a otros usuarios desde el panel sin tocar la BD, se puede añadir como mejora posterior (botón "Hacer admin" + RPC `security definer`), pero queda fuera de este plan.

## Riesgos

- Ninguno relevante: solo elevamos privilegios de dos cuentas concretas, identificadas por email.
