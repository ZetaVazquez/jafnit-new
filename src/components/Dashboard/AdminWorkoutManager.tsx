import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Plus, Edit, Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface DayExercises {
  day: string;
  exercises: string;
}

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  client_name: string;
  difficulty_level: string;
  exercises?: any;
  created_at: string;
}

interface AdminWorkoutManagerProps {
  onGoBack: () => void;
}

type Duration = '1_day' | '1_week' | '15_days' | '1_month';

const DURATION_CONFIG: Record<Duration, { label: string; days: string[] }> = {
  '1_day': { label: '1 Día', days: ['Día 1'] },
  '1_week': { label: '1 Semana', days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] },
  '15_days': { label: '15 Días', days: Array.from({ length: 15 }, (_, i) => `Día ${i + 1}`) },
  '1_month': { label: '1 Mes', days: ['Semana 1 - Lunes', 'Semana 1 - Martes', 'Semana 1 - Miércoles', 'Semana 1 - Jueves', 'Semana 1 - Viernes', 'Semana 1 - Sábado', 'Semana 1 - Domingo', 'Semana 2 - Lunes', 'Semana 2 - Martes', 'Semana 2 - Miércoles', 'Semana 2 - Jueves', 'Semana 2 - Viernes', 'Semana 2 - Sábado', 'Semana 2 - Domingo', 'Semana 3 - Lunes', 'Semana 3 - Martes', 'Semana 3 - Miércoles', 'Semana 3 - Jueves', 'Semana 3 - Viernes', 'Semana 3 - Sábado', 'Semana 3 - Domingo', 'Semana 4 - Lunes', 'Semana 4 - Martes', 'Semana 4 - Miércoles', 'Semana 4 - Jueves', 'Semana 4 - Viernes', 'Semana 4 - Sábado', 'Semana 4 - Domingo'] },
};

