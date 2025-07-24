
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Dumbbell, Clock, Target, PlayCircle } from 'lucide-react';
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
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

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

    if (selectedPlan) {
      return (
        <DynamicBackground className="min-h-screen">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm shadow-md">
            <div className="container mx-auto px-4 py-4">
              <Button
                onClick={() => setSelectedPlan(null)}
                variant="ghost"
                className="mb-4 text-nutrition-green hover:text-nutrition-green-dark"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Entrenamientos
              </Button>
              <h1 className="text-3xl font-bold text-nutrition-black">{selectedPlan.title}</h1>
              <p className="text-nutrition-gray mt-2">{selectedPlan.description}</p>
            </div>
          </header>

          {/* Content */}
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Plan Info */}
              <Card className="mb-6 bg-white/90 backdrop-blur-sm">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getDifficultyColor(selectedPlan.difficulty_level)}>
                      {getDifficultyText(selectedPlan.difficulty_level)}
                    </Badge>
                    <Button className="bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Comenzar Entrenamiento
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Exercises */}
              {selectedPlan.exercises && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-nutrition-black mb-4">Ejercicios</h2>
                  {Array.isArray(selectedPlan.exercises) ? (
                    selectedPlan.exercises.map((exercise: any, index: number) => (
                      <Card key={index} className="bg-white/90 backdrop-blur-sm">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-nutrition-black">{exercise.name || `Ejercicio ${index + 1}`}</h3>
                              <p className="text-nutrition-gray">{exercise.description || 'Sin descripción'}</p>
                              {exercise.sets && (
                                <p className="text-sm text-nutrition-gray mt-1">
                                  {exercise.sets} series × {exercise.reps || 'X'} repeticiones
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {exercise.duration && (
                                <div className="flex items-center text-nutrition-gray">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>{exercise.duration}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-white/90 backdrop-blur-sm">
                      <CardContent className="py-6 text-center">
                        <p className="text-nutrition-gray">No hay ejercicios específicos definidos para este plan.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </main>
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
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm"
                  onClick={() => setSelectedPlan(plan)}
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-nutrition-gray">
                        <Target className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {plan.exercises && Array.isArray(plan.exercises) 
                            ? `${plan.exercises.length} ejercicios` 
                            : 'Plan personalizado'
                          }
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-nutrition-green hover:bg-nutrition-green-dark text-white"
                      >
                        Ver Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
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
