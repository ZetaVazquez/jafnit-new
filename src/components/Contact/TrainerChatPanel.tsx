import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, UserRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { readTrainerMessages, sendTrainerMessage, TrainerMessage } from '@/lib/trainerChat';
import { supabase } from '@/integrations/supabase/client';

export default function TrainerChatPanel({ sessionId, onSessionId, closed = false }: { sessionId: string | null; onSessionId?: (id: string) => void; closed?: boolean }) {
  const { isAdmin } = useAuth();
  const [messages, setMessages] = useState<TrainerMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const activeSession = useRef(sessionId);
  activeSession.current = sessionId;

  const refresh = useCallback(async () => {
    if (!sessionId) return;
    try {
      const data = await readTrainerMessages(sessionId);
      if (activeSession.current !== sessionId) return;
      setMessages(data);
      setError('');
      if (isAdmin) await supabase.rpc('admin_mark_trainer_chat_read', { p_session_id: sessionId });
    } catch { if (activeSession.current === sessionId) setError('No se pudieron cargar los mensajes. Volveremos a intentarlo.'); }
    finally { if (activeSession.current === sessionId) setLoading(false); }
  }, [sessionId, isAdmin]);

  useEffect(() => {
    setMessages([]); setDraft(''); setError(''); setLoading(Boolean(sessionId));
    void refresh();
    const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 3000);
    return () => window.clearInterval(timer);
  }, [refresh, sessionId]);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' }); }, [messages.length]);

  const send = async () => {
    if (!draft.trim() || sending || closed) return;
    setSending(true); setError('');
    try {
      const id = await sendTrainerMessage(sessionId, draft.trim());
      setDraft('');
      if (id !== sessionId) onSessionId?.(id);
      else await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : (e as { message?: string })?.message || 'No se pudo enviar. Tu mensaje sigue aquí; inténtalo de nuevo.'); }
    finally { setSending(false); }
  };

  return <div className="flex flex-col min-h-0 h-full text-[hsl(var(--text-primary))]">
    <div aria-live="polite" aria-label="Mensajes del entrenador" className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-4 space-y-4">
      {loading && <div className="flex justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>}
      {!loading && messages.length === 0 && <div className="text-center py-8 text-[hsl(var(--text-secondary))]"><UserRound className="w-9 h-9 mx-auto mb-3 text-[hsl(var(--accent-green-light))]" /><p>Conversación con José Antonio</p><p className="text-sm mt-2">Todavía no hay mensajes.</p></div>}
      {messages.map(m => <div key={m.id} className={`flex ${m.from_admin === isAdmin ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%] rounded-lg px-3 py-2 ${m.from_admin === isAdmin ? 'bg-[hsl(var(--dark-card))] border border-[hsl(var(--accent-green))]/40' : 'bg-[hsl(var(--dark-bg))] border border-[hsl(var(--dark-border))]'}`}>
          <p className="text-xs mb-1 text-[hsl(var(--accent-green-light))]">{m.from_admin ? 'Entrenador' : 'Cliente'}</p>
          <p className="whitespace-pre-wrap break-words text-sm">{m.body}</p>
          <p className="text-[10px] mt-1 text-[hsl(var(--text-secondary))]">{new Date(m.created_at).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>)}
      <div ref={end} />
    </div>
    {error && <p role="alert" className="text-sm py-2 text-[hsl(var(--text-primary))]">{error}</p>}
    {closed ? <p className="border-t border-[hsl(var(--dark-border))] pt-3 text-sm text-[hsl(var(--text-secondary))]">El cliente ha cerrado este chat.</p> : <form onSubmit={e => { e.preventDefault(); void send(); }} className="flex items-end gap-2 border-t border-[hsl(var(--dark-border))] pt-3 shrink-0">
      <Textarea aria-label="Escribe tu mensaje al entrenador" value={draft} onChange={e => setDraft(e.target.value)} maxLength={2000} placeholder="Escribe tu mensaje…" className="resize-none min-h-[72px] max-h-32 bg-[hsl(var(--dark-bg))] border-[hsl(var(--dark-border))] text-[hsl(var(--text-primary))]" />
      <Button type="submit" size="icon" title="Enviar mensaje" aria-label="Enviar mensaje" disabled={!draft.trim() || sending} className="btn-cta w-11 h-11 shrink-0">{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</Button>
    </form>}
  </div>;
}