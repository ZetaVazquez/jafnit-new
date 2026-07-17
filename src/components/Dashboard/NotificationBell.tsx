import React, { useState, useEffect, useCallback } from 'react';
import { Bell, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link_url: string | null;
  read: boolean;
  created_at: string;
}

const NotificationBell: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from('user_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    setItems(data || []);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // Generate any expiry notifications (idempotent) then load
    (async () => {
      try { await (supabase as any).rpc('generate_plan_expiry_notifications'); } catch {}
      await load();
    })();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [user, load]);

  const unread = items.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    await (supabase as any).from('user_notifications').update({ read: true }).eq('id', id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = async () => {
    if (!user) return;
    await (supabase as any).from('user_notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClick = (n: Notification) => {
    markRead(n.id);
    if (n.link_url && onNavigate) {
      const url = new URL(n.link_url, window.location.origin);
      const view = url.searchParams.get('view');
      if (view) onNavigate(view);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative text-white/60 hover:text-white hover:bg-white/10">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center bg-red-500 text-white border-0 text-[10px]">
              {unread}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 bg-[hsl(220,20%,10%)] border-white/10 text-white">
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <h4 className="font-semibold">Notificaciones</h4>
          {unread > 0 && (
            <Button size="sm" variant="ghost" onClick={markAllRead} className="text-xs text-white/60 hover:text-white h-7">
              <Check className="w-3 h-3 mr-1" /> Marcar todas
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center text-white/50 text-sm">No tienes notificaciones.</div>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left p-3 border-b border-white/5 hover:bg-white/5 transition ${!n.read ? 'bg-white/[0.03]' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-[hsl(var(--accent-green-light))] flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">{n.title}</p>
                      {n.link_url && <ExternalLink className="w-3 h-3 text-white/40" />}
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-white/40 mt-1">{new Date(n.created_at).toLocaleString('es-ES')}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;