import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Edit, Trash2, Upload, Video, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  description: string | null;
  instructions: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  difficulty: string;
  equipment: string | null;
}

const MUSCLE_GROUPS = ['pecho', 'espalda', 'piernas', 'hombros', 'brazos', 'core', 'cardio', 'glúteos', 'full body'];
const DIFFICULTIES = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
];

const AdminExerciseLibrary: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const videoInput = useRef<HTMLInputElement>(null);
  const thumbInput = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '', muscle_group: 'pecho', description: '', instructions: '',
    video_url: '', thumbnail_url: '', difficulty: 'intermediate', equipment: ''
  });

  useEffect(() => { fetchExercises(); }, []);

  const fetchExercises = async () => {
    const { data, error } = await supabase.from('exercises_library').select('*').order('muscle_group').order('name');
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    setExercises(data || []);
  };

  const resetForm = () => {
    setForm({ name: '', muscle_group: 'pecho', description: '', instructions: '', video_url: '', thumbnail_url: '', difficulty: 'intermediate', equipment: '' });
    setEditing(null); setShowForm(false);
  };

  const uploadFile = async (file: File, kind: 'video' | 'thumbnail') => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('exercise-media').upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('exercise-media').getPublicUrl(path);
      setForm(prev => ({ ...prev, [kind === 'video' ? 'video_url' : 'thumbnail_url']: data.publicUrl }));
      toast({ title: kind === 'video' ? 'Video subido' : 'Imagen subida' });
    } catch (e: any) {
      toast({ title: 'Error subiendo', description: e.message, variant: 'destructive' });
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.rpc('admin_upsert_exercise', {
          p_id: editing.id,
          p_name: form.name, p_muscle_group: form.muscle_group,
          p_description: form.description || null, p_instructions: form.instructions || null,
          p_video_url: form.video_url || null, p_thumbnail_url: form.thumbnail_url || null,
          p_difficulty: form.difficulty, p_equipment: form.equipment || null,
        });
        if (error) throw error;
        toast({ title: 'Ejercicio actualizado' });
      } else {
        const { error } = await supabase.rpc('admin_upsert_exercise', {
          p_id: null,
          p_name: form.name, p_muscle_group: form.muscle_group,
          p_description: form.description || null, p_instructions: form.instructions || null,
          p_video_url: form.video_url || null, p_thumbnail_url: form.thumbnail_url || null,
          p_difficulty: form.difficulty, p_equipment: form.equipment || null,
        });
        if (error) throw error;
        toast({ title: 'Ejercicio creado' });
      }
      resetForm(); fetchExercises();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const editEx = (ex: Exercise) => {
    setEditing(ex);
    setForm({
      name: ex.name, muscle_group: ex.muscle_group, description: ex.description || '',
      instructions: ex.instructions || '', video_url: ex.video_url || '',
      thumbnail_url: ex.thumbnail_url || '', difficulty: ex.difficulty, equipment: ex.equipment || ''
    });
    setShowForm(true);
  };

  const deleteEx = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    const { error } = await supabase.rpc('admin_delete_exercise', { p_id: id });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Eliminado' });
    fetchExercises();
  };

  const filtered = exercises.filter(ex => {
    if (filter !== 'all' && ex.muscle_group !== filter) return false;
    if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onGoBack} variant="ghost" className="text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10 border border-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />Volver
            </Button>
            <h1 className="text-3xl font-bold text-white">Biblioteca de <span className="text-[hsl(var(--accent-green-light))] italic">Ejercicios</span></h1>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
            <Plus className="w-4 h-4 mr-2" />Nuevo Ejercicio
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">{editing ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Nombre</label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Grupo muscular</label>
                <Select value={form.muscle_group} onValueChange={v => setForm({ ...form, muscle_group: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
                    {MUSCLE_GROUPS.map(g => <SelectItem key={g} value={g} className="text-white capitalize">{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Dificultad</label>
                <Select value={form.difficulty} onValueChange={v => setForm({ ...form, difficulty: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
                    {DIFFICULTIES.map(d => <SelectItem key={d.value} value={d.value} className="text-white">{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Equipamiento</label>
                <Input value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="Ej: Barra, Mancuernas..." />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Descripción corta</label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Instrucciones</label>
              <Textarea value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} rows={3} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1 flex items-center gap-1"><Video className="w-4 h-4" /> Video</label>
                <input ref={videoInput} type="file" accept="video/*" hidden onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'video')} />
                <Button type="button" onClick={() => videoInput.current?.click()} disabled={uploading} variant="outline" className="w-full border-white/10 text-white/70 bg-white/5">
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {form.video_url ? 'Cambiar video' : 'Subir video'}
                </Button>
                {form.video_url && <video src={form.video_url} controls className="mt-2 w-full max-h-40 rounded-lg" />}
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1 flex items-center gap-1"><ImageIcon className="w-4 h-4" /> Miniatura/Imagen</label>
                <input ref={thumbInput} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'thumbnail')} />
                <Button type="button" onClick={() => thumbInput.current?.click()} disabled={uploading} variant="outline" className="w-full border-white/10 text-white/70 bg-white/5">
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {form.thumbnail_url ? 'Cambiar imagen' : 'Subir imagen'}
                </Button>
                {form.thumbnail_url && <img src={form.thumbnail_url} alt="" className="mt-2 w-full max-h-40 object-cover rounded-lg" />}
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editing ? 'Actualizar' : 'Crear'}
              </Button>
              <Button type="button" onClick={resetForm} variant="ghost" className="text-white/60 border border-white/10">Cancelar</Button>
            </div>
          </form>
        )}

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4 flex flex-wrap gap-3 items-center">
          <Input placeholder="Buscar ejercicio..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white/5 border-white/10 text-white max-w-xs" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white max-w-xs"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
              <SelectItem value="all" className="text-white">Todos los grupos</SelectItem>
              {MUSCLE_GROUPS.map(g => <SelectItem key={g} value={g} className="text-white capitalize">{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-sm text-white/40 ml-auto">{filtered.length} ejercicios</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ex => (
            <div key={ex.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              {ex.thumbnail_url ? (
                <img src={ex.thumbnail_url} alt={ex.name} className="w-full h-40 object-cover" />
              ) : ex.video_url ? (
                <video src={ex.video_url} className="w-full h-40 object-cover" muted />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-white/5 text-white/30"><ImageIcon className="w-12 h-12" /></div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white">{ex.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] capitalize">{ex.muscle_group}</span>
                </div>
                {ex.description && <p className="text-sm text-white/50 line-clamp-2">{ex.description}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-white/40">{ex.equipment || 'Sin equipo'}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => editEx(ex)} className="text-white/50 hover:text-white hover:bg-white/10"><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteEx(ex.id, ex.name)} className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminExerciseLibrary;