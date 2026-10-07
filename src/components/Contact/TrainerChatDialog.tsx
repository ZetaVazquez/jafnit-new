import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import TrainerChatPanel from './TrainerChatPanel';
import AdminTrainerChats from '@/components/Dashboard/AdminTrainerChats';

export default function TrainerChatDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { isAdmin, user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open || isAdmin || !user) { setReady(true); return; }
    setReady(false);
    supabase.rpc('get_my_trainer_chat').then(({ data }) => { setSessionId((data as string | null) ?? null); setReady(true); });
  }, [open, isAdmin, user]);

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className={`w-[calc(100%-1.5rem)] max-h-[90dvh] overflow-hidden bg-[hsl(var(--dark-surface))] border-[hsl(var(--dark-border))] text-[hsl(var(--text-primary))] ${isAdmin ? 'max-w-4xl' : 'h-[min(80dvh,650px)] grid-rows-[auto_1fr]'}`}>
      <DialogHeader className="pr-5"><DialogTitle>{isAdmin ? 'Chat con clientes' : 'Chat con José Antonio'}</DialogTitle><DialogDescription className="text-[hsl(var(--text-secondary))]">{isAdmin ? 'Conversaciones de los últimos dos días.' : 'Puedes cerrar el chat y seguir la conversación más tarde. Los mensajes se borran a los dos días.'}</DialogDescription></DialogHeader>
      {isAdmin ? <AdminTrainerChats /> : ready && <div className="min-h-0"><TrainerChatPanel key={sessionId ?? 'new'} sessionId={sessionId} onSessionId={setSessionId} /></div>}
    </DialogContent>
  </Dialog>;
}
