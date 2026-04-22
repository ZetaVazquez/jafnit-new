import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Phone, Instagram, Activity, Target, Utensils, Dumbbell, Heart, ClipboardList, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EVALUATION_BLOCKS, getBlockCompletion, getOverallEvaluationProgress } from './InitialEvaluationModal';
import { Progress } from '@/components/ui/progress';

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

interface InitialEvaluationData {
  block_1_identification?: Record<string, any>;
  block_2_health_screening?: Record<string, any>;
  block_3_dietary_history?: Record<string, any>;
  block_4_training_profile?: Record<string, any>;
  block_5_lifestyle_recovery?: Record<string, any>;
  block_6_medical_clinical?: Record<string, any>;
  block_7_hormonal_health?: Record<string, any>;
  block_8_anthropometry?: Record<string, any>;
  completed?: boolean;
  completed_at?: string;
  updated_at?: string;
}

const formatFieldLabel = (key: string) =>
  key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  clientEmail
}) => {
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [evaluationData, setEvaluationData] = useState<InitialEvaluationData | null>(null);
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

      // Obtener evaluación inicial profesional (segundo cuestionario)
      const { data: evaluation, error: evalError } = await (supabase as any)
        .from('initial_evaluations')
        .select('*')
        .eq('user_id', clientId)
        .maybeSingle();

      if (evalError) {
        console.error('Error fetching evaluation:', evalError);
        setEvaluationData(null);
      } else {
        setEvaluationData(evaluation);
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

            {/* Evaluación Inicial Profesional (segundo cuestionario) */}
            <Card className="border-2 border-nutrition-green/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="w-4 h-4" />
                    <span>Evaluación Inicial Profesional (Método JAFN)</span>
                  </div>
                  {evaluationData?.completed ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completada
                    </Badge>
                  ) : evaluationData ? (
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      En progreso
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pendiente</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!evaluationData ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    El cliente aún no ha iniciado la evaluación inicial profesional.
                  </p>
                ) : (
                  <>
                    {/* Progreso global */}
                    {(() => {
                      const overall = getOverallEvaluationProgress(evaluationData as Record<string, any>);
                      return (
                        <div className="mb-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">Progreso global de la evaluación</span>
                            <span className={`text-sm font-bold ${overall === 100 ? 'text-green-600' : overall > 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
                              {overall}%
                            </span>
                          </div>
                          <Progress value={overall} className="h-2" />
                        </div>
                      );
                    })()}

                    <Accordion type="multiple" className="w-full">
                      {EVALUATION_BLOCKS.map((b) => {
                        const key = b.column as keyof InitialEvaluationData;
                        const title = b.title;
                        const blockContent = (evaluationData[key] as Record<string, any>) || {};
                        const completion = getBlockCompletion(b, blockContent);
                        const entries = Object.entries(blockContent).filter(
                          ([, v]) => v !== null && v !== undefined && v !== '' && v !== false
                        );
                        const hasData = entries.length > 0;
                        const statusColor =
                          completion.percent === 100
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : completion.percent > 0
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            : 'bg-gray-100 text-gray-500 border-gray-300';
                        return (
                          <AccordionItem key={key as string} value={key as string}>
                            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                              <div className="flex items-center justify-between w-full pr-3 gap-3">
                                <span className="text-left flex-1">{title}</span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="hidden sm:block w-24">
                                    <Progress value={completion.percent} className="h-1.5" />
                                  </div>
                                  <Badge variant="outline" className={`text-xs ${statusColor}`}>
                                    {completion.answered}/{completion.total} · {completion.percent}%
                                  </Badge>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              {hasData ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                  {entries.map(([fieldKey, value]) => (
                                    <div key={fieldKey} className="bg-gray-50 rounded-lg p-3">
                                      <p className="text-xs font-medium text-gray-500 mb-1">
                                        {formatFieldLabel(fieldKey)}
                                      </p>
                                      <p className="text-sm text-gray-800 break-words">
                                        {typeof value === 'boolean'
                                          ? value ? 'Sí' : 'No'
                                          : String(value)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-400 italic py-2">
                                  Este bloque aún no contiene respuestas.
                                </p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsModal;