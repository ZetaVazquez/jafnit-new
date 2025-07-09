
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
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionStatus('inactive');
        setPlanType(null);
        setSubscriptionEnd(null);
        setIsBasicPlan(false);
      } else {
        setSubscriptionStatus(data.subscribed ? 'active' : 'inactive');
        setPlanType(data.plan_type);
        setSubscriptionEnd(data.subscription_end);
        setIsBasicPlan(data.is_basic_plan || false);
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
