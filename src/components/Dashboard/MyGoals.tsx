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

  const defaultHabits = [
    { id: 'alimentacion_1', category: 'ALIMENTACIÓN', icon: '🍽️', title: '¿Has hecho todas tus comidas del día sin saltarte ninguna?' },
    { id: 'alimentacion_2', category: 'ALIMENTACIÓN', icon: '🍽️', title: '¿Comiste con calma, sin distracciones y sin culpa?' },
    { id: 'alimentacion_3', category: 'ALIMENTACIÓN', icon: '🍽️', title: '¿Incluiste alimentos reales y balanceados (proteína, verdura, buenos hidratos)?' },
    { id: 'movimiento_1', category: 'MOVIMIENTO', icon: '🚶', title: '¿Has entrenado o te has movido al menos 30-60 min hoy?' },
    { id: 'movimiento_2', category: 'MOVIMIENTO', icon: '🚶', title: '¿Superaste los pasos diarios marcados?' },
    { id: 'movimiento_3', category: 'MOVIMIENTO', icon: '🚶', title: '¿Has evitado pasar demasiadas horas seguidas sentado/a?' },
    { id: 'hidratacion_1', category: 'HIDRATACIÓN', icon: '💧', title: '¿Has bebido al menos 8 vasos de agua?' },
    { id: 'hidratacion_2', category: 'HIDRATACIÓN', icon: '💧', title: '¿Has empezado el día con un vaso de agua en ayunas?' },
    { id: 'hidratacion_3', category: 'HIDRATACIÓN', icon: '💧', title: '¿Evitaste refrescos azucarados o bebidas innecesarias?' },
    { id: 'descanso_1', category: 'DESCANSO', icon: '😴', title: '¿Cenaste con tiempo antes de irte a dormir?' },
    { id: 'descanso_2', category: 'DESCANSO', icon: '😴', title: '¿Desconectaste pantallas al menos 30 min antes de dormir?' },
    { id: 'descanso_3', category: 'DESCANSO', icon: '😴', title: '¿Te sientes descansado/a al final del día?' }
  ];

  useEffect(() => {
    const fetchTodayProgress = async () => {
      if (!user) return;
      try {
        const { data: progressData, error: progressError } = await supabase
          .from('activity_logs').select('*').eq('user_id', user.id).eq('activity_type', 'habit_completed')
          .gte('created_at', `${today}T00:00:00.000Z`).lt('created_at', `${today}T23:59:59.999Z`);
        if (progressError) { console.error('Error fetching progress:', progressError); return; }
        const completedIds = (progressData || []).map(log => {
          if (typeof log.metadata === 'object' && log.metadata && 'habit_id' in log.metadata) return log.metadata.habit_id as string;
          return null;
        }).filter((id): id is string => id !== null);
        setCompletedHabits(new Set(completedIds));
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchTodayProgress();
  }, [user, today]);

  const handleGoalToggle = async (goalId: string, completed: boolean) => {
    if (!user) return;
    try {
      if (completed) {
        if (!completedHabits.has(goalId)) {
          const { error } = await supabase.from('activity_logs').insert({
            user_id: user.id, activity_type: 'habit_completed',
            description: `Hábito completado: ${defaultHabits.find(h => h.id === goalId)?.title}`,
            metadata: { habit_id: goalId }
          });
          if (error) { console.error('Error creating progress:', error); return; }
          const newCompletedHabits = new Set(completedHabits).add(goalId);
          setCompletedHabits(newCompletedHabits);
          if (newCompletedHabits.size === defaultHabits.length) setShowCongratulations(true);
        }
      } else {
        if (completedHabits.has(goalId)) {
          const { error } = await supabase.from('activity_logs').delete()
            .eq('user_id', user.id).eq('activity_type', 'habit_completed')
            .contains('metadata', { habit_id: goalId })
            .gte('created_at', `${today}T00:00:00.000Z`).lt('created_at', `${today}T23:59:59.999Z`);
          if (error) { console.error('Error removing progress:', error); return; }
          const newCompletedHabits = new Set(completedHabits);
          newCompletedHabits.delete(goalId);
          setCompletedHabits(newCompletedHabits);
        }
      }
    } catch (error) { console.error('Error:', error); }
  };

  const isHabitCompleted = (goalId: string) => completedHabits.has(goalId);

  const groupedHabits: Record<string, Array<{ id: string; category: string; icon: string; title: string }>> = {};
  defaultHabits.forEach(habit => {
    if (!groupedHabits[habit.category]) groupedHabits[habit.category] = [];
    groupedHabits[habit.category].push(habit);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(220,20%,8%)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[hsl(var(--accent-green))] mx-auto"></div>
          <p className="mt-4 text-white/50">Cargando tus objetivos...</p>
        </div>
      </div>
    );
  }

  const completedToday = completedHabits.size;
  const totalGoals = defaultHabits.length;
  const completionPercentage = totalGoals > 0 ? Math.round((completedToday / totalGoals) * 100) : 0;

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={onGoBack} variant="ghost" className="mb-4 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">✅ TU CHECKLIST DIARIA DE HÁBITOS 🔁</h1>
          <p className="text-white/50 mt-2">La clave no es hacerlo perfecto. Es hacerlo constante.</p>
          <p className="text-white/40">Cada día cuenta. Usa esta lista como guía para mantenerte en tu camino, sin agobios, sin castigos.</p>
          <p className="text-sm text-[hsl(var(--accent-green))] font-semibold mt-2">NOTA: Solo marcar las casillas si la respuesta es SÍ</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Summary */}
        <Card className="mb-8 border-[hsl(var(--accent-green))]/30 bg-gradient-to-r from-[hsl(var(--accent-green))]/20 to-[hsl(var(--accent-green))]/5 backdrop-blur-sm">
          <CardContent className="py-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">Progreso de Hoy</h2>
              <div className="text-4xl font-bold mb-2 text-[hsl(var(--accent-green))]">{completionPercentage}%</div>
              <p className="text-white/60">{completedToday} de {totalGoals} objetivos completados</p>
              <div className="w-full bg-white/10 rounded-full h-3 mt-4">
                <div className="bg-[hsl(var(--accent-green))] h-3 rounded-full transition-all duration-300" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habits Checklist */}
        <div className="space-y-6 mb-8">
          {Object.entries(groupedHabits).map(([category, habits]) => (
            <Card key={category} className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader className="bg-[hsl(var(--accent-green))]/15 border-b border-white/10 py-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                  {habits[0].icon} {category}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="space-y-3">
                  {habits.map((habit) => {
                    const isCompleted = isHabitCompleted(habit.id);
                    return (
                      <div key={habit.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${isCompleted ? 'bg-[hsl(var(--accent-green))]/10 border border-[hsl(var(--accent-green))]/30' : 'hover:bg-white/5 border border-transparent'}`}>
                        <Checkbox checked={isCompleted} onCheckedChange={(checked) => handleGoalToggle(habit.id, checked as boolean)} className="w-5 h-5 border-white/30 data-[state=checked]:bg-[hsl(var(--accent-green))] data-[state=checked]:border-[hsl(var(--accent-green))]" />
                        <div className="flex-1">
                          <p className={`${isCompleted ? 'text-[hsl(var(--accent-green))] line-through' : 'text-white/80'}`}>{habit.title}</p>
                          <p className="text-xs text-white/30 mt-1">(Marca solo si la respuesta es SÍ)</p>
                        </div>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-[hsl(var(--accent-green))]" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Motivational Section */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="py-6 text-center">
            <h3 className="text-xl font-bold text-white mb-4">🎯 Recuerda:</h3>
            <div className="space-y-2 text-white/50">
              <p>No se trata de marcar todas las casillas todos los días.</p>
              <p>Se trata de darte cuenta de lo que sí estás haciendo y de lo que necesitas ajustar mañana.</p>
              <p className="font-semibold text-[hsl(var(--accent-green))]">🔁 Constancia &gt; Perfección.</p>
              <p>📍 Marca lo que cumplas cada noche y saca conclusiones semanales.</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 py-6">
          <p className="text-2xl font-bold text-[hsl(var(--accent-green))]">PEQUEÑOS CAMBIOS SON GRANDES RESULTADOS</p>
        </div>
      </main>

      {/* Congratulations Modal */}
      <Dialog open={showCongratulations} onOpenChange={setShowCongratulations}>
        <DialogContent className="max-w-md mx-auto text-center bg-[hsl(220,20%,12%)] border-[hsl(var(--accent-green))]/30">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex justify-center mb-4"><PartyPopper className="w-16 h-16 text-yellow-400" /></div>
              <h2 className="text-2xl font-bold text-[hsl(var(--accent-green))]">¡Felicidades! 🎉</h2>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg text-white/60 mb-4">¡Has completado todos tus hábitos del día!</p>
            <p className="text-[hsl(var(--accent-green))] font-semibold text-xl">¡Excelente trabajo! 💪</p>
            <p className="text-sm text-white/40 mt-4">La constancia es la clave del éxito. ¡Sigue así!</p>
          </div>
          <Button onClick={() => setShowCongratulations(false)} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white w-full">¡Gracias!</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyGoals;
