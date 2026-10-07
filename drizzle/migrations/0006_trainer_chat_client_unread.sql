ALTER TABLE public.trainer_chat_sessions ADD COLUMN client_read_at timestamptz;

CREATE OR REPLACE FUNCTION public.get_my_trainer_chat_unread_count()
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO public
AS $$
 SELECT count(*) FROM public.trainer_chat_messages m
 JOIN public.trainer_chat_sessions s ON s.id=m.session_id
 WHERE s.user_id=auth.uid() AND s.expires_at>now() AND NOT s.client_closed
 AND m.from_admin AND (s.client_read_at IS NULL OR m.created_at>s.client_read_at);
$$;
REVOKE ALL ON FUNCTION public.get_my_trainer_chat_unread_count() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_trainer_chat_unread_count() TO authenticated;

CREATE OR REPLACE FUNCTION public.mark_my_trainer_chat_read(p_message_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public
AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Inicia sesión'; END IF;
 UPDATE public.trainer_chat_sessions s
 SET client_read_at=GREATEST(s.client_read_at,m.created_at)
 FROM public.trainer_chat_messages m
 WHERE m.id=p_message_id AND m.session_id=s.id AND m.from_admin
 AND s.user_id=auth.uid() AND s.expires_at>now() AND NOT s.client_closed;
END;
$$;
REVOKE ALL ON FUNCTION public.mark_my_trainer_chat_read(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_my_trainer_chat_read(uuid) TO authenticated;