
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user) {
        setSubscriptionStatus('inactive');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('get_user_subscription_status', { user_uuid: user.id });

        if (error) {
          console.error('Error checking subscription:', error);
          setSubscriptionStatus('inactive');
        } else {
          setSubscriptionStatus(data || 'inactive');
        }
      } catch (error) {
        console.error('Error:', error);
        setSubscriptionStatus('inactive');
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [user]);

  const hasActiveSubscription = subscriptionStatus === 'active';
  const isExpired = subscriptionStatus === 'expired';

  return {
    subscriptionStatus,
    hasActiveSubscription,
    isExpired,
    loading
  };
};
