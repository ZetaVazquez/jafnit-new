import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { closeTrainerChat } from '@/lib/trainerChat';
import TrainerChatPanel from './TrainerChatPanel';
import AdminTrainerChats from '@/components/Dashboard/AdminTrainerChats';

export default function TrainerChatDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { isAdmin, session } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const currentId = useRef<string | null>(null);
  const accessToken = useRef(session?.access_token);
  accessToken.current = session?.access_token;
  const changeId = (id: string) => { currentId.current = id; setSessionId(id); };

  useEffect(() => {
    if (isAdmin) return;
    const onLeave = () => {
      if (!currentId.current || !accessToken.current) return;
      void fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/close_trainer_chat`, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${accessToken.current}` }, body: JSON.stringify({ p_session_id: currentId.current }) });
    };
    window.addEventListener('pagehide', onLeave);
    return () => { window.removeEventListener('pagehide', onLeave); if (currentId.current) void closeTrainerChat(currentId.current).catch(() => undefined); };
  }, [isAdmin]);

  const changeOpen = async (next: boolean) => {
    if (!next && sessionId && !isAdmin) {
      try { await closeTrainerChat(sessionId); }
      catch { setError('No se pudo cerrar el chat. Inténtalo de nuevo.'); return; }
    }
    if (!next) { currentId.current = null; setSessionId(null); setError(''); }
    onOpenChange(next);
  };

  return <Dialog open={open} onOpenChange={next => void changeOpen(next)}>
    <DialogContent className={`w-[calc(100%-1.5rem)] max-h-[90dvh] overflow-hidden bg-[hsl(var(--dark-surface))] border-[hsl(var(--dark-border))] text-[hsl(var(--text-primary))] ${isAdmin ? 'max-w-4xl' : 'h-[min(80dvh,650px)] grid-rows-[auto_1fr]'}`}>
      <DialogHeader className="pr-5"><DialogTitle>{isAdmin ? 'Chat con clientes' : 'Chat con José Antonio'}</DialogTitle><DialogDescription className="text-[hsl(var(--text-secondary))]">{isAdmin ? 'Conversaciones de los últimos dos días.' : 'Los mensajes desaparecen para ti al cerrar el chat. El equipo los conserva durante dos días.'}</DialogDescription></DialogHeader>
      {error && <p role="alert">{error}</p>}
      {isAdmin ? <AdminTrainerChats /> : <div className="min-h-0"><TrainerChatPanel sessionId={sessionId} onSessionId={changeId} /></div>}
    </DialogContent>
  </Dialog>;
}