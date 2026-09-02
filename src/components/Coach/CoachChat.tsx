import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Send, X, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';

type Msg = { role: 'user' | 'assistant'; content: string };

/**
 * In-memory store: the conversation survives closing/reopening the chat and
 * switching sections of the SPA, and is only lost on a full page reload or
 * when the user enters the client/admin dashboard (cleared via clearCoachChat).
 */
let coachMemory: Msg[] = [];
export const clearCoachChat = () => { coachMemory = []; };

interface CoachChatProps {
  onClose: () => void;
  onOpenPlans?: () => void;
}

const formatText = (text: string) => {
  // very light markdown: **bold** and line breaks
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
};

const CoachChat: React.FC<CoachChatProps> = ({ onClose, onOpenPlans }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Msg[]>(coachMemory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep the in-memory copy in sync so the thread survives view changes.
  useEffect(() => { coachMemory = messages; }, [messages]);

  const sendMessage = async (userMessage: Msg | null, history: Msg[] = []) => {
    setLoading(true);
    try {
      // Registered users: the server holds the thread, so only the new message is sent.
      // Guests: the whole thread travels with the request.
      const payload = user
        ? (userMessage ? [{ role: 'user', content: userMessage.content }] : [])
        : [...history, ...(userMessage ? [userMessage] : [])];
      const { data, error } = await supabase.functions.invoke('coach-chat', {
        body: { messages: payload },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
      if (data?.readyForDiagnosis) setReady(true);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Error al hablar con el Coach');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // Load prior conversation on mount. The client always speaks first: no auto-greeting.
  useEffect(() => {
    (async () => {
      if (!user) {
        setInitialLoading(false);
        return;
      }
      const { data } = await supabase
        .from('coach_conversations')
        .select('messages')
        .eq('user_id', user.id)
        .maybeSingle();
      const prior = (((data?.messages as any) || []) as Msg[]);
      setMessages(prior);
      setInitialLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const userMsg: Msg = { role: 'user', content: trimmed };
    const history = messages;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    await sendMessage(userMsg, history);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[hsl(0_0%_6%)] flex flex-col">
      {/* Header */}
      <div className="border-b border-primary/20 bg-black/40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-montserrat font-bold text-white">FIT</div>
            <div className="text-xs text-primary/80">En línea · Asistente de JAFN</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-primary">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {initialLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
          {!initialLoading && messages.length === 0 && (
            <div className="flex justify-start">
              <div className="max-w-[85%] text-white whitespace-pre-wrap leading-relaxed">
                ¡Hola! 👋 Mi nombre es <strong>FIT</strong> y estoy aquí a tu disposición para ayudarte con cualquier duda sobre la web, los programas o el método JAFN. ¿En qué puedo ayudarte? 💪
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' ? (
                <div className="max-w-[85%] text-white whitespace-pre-wrap leading-relaxed">
                  {formatText(m.content)}
                </div>
              ) : (
                <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-[hsl(142_71%_45%)] text-black font-medium whitespace-pre-wrap">
                  {m.content}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="text-primary/70 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Escribiendo…
              </div>
            </div>
          )}
          {ready && onOpenPlans && (
            <div className="pt-4">
              <Button
                onClick={onOpenPlans}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                Ver programas personalizados de José Antonio →
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-primary/20 bg-black/40 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe tu respuesta…"
            rows={1}
            disabled={loading || initialLoading}
            className="min-h-[44px] max-h-32 resize-none bg-white/5 text-white placeholder:text-white/40 border-primary/30 focus-visible:ring-primary"
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="icon"
            className="h-11 w-11 bg-primary hover:bg-primary/90 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachChat;