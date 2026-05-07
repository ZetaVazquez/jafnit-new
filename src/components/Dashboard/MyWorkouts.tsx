import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Dumbbell, Clock, Target, Download, Eye, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { WorkoutPlan } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionGuard from '@/components/SubscriptionGuard';

interface MyWorkoutsProps {
  onGoBack: () => void;
}

const MyWorkouts: React.FC<MyWorkoutsProps> = ({ onGoBack }) => {
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase.from('workout_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (error) { console.error('Error fetching workout plans:', error); return; }
        setWorkoutPlans((data || []) as WorkoutPlan[]);
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchWorkoutPlans();
  }, [user]);

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'beginner': return 'bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] border-[hsl(var(--accent-green))]/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-white/10 text-white/50 border-white/20';
    }
  };

  const getDifficultyText = (level?: string) => {
    switch (level) { case 'beginner': return 'Principiante'; case 'intermediate': return 'Intermedio'; case 'advanced': return 'Avanzado'; default: return 'Sin especificar'; }
  };

  const hasStructuredDays = (exercises: any): boolean => {
    return exercises?.duration && exercises?.days && Array.isArray(exercises.days);
  };

  const formatLegacyExercises = (exercises: any): string => {
    if (!exercises) return 'No hay ejercicios especificados';
    if (typeof exercises === 'string') return exercises;
    if (exercises.description) return exercises.description;
    if (typeof exercises === 'object') return JSON.stringify(exercises, null, 2).replace(/[{}\[\]",]/g, '').replace(/:/g, ': ').trim();
    return String(exercises);
  };

  const toggleDay = (index: number) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const openWorkout = (plan: WorkoutPlan) => {
    setSelectedWorkout(plan);
    setExpandedDays(new Set([0]));
    setIsDialogOpen(true);
  };

  const downloadWorkoutPlan = (workout: WorkoutPlan) => {
    let content = `PLAN DE ENTRENAMIENTO: ${workout.title}\n\nDESCRIPCIÓN:\n${workout.description || 'Sin descripción'}\n\nNIVEL: ${getDifficultyText(workout.difficulty_level)}\n`;

    if (hasStructuredDays(workout.exercises)) {
      content += `\nDURACIÓN: ${workout.exercises.duration_label}\n`;
      workout.exercises.days.forEach((day: any) => {
        content += `\n${'='.repeat(40)}\n${day.day}\n${'='.repeat(40)}\n${day.exercises}\n`;
      });
    } else {
      content += `\nEJERCICIOS:\n${formatLegacyExercises(workout.exercises)}\n`;
    }

    content += `\nFecha: ${new Date(workout.created_at).toLocaleDateString('es-ES')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rutina_${workout.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const WorkoutsContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-[hsl(220,20%,8%)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[hsl(var(--accent-green))] mx-auto"></div>
            <p className="mt-4 text-white/50">Cargando tus entrenamientos...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[hsl(220,20%,8%)]">
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <Button onClick={onGoBack} variant="ghost" className="mb-4 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10">
              <ArrowLeft className="w-4 h-4 mr-2" />Volver al Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-white">Mis Entrenamientos</h1>
            <p className="text-white/50 mt-2">Descubre y sigue tus planes de entrenamiento personalizados</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {workoutPlans.length === 0 ? (
            <Card className="text-center py-12 border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent>
                <Dumbbell className="w-24 h-24 text-[hsl(var(--accent-green))] mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">No tienes planes de entrenamiento</h2>
                <p className="text-white/50 mb-6 max-w-md mx-auto">Aún no tienes ningún plan asignado. Contacta con tu entrenador para obtener tu rutina personalizada.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workoutPlans.map((plan) => (
                <Card key={plan.id} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{plan.title}</CardTitle>
                      <Badge className={`${getDifficultyColor(plan.difficulty_level)} border`}>{getDifficultyText(plan.difficulty_level)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {plan.description && <p className="text-white/50 mb-4">{plan.description}</p>}
                    <div className="flex items-center justify-between mb-4">
                      {hasStructuredDays(plan.exercises) ? (
                        <div className="flex items-center text-white/40">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-sm">{plan.exercises.duration_label} · {plan.exercises.days.length} días</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-white/40"><Target className="w-4 h-4 mr-1" /><span className="text-sm">Plan personalizado</span></div>
                      )}
                      <div className="flex items-center text-white/40"><Clock className="w-4 h-4 mr-1" /><span className="text-sm">{new Date(plan.created_at).toLocaleDateString('es-ES')}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white flex-1" onClick={() => openWorkout(plan)}>
                        <Eye className="w-4 h-4 mr-2" />Ver Plan
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => downloadWorkoutPlan(plan)} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* Workout Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-[hsl(220,20%,12%)] border-white/10">
            <DialogHeader><DialogTitle className="text-white text-2xl">Plan de Entrenamiento</DialogTitle></DialogHeader>
            {selectedWorkout && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{selectedWorkout.title}</h2>
                  {selectedWorkout.description && <p className="text-white/60 mb-4">{selectedWorkout.description}</p>}
                  <div className="flex items-center gap-4">
                    <Badge className={`${getDifficultyColor(selectedWorkout.difficulty_level)} border`}>{getDifficultyText(selectedWorkout.difficulty_level)}</Badge>
                    {hasStructuredDays(selectedWorkout.exercises) && (
                      <span className="text-sm text-white/40 flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {selectedWorkout.exercises.duration_label}
                      </span>
                    )}
                    <span className="text-sm text-white/40">{new Date(selectedWorkout.created_at).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>

                {/* Structured days view */}
                {hasStructuredDays(selectedWorkout.exercises) ? (
                  <div className="space-y-2">
                    {selectedWorkout.exercises.days.map((day: any, index: number) => (
                      <div key={index} className="rounded-lg border border-white/10 overflow-hidden">
                        <button
                          onClick={() => toggleDay(index)}
                          className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="font-semibold text-[hsl(var(--accent-green))]">{day.day}</span>
                          {expandedDays.has(index) ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                        </button>
                        {expandedDays.has(index) && (
                          <div className="p-4 bg-white/[0.02]">
                            {Array.isArray(day.items) && day.items.length > 0 ? (
                              <div className="space-y-3">
                                {day.items.map((it: any, i: number) => (
                                  <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3 flex gap-3">
                                    {it.video_url ? (
                                      <video src={it.video_url} controls className="w-32 h-32 object-cover rounded" poster={it.thumbnail_url || undefined} />
                                    ) : it.thumbnail_url ? (
                                      <img src={it.thumbnail_url} alt={it.name} className="w-32 h-32 object-cover rounded" />
                                    ) : (
                                      <div className="w-32 h-32 bg-white/5 rounded flex items-center justify-center text-white/30">Sin media</div>
                                    )}
                                    <div className="flex-1">
                                      <div className="text-white font-semibold">{it.name}</div>
                                      <div className="text-xs text-white/40 capitalize mb-2">{it.muscle_group}</div>
                                      <div className="text-sm text-white/70">{it.sets} series × {it.reps} reps · {it.rest_seconds}s descanso</div>
                                      {it.notes && <div className="text-xs text-white/50 mt-1 italic">{it.notes}</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <pre className="whitespace-pre-wrap text-sm text-white/70 leading-relaxed">{day.exercises}</pre>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Ejercicios:</h3>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <pre className="whitespace-pre-wrap text-sm text-white/70">{formatLegacyExercises(selectedWorkout.exercises)}</pre>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <Button variant="outline" onClick={() => downloadWorkoutPlan(selectedWorkout)} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />Descargar
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">Cerrar</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return <SubscriptionGuard><WorkoutsContent /></SubscriptionGuard>;
};

export default MyWorkouts;
