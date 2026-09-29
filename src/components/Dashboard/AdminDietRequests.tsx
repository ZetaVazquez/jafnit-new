import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, X, Loader2, ClipboardList, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EVALUATION_BLOCKS } from './InitialEvaluationModal';

interface Props { onChanged?: () => void }

const AdminDietRequests: React.FC<Props> = ({ onChanged }) => {
  const [rows, setRows] = useState<any[]>([]);
  const [evals, setEvals] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<'draft' | 'approved' | 'rejected'>('draft');
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('diet_plans')
      .select('id, title, description, status, calories_target, created_at, assigned_to, meal_plan, profiles:assigned_to(name, email)')
      .eq('generated_by_ai', true)
      .order('created_at', { ascending: false });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    const list = data || [];
    setRows(list);
    const ids = [...new Set(list.map((r: any) => r.assigned_to).filter(Boolean))];
    if (ids.length) {
      const { data: ev } = await (supabase as any).from('initial_evaluations').select('*').in('user_id', ids);
      const map: Record<string, any> = {};
      (ev || []).forEach((e: any) => { map[e.user_id] = e; });
      setEvals(map);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const act = async (id: string, approve: boolean) => {
    setBusy(id);
    const { error } = await (supabase as any).rpc(approve ? 'admin_approve_diet_plan' : 'admin_reject_diet_plan', { p_id: id });
    setBusy(null);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: approve ? 'Dieta aprobada' : 'Dieta rechazada', description: approve ? 'El cliente ya puede verla.' : 'El cliente no la verá.' });
    load();
    onChanged?.();
  };

  const shown = rows.filter(r => r.status === filter);
  const count = (s: string) => rows.filter(r => r.status === s).length;

  if (loading) return <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--accent-green))]" /></div>;

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {([['draft', 'Pendientes'], ['approved', 'Aprobadas'], ['rejected', 'Rechazadas']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`px-3 py-1.5 text-sm rounded-lg border ${filter === k ? 'border-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green))]/20 text-white' : 'border-white/10 text-white/60'}`}>
            {l} ({count(k)})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center text-white/60">No hay dietas en esta lista.</div>
      ) : (
        <div className="space-y-4">
          {shown.map(r => {
            const ev = evals[r.assigned_to];
            const t = r.meal_plan?.targets;
            return (
              <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-lg font-bold text-white">{r.profiles?.name || 'Cliente'}</h3>
                    <p className="text-sm text-white/50">{r.profiles?.email} · {new Date(r.created_at).toLocaleString('es-ES')}</p>
                    <p className="text-sm text-white/80 mt-2">{r.title}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge className="bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green-light))] border-0"><Flame className="w-3 h-3 mr-1" />{r.calories_target || t?.kcal || '—'} kcal/día</Badge>
                      {t && <Badge className="bg-white/10 text-white/80 border-0">P {t.protein_g ?? t.protein}g · C {t.carbs_g ?? t.carbs}g · G {t.fats_g ?? t.fats}g</Badge>}
                      {ev?.completed ? <Badge className="bg-white/10 text-white/80 border-0">Cuestionario completado</Badge> : <Badge className="bg-white/10 text-white/50 border-0">Sin cuestionario completo</Badge>}
                    </div>
                  </div>
                  {filter !== 'approved' && (
                    <div className="flex gap-2">
                      {filter === 'draft' && (
                        <Button variant="outline" disabled={busy === r.id} onClick={() => act(r.id, false)} className="bg-transparent border-destructive/50 text-destructive hover:bg-destructive/10">
                          <X className="w-4 h-4 mr-1" />Rechazar
                        </Button>
                      )}
                      <Button disabled={busy === r.id} onClick={() => act(r.id, true)} className="btn-cta">
                        {busy === r.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}Aprobar
                      </Button>
                    </div>
                  )}
                </div>

                <Accordion type="multiple" className="mt-3">
                  {ev && (
                    <AccordionItem value="q" className="border-white/10">
                      <AccordionTrigger className="text-white/80 hover:no-underline text-sm"><span className="flex items-center gap-2"><ClipboardList className="w-4 h-4" />Datos del cuestionario</span></AccordionTrigger>
                      <AccordionContent>
                        {EVALUATION_BLOCKS.map(b => {
                          const vals = (ev[b.column] || {}) as Record<string, any>;
                          const filled = b.fields.filter(f => vals[f.name] !== undefined && vals[f.name] !== '' && vals[f.name] !== null);
                          if (!filled.length) return null;
                          return (
                            <div key={b.column} className="mb-4">
                              <p className="text-xs font-semibold text-[hsl(var(--accent-green-light))] mb-2">{b.title}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {filled.map(f => (
                                  <div key={f.name} className="rounded-lg p-2 bg-white/5 border border-white/10">
                                    <p className="text-xs text-white/50">{f.label}</p>
                                    <p className="text-sm text-white break-words">{f.type === 'checkbox' ? (vals[f.name] ? 'Sí' : 'No') : String(vals[f.name])}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  <AccordionItem value="d" className="border-white/10">
                    <AccordionTrigger className="text-white/80 hover:no-underline text-sm">Ver dieta propuesta</AccordionTrigger>
                    <AccordionContent>
                      {(r.meal_plan?.days || []).map((d: any, i: number) => (
                        <div key={i} className="mb-3">
                          <p className="text-sm font-semibold text-white mb-1">{d.day}</p>
                          <ul className="space-y-1">
                            {(d.meals || []).map((m: any, j: number) => (
                              <li key={j} className="text-sm text-white/70">
                                <span className="text-white/50">{m.meal_type || m.type}:</span> {m.name}{m.calories ? ` · ${m.calories} kcal` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDietRequests;
