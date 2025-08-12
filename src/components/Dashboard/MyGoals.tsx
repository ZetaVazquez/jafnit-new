import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, CheckCircle, PartyPopper } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface MyGoalsProps {
  onGoBack: () => void;
}

const MyGoals: React.FC<MyGoalsProps> = ({ onGoBack }) => {
  const { user } = useAuth();
  const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Definir objetivos predefinidos
  const defaultHabits = [
    // ALIMENTACIÓN
    { id: 'alimentacion_1', category: 'ALIMENTACIÓN', icon: '🍽️', title: '¿Has hecho todas tus comidas del día sin saltarte ninguna?' },
    { id: 'alimentacion_2', category: 'ALIMENTACIÓN', icon: '🍽️', title: '¿Comiste con calma, sin distracciones y sin culpa?' },
    { id: 'alimentacion_3', category: 'ALIMENTACIÓN', icon: '🍽️', title: '¿Incluiste alimentos reales y balanceados (proteína, verdura, buenos hidratos)?' },
    
    // MOVIMIENTO
    { id: 'movimiento_1', category: 'MOVIMIENTO', icon: '🚶', title: '¿Has entrenado o te has movido al menos 30-60 min hoy?' },
    { id: 'movimiento_2', category: 'MOVIMIENTO', icon: '🚶', title: '¿Superaste los pasos diarios marcados?' },
    { id: 'movimiento_3', category: 'MOVIMIENTO', icon: '🚶', title: '¿Has evitado pasar demasiadas horas seguidas sentado/a?' },
    
    // HIDRATACIÓN
    { id: 'hidratacion_1', category: 'HIDRATACIÓN', icon: '💧', title: '¿Has bebido al menos 8 vasos de agua?' },
    { id: 'hidratacion_2', category: 'HIDRATACIÓN', icon: '💧', title: '¿Has empezado el día con un vaso de agua en ayunas?' },
    { id: 'hidratacion_3', category: 'HIDRATACIÓN', icon: '💧', title: '¿Evitaste refrescos azucarados o bebidas innecesarias?' },
    
    // DESCANSO
    { id: 'descanso_1', category: 'DESCANSO', icon: '😴', title: '¿Cenaste con tiempo antes de irte a dormir?' },
    { id: 'descanso_2', category: 'DESCANSO', icon: '😴', title: '¿Desconectaste pantallas al menos 30 min antes de dormir?' },
    { id: 'descanso_3', category: 'DESCANSO', icon: '😴', title: '¿Te sientes descansado/a al final del día?' }
  ];

  useEffect(() => {
    const fetchTodayProgress = async () => {
      if (!user) return;

      try {
        // Obtener logs de hábitos completados del día
        const { data: progressData, error: progressError } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .eq('activity_type', 'habit_completed')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lt('created_at', `${today}T23:59:59.999Z`);

        if (progressError) {
          console.error('Error fetching progress:', progressError);
          return;
        }

        // Extraer los IDs de hábitos completados
        const completedIds = (progressData || [])
          .map(log => {
            if (typeof log.metadata === 'object' && log.metadata && 'habit_id' in log.metadata) {
              return log.metadata.habit_id as string;
            }
            return null;
          })
          .filter((id): id is string => id !== null);

        setCompletedHabits(new Set(completedIds));
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
      if (completed) {
        if (!completedHabits.has(goalId)) {
          // Crear nuevo log de actividad para el hábito completado
          const { error } = await supabase
            .from('activity_logs')
            .insert({
              user_id: user.id,
              activity_type: 'habit_completed',
              description: `Hábito completado: ${defaultHabits.find(h => h.id === goalId)?.title}`,
              metadata: { habit_id: goalId }
            });

          if (error) {
            console.error('Error creating progress:', error);
            return;
          }

          const newCompletedHabits = new Set(completedHabits).add(goalId);
          setCompletedHabits(newCompletedHabits);

          // Check if all goals are completed
          if (newCompletedHabits.size === defaultHabits.length) {
            setShowCongratulations(true);
          }
        }
      } else {
        if (completedHabits.has(goalId)) {
          // Eliminar el log de actividad más reciente para este hábito
          const { error } = await supabase
            .from('activity_logs')
            .delete()
            .eq('user_id', user.id)
            .eq('activity_type', 'habit_completed')
            .contains('metadata', { habit_id: goalId })
            .gte('created_at', `${today}T00:00:00.000Z`)
            .lt('created_at', `${today}T23:59:59.999Z`);

          if (error) {
            console.error('Error removing progress:', error);
            return;
          }

          const newCompletedHabits = new Set(completedHabits);
          newCompletedHabits.delete(goalId);
          setCompletedHabits(newCompletedHabits);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isHabitCompleted = (goalId: string) => {
    return completedHabits.has(goalId);
  };

  const groupedHabits: Record<string, Array<{ id: string; category: string; icon: string; title: string }>> = {};
  defaultHabits.forEach(habit => {
    if (!groupedHabits[habit.category]) {
      groupedHabits[habit.category] = [];
    }
    groupedHabits[habit.category].push(habit);
  });

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

  const completedToday = completedHabits.size;
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
          <p className="text-sm text-nutrition-green font-semibold mt-2">NOTA: Solo marcar las casillas si la respuesta es SÍ</p>
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
                    const isCompleted = isHabitCompleted(habit.id);

                    return (
                      <div key={habit.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${isCompleted ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'}`}>
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={(checked) => handleGoalToggle(habit.id, checked as boolean)}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <p className={`${isCompleted ? 'text-green-800 line-through' : 'text-nutrition-black'}`}>
                            ☐ {habit.title}
                          </p>
                          <p className="text-xs text-nutrition-gray mt-1">
                            (Marca solo si la respuesta es SÍ)
                          </p>
                        </div>
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
