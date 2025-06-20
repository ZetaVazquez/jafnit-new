
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Calendar, BarChart3, Scale } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DailyProgress, DailyGoal, BodyMeasurement } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import BodyMeasurements from './BodyMeasurements';

interface MyProgressProps {
  onGoBack: () => void;
}

const MyProgress: React.FC<MyProgressProps> = ({ onGoBack }) => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<any[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user) return;

      try {
        // Fetch last 30 days of progress
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: progressData, error: progressError } = await supabase
          .from('daily_progress')
          .select(`
            *,
            daily_goals (*)
          `)
          .eq('user_id', user.id)
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (progressError) {
          console.error('Error fetching progress:', progressError);
          return;
        }

        // Fetch goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('daily_goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (goalsError) {
          console.error('Error fetching goals:', goalsError);
          return;
        }

        // Fetch body measurements
        const { data: measurementsData, error: measurementsError } = await supabase
          .from('body_measurements')
          .select('*')
          .eq('user_id', user.id)
          .order('measured_at', { ascending: true });

        if (measurementsError) {
          console.error('Error fetching measurements:', measurementsError);
          return;
        }

        // Process progress data for charts
        const chartData = processProgressData(progressData || [], (goalsData || []) as DailyGoal[]);
        
        setProgressData(chartData);
        setGoals((goalsData || []) as DailyGoal[]);
        setBodyMeasurements(measurementsData || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user]);

  const processProgressData = (progress: any[], goals: DailyGoal[]) => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayProgress = progress.filter(p => p.date === dateStr);
      const completedGoals = dayProgress.filter(p => p.completed).length;
      const totalGoals = goals.length;
      const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
      
      last30Days.push({
        date: dateStr,
        displayDate: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        completedGoals,
        totalGoals,
        completionRate,
        diet: dayProgress.find(p => p.daily_goals?.goal_type === 'diet')?.completed ? 1 : 0,
        workout: dayProgress.find(p => p.daily_goals?.goal_type === 'workout')?.completed ? 1 : 0,
        water: dayProgress.find(p => p.daily_goals?.goal_type === 'water')?.completed ? 1 : 0,
        sleep: dayProgress.find(p => p.daily_goals?.goal_type === 'sleep')?.completed ? 1 : 0,
      });
    }
    
    return last30Days;
  };

  const chartConfig = {
    completionRate: {
      label: "Tasa de Cumplimiento (%)",
      color: "#10b981",
    },
    diet: {
      label: "Dieta",
      color: "#3b82f6",
    },
    workout: {
      label: "Ejercicio",
      color: "#f59e0b",
    },
    water: {
      label: "Hidratación",
      color: "#06b6d4",
    },
    sleep: {
      label: "Descanso",
      color: "#8b5cf6",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green mx-auto"></div>
          <p className="mt-4 text-nutrition-gray">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  const latestMeasurement = bodyMeasurements[bodyMeasurements.length - 1];
  const currentStreak = calculateCurrentStreak();

  function calculateCurrentStreak() {
    let streak = 0;
    const sortedData = [...progressData].reverse();
    
    for (const day of sortedData) {
      if (day.completionRate >= 80) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  if (showMeasurements) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <Button
              onClick={() => setShowMeasurements(false)}
              variant="ghost"
              className="mb-4 text-nutrition-green hover:text-nutrition-green-dark"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Progreso
            </Button>
            <h1 className="text-3xl font-bold text-nutrition-black">Mediciones Corporales</h1>
            <p className="text-nutrition-gray mt-2">Gestiona tus mediciones y progreso físico</p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <BodyMeasurements onClose={() => setShowMeasurements(false)} />
        </main>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-nutrition-black">Mi Progreso</h1>
          <p className="text-nutrition-gray mt-2">Visualiza tu evolución y logros</p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="py-6 text-center">
              <TrendingUp className="w-8 h-8 text-nutrition-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-nutrition-black">{currentStreak}</div>
              <div className="text-sm text-nutrition-gray">Días consecutivos</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6 text-center">
              <BarChart3 className="w-8 h-8 text-nutrition-green-emerald mx-auto mb-2" />
              <div className="text-2xl font-bold text-nutrition-black">
                {progressData.length > 0 ? Math.round(progressData.reduce((acc, day) => acc + day.completionRate, 0) / progressData.length) : 0}%
              </div>
              <div className="text-sm text-nutrition-gray">Promedio mensual</div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setShowMeasurements(true)}
          >
            <CardContent className="py-6 text-center">
              <Scale className="w-8 h-8 text-nutrition-green-sage mx-auto mb-2" />
              <div className="text-2xl font-bold text-nutrition-black">
                {latestMeasurement?.weight || '--'}
              </div>
              <div className="text-sm text-nutrition-gray">Peso actual (kg)</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6 text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-nutrition-black">
                {bodyMeasurements.length}
              </div>
              <div className="text-sm text-nutrition-gray">Mediciones registradas</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Button 
            onClick={() => setShowMeasurements(true)}
            className="bg-nutrition-green hover:bg-nutrition-green-dark"
          >
            <Scale className="w-4 h-4 mr-2" />
            Gestionar Mediciones
          </Button>
        </div>

        {/* Progress Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Evolución de Cumplimiento (Últimos 30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="completionRate" 
                    stroke="var(--color-completionRate)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-completionRate)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Goals Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Desglose por Objetivos (Últimos 7 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis domain={[0, 1]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="diet" fill="var(--color-diet)" />
                  <Bar dataKey="workout" fill="var(--color-workout)" />
                  <Bar dataKey="water" fill="var(--color-water)" />
                  <Bar dataKey="sleep" fill="var(--color-sleep)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MyProgress;
