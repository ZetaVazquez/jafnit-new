
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, ChefHat, Calendar, Target, Download, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DietPlan } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionGuard from '@/components/SubscriptionGuard';
import DynamicBackground from '@/components/Layout/DynamicBackground';

interface MyDietsProps {
  onGoBack: () => void;
}

const MyDiets: React.FC<MyDietsProps> = ({ onGoBack }) => {
  const { user } = useAuth();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para formatear el plan de comidas
  const formatMealPlan = (mealPlan: any) => {
    if (!mealPlan) return 'No hay plan de comidas disponible';
    
    if (typeof mealPlan === 'string') return mealPlan;
    
    if (typeof mealPlan === 'object') {
      return JSON.stringify(mealPlan, null, 2)
        .replace(/[{}[\]",]/g, '')
        .replace(/:/g, ': ')
        .trim();
    }
    
    return String(mealPlan);
  };

  // Función para descargar el plan como archivo de texto
  const downloadDietPlan = (diet: DietPlan) => {
    const content = `
PLAN DE DIETA: ${diet.title}

Descripción: ${diet.description || 'No disponible'}

Objetivo de calorías: ${diet.calories_target ? `${diet.calories_target} cal/día` : 'No especificado'}

Fecha de creación: ${new Date(diet.created_at).toLocaleDateString('es-ES')}

PLAN DE COMIDAS:
${formatMealPlan(diet.meal_plan)}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diet.title.replace(/[^a-z0-9]/gi, '_')}_plan_dieta.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchDietPlans = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('diet_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching diet plans:', error);
        } else {
          setDietPlans(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDietPlans();
  }, [user]);

  const DietsContent = () => {
    if (loading) {
      return (
        <DynamicBackground className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green mx-auto"></div>
            <p className="mt-4 text-nutrition-gray">Cargando tus dietas...</p>
          </div>
        </DynamicBackground>
      );
    }

    return (
      <DynamicBackground className="min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-md">
          <div className="container mx-auto px-4 py-4">
            <Button
              onClick={onGoBack}
              variant="ghost"
              className="mb-4 text-nutrition-green hover:text-nutrition-green-dark"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-nutrition-black title-main">Mis Dietas</h1>
            <p className="text-nutrition-gray mt-2">Aquí encontrarás todos tus planes de alimentación personalizados</p>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-8">
          {dietPlans.length === 0 ? (
            <Card className="text-center py-12 bg-white/90 backdrop-blur-sm">
              <CardContent>
                <ChefHat className="w-16 h-16 text-nutrition-green mx-auto mb-4" />
                <h3 className="text-xl font-bold text-nutrition-black mb-2 title-playful">
                  No tienes planes de dieta asignados
                </h3>
                <p className="text-nutrition-gray mb-6">
                  José Antonio está preparando tu plan de alimentación personalizado. 
                  Recibirás una notificación cuando esté listo.
                </p>
                <Button className="bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                  Contactar con José Antonio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {dietPlans.map((diet) => (
                <Card key={diet.id} className="hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-nutrition-green title-playful">
                      <ChefHat className="w-5 h-5" />
                      <span>{diet.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-nutrition-gray mb-4">{diet.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-nutrition-gray">
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{diet.calories_target} cal/día</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Creado: {new Date(diet.created_at).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Plan Completo
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-nutrition-green text-xl">
                                {diet.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {diet.description && (
                                <div>
                                  <h4 className="font-semibold text-nutrition-black mb-2">Descripción:</h4>
                                  <p className="text-nutrition-gray">{diet.description}</p>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-2 gap-4">
                                {diet.calories_target && (
                                  <div>
                                    <h4 className="font-semibold text-nutrition-black mb-1">Objetivo de calorías:</h4>
                                    <p className="text-nutrition-gray">{diet.calories_target} cal/día</p>
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-semibold text-nutrition-black mb-1">Fecha de creación:</h4>
                                  <p className="text-nutrition-gray">{new Date(diet.created_at).toLocaleDateString('es-ES')}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-nutrition-black mb-2">Plan de Comidas:</h4>
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                  <pre className="whitespace-pre-wrap text-sm text-nutrition-gray font-mono">
                                    {formatMealPlan(diet.meal_plan)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          className="w-full border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
                          onClick={() => downloadDietPlan(diet)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </DynamicBackground>
    );
  };

  // Envolver el contenido con SubscriptionGuard
  return (
    <SubscriptionGuard>
      <DietsContent />
    </SubscriptionGuard>
  );
};

export default MyDiets;
