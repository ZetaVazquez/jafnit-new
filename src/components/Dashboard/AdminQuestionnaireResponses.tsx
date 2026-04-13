import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, TrendingUp, Activity, Heart, Utensils } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminQuestionnaireResponsesProps { onGoBack: () => void; }
interface QuestionnaireResponse { id: string; user_id: string; health_goals?: string; activity_level?: string; exercise_frequency?: string; dietary_preferences?: string; health_conditions?: string; created_at: string; profile_name: string; profile_email: string; has_active_subscription: boolean; hours_since_creation: number; }

const AdminQuestionnaireResponses: React.FC<AdminQuestionnaireResponsesProps> = ({ onGoBack }) => {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { fetchQuestionnaireResponses(); }, []);

  const fetchQuestionnaireResponses = async () => {
    try {
      setLoading(true);
      const { data: responsesData, error: responsesError } = await supabase.from('questionnaire_responses').select('*, profiles!inner(name, email)').order('created_at', { ascending: false });
      if (responsesError) throw responsesError;
      const enrichedResponses = await Promise.all(
        responsesData.map(async (response) => {
          const { data: stripeSub } = await supabase.from('stripe_subscriptions').select('status').eq('user_id', response.user_id).in('status', ['active', 'trialing']).maybeSingle();
          const { data: regularSub } = await supabase.from('subscriptions').select('status').eq('user_id', response.user_id).eq('status', 'active').maybeSingle();
          const hasActive = !!(stripeSub || regularSub);
          const hours = (Date.now() - new Date(response.created_at).getTime()) / (1000 * 60 * 60);
          return { id: response.id, user_id: response.user_id, health_goals: response.health_goals, activity_level: response.activity_level, exercise_frequency: response.exercise_frequency, dietary_preferences: response.dietary_preferences, health_conditions: response.health_conditions, created_at: response.created_at, profile_name: response.profiles.name, profile_email: response.profiles.email, has_active_subscription: hasActive, hours_since_creation: hours };
        })
      );
      setResponses(enrichedResponses.filter(r => r.has_active_subscription || r.hours_since_creation < 24));
    } catch (error) { console.error('Error:', error); toast({ title: 'Error', description: 'No se pudieron cargar las respuestas', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const formatActivityLevel = (level?: string) => {
    const map: Record<string, string> = { sedentary: 'Sedentario', light: 'Ligero', moderate: 'Moderado', active: 'Activo', very_active: 'Muy activo' };
    return map[level || ''] || level || 'No especificado';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,20%,8%)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--accent-green))]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={onGoBack} className="mb-4 border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver al Panel
          </Button>
          <h1 className="text-3xl font-bold text-[hsl(var(--accent-green))]">Respuestas del Cuestionario</h1>
          <p className="text-white/50 mt-2">Respuestas de usuarios logueados. Sin plan activo solo se muestran 24h.</p>
          <p className="text-sm text-white/40 mt-1">Total: {responses.length}</p>
        </div>

        {responses.length === 0 ? (
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-8 text-center"><p className="text-white/40">No hay respuestas disponibles.</p></CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {responses.map((response) => (
              <Card key={response.id} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.07] transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[hsl(var(--accent-green))]/20 rounded-full"><User className="w-5 h-5 text-[hsl(var(--accent-green))]" /></div>
                      <div>
                        <CardTitle className="text-xl text-white">{response.profile_name}</CardTitle>
                        <p className="text-sm text-white/40">{response.profile_email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={response.has_active_subscription ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/50 border border-white/20'}>
                        {response.has_active_subscription ? 'Plan Activo' : 'Sin Plan'}
                      </Badge>
                      {!response.has_active_subscription && (
                        <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs">Expira en {Math.round(24 - response.hours_since_creation)}h</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Heart className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <div><p className="text-sm font-semibold text-white">Objetivos</p><p className="text-sm text-white/50">{response.health_goals || 'No especificado'}</p></div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Activity className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div><p className="text-sm font-semibold text-white">Actividad</p><p className="text-sm text-white/50">{formatActivityLevel(response.activity_level)}</p></div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <TrendingUp className="w-5 h-5 text-[hsl(var(--accent-green))] mt-0.5 flex-shrink-0" />
                        <div><p className="text-sm font-semibold text-white">Frecuencia</p><p className="text-sm text-white/50">{response.exercise_frequency || 'No especificado'}</p></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Utensils className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                        <div><p className="text-sm font-semibold text-white">Dieta</p><p className="text-sm text-white/50">{response.dietary_preferences || 'No especificado'}</p></div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Calendar className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div><p className="text-sm font-semibold text-white">Fecha</p><p className="text-sm text-white/50">{new Date(response.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p></div>
                      </div>
                      {response.health_conditions && (
                        <div className="flex items-start space-x-2">
                          <Heart className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                          <div><p className="text-sm font-semibold text-white">Condiciones</p><p className="text-sm text-white/50">{response.health_conditions}</p></div>
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
    </div>
  );
};

export default AdminQuestionnaireResponses;
