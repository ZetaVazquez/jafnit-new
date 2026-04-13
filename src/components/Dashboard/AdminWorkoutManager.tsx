
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Client { id: string; name: string; email: string; }
interface WorkoutPlan { id: string; title: string; description: string; assigned_to: string; client_name: string; difficulty_level: string; exercises?: any; created_at: string; }
interface AdminWorkoutManagerProps { onGoBack: () => void; }

const AdminWorkoutManager: React.FC<AdminWorkoutManagerProps> = ({ onGoBack }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', difficulty_level: 'intermediate', exercises: '' });
  const { toast } = useToast();

  useEffect(() => { fetchClients(); fetchWorkoutPlans(); }, []);
  useEffect(() => {
    setFilteredClients(clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.rpc('get_active_profiles').neq('email', 'josefiguenu@gmail.com').neq('email', 'consultajafn@gmail.com').neq('email', 'zaiidav347@gmail.com');
      if (error) throw error;
      setClients(data || []);
    } catch (error) { console.error('Error fetching clients:', error); }
  };

  const fetchWorkoutPlans = async () => {
    try {
      const { data: workoutsData, error: workoutsError } = await supabase.from('workout_plans').select('*');
      if (workoutsError) throw workoutsError;
      const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('id, name');
      if (profilesError) throw profilesError;
      const plansWithNames = workoutsData?.map(plan => ({ ...plan, client_name: profilesData?.find(p => p.id === plan.assigned_to)?.name || 'Sin asignar' })) || [];
      setWorkoutPlans(plansWithNames);
    } catch (error) { console.error('Error fetching workout plans:', error); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !formData.title) { toast({ title: "Error", description: "Selecciona un cliente y completa el título.", variant: "destructive" }); return; }
    try {
      let exercisesData = null;
      if (formData.exercises) { try { exercisesData = JSON.parse(formData.exercises); } catch { exercisesData = { description: formData.exercises }; } }
      const workoutData = { title: formData.title, description: formData.description, assigned_to: selectedClient, user_id: selectedClient, difficulty_level: formData.difficulty_level, exercises: exercisesData };
      if (editingWorkout) {
        const { error } = await supabase.from('workout_plans').update(workoutData).eq('id', editingWorkout.id);
        if (error) throw error;
        toast({ title: "Actualizado", description: "Entrenamiento actualizado." });
      } else {
        const { error } = await supabase.from('workout_plans').insert([workoutData]);
        if (error) throw error;
        toast({ title: "Creado", description: "Entrenamiento creado." });
      }
      setFormData({ title: '', description: '', difficulty_level: 'intermediate', exercises: '' });
      setSelectedClient(''); setShowCreateForm(false); setEditingWorkout(null); fetchWorkoutPlans();
    } catch (error) { console.error('Error saving workout:', error); toast({ title: "Error", description: "No se pudo guardar.", variant: "destructive" }); }
  };

  const deleteWorkout = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    try { const { error } = await supabase.from('workout_plans').delete().eq('id', id); if (error) throw error; toast({ title: "Eliminado" }); fetchWorkoutPlans(); }
    catch (error) { toast({ title: "Error", variant: "destructive" }); }
  };

  const editWorkout = (w: WorkoutPlan) => {
    setEditingWorkout(w);
    setFormData({ title: w.title, description: w.description || '', difficulty_level: w.difficulty_level || 'intermediate', exercises: w.exercises ? JSON.stringify(w.exercises, null, 2) : '' });
    setSelectedClient(w.assigned_to); setShowCreateForm(true);
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" onClick={onGoBack} className="mr-4 border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />Volver
            </Button>
            <h1 className="text-3xl font-bold text-[hsl(var(--accent-green))]">Sus Entrenamientos</h1>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
            <Plus className="w-4 h-4 mr-2" />Nuevo Entrenamiento
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Buscar Cliente</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-white/40" />
                <Input placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div key={client.id} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedClient === client.id ? 'bg-[hsl(var(--accent-green))]/20 border border-[hsl(var(--accent-green))]/30' : 'bg-white/5 hover:bg-white/10'}`} onClick={() => setSelectedClient(client.id)}>
                    <p className="font-medium text-white">{client.name}</p>
                    <p className="text-sm text-white/40">{client.email}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {showCreateForm && (
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-white">{editingWorkout ? 'Editar Entrenamiento' : 'Crear Nuevo Entrenamiento'}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Título</label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ej: Rutina de Fuerza" required className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Descripción</label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Dificultad</label>
                    <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Principiante</SelectItem>
                        <SelectItem value="intermediate">Intermedio</SelectItem>
                        <SelectItem value="advanced">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Ejercicios</label>
                    <Textarea value={formData.exercises} onChange={(e) => setFormData({ ...formData, exercises: e.target.value })} rows={6} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono text-sm" />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1 bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white" disabled={!selectedClient}>{editingWorkout ? 'Actualizar' : 'Crear'}</Button>
                    <Button type="button" variant="outline" onClick={() => { setShowCreateForm(false); setEditingWorkout(null); }} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">Cancelar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mt-6 border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader><CardTitle className="text-white">Entrenamientos Creados</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workoutPlans.map((workout) => (
                <div key={workout.id} className="p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white">{workout.title}</h3>
                      <p className="text-white/50 mb-2">Cliente: {workout.client_name}</p>
                      {workout.description && <p className="text-white/60 mb-2">{workout.description}</p>}
                      <p className="text-sm text-white/40">Dificultad: {workout.difficulty_level === 'beginner' ? 'Principiante' : workout.difficulty_level === 'intermediate' ? 'Intermedio' : 'Avanzado'}</p>
                      <p className="text-xs text-white/30 mt-2">Creado: {new Date(workout.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => editWorkout(workout)} className="text-white/40 hover:text-white hover:bg-white/10"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteWorkout(workout.id, workout.title)} className="text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
              {workoutPlans.length === 0 && <div className="text-center py-8 text-white/40">No hay entrenamientos creados todavía.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminWorkoutManager;
