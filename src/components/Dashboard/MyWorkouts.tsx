
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Dumbbell, Clock, Target, Download, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { WorkoutPlan } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionGuard from '@/components/SubscriptionGuard';
import DynamicBackground from '@/components/Layout/DynamicBackground';

interface MyWorkoutsProps {
  onGoBack: () => void;
}

const MyWorkouts: React.FC<MyWorkoutsProps> = ({ onGoBack }) => {
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching workout plans:', error);
          return;
        }

        setWorkoutPlans((data || []) as WorkoutPlan[]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlans();
  }, [user]);

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (level?: string) => {
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return 'Sin especificar';
    }
  };

  const formatWorkoutPlan = (exercises: any): string => {
    if (!exercises) return 'No hay ejercicios especificados';

    if (typeof exercises === 'string') return exercises;

    if (Array.isArray(exercises)) {
      return exercises
        .map((exercise: any, index: number) => {
          if (typeof exercise === 'string') return `• ${exercise}`;
          const lines: string[] = [];
          lines.push(`${index + 1}. ${exercise.name || 'Ejercicio sin nombre'}`);
          if (exercise.description) lines.push(`   Descripción: ${exercise.description}`);
          if (exercise.sets) lines.push(`   Series: ${exercise.sets}`);
          if (exercise.reps) lines.push(`   Repeticiones: ${exercise.reps}`);
          if (exercise.duration) lines.push(`   Duración: ${exercise.duration}`);
          if (exercise.weight) lines.push(`   Peso: ${exercise.weight}`);
          if (exercise.rest) lines.push(`   Descanso: ${exercise.rest}`);
          return lines.join('\n');
        })
        .join('\n');
    }

    if (typeof exercises === 'object') {
      // Formateo genérico tipo "Mis dietas": sin llaves/corchetes/quotes, con indentación legible
      return JSON.stringify(exercises, null, 2)
        .replace(/[{}\[\]",]/g, '')
        .replace(/:/g, ': ')
        .replace(/^\s*$/gm, '')
        .trim();
    }

    return String(exercises);
  };

  const downloadWorkoutPlan = (workout: WorkoutPlan) => {
    const content = `PLAN DE ENTRENAMIENTO: ${workout.title}

DESCRIPCIÓN:
${workout.description || 'Sin descripción'}

NIVEL DE DIFICULTAD: ${getDifficultyText(workout.difficulty_level)}

EJERCICIOS:
${formatWorkoutPlan(workout.exercises)}

Fecha de creación: ${new Date(workout.created_at).toLocaleDateString('es-ES')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan_entrenamiento_${workout.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewPlan = (workout: WorkoutPlan) => {
    setSelectedWorkout(workout);
    setIsDialogOpen(true);
  };

  const WorkoutsContent = () => {
    if (loading) {
      return (
        <DynamicBackground className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green mx-auto"></div>
            <p className="mt-4 text-nutrition-gray">Cargando tus entrenamientos...</p>
          </div>
        </DynamicBackground>
      );
    }

    return (
      <DynamicBackground className="min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-md">
          <div className="container mx-auto px-4 py-4">
            <Button
              onClick={onGoBack}
              variant="ghost"
              className="mb-4 text-nutrition-green hover:text-nutrition-green-dark"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-nutrition-black">Mis Entrenamientos</h1>
            <p className="text-nutrition-gray mt-2">Descubre y sigue tus planes de entrenamiento personalizados</p>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-8">
          {workoutPlans.length === 0 ? (
            <Card className="text-center py-12 bg-white/90 backdrop-blur-sm">
              <CardContent>
                <Dumbbell className="w-24 h-24 text-nutrition-green mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-nutrition-black mb-4">
                  No tienes planes de entrenamiento
                </h2>
                <p className="text-nutrition-gray mb-6 max-w-md mx-auto">
                  Aún no tienes ningún plan de entrenamiento asignado. Contacta con tu entrenador para obtener tu rutina personalizada.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workoutPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-nutrition-black">{plan.title}</CardTitle>
                      <Badge className={getDifficultyColor(plan.difficulty_level)}>
                        {getDifficultyText(plan.difficulty_level)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-nutrition-gray mb-4">{plan.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-nutrition-gray">
                        <Target className="w-4 h-4 mr-1" />
                        <span className="text-sm">Plan personalizado</span>
                      </div>
                      <div className="flex items-center text-nutrition-gray">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {new Date(plan.created_at).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-nutrition-green hover:bg-nutrition-green-dark text-white flex-1"
                        onClick={() => handleViewPlan(plan)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Plan Completo
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadWorkoutPlan(plan)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* Modal para ver plan completo */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Plan de Entrenamiento Completo</DialogTitle>
            </DialogHeader>
            {selectedWorkout && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-nutrition-black mb-2">{selectedWorkout.title}</h2>
                  {selectedWorkout.description && (
                    <p className="text-nutrition-gray mb-4">{selectedWorkout.description}</p>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={getDifficultyColor(selectedWorkout.difficulty_level)}>
                      {getDifficultyText(selectedWorkout.difficulty_level)}
                    </Badge>
                    <span className="text-sm text-nutrition-gray">
                      Creado el {new Date(selectedWorkout.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-nutrition-black mb-3">Plan de Ejercicios:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {formatWorkoutPlan(selectedWorkout.exercises)}
                    </pre>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => downloadWorkoutPlan(selectedWorkout)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Plan
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DynamicBackground>
    );
  };

  // Envolver el contenido con SubscriptionGuard
  return (
    <SubscriptionGuard>
      <WorkoutsContent />
    </SubscriptionGuard>
  );
};

export default MyWorkouts;
