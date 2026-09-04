DROP POLICY IF EXISTS "own all subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_select_own_or_admin" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_admin_manage" ON public.subscriptions;

CREATE POLICY "subscriptions_select_own_or_admin"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "subscriptions_admin_manage"
ON public.subscriptions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "own all pending payments" ON public.pending_payments;
DROP POLICY IF EXISTS "pending_payments_select_own_or_admin" ON public.pending_payments;
DROP POLICY IF EXISTS "pending_payments_insert_own_pending" ON public.pending_payments;
DROP POLICY IF EXISTS "pending_payments_update_own_pending" ON public.pending_payments;
DROP POLICY IF EXISTS "pending_payments_delete_own_pending" ON public.pending_payments;
DROP POLICY IF EXISTS "pending_payments_admin_manage" ON public.pending_payments;

CREATE POLICY "pending_payments_select_own_or_admin"
ON public.pending_payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "pending_payments_insert_own_pending"
ON public.pending_payments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "pending_payments_update_own_pending"
ON public.pending_payments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "pending_payments_delete_own_pending"
ON public.pending_payments
FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "pending_payments_admin_manage"
ON public.pending_payments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));