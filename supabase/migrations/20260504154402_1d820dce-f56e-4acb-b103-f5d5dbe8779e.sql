ALTER TABLE public.questionnaire_responses
  ADD CONSTRAINT questionnaire_responses_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.diet_plans
  ADD CONSTRAINT diet_plans_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.diet_plans
  ADD CONSTRAINT diet_plans_assigned_to_profiles_fkey
  FOREIGN KEY (assigned_to) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.workout_plans
  ADD CONSTRAINT workout_plans_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.workout_plans
  ADD CONSTRAINT workout_plans_assigned_to_profiles_fkey
  FOREIGN KEY (assigned_to) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.pending_payments
  ADD CONSTRAINT pending_payments_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.initial_evaluations
  ADD CONSTRAINT initial_evaluations_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_expired_subscriptions() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_subscription_status(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_update_subscription_end_date(uuid, timestamptz) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_update_stripe_subscription_end_date(uuid, timestamptz) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_expired_subscriptions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_subscription_status(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_subscription_end_date(uuid, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_stripe_subscription_end_date(uuid, timestamptz) TO authenticated;