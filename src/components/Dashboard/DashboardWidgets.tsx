import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Dumbbell, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const TodayGoalsWidget: React.FC = () => {
  const { user } = useAuth();
  const [completedHabits, setCompletedHabits] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const totalHabits = 12; // Total number of daily habits
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

        if (progressError) {
          console.error('Error fetching progress:', progressError);
          return;
        }

        // Count unique habits completed today
        const uniqueHabits = new Set();
        (progressData || []).forEach(log => {
          if (typeof log.metadata === 'object' && log.metadata && 'habit_id' in log.metadata) {
            uniqueHabits.add(log.metadata.habit_id);
          }
        });

        setCompletedHabits(uniqueHabits.size);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayProgress();

    // Set up real-time updates
    const channel = supabase
      .channel('habit-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchTodayProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, today]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Objetivos de Hoy</p>
              <p className="text-2xl font-bold">...</p>
            </div>
            <Target className="w-8 h-8 text-white/80" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Objetivos de Hoy</p>
            <p className="text-2xl font-bold">{completedHabits}/{totalHabits}</p>
          </div>
          <Target className="w-8 h-8 text-white/80" />
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
        const { data: workoutData, error: workoutError } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .eq('activity_type', 'workout_completed');

        if (workoutError) {
          console.error('Error fetching workout stats:', workoutError);
          return;
        }

        setWorkoutCount((workoutData || []).length);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutStats();

    // Set up real-time updates
    const channel = supabase
      .channel('workout-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchWorkoutStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Entrenamientos</p>
              <p className="text-2xl font-bold">...</p>
            </div>
            <Dumbbell className="w-8 h-8 text-white/80" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Entrenamientos</p>
            <p className="text-2xl font-bold">{workoutCount}</p>
          </div>
          <Dumbbell className="w-8 h-8 text-white/80" />
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
        // Get unique days where user had any activity
        const { data: activityData, error: activityError } = await supabase
          .from('activity_logs')
          .select('created_at')
          .eq('user_id', user.id);

        if (activityError) {
          console.error('Error fetching activity stats:', activityError);
          return;
        }

        // Count unique days
        const uniqueDays = new Set();
        (activityData || []).forEach(log => {
          const date = new Date(log.created_at).toISOString().split('T')[0];
          uniqueDays.add(date);
        });

        setActiveDays(uniqueDays.size);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveDays();

    // Set up real-time updates
    const channel = supabase
      .channel('activity-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchActiveDays();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Días Activos</p>
              <p className="text-2xl font-bold">...</p>
            </div>
            <TrendingUp className="w-8 h-8 text-white/80" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Días Activos</p>
            <p className="text-2xl font-bold">{activeDays}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-white/80" />
        </div>
      </CardContent>
    </Card>
  );
};