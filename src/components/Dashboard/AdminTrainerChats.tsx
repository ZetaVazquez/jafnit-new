import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listTrainerChats, TrainerConversation } from '@/lib/trainerChat';
import TrainerChatPanel from '@/components/Contact/TrainerChatPanel';

export default function AdminTrainerChats({ onGoBack }: { onGoBack?: () => void }) {
  const [chats, setChats] = useState<TrainerConversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    try { const data = await listTrainerChats(); setChats(data); setError(''); }
    catch { setError('No se pudieron cargar las conversaciones.'); }
  }, []);
  useEffect(() => { void refresh(); const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 5000); return () => window.clearInterval(timer); }, [refresh]);
  const current = chats.find(c => c.id === selected);

  return <section className="container mx-auto px-0 md:px-4 py-4 text-[hsl(var(--text-primary))]">
    {onGoBack && <Button onClick={onGoBack} variant="ghost" className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Volver al panel</Button>}
    <div className="flex justify-between items-center gap-3 mb-5"><h1 className="text-xl md:text-2xl font-bold">Chateando con clientes</h1><Button size="icon" variant="ghost" onClick={() => void refresh()} aria-label="Actualizar conversaciones" title="Actualizar conversaciones"><RefreshCw className="w-4 h-4" /></Button></div>
    {error && <p role="alert">{error}</p>}
    <div className="grid md:grid-cols-[260px_1fr] gap-5 h-[min(65dvh,650px)] min-h-[300px]">
      <div className={`${current ? 'hidden md:block' : ''} overflow-y-auto overscroll-contain space-y-2`}>
        {!chats.length && <p className="text-[hsl(var(--text-secondary))] py-8">No hay conversaciones.</p>}
        {chats.map(chat => <Button key={chat.id} variant="ghost" onClick={() => setSelected(chat.id)} className={`w-full h-auto min-h-24 flex-col items-start gap-1 text-left whitespace-normal border rounded-lg ${chat.id === selected ? 'bg-[hsl(var(--dark-card))] border-[hsl(var(--accent-green))]' : 'border-[hsl(var(--dark-border))]'} hover:bg-[hsl(var(--dark-card))] hover:text-[hsl(var(--text-primary))]`}>
          <span className="flex justify-between w-full gap-2"><span className="break-words">{chat.client_name}</span>{chat.unread_count > 0 && <span className="text-[hsl(var(--accent-green-light))] shrink-0">{chat.unread_count} nuevos</span>}</span>
          <span className="text-xs text-[hsl(var(--text-secondary))] break-all">{chat.client_email}</span><span className="text-xs line-clamp-1">{chat.last_message}</span>
          <span className="text-xs text-[hsl(var(--text-secondary))]">{chat.client_closed ? 'Cerrado por el cliente · ' : ''}{new Date(chat.last_at).toLocaleString('es-ES')}</span>
        </Button>)}
      </div>
      <div className={`${!current ? 'hidden md:flex' : 'flex'} flex-col min-h-0 md:border-l md:border-[hsl(var(--dark-border))] md:pl-5`}>
        {current ? <><div className="shrink-0"><Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="md:hidden mb-2"><ArrowLeft className="w-4 h-4 mr-2" />Conversaciones</Button><h2 className="font-semibold">{current.client_name}</h2><p className="text-xs text-[hsl(var(--text-secondary))] break-all">{current.client_email}</p></div><div className="flex-1 min-h-0"><TrainerChatPanel key={current.id} sessionId={current.id} closed={current.client_closed} /></div></> : <div className="m-auto text-center text-[hsl(var(--text-secondary))]"><MessageCircle className="w-9 h-9 mx-auto mb-3" />Selecciona una conversación</div>}
      </div>
    </div>
  </section>;
}