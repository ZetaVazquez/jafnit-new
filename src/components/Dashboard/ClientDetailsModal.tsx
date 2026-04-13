import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Phone, Instagram, Activity, Target, Utensils, Dumbbell, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  clientEmail: string;
}

interface QuestionnaireData {
  age?: number;
  weight?: number;
  height?: number;
  activity_level?: string;
  health_goals?: string;
  dietary_preferences?: string;
  exercise_frequency?: string;
  health_conditions?: string;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  clientEmail
}) => {
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientData();
    }
  }, [isOpen, clientId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      
      // Obtener datos del cuestionario
      const { data: questionnaire, error } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', clientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching questionnaire:', error);
        setQuestionnaireData(null);
      } else {
        setQuestionnaireData(questionnaire);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del cliente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatActivityLevel = (level?: string) => {
    const levels: { [key: string]: string } = {
      'sedentary': 'Sedentario',
      'light': 'Ligero',
      'moderate': 'Moderado',
      'active': 'Activo',
      'very_active': 'Muy activo'
    };
    return levels[level || ''] || level || 'No especificado';
  };

  const formatExerciseFrequency = (frequency?: string) => {
    const frequencies: { [key: string]: string } = {
      'never': 'Nunca',
      'rarely': 'Raramente',
      '1-2_times': '1-2 veces por semana',
      '3-4_times': '3-4 veces por semana',
      '5-6_times': '5-6 veces por semana',
      'daily': 'Diariamente'
    };
    return frequencies[frequency || ''] || frequency || 'No especificado';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Detalles del Cliente</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nutrition-green"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Nombre:</span>
                    <span>{clientName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{clientEmail}</span>
                  </div>
                  {questionnaireData?.age && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Edad:</span>
                      <span>{questionnaireData.age} años</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Medidas Corporales */}
            {(questionnaireData?.weight || questionnaireData?.height) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Medidas Corporales</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {questionnaireData.weight && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-nutrition-green">
                          {questionnaireData.weight} kg
                        </div>
                        <div className="text-sm text-gray-600">Peso</div>
                      </div>
                    )}
                    {questionnaireData.height && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-nutrition-green">
                          {questionnaireData.height} cm
                        </div>
                        <div className="text-sm text-gray-600">Altura</div>
                      </div>
                    )}
                    {questionnaireData.weight && questionnaireData.height && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-nutrition-green">
                          {((questionnaireData.weight / Math.pow(questionnaireData.height / 100, 2)).toFixed(1))}
                        </div>
                        <div className="text-sm text-gray-600">IMC</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actividad y Ejercicio */}
            {(questionnaireData?.activity_level || questionnaireData?.exercise_frequency) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Dumbbell className="w-4 h-4" />
                    <span>Actividad Física</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questionnaireData.activity_level && (
                    <div>
                      <span className="font-medium">Nivel de actividad diaria:</span>
                      <Badge className="ml-2" variant="secondary">
                        {formatActivityLevel(questionnaireData.activity_level)}
                      </Badge>
                    </div>
                  )}
                  {questionnaireData.exercise_frequency && (
                    <div>
                      <span className="font-medium">Frecuencia de ejercicio:</span>
                      <Badge className="ml-2" variant="secondary">
                        {formatExerciseFrequency(questionnaireData.exercise_frequency)}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Objetivos y Salud */}
            {(questionnaireData?.health_goals || questionnaireData?.health_conditions) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Objetivos y Salud</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questionnaireData.health_goals && (
                    <div>
                      <span className="font-medium">Objetivos de salud:</span>
                      <p className="mt-1 text-gray-700">{questionnaireData.health_goals}</p>
                    </div>
                  )}
                  {questionnaireData.health_conditions && (
                    <div>
                      <span className="font-medium">Condiciones de salud:</span>
                      <p className="mt-1 text-gray-700">{questionnaireData.health_conditions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Preferencias Dietéticas */}
            {questionnaireData?.dietary_preferences && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Utensils className="w-4 h-4" />
                    <span>Preferencias Dietéticas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{questionnaireData.dietary_preferences}</p>
                </CardContent>
              </Card>
            )}

            {/* Mensaje si no hay datos del cuestionario */}
            {!questionnaireData && (
              <Card>
                <CardContent className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Este cliente aún no ha completado el cuestionario inicial.</p>
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