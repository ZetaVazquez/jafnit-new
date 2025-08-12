import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Target, Plus, CheckCircle, PartyPopper } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DailyGoal, DailyProgress } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';

interface MyGoalsProps {
  onGoBack: () => void;
}

const MyGoals: React.FC<MyGoalsProps> = ({ onGoBack }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [todayProgress, setTodayProgress] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Definir objetivos predefinidos
  const defaultHabits = [
    // ALIMENTACIÓN
    { id: 'food_1', category: 'ALIMENTACIÓN', icon: '🍽️', title: '¿Has hecho todas tus comidas del día sin saltarte ninguna?' },
    { id: 'food_2', category: 'ALIMENTACIÓN', icon: '🍽️', title: '¿Comiste con calma, sin distracciones y sin culpa?' },
    { id: 'food_3', category: 'ALIMENTACIÓN', icon: '🍽️', title: '¿Incluiste alimentos reales y balanceados (proteína, verdura, buenos hidratos)?' },
    
    // MOVIMIENTO
    { id: 'movement_1', category: 'MOVIMIENTO', icon: '🚶', title: '¿Has entrenado o te has movido al menos 30-60 min hoy?' },
    { id: 'movement_2', category: 'MOVIMIENTO', icon: '🚶', title: '¿Superaste los pasos diarios marcados?' },
    { id: 'movement_3', category: 'MOVIMIENTO', icon: '🚶', title: '¿Has evitado pasar demasiadas horas seguidas sentado/a?' },
    
    // HIDRATACIÓN
    { id: 'hydration_1', category: 'HIDRATACIÓN', icon: '💧', title: '¿Has bebido al menos 8 vasos de agua?' },
    { id: 'hydration_2', category: 'HIDRATACIÓN', icon: '💧', title: '¿Has empezado el día con un vaso de agua en ayunas?' },
    { id: 'hydration_3', category: 'HIDRATACIÓN', icon: '💧', title: '¿Evitaste refrescos azucarados o bebidas innecesarias?' },
    
    // DESCANSO
    { id: 'rest_1', category: 'DESCANSO', icon: '😴', title: '¿Cenaste con tiempo antes de irte a dormir?' },
    { id: 'rest_2', category: 'DESCANSO', icon: '😴', title: '¿Desconectaste pantallas al menos 30 min antes de dormir?' },
    { id: 'rest_3', category: 'DESCANSO', icon: '😴', title: '¿Te sientes descansado/a al final del día?' }
  ];

  useEffect(() => {
    const fetchTodayProgress = async () => {
      if (!user) return;

      try {
        // Fetch today's progress
        const { data: progressData, error: progressError } = await supabase
          .from('daily_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today);

        if (progressError) {
          console.error('Error fetching progress:', progressError);
          return;
        }

        setTodayProgress(progressData || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayProgress();
  }, [user, today]);

  const handleGoalToggle = async (goalId: string, completed: boolean) => {
    if (!user) return;

    try {
      const existingProgress = todayProgress.find(p => p.goal_id === goalId);

      if (existingProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('daily_progress')
          .update({
            completed,
            completed_at: completed ? new Date().toISOString() : null
          })
          .eq('id', existingProgress.id);

        if (error) {
          console.error('Error updating progress:', error);
          return;
        }

        const updatedProgress = todayProgress.map(p =>
          p.id === existingProgress.id
            ? { ...p, completed, completed_at: completed ? new Date().toISOString() : null }
            : p
        );
        setTodayProgress(updatedProgress);

        // Check if all goals are completed
        if (completed) {
          const completedCount = updatedProgress.filter(p => p.completed).length;
          if (completedCount === defaultHabits.length) {
            setShowCongratulations(true);
          }
        }
      } else {
        // Create new progress entry
        const { data, error } = await supabase
          .from('daily_progress')
          .insert({
            user_id: user.id,
            goal_id: goalId,
            date: today,
            completed,
            completed_at: completed ? new Date().toISOString() : null
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating progress:', error);
          return;
        }

        const updatedProgress = [...todayProgress, data];
        setTodayProgress(updatedProgress);

        // Check if all goals are completed
        if (completed) {
          const completedCount = updatedProgress.filter(p => p.completed).length;
          if (completedCount === defaultHabits.length) {
            setShowCongratulations(true);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getGoalProgress = (goalId: string) => {
    return todayProgress.find(p => p.goal_id === goalId);
  };

  const groupedHabits = defaultHabits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<string, typeof defaultHabits>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green mx-auto"></div>
          <p className="mt-4 text-nutrition-gray">Cargando tus objetivos...</p>
        </div>
      </div>
    );
  }

  const completedToday = todayProgress.filter(p => p.completed).length;
  const totalGoals = defaultHabits.length;
  const completionPercentage = totalGoals > 0 ? Math.round((completedToday / totalGoals) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={onGoBack}
            variant="ghost"
            className="mb-4 text-nutrition-green hover:text-nutrition-green-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-nutrition-black">✅ TU CHECKLIST DIARIA DE HÁBITOS 🔁</h1>
          <p className="text-nutrition-gray mt-2">La clave no es hacerlo perfecto. Es hacerlo constante.</p>
          <p className="text-nutrition-gray">Cada día cuenta. Usa esta lista como guía para mantenerte en tu camino, sin agobios, sin castigos. Solo tú contigo. Y con tu objetivo claro.</p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Progress Summary */}
        <Card className="mb-8 bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white">
          <CardContent className="py-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Progreso de Hoy</h2>
              <div className="text-4xl font-bold mb-2">{completionPercentage}%</div>
              <p className="opacity-90">{completedToday} de {totalGoals} objetivos completados</p>
              <div className="w-full bg-white/20 rounded-full h-3 mt-4">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habits Checklist */}
        <div className="space-y-6 mb-8">
          {Object.entries(groupedHabits).map(([category, habits]) => (
            <Card key={category} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white py-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  {habits[0].icon} {category}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="space-y-3">
                  {habits.map((habit) => {
                    const progress = getGoalProgress(habit.id);
                    const isCompleted = progress?.completed || false;

                    return (
                      <div key={habit.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${isCompleted ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'}`}>
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={(checked) => handleGoalToggle(habit.id, checked as boolean)}
                          className="w-5 h-5"
                        />
                        <p className={`flex-1 ${isCompleted ? 'text-green-800 line-through' : 'text-nutrition-black'}`}>
                          {habit.title}
                        </p>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Motivational Section */}
        <Card className="bg-gradient-to-r from-nutrition-green-light to-nutrition-green-lighter border-none">
          <CardContent className="py-6 text-center">
            <h3 className="text-xl font-bold text-nutrition-black mb-4">🎯 Recuerda:</h3>
            <div className="space-y-2 text-nutrition-gray">
              <p>No se trata de marcar todas las casillas todos los días.</p>
              <p>Se trata de darte cuenta de lo que sí estás haciendo y de lo que necesitas ajustar mañana.</p>
              <p className="font-semibold text-nutrition-green">🔁 Constancia &gt; Perfección.</p>
              <p>📍 Marca lo que cumplas cada noche y saca conclusiones semanales.</p>
            </div>
          </CardContent>
        </Card>

        {/* Final Motivational Message */}
        <div className="text-center mt-8 py-6">
          <p className="text-2xl font-bold text-nutrition-green">PEQUEÑOS CAMBIOS SON GRANDES RESULTADOS</p>
        </div>

      </main>

      {/* Congratulations Modal */}
      <Dialog open={showCongratulations} onOpenChange={setShowCongratulations}>
        <DialogContent className="max-w-md mx-auto text-center">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex justify-center mb-4">
                <PartyPopper className="w-16 h-16 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-nutrition-green">¡Felicidades! 🎉</h2>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg text-nutrition-gray mb-4">
              ¡Has completado todos tus hábitos del día!
            </p>
            <p className="text-nutrition-green font-semibold text-xl">
              ¡Excelente trabajo! 💪
            </p>
            <p className="text-sm text-nutrition-gray mt-4">
              La constancia es la clave del éxito. ¡Sigue así!
            </p>
          </div>
          <Button 
            onClick={() => setShowCongratulations(false)}
            className="bg-nutrition-green hover:bg-nutrition-green-dark text-white w-full"
          >
            ¡Gracias!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyGoals;
