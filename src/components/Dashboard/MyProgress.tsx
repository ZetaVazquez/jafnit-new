
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
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { data: activityData, error: activityError } = await supabase
          .from('activity_logs').select('*').eq('user_id', user.id).eq('activity_type', 'habit_completed')
          .gte('created_at', thirtyDaysAgo.toISOString()).order('created_at', { ascending: true });
        if (activityError) { console.error('Error fetching activity data:', activityError); return; }
        const totalHabits = 12;
        const { data: measurementsData, error: measurementsError } = await supabase
          .from('body_measurements').select('*').eq('user_id', user.id).order('measured_at', { ascending: true });
        if (measurementsError) { console.error('Error fetching measurements:', measurementsError); return; }
        const chartData = processActivityData(activityData || [], totalHabits);
        setProgressData(chartData);
        setGoals([]);
        setBodyMeasurements(measurementsData || []);
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchProgressData();
  }, [user]);

  const processActivityData = (activityLogs: any[], totalHabits: number) => {
    const last30Days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today); date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayActivities = activityLogs.filter(a => new Date(a.created_at).toISOString().split('T')[0] === dateStr);
      const uniqueHabits = new Set();
      dayActivities.forEach(a => { if (a.metadata?.habit_id) uniqueHabits.add(a.metadata.habit_id); });
      const completedGoals = uniqueHabits.size;
      last30Days.push({
        date: dateStr, displayDate: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        completedGoals, totalGoals: totalHabits, completionRate: totalHabits > 0 ? Math.round((completedGoals / totalHabits) * 100) : 0,
        diet: Array.from(uniqueHabits).filter(id => String(id).startsWith('alimentacion_')).length,
        workout: Array.from(uniqueHabits).filter(id => String(id).startsWith('movimiento_')).length,
        water: Array.from(uniqueHabits).filter(id => String(id).startsWith('hidratacion_')).length,
        sleep: Array.from(uniqueHabits).filter(id => String(id).startsWith('descanso_')).length,
      });
    }
    return last30Days;
  };

  const chartConfig = {
    completionRate: { label: "Tasa de Cumplimiento (%)", color: "hsl(142, 71%, 45%)" },
    diet: { label: "Dieta", color: "hsl(217, 91%, 60%)" },
    workout: { label: "Ejercicio", color: "hsl(38, 92%, 50%)" },
    water: { label: "Hidratación", color: "hsl(187, 92%, 41%)" },
    sleep: { label: "Descanso", color: "hsl(258, 90%, 66%)" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(220,20%,8%)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[hsl(var(--accent-green))] mx-auto"></div>
          <p className="mt-4 text-white/50">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  const latestMeasurement = bodyMeasurements[bodyMeasurements.length - 1];
  function calculateCurrentStreak() {
    let streak = 0;
    const sortedData = [...progressData].reverse();
    for (const day of sortedData) { if (day.completionRate >= 80) streak++; else break; }
    return streak;
  }
  const currentStreak = calculateCurrentStreak();

  if (showMeasurements) {
    return (
      <div className="min-h-screen bg-[hsl(220,20%,8%)]">
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <Button onClick={() => setShowMeasurements(false)} variant="ghost" className="mb-4 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10">
              <ArrowLeft className="w-4 h-4 mr-2" />Volver al Progreso
            </Button>
            <h1 className="text-3xl font-bold text-white">Mediciones Corporales</h1>
            <p className="text-white/50 mt-2">Gestiona tus mediciones y progreso físico</p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8"><BodyMeasurements onClose={() => setShowMeasurements(false)} /></main>
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
          <h1 className="text-3xl font-bold text-white">Mi Progreso</h1>
          <p className="text-white/50 mt-2">Visualiza tu evolución y logros</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="py-6 text-center">
              <TrendingUp className="w-8 h-8 text-[hsl(var(--accent-green))] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{currentStreak}</div>
              <div className="text-sm text-white/50">Días consecutivos</div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="py-6 text-center">
              <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {progressData.length > 0 ? Math.round(progressData.reduce((acc, day) => acc + day.completionRate, 0) / progressData.length) : 0}%
              </div>
              <div className="text-sm text-white/50">Promedio mensual</div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setShowMeasurements(true)}>
            <CardContent className="py-6 text-center">
              <Scale className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{latestMeasurement?.weight || '--'}</div>
              <div className="text-sm text-white/50">Peso actual (kg)</div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="py-6 text-center">
              <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{bodyMeasurements.length}</div>
              <div className="text-sm text-white/50">Mediciones registradas</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Button onClick={() => setShowMeasurements(true)} className="bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/30 border border-[hsl(var(--accent-green))]/30">
            <Scale className="w-4 h-4 mr-2" />Gestionar Mediciones
          </Button>
        </div>

        {/* Progress Chart */}
        <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader><CardTitle className="text-white">Evolución de Cumplimiento (Últimos 30 días)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="displayDate" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.4)' }} />
                  <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.4)' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="completionRate" stroke="var(--color-completionRate)" strokeWidth={3} dot={{ fill: "var(--color-completionRate)", strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Goals Breakdown */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader><CardTitle className="text-white">Desglose por Objetivos (Últimos 7 días)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="displayDate" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.4)' }} />
                  <YAxis domain={[0, 1]} stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.4)' }} />
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
