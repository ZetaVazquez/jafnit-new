
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useQuestionnaire = () => {
  const [loading, setLoading] = useState(false);

  const saveQuestionnaireResponse = async (responses: {
    health_goals?: string;
    current_situation?: string;
    commitment_level?: string;
    daily_life?: string;
    investment_readiness?: string;
    personal_motivation?: string;
    contact_info?: string;
  }) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await supabase
        .from('questionnaire_responses')
        .insert([{
          user_id: user.id,
          health_goals: responses.health_goals,
          activity_level: responses.current_situation,
          exercise_frequency: responses.commitment_level,
          dietary_preferences: responses.daily_life,
          health_conditions: responses.investment_readiness
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving questionnaire:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in saveQuestionnaireResponse:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getQuestionnaireResponse = async (userId: string) => {
    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return { data, error };
  };

  return {
    saveQuestionnaireResponse,
    getQuestionnaireResponse,
    loading
  };
};
