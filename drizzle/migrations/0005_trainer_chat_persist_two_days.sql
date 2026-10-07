CREATE OR REPLACE FUNCTION public.get_my_trainer_chat() RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT id FROM public.trainer_chat_sessions WHERE user_id=auth.uid() AND expires_at>now() AND NOT client_closed ORDER BY created_at DESC LIMIT 1
$$;
REVOKE ALL ON FUNCTION public.get_my_trainer_chat() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_trainer_chat() TO authenticated;
CREATE OR REPLACE FUNCTION public.send_trainer_message(p_session_id uuid, p_body text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_id uuid; v_admin boolean; v_name text;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Inicia sesión para enviar mensajes'; END IF;
 IF p_body IS NULL OR length(btrim(p_body)) NOT BETWEEN 1 AND 2000 THEN RAISE EXCEPTION 'El mensaje debe tener entre 1 y 2000 caracteres'; END IF;
 v_admin := public.has_role(auth.uid(),'admin');
 IF p_session_id IS NULL THEN
  IF v_admin THEN RAISE EXCEPTION 'Selecciona una conversación'; END IF;
  SELECT id INTO v_id FROM public.trainer_chat_sessions WHERE user_id=auth.uid() AND expires_at>now() AND NOT client_closed ORDER BY created_at DESC LIMIT 1 FOR UPDATE;
  IF v_id IS NULL THEN
   INSERT INTO public.trainer_chat_sessions(user_id) VALUES (auth.uid()) RETURNING id INTO v_id;
  END IF;
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