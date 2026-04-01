import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Dumbbell, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const TodayGoalsWidget: React.FC = () => {
  const { user } = useAuth();
  const [completedHabits, setCompletedHabits] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const totalHabits = 12;
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTodayProgress = async () => {
      if (!user) return;
      try {
        const { data: progressData, error: progressError } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .eq('activity_type', 'habit_completed')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lt('created_at', `${today}T23:59:59.999Z`);
        if (progressError) { console.error('Error fetching progress:', progressError); return; }
        const uniqueHabits = new Set();
        (progressData || []).forEach(log => {
          if (typeof log.metadata === 'object' && log.metadata && 'habit_id' in log.metadata) {
            uniqueHabits.add(log.metadata.habit_id);
          }
        });
        setCompletedHabits(uniqueHabits.size);
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchTodayProgress();
    const channel = supabase.channel('habit-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs', filter: `user_id=eq.${user?.id}` }, () => { fetchTodayProgress(); }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, today]);

  return (
    <Card className="border-white/10 bg-gradient-to-br from-[hsl(var(--accent-green))]/20 to-[hsl(var(--accent-green))]/5 backdrop-blur-sm">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Objetivos de Hoy</p>
            <p className="text-2xl font-bold text-white">{loading ? '...' : `${completedHabits}/${totalHabits}`}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[hsl(var(--accent-green))]/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-[hsl(var(--accent-green))]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const WorkoutStatsWidget: React.FC = () => {
  const { user } = useAuth();
  const [workoutCount, setWorkoutCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutStats = async () => {
      if (!user) return;
      try {
        const { data: workoutData, error: workoutError } = await supabase.from('workout_plans').select('*').eq('user_id', user.id);
        if (workoutError) { console.error('Error fetching workout stats:', workoutError); return; }
        setWorkoutCount((workoutData || []).length);
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchWorkoutStats();
    const channel = supabase.channel('workout-plans-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'workout_plans', filter: `user_id=eq.${user?.id}` }, () => { fetchWorkoutStats(); }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return (
    <Card className="border-white/10 bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-sm">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Entrenamientos</p>
            <p className="text-2xl font-bold text-white">{loading ? '...' : workoutCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ActiveDaysWidget: React.FC = () => {
  const { user } = useAuth();
  const [activeDays, setActiveDays] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveDays = async () => {
      if (!user) return;
      try {
        const { data: activityData, error: activityError } = await supabase.from('activity_logs').select('created_at').eq('user_id', user.id);
        if (activityError) { console.error('Error fetching activity stats:', activityError); return; }
        const uniqueDays = new Set();
        (activityData || []).forEach(log => { uniqueDays.add(new Date(log.created_at).toISOString().split('T')[0]); });
        setActiveDays(uniqueDays.size);
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchActiveDays();
    const channel = supabase.channel('activity-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs', filter: `user_id=eq.${user?.id}` }, () => { fetchActiveDays(); }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return (
    <Card className="border-white/10 bg-gradient-to-br from-purple-500/20 to-purple-500/5 backdrop-blur-sm">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Días Activos</p>
            <p className="text-2xl font-bold text-white">{loading ? '...' : activeDays}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
