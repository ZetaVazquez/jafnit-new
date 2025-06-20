
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChefHat, Calendar, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DietPlan } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';

interface MyDietsProps {
  onGoBack: () => void;
}

const MyDiets: React.FC<MyDietsProps> = ({ onGoBack }) => {
  const { user } = useAuth();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green mx-auto"></div>
          <p className="mt-4 text-nutrition-gray">Cargando tus dietas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={onGoBack}
            variant="ghost"
            className="mb-4 text-nutrition-green hover:text-nutrition-green-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-nutrition-black">Mis Dietas</h1>
          <p className="text-nutrition-gray mt-2">Aquí encontrarás todos tus planes de alimentación personalizados</p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {dietPlans.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ChefHat className="w-16 h-16 text-nutrition-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-nutrition-black mb-2">
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
              <Card key={diet.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-nutrition-green">
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
                      <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                        Ver Plan Completo
                      </Button>
                      <Button variant="outline" className="w-full border-nutrition-green text-nutrition-green">
                        Descargar PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyDiets;
