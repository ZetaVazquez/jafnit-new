import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Activity, Target, Utensils, Dumbbell, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientDetailsModalProps { isOpen: boolean; onClose: () => void; clientId: string; clientName: string; clientEmail: string; }
interface QuestionnaireData { age?: number; weight?: number; height?: number; activity_level?: string; health_goals?: string; dietary_preferences?: string; exercise_frequency?: string; health_conditions?: string; }

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ isOpen, onClose, clientId, clientName, clientEmail }) => {
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { if (isOpen && clientId) fetchClientData(); }, [isOpen, clientId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('questionnaire_responses').select('*').eq('user_id', clientId).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (error) { console.error('Error:', error); setQuestionnaireData(null); }
      else setQuestionnaireData(data);
    } catch (error) { toast({ title: "Error", description: "No se pudieron cargar los datos.", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const formatActivityLevel = (level?: string) => {
    const m: Record<string, string> = { sedentary: 'Sedentario', light: 'Ligero', moderate: 'Moderado', active: 'Activo', very_active: 'Muy activo' };
    return m[level || ''] || level || 'No especificado';
  };

  const formatExerciseFrequency = (f?: string) => {
    const m: Record<string, string> = { never: 'Nunca', rarely: 'Raramente', '1-2_times': '1-2 veces/semana', '3-4_times': '3-4 veces/semana', '5-6_times': '5-6 veces/semana', daily: 'Diariamente' };
    return m[f || ''] || f || 'No especificado';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[hsl(220,15%,13%)] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-[hsl(var(--accent-green))]">
            <User className="w-5 h-5" /><span>Detalles del Cliente</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--accent-green))]"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader><CardTitle className="flex items-center space-x-2 text-white"><User className="w-4 h-4 text-[hsl(var(--accent-green))]" /><span>Información Personal</span></CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2"><User className="w-4 h-4 text-white/40" /><span className="font-medium text-white/60">Nombre:</span><span className="text-white">{clientName}</span></div>
                  <div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-white/40" /><span className="font-medium text-white/60">Email:</span><span className="text-white">{clientEmail}</span></div>
                  {questionnaireData?.age && <div className="flex items-center space-x-2"><Calendar className="w-4 h-4 text-white/40" /><span className="font-medium text-white/60">Edad:</span><span className="text-white">{questionnaireData.age} años</span></div>}
                </div>
              </CardContent>
            </Card>

            {(questionnaireData?.weight || questionnaireData?.height) && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader><CardTitle className="flex items-center space-x-2 text-white"><Activity className="w-4 h-4 text-[hsl(var(--accent-green))]" /><span>Medidas Corporales</span></CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {questionnaireData.weight && <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10"><div className="text-2xl font-bold text-[hsl(var(--accent-green))]">{questionnaireData.weight} kg</div><div className="text-sm text-white/50">Peso</div></div>}
                    {questionnaireData.height && <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10"><div className="text-2xl font-bold text-[hsl(var(--accent-green))]">{questionnaireData.height} cm</div><div className="text-sm text-white/50">Altura</div></div>}
                    {questionnaireData.weight && questionnaireData.height && <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10"><div className="text-2xl font-bold text-[hsl(var(--accent-green))]">{(questionnaireData.weight / Math.pow(questionnaireData.height / 100, 2)).toFixed(1)}</div><div className="text-sm text-white/50">IMC</div></div>}
                  </div>
                </CardContent>
              </Card>
            )}

            {(questionnaireData?.activity_level || questionnaireData?.exercise_frequency) && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader><CardTitle className="flex items-center space-x-2 text-white"><Dumbbell className="w-4 h-4 text-[hsl(var(--accent-green))]" /><span>Actividad Física</span></CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {questionnaireData.activity_level && <div><span className="font-medium text-white/60">Nivel de actividad:</span><Badge className="ml-2 bg-white/10 text-white/70 border border-white/20">{formatActivityLevel(questionnaireData.activity_level)}</Badge></div>}
                  {questionnaireData.exercise_frequency && <div><span className="font-medium text-white/60">Frecuencia:</span><Badge className="ml-2 bg-white/10 text-white/70 border border-white/20">{formatExerciseFrequency(questionnaireData.exercise_frequency)}</Badge></div>}
                </CardContent>
              </Card>
            )}

            {(questionnaireData?.health_goals || questionnaireData?.health_conditions) && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader><CardTitle className="flex items-center space-x-2 text-white"><Target className="w-4 h-4 text-[hsl(var(--accent-green))]" /><span>Objetivos y Salud</span></CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {questionnaireData.health_goals && <div><span className="font-medium text-white/60">Objetivos:</span><p className="mt-1 text-white/70">{questionnaireData.health_goals}</p></div>}
                  {questionnaireData.health_conditions && <div><span className="font-medium text-white/60">Condiciones:</span><p className="mt-1 text-white/70">{questionnaireData.health_conditions}</p></div>}
                </CardContent>
              </Card>
            )}

            {questionnaireData?.dietary_preferences && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader><CardTitle className="flex items-center space-x-2 text-white"><Utensils className="w-4 h-4 text-[hsl(var(--accent-green))]" /><span>Preferencias Dietéticas</span></CardTitle></CardHeader>
                <CardContent><p className="text-white/70">{questionnaireData.dietary_preferences}</p></CardContent>
              </Card>
            )}

            {!questionnaireData && (
              <Card className="border-white/10 bg-white/5">
                <CardContent className="text-center py-8">
                  <Heart className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">Este cliente aún no ha completado el cuestionario.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsModal;
