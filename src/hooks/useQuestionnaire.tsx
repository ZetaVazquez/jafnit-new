
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuestionnaireResponse } from '@/types/database';

export const useQuestionnaire = () => {
  const [loading, setLoading] = useState(false);

  const saveQuestionnaireResponse = async (responses: Omit<QuestionnaireResponse, 'id' | 'user_id' | 'created_at'>) => {
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
          ...responses
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