const AdminWorkoutManager: React.FC<AdminWorkoutManagerProps> = ({ onGoBack }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [duration, setDuration] = useState<Duration>('1_week');
  const [dayExercises, setDayExercises] = useState<DayExercises[]>([]);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]));

  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
    fetchWorkoutPlans();
  }, []);

  useEffect(() => {
    setFilteredClients(clients.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [searchTerm, clients]);

  // Initialize day exercises when duration changes
  useEffect(() => {
    const days = DURATION_CONFIG[duration].days;
    setDayExercises(prev => {
      const newDays = days.map((day, i) => ({
        day,
        exercises: prev[i]?.exercises || ''
      }));
      return newDays;
    });
    setExpandedDays(new Set([0]));
  }, [duration]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_active_profiles')
        .neq('email', 'josefiguenu@gmail.com')
        .neq('email', 'consultajafn@gmail.com')
        .neq('email', 'zaiidav347@gmail.com');
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchWorkoutPlans = async () => {
    try {
      const { data: workoutsData, error: workoutsError } = await supabase.from('workout_plans').select('*');
      if (workoutsError) throw workoutsError;

      const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('id, name');
      if (profilesError) throw profilesError;

      const plans = workoutsData?.map(plan => ({
        ...plan,
        client_name: profilesData?.find(p => p.id === plan.assigned_to)?.name || 'Sin asignar'
      })) || [];
      setWorkoutPlans(plans);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDifficultyLevel('intermediate');
    setDuration('1_week');
    setDayExercises([]);
    setSelectedClient('');
    setShowCreateForm(false);
    setEditingWorkout(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !title) {
      toast({ title: "Error", description: "Selecciona un cliente y completa el título.", variant: "destructive" });
      return;
    }

    try {
      const exercisesData = {
        duration,
        duration_label: DURATION_CONFIG[duration].label,
        days: dayExercises.filter(d => d.exercises.trim()).map(d => ({
          day: d.day,
          exercises: d.exercises
        }))
      };

      const workoutData = {
        title,
        description,
        assigned_to: selectedClient,
        user_id: selectedClient,
        difficulty_level: difficultyLevel,
        exercises: exercisesData
      };

      if (editingWorkout) {
        const { error } = await supabase.from('workout_plans').update(workoutData).eq('id', editingWorkout.id);
        if (error) throw error;
        toast({ title: "Entrenamiento actualizado", description: "El entrenamiento ha sido actualizado exitosamente." });
      } else {
        const { error } = await supabase.from('workout_plans').insert([workoutData]);
        if (error) throw error;
        toast({ title: "Entrenamiento creado", description: "El entrenamiento ha sido creado exitosamente." });
      }

      resetForm();
      fetchWorkoutPlans();
    } catch (error) {
      console.error('Error saving workout plan:', error);
      toast({ title: "Error", description: "No se pudo guardar el entrenamiento.", variant: "destructive" });
    }
  };

  const deleteWorkout = async (workoutId: string, workoutTitle: string) => {
    if (!confirm(`¿Eliminar "${workoutTitle}"?`)) return;
    try {
      const { error } = await supabase.from('workout_plans').delete().eq('id', workoutId);
      if (error) throw error;
      toast({ title: "Eliminado", description: "El entrenamiento ha sido eliminado." });
      fetchWorkoutPlans();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar.", variant: "destructive" });
    }
  };

  const editWorkout = (workout: WorkoutPlan) => {
    setEditingWorkout(workout);
    setTitle(workout.title);
    setDescription(workout.description || '');
    setDifficultyLevel(workout.difficulty_level || 'intermediate');
    setSelectedClient(workout.assigned_to);
    setShowCreateForm(true);

    // Load existing exercise data
    if (workout.exercises?.duration && workout.exercises?.days) {
      setDuration(workout.exercises.duration);
      const days = DURATION_CONFIG[workout.exercises.duration as Duration]?.days || [];
      setDayExercises(days.map(day => {
        const existing = workout.exercises.days.find((d: any) => d.day === day);
        return { day, exercises: existing?.exercises || '' };
      }));
    } else {
      setDuration('1_week');
      const fallbackText = workout.exercises
        ? (typeof workout.exercises === 'string' ? workout.exercises : JSON.stringify(workout.exercises, null, 2))
        : '';
      setDayExercises(DURATION_CONFIG['1_week'].days.map((day, i) => ({
        day,
        exercises: i === 0 ? fallbackText : ''
      })));
    }
  };

  const toggleDay = (index: number) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const updateDayExercises = (index: number, value: string) => {
    setDayExercises(prev => prev.map((d, i) => i === index ? { ...d, exercises: value } : d));
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return level;
    }
  };

  const selectedClientName = clients.find(c => c.id === selectedClient)?.name;

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onGoBack} variant="ghost" className="text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10 border border-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />Volver
            </Button>
            <h1 className="text-3xl font-bold text-white">
              Planes de <span className="text-[hsl(var(--accent-green-light))] italic">Ejercicio</span>
            </h1>
          </div>
          <Button onClick={() => { resetForm(); setShowCreateForm(true); }} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
            <Plus className="w-4 h-4 mr-2" />Nueva Rutina
          </Button>
        </div>

        {showCreateForm && (
          <div className="mb-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingWorkout ? 'Editar Rutina' : 'Crear Nueva Rutina'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client selector */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Buscar y seleccionar cliente</label>
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-white/40" />
                  <Input
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                {selectedClientName && (
                  <p className="text-sm text-[hsl(var(--accent-green))] mb-2">✓ Seleccionado: {selectedClientName}</p>
                )}
                <div className="max-h-40 overflow-y-auto space-y-1 rounded-lg border border-white/10 p-2">
                  {filteredClients.map(client => (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClient(client.id)}
                      className={`p-2 rounded-lg cursor-pointer transition-colors text-sm ${
                        selectedClient === client.id
                          ? 'bg-[hsl(var(--accent-green))]/20 border border-[hsl(var(--accent-green))]/40 text-white'
                          : 'hover:bg-white/5 text-white/70'
                      }`}
                    >
                      <span className="font-medium">{client.name}</span>
                      <span className="text-white/40 ml-2">{client.email}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Título de la rutina</label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Rutina de Fuerza" className="bg-white/5 border-white/10 text-white placeholder:text-white/30" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Nivel de dificultad</label>
                  <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
                      <SelectItem value="beginner" className="text-white">Principiante</SelectItem>
                      <SelectItem value="intermediate" className="text-white">Intermedio</SelectItem>
                      <SelectItem value="advanced" className="text-white">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Descripción general</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción de la rutina..." rows={2} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>

              {/* Duration selector */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Duración de la rutina
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(Object.entries(DURATION_CONFIG) as [Duration, typeof DURATION_CONFIG[Duration]][]).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDuration(key)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        duration === key
                          ? 'bg-[hsl(var(--accent-green))]/20 border-[hsl(var(--accent-green))]/50 text-[hsl(var(--accent-green))]'
                          : 'border-white/10 text-white/50 hover:bg-white/5'
                      }`}
                    >
                      {config.label}
                      <span className="block text-xs mt-1 opacity-60">{config.days.length} días</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Day-by-day exercises */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">Ejercicios por día</label>
                <div className="space-y-2">
                  {dayExercises.map((dayData, index) => (
                    <div key={index} className="rounded-lg border border-white/10 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`w-full flex items-center justify-between p-3 text-sm font-medium transition-colors ${
                          dayData.exercises.trim()
                            ? 'bg-[hsl(var(--accent-green))]/10 text-[hsl(var(--accent-green))]'
                            : 'bg-white/5 text-white/60'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {dayData.day}
                          {dayData.exercises.trim() && <span className="text-xs opacity-60">✓ tiene ejercicios</span>}
                        </span>
                        {expandedDays.has(index) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {expandedDays.has(index) && (
                        <div className="p-3 bg-white/[0.02]">
                          <Textarea
                            value={dayData.exercises}
                            onChange={e => updateDayExercises(index, e.target.value)}
                            placeholder={`Ejercicios para ${dayData.day}...\nEj:\n- Press de banca: 4x10\n- Sentadillas: 4x12\n- Remo con barra: 3x10\n- Descanso: si es día de descanso dejarlo vacío`}
                            rows={5}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={!selectedClient} className="flex-1 bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
                  {editingWorkout ? 'Actualizar' : 'Crear'} Rutina
                </Button>
                <Button type="button" onClick={resetForm} variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10 border border-white/10">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Workout Plans List */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Rutinas Creadas</h2>
          </div>
          <div className="p-4 space-y-3">
            {workoutPlans.length === 0 ? (
              <p className="text-center py-8 text-white/40">No hay rutinas creadas todavía.</p>
            ) : workoutPlans.map(workout => (
              <div key={workout.id} className="rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">{workout.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        workout.difficulty_level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        workout.difficulty_level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {getDifficultyLabel(workout.difficulty_level)}
                      </span>
                    </div>
                    <p className="text-sm text-white/40 mt-1">
                      Cliente: {workout.client_name} · {workout.exercises?.duration_label || 'Sin duración'} · {new Date(workout.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => editWorkout(workout)} className="text-white/50 hover:text-white hover:bg-white/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteWorkout(workout.id, workout.title)} className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {expandedWorkout === workout.id && workout.exercises?.days && (
                  <div className="border-t border-white/10 p-4 space-y-2">
                    {workout.description && <p className="text-sm text-white/50 mb-3">{workout.description}</p>}
                    {workout.exercises.days.map((day: any, i: number) => (
                      <div key={i} className="rounded-lg bg-white/5 p-3">
                        <h4 className="text-sm font-semibold text-[hsl(var(--accent-green))] mb-1">{day.day}</h4>
                        <pre className="text-sm text-white/60 whitespace-pre-wrap">{day.exercises}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkoutManager;
