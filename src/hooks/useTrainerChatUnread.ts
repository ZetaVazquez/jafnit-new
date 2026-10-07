import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const trainerChatUnreadKey = (userId?: string) => ['trainer-chat-unread', userId];

export function useTrainerChatUnread() {
  const { user, isAdmin } = useAuth();
  const { data } = useQuery({
    queryKey: trainerChatUnreadKey(user?.id),
    enabled: Boolean(user) && !isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_my_trainer_chat_unread_count');
      if (error) throw error;
      return Number(data ?? 0);
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
  return Boolean(user) && !isAdmin && (data ?? 0) > 0;
}