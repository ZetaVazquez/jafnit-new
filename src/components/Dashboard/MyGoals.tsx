import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Target, Plus, CheckCircle } from 'lucide-react';
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

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchGoalsAndProgress = async () => {
      if (!user) return;

      try {
        // Fetch active goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('daily_goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at');

        if (goalsError) {
          console.error('Error fetching goals:', goalsError);
          return;
        }

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

        setGoals((goalsData || []) as DailyGoal[]);
        setTodayProgress(progressData || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalsAndProgress();
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

        setTodayProgress(prev =>
          prev.map(p =>
            p.id === existingProgress.id
              ? { ...p, completed, completed_at: completed ? new Date().toISOString() : null }
              : p
          )
        );
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

        setTodayProgress(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getGoalProgress = (goalId: string) => {
    return todayProgress.find(p => p.goal_id === goalId);
  };

  const getGoalIcon = (goalType: string) => {
    switch (goalType) {
      case 'diet': return '🥗';
      case 'workout': return '💪';
      case 'water': return '💧';
      case 'sleep': return '😴';
      case 'supplements': return '💊';
      default: return '🎯';
    }
  };

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
  const totalGoals = goals.length;
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
          <h1 className="text-3xl font-bold text-nutrition-black">Mis Objetivos</h1>
          <p className="text-nutrition-gray mt-2">Gestiona y sigue tus objetivos diarios</p>
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

        {/* Goals List */}
        <div className="space-y-4 mb-8">
          {goals.map((goal) => {
            const progress = getGoalProgress(goal.id);
            const isCompleted = progress?.completed || false;

            return (
              <Card key={goal.id} className={`transition-all duration-300 ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                <CardContent className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getGoalIcon(goal.goal_type)}</div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${isCompleted ? 'text-green-800 line-through' : 'text-nutrition-black'}`}>
                        {goal.title}
                      </h3>
                      <p className={`text-sm ${isCompleted ? 'text-green-600' : 'text-nutrition-gray'}`}>
                        {goal.description}
                      </p>
                      {goal.target_value && (
                        <p className="text-xs text-nutrition-gray mt-1">
                          Objetivo: {goal.target_value} {goal.target_unit}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={(checked) => handleGoalToggle(goal.id, checked as boolean)}
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Goal Button */}
        <Card className="border-dashed border-2 border-nutrition-green-light">
          <CardContent className="py-8 text-center">
            <Plus className="w-12 h-12 text-nutrition-green mx-auto mb-4" />
            <h3 className="text-lg font-bold text-nutrition-green mb-2">Añadir Nuevo Objetivo</h3>
            <p className="text-nutrition-gray mb-4">Crea objetivos personalizados para tu rutina diaria</p>
            <Button className="bg-nutrition-green hover:bg-nutrition-green-dark text-white">
              Añadir Objetivo
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MyGoals;
