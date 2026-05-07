import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Search, Plus, Edit, Trash2, ChevronDown, ChevronUp, Calendar, Sparkles, X, Check, Clock, Loader2, Video, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Client { id: string; name: string; email: string; }
interface Exercise {
  id: string; name: string; muscle_group: string; description: string | null;
  video_url: string | null; thumbnail_url: string | null; difficulty: string; equipment: string | null;
}
interface PlanItem {
  exercise_id: string; name: string; muscle_group: string;
  video_url: string | null; thumbnail_url: string | null;
  sets: number; reps: string; rest_seconds: number; notes: string;
}
interface DayPlan { day: string; items: PlanItem[]; }
interface WorkoutPlanRow {
  id: string; title: string; description: string | null; assigned_to: string;
  client_name?: string; difficulty_level: string | null;
  exercises: any; created_at: string; status: string; generated_by_ai: boolean;
}

type Duration = '1_day' | '1_week' | '15_days' | '1_month';
const DURATION_CONFIG: Record<Duration, { label: string; days: string[] }> = {
  '1_day': { label: '1 Día', days: ['Día 1'] },
  '1_week': { label: '1 Semana', days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] },
  '15_days': { label: '15 Días', days: Array.from({ length: 15 }, (_, i) => `Día ${i + 1}`) },
  '1_month': { label: '1 Mes', days: Array.from({ length: 28 }, (_, i) => `Día ${i + 1}`) },
};

