import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ClientFormData {
  // Datos Generales
  full_name?: string;
  birth_date?: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  dni_nie?: string;
  address?: string;
  city?: string;
  start_date?: string;
  contracted_program?: string;
  payment_method?: string;
  next_renewal?: string;
  acquisition_source?: string;

  // Contacto / Lead
  wants_more_info?: boolean;
  contact_message?: string;
  info_needed?: string;
  preferred_contact_method?: string;
  
  // Objetivos y Motivación
  main_objective?: string;
  secondary_objectives?: string;
  personal_motivation?: string;
  commitment_time?: string;
  ninety_day_goal?: string;
  
  // Datos físicos
  initial_weight?: number;
  height_cm?: number;
  bmi?: number;
  waist_perimeter?: number;
  hip_perimeter?: number;
  body_fat_percentage?: number;
  resting_heart_rate?: number;
  measurements_date?: string;
  
  // Información de actividad
  daily_activity_level?: string;
  current_training?: string;
  physical_limitations?: string;
  training_availability?: string;
  
  // Hábitos alimentarios
  meals_per_day?: number;
  current_diet_type?: string;
  food_restrictions?: string;
  current_supplements?: string;
  intolerances_allergies?: string;
  pathologies?: string;
  daily_water_intake?: string;
  
  // Notas adicionales
  professional_notes?: string;
}

export const useClientForm = () => {
  const [loading, setLoading] = useState(false);

  const saveClientForm = async (formData: ClientFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await (supabase as any)
        .from('client_forms')
        .insert([{
          user_id: user.id,
          ...formData
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving client form:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in saveClientForm:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getClientForm = async (userId: string) => {
    const { data, error } = await (supabase as any)
      .from('client_forms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return { data, error };
  };

  return {
    saveClientForm,
    getClientForm,
    loading
  };
};