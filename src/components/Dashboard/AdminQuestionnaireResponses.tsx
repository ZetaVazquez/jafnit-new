import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, ClipboardList, CheckCircle2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EVALUATION_BLOCKS, getBlockCompletion, getOverallEvaluationProgress } from './InitialEvaluationModal';

interface AdminQuestionnaireResponsesProps {
  onGoBack: () => void;
}

interface ClientEvaluation {
  user_id: string;
  name: string;
  email: string;
  evaluation: Record<string, any>;
  completedBlocks: number;
  overallPercent: number;
  updated_at: string;
}

const AdminQuestionnaireResponses: React.FC<AdminQuestionnaireResponsesProps> = ({ onGoBack }) => {
  const [clients, setClients] = useState<ClientEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ClientEvaluation | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('initial_evaluations')
        .select('*, profiles:user_id(name, email)')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      const mapped: ClientEvaluation[] = (data || []).map((ev: any) => {
        const completedBlocks = EVALUATION_BLOCKS.filter(
          b => getBlockCompletion(b, ev[b.column]).percent === 100
        ).length;
        return {
          user_id: ev.user_id,
          name: ev.profiles?.name || 'Sin nombre',
          email: ev.profiles?.email || '',
          evaluation: ev,
          completedBlocks,
          overallPercent: getOverallEvaluationProgress(ev),
          updated_at: ev.updated_at,
        };
      });
      setClients(mapped);
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error', description: 'No se pudieron cargar las evaluaciones', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--accent-green-light))]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={onGoBack}
          className="mb-4 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Panel
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Respuestas del <span className="text-[hsl(var(--accent-green-light))] italic">Cuestionario</span>
        </h1>
        <p className="text-white/50 mt-2">
          Selecciona un cliente para ver los bloques completados al 100%. Los bloques incompletos no se muestran hasta que el cliente los finalice.
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <ClipboardList className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">Aún no hay evaluaciones disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map(c => (
            <button
              key={c.user_id}
              onClick={() => setSelected(c)}
              className="group text-left rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-[hsl(var(--accent-green-light)/0.15)] hover:to-[hsl(var(--accent-green-light)/0.05)] hover:border-[hsl(var(--accent-green-light)/0.4)] backdrop-blur-sm p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[hsl(var(--accent-green-light)/0.1)] min-h-[180px] flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[hsl(var(--accent-green-light)/0.15)] text-[hsl(var(--accent-green-light))] group-hover:bg-[hsl(var(--accent-green-light)/0.25)] transition-colors">
                  <User className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">{c.name}</h3>
                  <p className="text-sm text-white/50 truncate flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> {c.email}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge className="bg-[hsl(var(--accent-green-light)/0.15)] text-[hsl(var(--accent-green-light))] border border-[hsl(var(--accent-green-light)/0.3)] hover:bg-[hsl(var(--accent-green-light)/0.2)]">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {c.completedBlocks}/{EVALUATION_BLOCKS.length} bloques al 100%
                </Badge>
                <span className="text-xs text-white/40">{c.overallPercent}% total</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[hsl(220,20%,10%)] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <ClipboardList className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
              Respuestas — {selected?.name}
            </DialogTitle>
            <p className="text-sm text-white/50">{selected?.email}</p>
          </DialogHeader>
          {selected && (() => {
            const completed = EVALUATION_BLOCKS.filter(
              b => getBlockCompletion(b, selected.evaluation[b.column]).percent === 100
            );
            if (completed.length === 0) {
              return (
                <div className="py-10 text-center text-white/60">
                  Este cliente aún no tiene ningún bloque completado al 100%.
                </div>
              );
            }
            return (
              <Accordion type="multiple" className="w-full">
                {completed.map(b => {
                  const values = (selected.evaluation[b.column] || {}) as Record<string, any>;
                  return (
                    <AccordionItem key={b.column} value={b.column} className="border-white/10">
                      <AccordionTrigger className="text-white hover:no-underline hover:text-[hsl(var(--accent-green-light))]">
                        <div className="flex items-center gap-3 text-left">
                          <Badge className="bg-[hsl(var(--accent-green-light)/0.2)] text-[hsl(var(--accent-green-light))] border border-[hsl(var(--accent-green-light)/0.3)]">
                            100%
                          </Badge>
                          <span className="text-sm font-semibold">{b.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          {b.fields.map(f => {
                            const v = values[f.name];
                            const display = f.type === 'checkbox'
                              ? (v === true ? 'Sí' : 'No')
                              : (v === null || v === undefined || v === '' ? '—' : String(v));
                            return (
                              <div key={f.name} className="rounded-lg p-3 bg-white/5 border border-white/10">
                                <p className="text-xs font-medium text-white/50 mb-1">{f.label}</p>
                                <p className="text-sm text-white break-words">{display}</p>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuestionnaireResponses;
