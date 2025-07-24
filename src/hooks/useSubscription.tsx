
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [planType, setPlanType] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isBasicPlan, setIsBasicPlan] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setSubscriptionStatus('inactive');
      setPlanType(null);
      setSubscriptionEnd(null);
      setIsBasicPlan(false);
      setLoading(false);
      return;
    }

    try {
      // First check traditional subscriptions using the RPC function
      const { data: status, error: statusError } = await supabase
        .rpc('get_user_subscription_status', { user_uuid: user.id });

      if (statusError) {
        console.error('Error checking subscription status:', statusError);
        setSubscriptionStatus('inactive');
        setPlanType(null);
        setSubscriptionEnd(null);
        setIsBasicPlan(false);
      } else {
        // If traditional subscription is active, use it
        if (status === 'active') {
          // Get subscription details from traditional table
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (subscription) {
            setSubscriptionStatus('active');
            setPlanType(subscription.plan_type);
            setSubscriptionEnd(subscription.end_date);
            setIsBasicPlan(subscription.plan_type === 'basic');
            return;
          }
        }

        // If no traditional subscription, check Stripe
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke('check-subscription');
        
        if (stripeError) {
          console.error('Error checking Stripe subscription:', stripeError);
          setSubscriptionStatus(status || 'inactive');
          setPlanType(null);
          setSubscriptionEnd(null);
          setIsBasicPlan(false);
        } else {
          setSubscriptionStatus(stripeData.subscribed ? 'active' : (status || 'inactive'));
          setPlanType(stripeData.plan_type);
          setSubscriptionEnd(stripeData.subscription_end);
          setIsBasicPlan(stripeData.is_basic_plan || false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setSubscriptionStatus('inactive');
      setPlanType(null);
      setSubscriptionEnd(null);
      setIsBasicPlan(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  const hasActiveSubscription = subscriptionStatus === 'active';
  const isExpired = subscriptionStatus === 'expired';

  return {
    subscriptionStatus,
    planType,
    subscriptionEnd,
    isBasicPlan,
    hasActiveSubscription,
    isExpired,
    loading,
    refreshSubscription: checkSubscriptionStatus
  };
};
