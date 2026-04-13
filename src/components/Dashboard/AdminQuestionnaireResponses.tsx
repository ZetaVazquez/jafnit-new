import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, TrendingUp, Activity, Heart, Utensils } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminQuestionnaireResponsesProps {
  onGoBack: () => void;
}

interface QuestionnaireResponse {
  id: string;
  user_id: string;
  health_goals?: string;
  activity_level?: string;
  exercise_frequency?: string;
  dietary_preferences?: string;
  health_conditions?: string;
  created_at: string;
  profile_name: string;
  profile_email: string;
  has_active_subscription: boolean;
  hours_since_creation: number;
}

const AdminQuestionnaireResponses: React.FC<AdminQuestionnaireResponsesProps> = ({ onGoBack }) => {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestionnaireResponses();
  }, []);

  const fetchQuestionnaireResponses = async () => {
    try {
      setLoading(true);

      // Obtener todas las respuestas del cuestionario con información del perfil
      const { data: responsesData, error: responsesError } = await supabase
        .from('questionnaire_responses')
        .select(`
          *,
          profiles!inner(name, email)
        `)
        .order('created_at', { ascending: false });

      if (responsesError) throw responsesError;

      // Para cada respuesta, verificar el estado de suscripción
      const enrichedResponses = await Promise.all(
        responsesData.map(async (response) => {
          // Verificar suscripción activa (tanto Stripe como tradicional)
          const { data: stripeSubscription } = await supabase
            .from('stripe_subscriptions')
            .select('status')
            .eq('user_id', response.user_id)
            .in('status', ['active', 'trialing'])
            .maybeSingle();

          const { data: regularSubscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', response.user_id)
            .eq('status', 'active')
            .maybeSingle();

          const hasActiveSubscription = !!(stripeSubscription || regularSubscription);

          // Calcular horas desde la creación
          const createdAt = new Date(response.created_at);
          const now = new Date();
          const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

          return {
            id: response.id,
            user_id: response.user_id,
            health_goals: response.health_goals,
            activity_level: response.activity_level,
            exercise_frequency: response.exercise_frequency,
            dietary_preferences: response.dietary_preferences,
            health_conditions: response.health_conditions,
            created_at: response.created_at,
            profile_name: response.profiles.name,
            profile_email: response.profiles.email,
            has_active_subscription: hasActiveSubscription,
            hours_since_creation: hoursSinceCreation,
          };
        })
      );

      // Filtrar según la lógica: si no tiene suscripción activa, solo mostrar si fue creado hace menos de 24h
      const filteredResponses = enrichedResponses.filter(
        (response) => response.has_active_subscription || response.hours_since_creation < 24
      );

      setResponses(filteredResponses);
    } catch (error) {
      console.error('Error fetching questionnaire responses:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las respuestas del cuestionario',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatActivityLevel = (level: string | undefined) => {
    if (!level) return 'No especificado';
    const mapping: Record<string, string> = {
      'sedentary': 'Sedentario',
      'light': 'Ligero',
      'moderate': 'Moderado',
      'active': 'Activo',
      'very_active': 'Muy activo',
    };
    return mapping[level] || level;
  };

  const formatExerciseFrequency = (frequency: string | undefined) => {
    if (!frequency) return 'No especificado';
    return frequency;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutrition-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={onGoBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Panel
        </Button>
        <h1 className="text-3xl font-bold text-nutrition-green">Respuestas del Cuestionario</h1>
        <p className="text-nutrition-gray mt-2">
          Respuestas de usuarios logueados. Las respuestas de usuarios sin plan activo solo se muestran durante 24 horas.
        </p>
        <p className="text-sm text-nutrition-gray mt-1">
          Total de respuestas visibles: {responses.length}
        </p>
      </div>

      {responses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-nutrition-gray">No hay respuestas disponibles para mostrar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {responses.map((response) => (
            <Card key={response.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-nutrition-green-lighter rounded-full">
                      <User className="w-5 h-5 text-nutrition-green" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{response.profile_name}</CardTitle>
                      <p className="text-sm text-nutrition-gray">{response.profile_email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={response.has_active_subscription ? 'default' : 'secondary'}>
                      {response.has_active_subscription ? 'Plan Activo' : 'Sin Plan'}
                    </Badge>
                    {!response.has_active_subscription && (
                      <Badge variant="outline" className="text-xs">
                        Expira en {Math.round(24 - response.hours_since_creation)}h
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-nutrition-black">Objetivos de Salud</p>
                        <p className="text-sm text-nutrition-gray">{response.health_goals || 'No especificado'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Activity className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-nutrition-black">Nivel de Actividad</p>
                        <p className="text-sm text-nutrition-gray">{formatActivityLevel(response.activity_level)}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-nutrition-black">Frecuencia de Ejercicio</p>
                        <p className="text-sm text-nutrition-gray">
                          {formatExerciseFrequency(response.exercise_frequency)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Utensils className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-nutrition-black">Preferencias Dietéticas</p>
                        <p className="text-sm text-nutrition-gray">
                          {response.dietary_preferences || 'No especificado'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Calendar className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-nutrition-black">Fecha de Respuesta</p>
                        <p className="text-sm text-nutrition-gray">
                          {new Date(response.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {response.health_conditions && (
                      <div className="flex items-start space-x-2">
                        <Heart className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-nutrition-black">Condiciones de Salud</p>
                          <p className="text-sm text-nutrition-gray">{response.health_conditions}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuestionnaireResponses;