const AdminWorkoutBuilder: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [library, setLibrary] = useState<Exercise[]>([]);
  const [plans, setPlans] = useState<WorkoutPlanRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WorkoutPlanRow | null>(null);
  const [view, setView] = useState<'all' | 'drafts'>('all');
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  // form state
  const [searchClient, setSearchClient] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [duration, setDuration] = useState<Duration>('1_week');
  const [days, setDays] = useState<DayPlan[]>([]);
  const [expandedDay, setExpandedDay] = useState<number>(0);
  const [pickerOpen, setPickerOpen] = useState<{ dayIndex: number } | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerFilter, setPickerFilter] = useState('all');
  const [generating, setGenerating] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClients(); fetchLibrary(); fetchPlans();
  }, []);

  useEffect(() => {
    setDays(prev => DURATION_CONFIG[duration].days.map((d, i) => ({ day: d, items: prev[i]?.items || [] })));
  }, [duration]);

  const fetchClients = async () => {
    const { data } = await supabase.rpc('get_active_profiles')
      .neq('email', 'josefiguenu@gmail.com').neq('email', 'consultajafn@gmail.com').neq('email', 'zaiidav347@gmail.com');
    setClients(data || []);
  };
  const fetchLibrary = async () => {
    const { data } = await supabase.from('exercises_library').select('*').order('name');
    setLibrary(data || []);
  };
  const fetchPlans = async () => {
    const { data } = await supabase.from('workout_plans').select('*').order('created_at', { ascending: false });
    const { data: profs } = await supabase.from('profiles').select('id, name');
    setPlans((data || []).map((p: any) => ({ ...p, client_name: profs?.find(x => x.id === p.assigned_to)?.name || '—' })));
  };

  const resetForm = () => {
    setSelectedClient(''); setTitle(''); setDescription(''); setDifficulty('intermediate');
    setDuration('1_week'); setDays([]); setEditing(null); setShowForm(false); setExpandedDay(0);
  };

  const startEdit = (p: WorkoutPlanRow) => {
    setEditing(p);
    setSelectedClient(p.assigned_to);
    setTitle(p.title);
    setDescription(p.description || '');
    setDifficulty(p.difficulty_level || 'intermediate');
    const d: Duration = (p.exercises?.duration as Duration) || '1_week';
    setDuration(d);
    const baseDays = DURATION_CONFIG[d].days;
    const existingDays = p.exercises?.days || [];
    setDays(baseDays.map((day, i) => {
      const ex = existingDays.find((x: any) => x.day === day) || existingDays[i];
      return { day, items: (ex?.items || []).map((it: any) => ({
        exercise_id: it.exercise_id || '', name: it.name || '',
        muscle_group: it.muscle_group || '',
        video_url: it.video_url || null, thumbnail_url: it.thumbnail_url || null,
        sets: it.sets || 3, reps: it.reps || '10', rest_seconds: it.rest_seconds || 60, notes: it.notes || ''
      })) };
    }));
    setShowForm(true);
  };

  const addItemToDay = (dayIndex: number, ex: Exercise) => {
    setDays(prev => prev.map((d, i) => i !== dayIndex ? d : ({
      ...d, items: [...d.items, {
        exercise_id: ex.id, name: ex.name, muscle_group: ex.muscle_group,
        video_url: ex.video_url, thumbnail_url: ex.thumbnail_url,
        sets: 3, reps: '10', rest_seconds: 60, notes: ''
      }]
    })));
    setPickerOpen(null);
  };

  const updateItem = (dayIndex: number, itemIndex: number, patch: Partial<PlanItem>) => {
    setDays(prev => prev.map((d, i) => i !== dayIndex ? d : ({
      ...d, items: d.items.map((it, j) => j === itemIndex ? { ...it, ...patch } : it)
    })));
  };
  const removeItem = (dayIndex: number, itemIndex: number) => {
    setDays(prev => prev.map((d, i) => i !== dayIndex ? d : ({ ...d, items: d.items.filter((_, j) => j !== itemIndex) })));
  };

  const savePlan = async (status: 'draft' | 'approved') => {
    if (!selectedClient || !title) {
      toast({ title: 'Faltan datos', description: 'Selecciona cliente y título', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        title, description, assigned_to: selectedClient, user_id: selectedClient,
        difficulty_level: difficulty, status,
        exercises: { duration, duration_label: DURATION_CONFIG[duration].label, days: days.filter(d => d.items.length > 0) }
      };
      if (editing) {
        const { error } = await supabase.from('workout_plans').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('workout_plans').insert(payload);
        if (error) throw error;
      }
      toast({ title: status === 'approved' ? 'Plan aprobado y enviado' : 'Borrador guardado' });
      resetForm(); fetchPlans();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const approveDraft = async (id: string) => {
    const { error } = await supabase.from('workout_plans').update({ status: 'approved' }).eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Plan aprobado y enviado al cliente' });
    fetchPlans();
  };

  const deletePlan = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    const { error } = await supabase.from('workout_plans').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Eliminado' }); fetchPlans();
  };

  const generateWithAI = async (clientId: string) => {
    setGenerating(clientId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-plans-from-questionnaire', {
        body: { user_id: clientId, type: 'workout' }
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Error generando');
      toast({ title: 'Borrador generado por IA', description: 'Revísalo en la pestaña de borradores.' });
      fetchPlans(); setView('drafts');
    } catch (e: any) {
      toast({ title: 'Error IA', description: e.message, variant: 'destructive' });
    } finally { setGenerating(null); }
  };

  const filteredClients = clients.filter(c =>
    c.name?.toLowerCase().includes(searchClient.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchClient.toLowerCase())
  );
  const filteredLib = library.filter(e =>
    (pickerFilter === 'all' || e.muscle_group === pickerFilter) &&
    (pickerSearch === '' || e.name.toLowerCase().includes(pickerSearch.toLowerCase()))
  );
  const visiblePlans = view === 'drafts' ? plans.filter(p => p.status === 'draft') : plans;

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Button onClick={onGoBack} variant="ghost" className="text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10 border border-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />Volver
            </Button>
            <h1 className="text-3xl font-bold text-white">Planes de <span className="text-[hsl(var(--accent-green-light))] italic">Ejercicio</span></h1>
          </div>
          <div className="flex gap-2">
            <div className="rounded-lg border border-white/10 bg-white/5 flex">
              <button onClick={() => setView('all')} className={`px-3 py-1.5 text-sm rounded-l-lg ${view === 'all' ? 'bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))]' : 'text-white/60'}`}>Todos</button>
              <button onClick={() => setView('drafts')} className={`px-3 py-1.5 text-sm rounded-r-lg ${view === 'drafts' ? 'bg-yellow-500/20 text-yellow-400' : 'text-white/60'}`}>
                Borradores ({plans.filter(p => p.status === 'draft').length})
              </button>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
              <Plus className="w-4 h-4 mr-2" />Nueva Rutina
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Editar Rutina' : 'Crear Rutina'}</h2>

            {/* Client picker */}
            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-2">Cliente</label>
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-white/40" />
                <Input placeholder="Buscar..." value={searchClient} onChange={e => setSearchClient(e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1 rounded-lg border border-white/10 p-2">
                {filteredClients.map(c => (
                  <div key={c.id} onClick={() => setSelectedClient(c.id)}
                    className={`p-2 rounded cursor-pointer text-sm ${selectedClient === c.id ? 'bg-[hsl(var(--accent-green))]/20 text-white border border-[hsl(var(--accent-green))]/40' : 'hover:bg-white/5 text-white/70'}`}>
                    <span className="font-medium">{c.name}</span> <span className="text-white/40">{c.email}</span>
                  </div>
                ))}
              </div>
              {selectedClient && (
                <Button type="button" size="sm" disabled={generating === selectedClient} onClick={() => generateWithAI(selectedClient)}
                  className="mt-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30">
                  {generating === selectedClient ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Generar borrador con IA desde cuestionario
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Título</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Dificultad</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
                    <SelectItem value="beginner" className="text-white">Principiante</SelectItem>
                    <SelectItem value="intermediate" className="text-white">Intermedio</SelectItem>
                    <SelectItem value="advanced" className="text-white">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción..." rows={2} className="bg-white/5 border-white/10 text-white mb-4" />

            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Duración</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(Object.entries(DURATION_CONFIG) as [Duration, typeof DURATION_CONFIG[Duration]][]).map(([k, c]) => (
                  <button key={k} type="button" onClick={() => setDuration(k)}
                    className={`p-3 rounded-lg border text-sm ${duration === k ? 'bg-[hsl(var(--accent-green))]/20 border-[hsl(var(--accent-green))]/50 text-[hsl(var(--accent-green))]' : 'border-white/10 text-white/50'}`}>
                    {c.label}<span className="block text-xs opacity-60">{c.days.length} días</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {days.map((day, dIdx) => (
                <div key={dIdx} className="rounded-lg border border-white/10">
                  <button type="button" onClick={() => setExpandedDay(expandedDay === dIdx ? -1 : dIdx)}
                    className={`w-full flex items-center justify-between p-3 text-sm ${day.items.length > 0 ? 'bg-[hsl(var(--accent-green))]/10 text-[hsl(var(--accent-green))]' : 'bg-white/5 text-white/60'}`}>
                    <span className="flex items-center gap-2 font-medium">{day.day} {day.items.length > 0 && <span className="text-xs opacity-60">· {day.items.length} ejercicios</span>}</span>
                    {expandedDay === dIdx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedDay === dIdx && (
                    <div className="p-3 space-y-2 bg-white/[0.02]">
                      {day.items.map((it, iIdx) => (
                        <div key={iIdx} className="rounded-lg border border-white/10 bg-white/5 p-3">
                          <div className="flex gap-3">
                            {it.thumbnail_url ? <img src={it.thumbnail_url} alt="" className="w-16 h-16 object-cover rounded" /> :
                              it.video_url ? <video src={it.video_url} className="w-16 h-16 object-cover rounded" muted /> :
                              <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded text-white/30"><Video className="w-6 h-6" /></div>}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div>
                                  <div className="text-white font-medium">{it.name}</div>
                                  <div className="text-xs text-white/40 capitalize">{it.muscle_group}</div>
                                </div>
                                <Button type="button" size="sm" variant="ghost" onClick={() => removeItem(dIdx, iIdx)} className="text-red-400/70 hover:bg-red-500/10"><X className="w-4 h-4" /></Button>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <div><label className="text-xs text-white/50">Series</label><Input type="number" value={it.sets} onChange={e => updateItem(dIdx, iIdx, { sets: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white h-8" /></div>
                                <div><label className="text-xs text-white/50">Reps</label><Input value={it.reps} onChange={e => updateItem(dIdx, iIdx, { reps: e.target.value })} className="bg-white/5 border-white/10 text-white h-8" placeholder="10 ó 8-12" /></div>
                                <div><label className="text-xs text-white/50">Descanso (s)</label><Input type="number" value={it.rest_seconds} onChange={e => updateItem(dIdx, iIdx, { rest_seconds: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white h-8" /></div>
                                <div><label className="text-xs text-white/50">Notas</label><Input value={it.notes} onChange={e => updateItem(dIdx, iIdx, { notes: e.target.value })} className="bg-white/5 border-white/10 text-white h-8" /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button type="button" onClick={() => { setPickerOpen({ dayIndex: dIdx }); setPickerSearch(''); setPickerFilter('all'); }}
                        variant="outline" className="w-full border-dashed border-white/20 text-white/60 hover:bg-white/10 bg-transparent">
                        <Plus className="w-4 h-4 mr-2" />Añadir ejercicio
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => savePlan('draft')} disabled={saving} variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 bg-transparent">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Clock className="w-4 h-4 mr-2" />}Guardar como borrador
              </Button>
              <Button onClick={() => savePlan('approved')} disabled={saving} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}Aprobar y enviar al cliente
              </Button>
              <Button onClick={resetForm} variant="ghost" className="text-white/60 border border-white/10">Cancelar</Button>
            </div>
          </div>
        )}

        {/* Plans list */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="p-4 space-y-3">
            {visiblePlans.length === 0 ? (
              <p className="text-center py-8 text-white/40">No hay planes.</p>
            ) : visiblePlans.map(p => (
              <div key={p.id} className="rounded-lg border border-white/10 bg-white/[0.03]">
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1 cursor-pointer" onClick={() => setExpandedPlan(expandedPlan === p.id ? null : p.id)}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-white">{p.title}</h3>
                      {p.status === 'draft' && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">BORRADOR</span>}
                      {p.generated_by_ai && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 flex items-center gap-1"><Sparkles className="w-3 h-3" />IA</span>}
                    </div>
                    <p className="text-sm text-white/40 mt-1">{p.client_name} · {p.exercises?.duration_label || ''} · {new Date(p.created_at).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div className="flex gap-2">
                    {p.status === 'draft' && (
                      <Button size="sm" onClick={() => approveDraft(p.id)} className="bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/30">
                        <Check className="w-4 h-4 mr-1" />Aprobar
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => startEdit(p)} className="text-white/50 hover:bg-white/10"><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => deletePlan(p.id, p.title)} className="text-red-400/60 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                {expandedPlan === p.id && p.exercises?.days && (
                  <div className="border-t border-white/10 p-4 space-y-2">
                    {p.exercises.days.map((d: any, i: number) => (
                      <div key={i} className="rounded-lg bg-white/5 p-3">
                        <h4 className="text-sm font-semibold text-[hsl(var(--accent-green))] mb-2">{d.day}</h4>
                        {(d.items || []).map((it: any, j: number) => (
                          <div key={j} className="text-sm text-white/70 py-1">• {it.name} — {it.sets}x{it.reps} ({it.rest_seconds}s desc.)</div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise picker dialog */}
      <Dialog open={!!pickerOpen} onOpenChange={o => !o && setPickerOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-[hsl(220,20%,12%)] border-white/10">
          <DialogHeader><DialogTitle className="text-white">Elegir ejercicio</DialogTitle></DialogHeader>
          <div className="flex flex-wrap gap-2 mb-3">
            <Input placeholder="Buscar..." value={pickerSearch} onChange={e => setPickerSearch(e.target.value)} className="bg-white/5 border-white/10 text-white max-w-xs" />
            <Select value={pickerFilter} onValueChange={setPickerFilter}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white max-w-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
                <SelectItem value="all" className="text-white">Todos</SelectItem>
                {Array.from(new Set(library.map(e => e.muscle_group))).map(g => (
                  <SelectItem key={g} value={g} className="text-white capitalize">{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {filteredLib.map(ex => (
              <button key={ex.id} type="button" onClick={() => pickerOpen && addItemToDay(pickerOpen.dayIndex, ex)}
                className="flex gap-3 p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-left">
                {ex.thumbnail_url ? <img src={ex.thumbnail_url} alt="" className="w-14 h-14 object-cover rounded" /> :
                  <div className="w-14 h-14 flex items-center justify-center bg-white/5 rounded text-white/30"><ImageIcon className="w-5 h-5" /></div>}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm truncate">{ex.name}</div>
                  <div className="text-xs text-white/40 capitalize">{ex.muscle_group} · {ex.difficulty}</div>
                </div>
              </button>
            ))}
          </div>
          {filteredLib.length === 0 && <p className="text-center text-white/40 py-8">Sin ejercicios. Crea algunos en la Biblioteca.</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWorkoutBuilder;