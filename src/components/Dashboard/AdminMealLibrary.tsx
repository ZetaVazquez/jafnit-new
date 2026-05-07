import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Edit, Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Meal {
  id: string;
  name: string;
  meal_type: string;
  description: string | null;
  image_url: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fats_g: number | null;
  ingredients: string | null;
  diet_tags: string[] | null;
}

const MEAL_TYPES = [
  { value: 'desayuno', label: 'Desayuno' },
  { value: 'almuerzo', label: 'Almuerzo' },
  { value: 'cena', label: 'Cena' },
  { value: 'snack', label: 'Snack' },
  { value: 'pre_entreno', label: 'Pre-entreno' },
  { value: 'post_entreno', label: 'Post-entreno' },
];

const AdminMealLibrary: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Meal | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '', meal_type: 'desayuno', description: '', image_url: '',
    calories: '', protein_g: '', carbs_g: '', fats_g: '', ingredients: '', diet_tags: ''
  });

  useEffect(() => { fetchMeals(); }, []);

  const fetchMeals = async () => {
    const { data, error } = await supabase.from('meals_library').select('*').order('meal_type').order('name');
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    setMeals(data || []);
  };

  const resetForm = () => {
    setForm({ name: '', meal_type: 'desayuno', description: '', image_url: '', calories: '', protein_g: '', carbs_g: '', fats_g: '', ingredients: '', diet_tags: '' });
    setEditing(null); setShowForm(false);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('meal-media').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('meal-media').getPublicUrl(path);
      setForm(prev => ({ ...prev, image_url: data.publicUrl }));
      toast({ title: 'Imagen subida' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        meal_type: form.meal_type,
        description: form.description || null,
        image_url: form.image_url || null,
        calories: form.calories ? Number(form.calories) : null,
        protein_g: form.protein_g ? Number(form.protein_g) : null,
        carbs_g: form.carbs_g ? Number(form.carbs_g) : null,
        fats_g: form.fats_g ? Number(form.fats_g) : null,
        ingredients: form.ingredients || null,
        diet_tags: form.diet_tags ? form.diet_tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      if (editing) {
        const { error } = await supabase.from('meals_library').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast({ title: 'Comida actualizada' });
      } else {
        const { error } = await supabase.from('meals_library').insert(payload);
        if (error) throw error;
        toast({ title: 'Comida creada' });
      }
      resetForm(); fetchMeals();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const editMeal = (m: Meal) => {
    setEditing(m);
    setForm({
      name: m.name, meal_type: m.meal_type, description: m.description || '',
      image_url: m.image_url || '',
      calories: m.calories?.toString() || '', protein_g: m.protein_g?.toString() || '',
      carbs_g: m.carbs_g?.toString() || '', fats_g: m.fats_g?.toString() || '',
      ingredients: m.ingredients || '', diet_tags: (m.diet_tags || []).join(', ')
    });
    setShowForm(true);
  };

  const deleteMeal = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    const { error } = await supabase.from('meals_library').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Eliminado' });
    fetchMeals();
  };

  const filtered = meals.filter(m => {
    if (filter !== 'all' && m.meal_type !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
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
            <h1 className="text-3xl font-bold text-white">Biblioteca de <span className="text-[hsl(var(--accent-green-light))] italic">Comidas</span></h1>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
            <Plus className="w-4 h-4 mr-2" />Nueva Comida
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">{editing ? 'Editar Comida' : 'Nueva Comida'}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Nombre</label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Tipo de comida</label>
                <Select value={form.meal_type} onValueChange={v => setForm({ ...form, meal_type: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
                    {MEAL_TYPES.map(t => <SelectItem key={t.value} value={t.value} className="text-white">{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Descripción</label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Ingredientes</label>
              <Textarea value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} rows={3} className="bg-white/5 border-white/10 text-white" placeholder="100g de avena, 1 plátano, 200ml de leche..." />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div><label className="block text-xs text-white/70 mb-1">Calorías</label><Input type="number" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
              <div><label className="block text-xs text-white/70 mb-1">Proteína (g)</label><Input type="number" step="0.1" value={form.protein_g} onChange={e => setForm({ ...form, protein_g: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
              <div><label className="block text-xs text-white/70 mb-1">Carbos (g)</label><Input type="number" step="0.1" value={form.carbs_g} onChange={e => setForm({ ...form, carbs_g: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
              <div><label className="block text-xs text-white/70 mb-1">Grasas (g)</label><Input type="number" step="0.1" value={form.fats_g} onChange={e => setForm({ ...form, fats_g: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Etiquetas (separadas por coma)</label>
              <Input value={form.diet_tags} onChange={e => setForm({ ...form, diet_tags: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="vegetariano, alto en proteína, sin gluten" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1 flex items-center gap-1"><ImageIcon className="w-4 h-4" /> Foto de la comida</label>
              <input ref={fileInput} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              <Button type="button" onClick={() => fileInput.current?.click()} disabled={uploading} variant="outline" className="w-full border-white/10 text-white/70 bg-white/5">
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {form.image_url ? 'Cambiar foto' : 'Subir foto'}
              </Button>
              {form.image_url && <img src={form.image_url} alt="" className="mt-2 w-full max-h-60 object-cover rounded-lg" />}
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
          <Input placeholder="Buscar comida..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white/5 border-white/10 text-white max-w-xs" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white max-w-xs"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
              <SelectItem value="all" className="text-white">Todos los tipos</SelectItem>
              {MEAL_TYPES.map(t => <SelectItem key={t.value} value={t.value} className="text-white">{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-sm text-white/40 ml-auto">{filtered.length} comidas</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              {m.image_url ? (
                <img src={m.image_url} alt={m.name} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-white/5 text-white/30"><ImageIcon className="w-12 h-12" /></div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white">{m.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] capitalize">{m.meal_type}</span>
                </div>
                {m.description && <p className="text-sm text-white/50 line-clamp-2">{m.description}</p>}
                <div className="flex items-center gap-3 text-xs text-white/40 mt-2">
                  {m.calories != null && <span>{m.calories} kcal</span>}
                  {m.protein_g != null && <span>P: {m.protein_g}g</span>}
                  {m.carbs_g != null && <span>C: {m.carbs_g}g</span>}
                  {m.fats_g != null && <span>G: {m.fats_g}g</span>}
                </div>
                <div className="flex items-center justify-end mt-3 gap-1">
                  <Button size="sm" variant="ghost" onClick={() => editMeal(m)} className="text-white/50 hover:text-white hover:bg-white/10"><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteMeal(m.id, m.name)} className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMealLibrary;