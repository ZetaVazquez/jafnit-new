import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MessageSquare, Ruler, Search, Trash2, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props { onGoBack: () => void; }

type Row = {
  user_id: string; name: string | null; email: string | null;
  has_conversation: boolean; msg_count: number; last_activity: string | null;
  weight_kg: number | null; height_cm: number | null; age: number | null; waist_cm: number | null;
  activity_level: string | null; sleep_hours: number | null; meals_per_day: number | null; water_l: number | null;
};

type Msg = { role: 'user' | 'assistant'; content: string };

const numOrNull = (v: string) => v.trim() === '' ? null : Number(v);
const intOrNull = (v: string) => v.trim() === '' ? null : parseInt(v, 10);

const AdminCoachReview: React.FC<Props> = ({ onGoBack }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Row | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDeleteChat, setConfirmDeleteChat] = useState(false);
  const [confirmDeleteMeas, setConfirmDeleteMeas] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('admin_list_coach_users');
    if (error) toast.error(error.message);
    setRows((data as Row[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(r => (r.name || '').toLowerCase().includes(t) || (r.email || '').toLowerCase().includes(t));
  }, [rows, q]);

  const openChat = async (r: Row) => {
    setSelected(r);
    setChatOpen(true);
    setMessages([]);
    const { data, error } = await supabase.rpc('admin_read_coach_conversation', { p_user_id: r.user_id });
    if (error) { toast.error(error.message); return; }
    const msgs = ((data as any)?.messages || []) as Msg[];
    setMessages(msgs);
  };

  const openEdit = (r: Row) => {
    setSelected(r);
    setForm({
      weight_kg: r.weight_kg?.toString() ?? '',
      height_cm: r.height_cm?.toString() ?? '',
      age: r.age?.toString() ?? '',
      waist_cm: r.waist_cm?.toString() ?? '',
      activity_level: r.activity_level ?? '',
      sleep_hours: r.sleep_hours?.toString() ?? '',
      meals_per_day: r.meals_per_day?.toString() ?? '',
      water_l: r.water_l?.toString() ?? '',
    });
    setEditOpen(true);
  };

  const saveMeasurements = async () => {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase.rpc('admin_update_coach_measurements', {
      p_user_id: selected.user_id,
      p_weight_kg: numOrNull(form.weight_kg),
      p_height_cm: numOrNull(form.height_cm),
      p_age: intOrNull(form.age),
      p_waist_cm: numOrNull(form.waist_cm),
      p_activity_level: form.activity_level.trim() || null,
      p_sleep_hours: numOrNull(form.sleep_hours),
      p_meals_per_day: intOrNull(form.meals_per_day),
      p_water_l: numOrNull(form.water_l),
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Medidas actualizadas');
    setEditOpen(false);
    await load();
  };

  const deleteMeasurements = async () => {
    if (!selected) return;
    const { error } = await supabase.rpc('admin_delete_coach_measurements', { p_user_id: selected.user_id });
    if (error) { toast.error(error.message); return; }
    toast.success('Medidas descartadas');
    setConfirmDeleteMeas(false);
    setEditOpen(false);
    await load();
  };

  const deleteConversation = async () => {
    if (!selected) return;
    const { error } = await supabase.rpc('admin_delete_coach_conversation', { p_user_id: selected.user_id });
    if (error) { toast.error(error.message); return; }
    toast.success('Conversación descartada');
    setConfirmDeleteChat(false);
    setChatOpen(false);
    await load();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button onClick={onGoBack} variant="ghost" className="text-white/70 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Revisión <span className="text-primary italic">Coach IA</span>
          </h1>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o email"
            className="pl-9 bg-black/40 border-white/10 text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/60">Ningún cliente ha usado el Coach IA todavía.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div key={r.user_id} className="rounded-xl border border-primary/20 bg-black/40 p-5 backdrop-blur">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <div className="text-white font-semibold truncate">{r.name || 'Sin nombre'}</div>
                  <div className="text-white/50 text-xs truncate">{r.email}</div>
                </div>
                <div className="text-right text-xs text-primary/80 shrink-0">
                  {r.msg_count} msg
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-white/70 mb-4">
                <span>Peso: <b className="text-white">{r.weight_kg ?? '—'}</b> kg</span>
                <span>Altura: <b className="text-white">{r.height_cm ?? '—'}</b> cm</span>
                <span>Edad: <b className="text-white">{r.age ?? '—'}</b></span>
                <span>Cintura: <b className="text-white">{r.waist_cm ?? '—'}</b> cm</span>
                <span>Sueño: <b className="text-white">{r.sleep_hours ?? '—'}</b> h</span>
                <span>Agua: <b className="text-white">{r.water_l ?? '—'}</b> L</span>
                <span className="col-span-2">Actividad: <b className="text-white">{r.activity_level ?? '—'}</b></span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 border-primary/30 text-primary hover:bg-primary/10" onClick={() => openChat(r)}>
                  <MessageSquare className="w-4 h-4 mr-1" /> Chat
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => openEdit(r)}>
                  <Ruler className="w-4 h-4 mr-1" /> Medidas
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat viewer */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-2xl bg-[hsl(220,20%,10%)] border-primary/20 text-white max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Conversación con {selected?.name || selected?.email}</DialogTitle>
            <DialogDescription className="text-white/60">
              Solo lectura. Puedes descartar el hilo si contiene datos incorrectos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
            {messages.length === 0 ? (
              <div className="text-white/50 text-sm text-center py-8">Sin mensajes.</div>
            ) : messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl whitespace-pre-wrap text-sm ${
                  m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-white/90'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="border-t border-white/10 pt-3">
            <Button variant="destructive" onClick={() => setConfirmDeleteChat(true)} disabled={!messages.length}>
              <Trash2 className="w-4 h-4 mr-2" /> Descartar conversación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Measurements editor */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg bg-[hsl(220,20%,10%)] border-primary/20 text-white">
          <DialogHeader>
            <DialogTitle>Corregir medidas · {selected?.name || selected?.email}</DialogTitle>
            <DialogDescription className="text-white/60">
              Ajusta o corrige los datos antes de generar el diagnóstico.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['weight_kg', 'Peso (kg)'], ['height_cm', 'Altura (cm)'],
              ['age', 'Edad'], ['waist_cm', 'Cintura (cm)'],
              ['sleep_hours', 'Sueño (h)'], ['water_l', 'Agua (L)'],
              ['meals_per_day', 'Comidas / día'], ['activity_level', 'Actividad'],
            ].map(([k, label]) => (
              <div key={k} className="space-y-1">
                <Label className="text-xs text-white/70">{label}</Label>
                <Input
                  value={form[k] ?? ''}
                  onChange={(e) => setForm(f => ({ ...f, [k]: e.target.value }))}
                  placeholder={k === 'activity_level' ? 'sedentario / ligero / activo' : ''}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
            ))}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="destructive" onClick={() => setConfirmDeleteMeas(true)} className="sm:mr-auto">
              <Trash2 className="w-4 h-4 mr-2" /> Descartar medidas
            </Button>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={saveMeasurements} disabled={saving} className="bg-primary hover:bg-primary/90">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDeleteChat} onOpenChange={setConfirmDeleteChat}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar toda la conversación?</AlertDialogTitle>
            <AlertDialogDescription>Se eliminará el hilo completo del cliente con el Coach IA. Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteConversation} className="bg-red-600 hover:bg-red-700">Descartar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDeleteMeas} onOpenChange={setConfirmDeleteMeas}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar las medidas guardadas?</AlertDialogTitle>
            <AlertDialogDescription>Se eliminarán todas las medidas registradas por el Coach IA para este cliente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMeasurements} className="bg-red-600 hover:bg-red-700">Descartar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCoachReview;