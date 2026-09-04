import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Trash2, Search, Scale } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onGoBack: () => void;
}

interface ClientRow {
  id: string;
  name: string;
  email: string;
}

interface Review {
  id: string;
  review_date: string;
  compliance_pct: number;
  diet_pct: number | null;
  training_pct: number | null;
  water_pct: number | null;
  sleep_pct: number | null;
  notes: string | null;
  next_steps: string | null;
}

const emptyForm = {
  review_date: new Date().toISOString().split('T')[0],
  compliance_pct: 0,
  diet_pct: '' as number | '',
  training_pct: '' as number | '',
  water_pct: '' as number | '',
  sleep_pct: '' as number | '',
  notes: '',
  next_steps: '',
};

const AdminProgressReview: React.FC<Props> = ({ onGoBack }) => {
  const { toast } = useToast();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ClientRow | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, email')
        .order('name');
      setClients(data || []);
    })();
  }, []);

  const loadClient = async (client: ClientRow) => {
    setSelected(client);
    setForm({ ...emptyForm });
    const [{ data: rev }, { data: meas }] = await Promise.all([
      supabase
        .from('client_progress_reviews')
        .select('*')
        .eq('user_id', client.id)
        .order('review_date', { ascending: false }),
      supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', client.id)
        .order('measured_at', { ascending: false })
        .limit(5),
    ]);
    setReviews((rev as Review[]) || []);
    setMeasurements(meas || []);
  };

  const editReview = (r: Review) => {
    setForm({
      review_date: r.review_date,
      compliance_pct: r.compliance_pct,
      diet_pct: r.diet_pct ?? '',
      training_pct: r.training_pct ?? '',
      water_pct: r.water_pct ?? '',
      sleep_pct: r.sleep_pct ?? '',
      notes: r.notes ?? '',
      next_steps: r.next_steps ?? '',
    });
  };

  const num = (v: number | '') => (v === '' ? null : Number(v));

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase.rpc('admin_upsert_progress_review', {
      p_user_id: selected.id,
      p_review_date: form.review_date,
      p_compliance_pct: Number(form.compliance_pct) || 0,
      p_diet_pct: num(form.diet_pct),
      p_training_pct: num(form.training_pct),
      p_water_pct: num(form.water_pct),
      p_sleep_pct: num(form.sleep_pct),
      p_notes: form.notes || null,
      p_next_steps: form.next_steps || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Error', description: 'No se pudo guardar la evaluación.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Evaluación guardada', description: 'El cliente ya puede verla en Mi Progreso.' });
    await loadClient(selected);
  };

  const remove = async (id: string) => {
    if (!selected) return;
    const { error } = await supabase.rpc('admin_delete_progress_review', { p_id: id });
    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar.', variant: 'destructive' });
      return;
    }
    await loadClient(selected);
  };

  const filtered = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={onGoBack}
            variant="ghost"
            className="mb-4 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Button>
          <h1 className="text-3xl font-bold text-white">Evaluación de Progreso</h1>
          <p className="text-white/50 mt-2">
            Marca la evolución de cumplimiento de cada cliente. El cliente solo puede leerla.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Clients list */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm h-fit">
          <CardHeader>
            <CardTitle className="text-white text-lg">Clientes</CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-1 max-h-[60vh] overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => loadClient(c)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selected?.id === c.id
                    ? 'bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))]'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-white/40">{c.email}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Detail */}
        <div className="space-y-6">
          {!selected ? (
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="py-16 text-center text-white/50">
                Selecciona un cliente para evaluar su progreso.
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Scale className="w-4 h-4 text-yellow-400" />
                    Mediciones registradas por {selected.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {measurements.length === 0 ? (
                    <p className="text-white/40 text-sm">Este cliente aún no ha registrado mediciones.</p>
                  ) : (
                    <div className="space-y-2">
                      {measurements.map((m) => (
                        <div
                          key={m.id}
                          className="flex flex-wrap gap-4 text-sm text-white/70 border border-white/10 rounded-lg px-3 py-2"
                        >
                          <span className="text-white/40">
                            {new Date(m.measured_at).toLocaleDateString('es-ES')}
                          </span>
                          {m.weight && <span>Peso: {m.weight} kg</span>}
                          {m.body_fat_percentage && <span>Grasa: {m.body_fat_percentage}%</span>}
                          {m.muscle_mass && <span>Músculo: {m.muscle_mass} kg</span>}
                          {m.waist_circumference && <span>Cintura: {m.waist_circumference} cm</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Nueva evaluación / editar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white/70">Fecha</Label>
                      <Input
                        type="date"
                        value={form.review_date}
                        onChange={(e) => setForm({ ...form, review_date: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70">Cumplimiento global (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={form.compliance_pct}
                        onChange={(e) => setForm({ ...form, compliance_pct: Number(e.target.value) })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    {([
                      ['diet_pct', 'Dieta (%)'],
                      ['training_pct', 'Entrenamiento (%)'],
                      ['water_pct', 'Hidratación (%)'],
                      ['sleep_pct', 'Descanso (%)'],
                    ] as const).map(([key, label]) => (
                      <div key={key}>
                        <Label className="text-white/70">{label}</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={form[key] as number | ''}
                          onChange={(e) =>
                            setForm({ ...form, [key]: e.target.value === '' ? '' : Number(e.target.value) })
                          }
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label className="text-white/70">Valoración para el cliente</Label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      placeholder="Qué ha ido bien, qué mejorar..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">Próximos pasos</Label>
                    <Textarea
                      value={form.next_steps}
                      onChange={(e) => setForm({ ...form, next_steps: e.target.value })}
                      rows={2}
                      placeholder="Objetivos hasta la próxima revisión..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>

                  <Button
                    onClick={save}
                    disabled={saving}
                    className="bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/30 border border-[hsl(var(--accent-green))]/30"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar evaluación'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Historial de evaluaciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reviews.length === 0 ? (
                    <p className="text-white/40 text-sm">Sin evaluaciones todavía.</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="border border-white/10 rounded-lg p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-white font-medium">
                            {new Date(r.review_date).toLocaleDateString('es-ES')} ·{' '}
                            <span className="text-[hsl(var(--accent-green))]">{r.compliance_pct}%</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-white/70 hover:bg-white/10" onClick={() => editReview(r)}>
                              Editar
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10" onClick={() => remove(r.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {r.notes && <p className="text-white/60 text-sm mt-2 whitespace-pre-wrap">{r.notes}</p>}
                        {r.next_steps && (
                          <p className="text-white/40 text-sm mt-1 whitespace-pre-wrap">Próximos pasos: {r.next_steps}</p>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProgressReview;
