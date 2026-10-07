CREATE TABLE public.trainer_chat_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT (now() + interval '2 days'),
 client_closed boolean NOT NULL DEFAULT false, admin_read_at timestamptz
);
GRANT SELECT ON public.trainer_chat_sessions TO authenticated;
GRANT ALL ON public.trainer_chat_sessions TO service_role;
ALTER TABLE public.trainer_chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY trainer_sessions_read ON public.trainer_chat_sessions FOR SELECT TO authenticated USING (expires_at > now() AND (public.has_role(auth.uid(), 'admin') OR (user_id=auth.uid() AND NOT client_closed)));
CREATE TABLE public.trainer_chat_messages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), session_id uuid NOT NULL REFERENCES public.trainer_chat_sessions(id) ON DELETE CASCADE,
 sender_id uuid NOT NULL, from_admin boolean NOT NULL DEFAULT false,
 body text NOT NULL CHECK (length(btrim(body)) BETWEEN 1 AND 2000), created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trainer_chat_messages TO authenticated;
GRANT ALL ON public.trainer_chat_messages TO service_role;
ALTER TABLE public.trainer_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY trainer_messages_read ON public.trainer_chat_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.trainer_chat_sessions s WHERE s.id=session_id AND s.expires_at>now() AND (public.has_role(auth.uid(),'admin') OR (s.user_id=auth.uid() AND NOT s.client_closed))));
CREATE INDEX trainer_messages_session_date ON public.trainer_chat_messages(session_id,created_at);
CREATE INDEX trainer_sessions_expiry ON public.trainer_chat_sessions(expires_at);
CREATE OR REPLACE FUNCTION public.send_trainer_message(p_session_id uuid, p_body text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_id uuid; v_admin boolean; v_name text;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Inicia sesión para enviar mensajes'; END IF;
 IF p_body IS NULL OR length(btrim(p_body)) NOT BETWEEN 1 AND 2000 THEN RAISE EXCEPTION 'El mensaje debe tener entre 1 y 2000 caracteres'; END IF;
 v_admin := public.has_role(auth.uid(),'admin');
 IF p_session_id IS NULL THEN
  IF v_admin THEN RAISE EXCEPTION 'Selecciona una conversación'; END IF;
  INSERT INTO public.trainer_chat_sessions(user_id) VALUES (auth.uid()) RETURNING id INTO v_id;
 ELSE
  SELECT id INTO v_id FROM public.trainer_chat_sessions WHERE id=p_session_id AND expires_at>now() AND (v_admin OR (user_id=auth.uid() AND NOT client_closed)) FOR UPDATE;
  IF v_id IS NULL THEN RAISE EXCEPTION 'Esta conversación ha finalizado'; END IF;
 END IF;
 INSERT INTO public.trainer_chat_messages(session_id,sender_id,from_admin,body) VALUES (v_id,auth.uid(),v_admin,btrim(p_body));
 IF NOT v_admin THEN
  SELECT name INTO v_name FROM public.profiles WHERE id=auth.uid();
  INSERT INTO public.user_notifications(user_id,type,title,message,link_url,dedupe_key)
  SELECT r.user_id,'trainer_chat','Nuevo mensaje de cliente',coalesce(v_name,'Cliente') || ' te ha enviado un mensaje.',NULL,'trainer-chat:' || v_id::text || ':' || r.user_id::text
  FROM public.user_roles r WHERE r.role='admin' AND NOT EXISTS (SELECT 1 FROM public.user_notifications n WHERE n.dedupe_key='trainer-chat:' || v_id::text || ':' || r.user_id::text);
 END IF;
 RETURN v_id;
END $$;
CREATE OR REPLACE FUNCTION public.close_trainer_chat(p_session_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 UPDATE public.trainer_chat_sessions SET client_closed=true WHERE id=p_session_id AND user_id=auth.uid();
END $$;
CREATE OR REPLACE FUNCTION public.read_trainer_chat(p_session_id uuid) RETURNS SETOF public.trainer_chat_messages LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM public.trainer_chat_sessions WHERE id=p_session_id AND expires_at>now() AND (public.has_role(auth.uid(),'admin') OR (user_id=auth.uid() AND NOT client_closed))) THEN RETURN; END IF;
 RETURN QUERY SELECT * FROM public.trainer_chat_messages WHERE session_id=p_session_id ORDER BY created_at,id;
END $$;
CREATE OR REPLACE FUNCTION public.admin_list_trainer_chats() RETURNS TABLE(id uuid,client_name text,client_email text,client_closed boolean,expires_at timestamptz,last_message text,last_at timestamptz,unread_count bigint) LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Acceso no autorizado'; END IF;
 RETURN QUERY SELECT s.id,p.name,p.email,s.client_closed,s.expires_at,m.body,m.created_at,(SELECT count(*) FROM public.trainer_chat_messages x WHERE x.session_id=s.id AND NOT x.from_admin AND (s.admin_read_at IS NULL OR x.created_at>s.admin_read_at)) FROM public.trainer_chat_sessions s JOIN public.profiles p ON p.id=s.user_id JOIN LATERAL (SELECT body,created_at FROM public.trainer_chat_messages WHERE session_id=s.id ORDER BY created_at DESC LIMIT 1) m ON true WHERE s.expires_at>now() ORDER BY m.created_at DESC;
END $$;
CREATE OR REPLACE FUNCTION public.admin_mark_trainer_chat_read(p_session_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Acceso no autorizado'; END IF;
 UPDATE public.trainer_chat_sessions SET admin_read_at=now() WHERE id=p_session_id;
END $$;
CREATE OR REPLACE FUNCTION public.cleanup_trainer_chats() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 DELETE FROM public.user_notifications n WHERE n.type='trainer_chat' AND n.created_at <= now()-interval '2 days';
 DELETE FROM public.trainer_chat_sessions WHERE expires_at<=now();
END $$;
REVOKE ALL ON FUNCTION public.send_trainer_message(uuid,text), public.close_trainer_chat(uuid), public.read_trainer_chat(uuid), public.admin_list_trainer_chats(), public.admin_mark_trainer_chat_read(uuid), public.cleanup_trainer_chats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.send_trainer_message(uuid,text), public.close_trainer_chat(uuid), public.read_trainer_chat(uuid), public.admin_list_trainer_chats(), public.admin_mark_trainer_chat_read(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_trainer_chats() TO service_role;
SELECT cron.schedule('cleanup-trainer-chats','0 * * * *','SELECT public.cleanup_trainer_chats()');