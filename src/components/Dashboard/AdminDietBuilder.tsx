import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Search, Plus, Edit, Trash2, ChevronDown, ChevronUp, Calendar, Sparkles, X, Check, Clock, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Client { id: string; name: string; email: string; }
interface Meal {
  id: string; name: string; meal_type: string; description: string | null; image_url: string | null;
  calories: number | null; protein_g: number | null; carbs_g: number | null; fats_g: number | null;
}
interface MealItem {
  meal_id: string; name: string; meal_type: string; image_url: string | null;
  calories: number | null; protein_g: number | null; carbs_g: number | null; fats_g: number | null;
  quantity: string; notes: string;
}
interface DayPlan { day: string; meals: MealItem[]; }
interface DietPlanRow {
  id: string; title: string; description: string | null; calories_target: number | null;
  user_id: string; assigned_to: string | null; client_name?: string;
  meal_plan: any; created_at: string; status: string; generated_by_ai: boolean;
}

type Duration = '1_day' | '3_days' | '1_week';
const DURATION_CONFIG: Record<Duration, { label: string; days: string[] }> = {
  '1_day': { label: '1 Día', days: ['Día 1'] },
  '3_days': { label: '3 Días', days: ['Día 1', 'Día 2', 'Día 3'] },
  '1_week': { label: '1 Semana', days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] },
};

