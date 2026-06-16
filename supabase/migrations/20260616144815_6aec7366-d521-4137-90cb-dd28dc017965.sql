
-- Extend client_forms with lead/contact fields
ALTER TABLE public.client_forms
  ADD COLUMN IF NOT EXISTS contact_message TEXT,
  ADD COLUMN IF NOT EXISTS info_needed TEXT,
  ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT,
  ADD COLUMN IF NOT EXISTS wants_more_info BOOLEAN DEFAULT false;

-- Lead follow-ups (admin CRM notes per user)
CREATE TABLE IF NOT EXISTS public.lead_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'nuevo', -- nuevo | contactado | en_negociacion | convertido | descartado
  note TEXT,
  next_action TEXT,
  next_action_date DATE,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_followups TO authenticated;
GRANT ALL ON public.lead_followups TO service_role;

ALTER TABLE public.lead_followups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all lead followups"
ON public.lead_followups
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_lead_followups_updated_at
  BEFORE UPDATE ON public.lead_followups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS lead_followups_user_id_idx ON public.lead_followups(user_id);
CREATE INDEX IF NOT EXISTS lead_followups_status_idx ON public.lead_followups(status);
