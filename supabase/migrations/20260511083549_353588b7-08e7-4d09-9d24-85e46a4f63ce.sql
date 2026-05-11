UPDATE public.user_roles
SET role = 'admin'::public.app_role
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email IN ('consultajafn@gmail.com','zaiidav347@gmail.com')
);

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE u.email IN ('consultajafn@gmail.com','zaiidav347@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id
  );