const AdminDietBuilder: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [library, setLibrary] = useState<Meal[]>([]);
  const [plans, setPlans] = useState<DietPlanRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DietPlanRow | null>(null);
  const [view, setView] = useState<'all' | 'drafts'>('all');
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const [searchClient, setSearchClient] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [duration, setDuration] = useState<Duration>('1_week');
  const [days, setDays] = useState<DayPlan[]>([]);
  const [expandedDay, setExpandedDay] = useState<number>(0);
  const [pickerOpen, setPickerOpen] = useState<{ dayIndex: number } | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerFilter, setPickerFilter] = useState('all');
  const [generating, setGenerating] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchClients(); fetchLibrary(); fetchPlans(); }, []);
  useEffect(() => {
    setDays(prev => DURATION_CONFIG[duration].days.map((d, i) => ({ day: d, meals: prev[i]?.meals || [] })));
  }, [duration]);

  const fetchClients = async () => {
    const { data } = await supabase.rpc('get_active_profiles')
      .neq('email', 'josefiguenu@gmail.com').neq('email', 'consultajafn@gmail.com').neq('email', 'zaiidav347@gmail.com');
    setClients(data || []);
  };
  const fetchLibrary = async () => {
    const { data } = await supabase.from('meals_library').select('*').order('name');
    setLibrary(data || []);
  };
  const fetchPlans = async () => {
    const { data } = await supabase.from('diet_plans').select('*').order('created_at', { ascending: false });
    const { data: profs } = await supabase.from('profiles').select('id, name');
    setPlans((data || []).map((p: any) => ({ ...p, client_name: profs?.find(x => x.id === (p.assigned_to || p.user_id))?.name || '—' })));
  };

  const resetForm = () => {
    setSelectedClient(''); setTitle(''); setDescription(''); setCalories('');
    setDuration('1_week'); setDays([]); setEditing(null); setShowForm(false); setExpandedDay(0);
  };

  const startEdit = (p: DietPlanRow) => {
    setEditing(p);
    setSelectedClient(p.assigned_to || p.user_id);
    setTitle(p.title); setDescription(p.description || '');
    setCalories(p.calories_target?.toString() || '');
    const d: Duration = (p.meal_plan?.duration as Duration) || '1_week';
    setDuration(d);
    const baseDays = DURATION_CONFIG[d].days;
    const existingDays = p.meal_plan?.days || [];
    setDays(baseDays.map((day, i) => {
      const ex = existingDays.find((x: any) => x.day === day) || existingDays[i];
      return { day, meals: (ex?.meals || []).map((it: any) => ({
        meal_id: it.meal_id || '', name: it.name || '', meal_type: it.meal_type || '',
        image_url: it.image_url || null,
        calories: it.calories ?? null, protein_g: it.protein_g ?? null, carbs_g: it.carbs_g ?? null, fats_g: it.fats_g ?? null,
        quantity: it.quantity || '1 ración', notes: it.notes || ''
      })) };
    }));
    setShowForm(true);
  };

  const addMeal = (dayIndex: number, m: Meal) => {
    setDays(prev => prev.map((d, i) => i !== dayIndex ? d : ({
      ...d, meals: [...d.meals, {
        meal_id: m.id, name: m.name, meal_type: m.meal_type, image_url: m.image_url,
        calories: m.calories, protein_g: m.protein_g, carbs_g: m.carbs_g, fats_g: m.fats_g,
        quantity: '1 ración', notes: ''
      }]
    })));
    setPickerOpen(null);
  };
  const updateMeal = (dayIndex: number, idx: number, patch: Partial<MealItem>) => {
    setDays(prev => prev.map((d, i) => i !== dayIndex ? d : ({ ...d, meals: d.meals.map((it, j) => j === idx ? { ...it, ...patch } : it) })));
  };
  const removeMeal = (dayIndex: number, idx: number) => {
    setDays(prev => prev.map((d, i) => i !== dayIndex ? d : ({ ...d, meals: d.meals.filter((_, j) => j !== idx) })));
  };

  const savePlan = async (status: 'draft' | 'approved') => {
    if (!selectedClient || !title) { toast({ title: 'Faltan datos', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const meal_plan = { duration, duration_label: DURATION_CONFIG[duration].label, days: days.filter(d => d.meals.length > 0) };
      const calories_target = calories ? Number(calories) : null;
      if (editing) {
        const { error } = await supabase.rpc('admin_update_diet_plan', {
          p_id: editing.id, p_title: title, p_description: description,
          p_assigned_to: selectedClient, p_calories_target: calories_target,
          p_status: status, p_meal_plan: meal_plan as any,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.rpc('admin_create_diet_plan', {
          p_title: title, p_description: description,
          p_assigned_to: selectedClient, p_calories_target: calories_target,
          p_status: status, p_meal_plan: meal_plan as any,
        });
        if (error) throw error;
      }
      toast({ title: status === 'approved' ? 'Plan aprobado y enviado' : 'Borrador guardado' });
      resetForm(); fetchPlans();
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  const approveDraft = async (id: string) => {
    const { error } = await supabase.rpc('admin_approve_diet_plan', { p_id: id });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Plan aprobado y enviado al cliente' }); fetchPlans();
  };
  const deletePlan = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    const { error } = await supabase.rpc('admin_delete_diet_plan', { p_id: id });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Eliminado' }); fetchPlans();
  };

  const generateWithAI = async (clientId: string) => {
    setGenerating(clientId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-plans-from-questionnaire', {
        body: { user_id: clientId, type: 'diet', duration }
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Error generando');
      toast({ title: 'Borrador de dieta generado por IA' });
      fetchPlans(); setView('drafts');
    } catch (e: any) { toast({ title: 'Error IA', description: e.message, variant: 'destructive' }); }
    finally { setGenerating(null); }
  };

  const filteredClients = clients.filter(c =>
    c.name?.toLowerCase().includes(searchClient.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchClient.toLowerCase())
  );
  const filteredLib = library.filter(m =>
    (pickerFilter === 'all' || m.meal_type === pickerFilter) &&
    (pickerSearch === '' || m.name.toLowerCase().includes(pickerSearch.toLowerCase()))
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
            <h1 className="text-3xl font-bold text-white">Planes de <span className="text-[hsl(var(--accent-green-light))] italic">Dieta</span></h1>
          </div>
          <div className="flex gap-2">
            <div className="rounded-lg border border-white/10 bg-white/5 flex">
              <button onClick={() => setView('all')} className={`px-3 py-1.5 text-sm rounded-l-lg ${view === 'all' ? 'bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))]' : 'text-white/60'}`}>Todos</button>
              <button onClick={() => setView('drafts')} className={`px-3 py-1.5 text-sm rounded-r-lg ${view === 'drafts' ? 'bg-yellow-500/20 text-yellow-400' : 'text-white/60'}`}>
                Borradores ({plans.filter(p => p.status === 'draft').length})
              </button>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
              <Plus className="w-4 h-4 mr-2" />Nueva Dieta
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Editar Dieta' : 'Crear Dieta'}</h2>

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
                  Generar borrador con IA
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div><label className="block text-sm text-white/70 mb-1">Título</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
              <div><label className="block text-sm text-white/70 mb-1">Calorías objetivo</label>
                <Input type="number" value={calories} onChange={e => setCalories(e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
            </div>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción..." rows={2} className="bg-white/5 border-white/10 text-white mb-4" />

            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Duración</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(DURATION_CONFIG) as [Duration, typeof DURATION_CONFIG[Duration]][]).map(([k, c]) => (
                  <button key={k} type="button" onClick={() => setDuration(k)}
                    className={`p-3 rounded-lg border text-sm ${duration === k ? 'bg-[hsl(var(--accent-green))]/20 border-[hsl(var(--accent-green))]/50 text-[hsl(var(--accent-green))]' : 'border-white/10 text-white/50'}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {days.map((day, dIdx) => (
                <div key={dIdx} className="rounded-lg border border-white/10">
                  <button type="button" onClick={() => setExpandedDay(expandedDay === dIdx ? -1 : dIdx)}
                    className={`w-full flex items-center justify-between p-3 text-sm ${day.meals.length > 0 ? 'bg-[hsl(var(--accent-green))]/10 text-[hsl(var(--accent-green))]' : 'bg-white/5 text-white/60'}`}>
                    <span className="flex items-center gap-2 font-medium">{day.day} {day.meals.length > 0 && <span className="text-xs opacity-60">· {day.meals.length} comidas</span>}</span>
                    {expandedDay === dIdx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedDay === dIdx && (
                    <div className="p-3 space-y-2 bg-white/[0.02]">
                      {day.meals.map((m, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-3">
                          <div className="flex gap-3">
                            {m.image_url ? <img src={m.image_url} alt="" className="w-16 h-16 object-cover rounded" /> :
                              <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded text-white/30"><ImageIcon className="w-6 h-6" /></div>}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div>
                                  <div className="text-white font-medium">{m.name}</div>
                                  <div className="text-xs text-white/40 capitalize">{m.meal_type} {m.calories != null && `· ${m.calories} kcal`}</div>
                                </div>
                                <Button type="button" size="sm" variant="ghost" onClick={() => removeMeal(dIdx, idx)} className="text-red-400/70 hover:bg-red-500/10"><X className="w-4 h-4" /></Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div><label className="text-xs text-white/50">Cantidad</label><Input value={m.quantity} onChange={e => updateMeal(dIdx, idx, { quantity: e.target.value })} className="bg-white/5 border-white/10 text-white h-8" /></div>
                                <div><label className="text-xs text-white/50">Notas</label><Input value={m.notes} onChange={e => updateMeal(dIdx, idx, { notes: e.target.value })} className="bg-white/5 border-white/10 text-white h-8" /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button type="button" onClick={() => { setPickerOpen({ dayIndex: dIdx }); setPickerSearch(''); setPickerFilter('all'); }}
                        variant="outline" className="w-full border-dashed border-white/20 text-white/60 hover:bg-white/10 bg-transparent">
                        <Plus className="w-4 h-4 mr-2" />Añadir comida
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
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
                    <p className="text-sm text-white/40 mt-1">{p.client_name} · {p.calories_target ? `${p.calories_target} kcal` : ''} · {new Date(p.created_at).toLocaleDateString('es-ES')}</p>
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
                {expandedPlan === p.id && p.meal_plan?.days && (
                  <div className="border-t border-white/10 p-4 space-y-2">
                    {p.meal_plan.days.map((d: any, i: number) => (
                      <div key={i} className="rounded-lg bg-white/5 p-3">
                        <h4 className="text-sm font-semibold text-[hsl(var(--accent-green))] mb-2">{d.day}</h4>
                        {(d.meals || []).map((m: any, j: number) => (
                          <div key={j} className="text-sm text-white/70 py-1">• {m.name} ({m.meal_type}) — {m.quantity}</div>
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

      <Dialog open={!!pickerOpen} onOpenChange={o => !o && setPickerOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-[hsl(220,20%,12%)] border-white/10">
          <DialogHeader><DialogTitle className="text-white">Elegir comida</DialogTitle></DialogHeader>
          <div className="flex flex-wrap gap-2 mb-3">
            <Input placeholder="Buscar..." value={pickerSearch} onChange={e => setPickerSearch(e.target.value)} className="bg-white/5 border-white/10 text-white max-w-xs" />
            <Select value={pickerFilter} onValueChange={setPickerFilter}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white max-w-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
                <SelectItem value="all" className="text-white">Todos</SelectItem>
                {Array.from(new Set(library.map(m => m.meal_type))).map(t => (
                  <SelectItem key={t} value={t} className="text-white capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {filteredLib.map(m => (
              <button key={m.id} type="button" onClick={() => pickerOpen && addMeal(pickerOpen.dayIndex, m)}
                className="flex gap-3 p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-left">
                {m.image_url ? <img src={m.image_url} alt="" className="w-14 h-14 object-cover rounded" /> :
                  <div className="w-14 h-14 flex items-center justify-center bg-white/5 rounded text-white/30"><ImageIcon className="w-5 h-5" /></div>}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm truncate">{m.name}</div>
                  <div className="text-xs text-white/40 capitalize">{m.meal_type} {m.calories != null && `· ${m.calories} kcal`}</div>
                </div>
              </button>
            ))}
          </div>
          {filteredLib.length === 0 && <p className="text-center text-white/40 py-8">Sin comidas. Crea algunas en la Biblioteca.</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDietBuilder;