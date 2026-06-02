
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, ChefHat, Calendar, Target, Download, Eye, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DietPlan } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionGuard from '@/components/SubscriptionGuard';

interface MyDietsProps {
  onGoBack: () => void;
}

const MyDiets: React.FC<MyDietsProps> = ({ onGoBack }) => {
  const { user } = useAuth();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenericModal, setShowGenericModal] = useState(false);
  const [genericNoticeShown, setGenericNoticeShown] = useState(false);

  const formatMealPlan = (mealPlan: any) => {
    if (!mealPlan) return 'No hay plan de comidas disponible';
    if (typeof mealPlan === 'string') return mealPlan;
    if (typeof mealPlan === 'object') return JSON.stringify(mealPlan, null, 2).replace(/[{}[\]",]/g, '').replace(/:/g, ': ').trim();
    return String(mealPlan);
  };

  const downloadDietPlan = (diet: DietPlan) => {
    const content = `PLAN DE DIETA: ${diet.title}\n\nDescripción: ${diet.description || 'No disponible'}\n\nObjetivo de calorías: ${diet.calories_target ? `${diet.calories_target} cal/día` : 'No especificado'}\n\nFecha de creación: ${new Date(diet.created_at).toLocaleDateString('es-ES')}\n\nPLAN DE COMIDAS:\n${formatMealPlan(diet.meal_plan)}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `${diet.title.replace(/[^a-z0-9]/gi, '_')}_plan_dieta.txt`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchDietPlans = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase.from('diet_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (error) console.error('Error fetching diet plans:', error);
        else {
          const plans = data || [];
          setDietPlans(plans);
          if (plans.some((p: any) => p.meal_plan?.is_generic) && !genericNoticeShown) {
            setShowGenericModal(true);
            setGenericNoticeShown(true);
          }
        }
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    fetchDietPlans();
  }, [user]);

  const DietsContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-[hsl(220,20%,8%)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[hsl(var(--accent-green))] mx-auto"></div>
            <p className="mt-4 text-white/50">Cargando tus dietas...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[hsl(220,20%,8%)]">
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <Button onClick={onGoBack} variant="ghost" className="mb-4 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10">
              <ArrowLeft className="w-4 h-4 mr-2" />Volver al Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-white">Mis Dietas</h1>
            <p className="text-white/50 mt-2">Aquí encontrarás todos tus planes de alimentación personalizados</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {dietPlans.length === 0 ? (
            <Card className="text-center py-12 border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent>
                <ChefHat className="w-16 h-16 text-[hsl(var(--accent-green))] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No tienes planes de dieta asignados</h3>
                <p className="text-white/50 mb-6">José Antonio está preparando tu plan de alimentación personalizado. Recibirás una notificación cuando esté listo.</p>
                <Button className="bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/30 border border-[hsl(var(--accent-green))]/30">Contactar con José Antonio</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {dietPlans.map((diet) => (
                <Card key={diet.id} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-[hsl(var(--accent-green))]"><ChefHat className="w-5 h-5" /><span>{diet.title}</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-white/50 mb-4">{diet.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-white/40">
                          <div className="flex items-center space-x-1"><Target className="w-4 h-4" /><span>{diet.calories_target} cal/día</span></div>
                          <div className="flex items-center space-x-1"><Calendar className="w-4 h-4" /><span>Creado: {new Date(diet.created_at).toLocaleDateString('es-ES')}</span></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white"><Eye className="w-4 h-4 mr-2" />Ver Plan Completo</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[hsl(220,20%,12%)] border-white/10">
                            <DialogHeader><DialogTitle className="text-[hsl(var(--accent-green))] text-xl">{diet.title}</DialogTitle></DialogHeader>
                            <div className="space-y-4">
                              {diet.description && <div><h4 className="font-semibold text-white mb-2">Descripción:</h4><p className="text-white/60">{diet.description}</p></div>}
                              <div className="grid grid-cols-2 gap-4">
                                {diet.calories_target && <div><h4 className="font-semibold text-white mb-1">Objetivo de calorías:</h4><p className="text-white/60">{diet.calories_target} cal/día</p></div>}
                                <div><h4 className="font-semibold text-white mb-1">Fecha de creación:</h4><p className="text-white/60">{new Date(diet.created_at).toLocaleDateString('es-ES')}</p></div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-white mb-2">Plan de Comidas:</h4>
                                {Array.isArray(diet.meal_plan?.days) && diet.meal_plan.days.length > 0 ? (
                                  <div className="space-y-4">
                                    {diet.meal_plan.days.map((day: any, di: number) => (
                                      <div key={di} className="rounded-lg border border-white/10 bg-white/5 p-3">
                                        <h5 className="text-[hsl(var(--accent-green))] font-semibold mb-2">{day.day}</h5>
                                <div className="space-y-3">
                                          {(() => {
                                            const groups: Record<string, any[]> = {};
                                            (day.meals || []).forEach((m: any) => {
                                              const k = m.meal_type || 'otro';
                                              (groups[k] = groups[k] || []).push(m);
                                            });
                                            const order = ['breakfast','desayuno','lunch','comida','snack','merienda','dinner','cena','otro'];
                                            const labels: Record<string,string> = {breakfast:'Desayuno',desayuno:'Desayuno',lunch:'Comida',comida:'Comida',snack:'Merienda',merienda:'Merienda',dinner:'Cena',cena:'Cena',otro:'Otro'};
                                            return Object.keys(groups).sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map((mt) => (
                                              <div key={mt}>
                                                <div className="text-white text-sm font-medium mb-2 leading-snug">
                                                  {groups[mt].map((m: any) => m.name).join(' o ')}{' '}
                                                  <span className="text-[hsl(var(--accent-green))] uppercase text-xs tracking-wider">({(labels[mt] || mt).toUpperCase()})</span>
                                                </div>
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                  {groups[mt].map((m: any, mi: number) => (
                                                    <div key={mi} className="rounded-lg border border-white/10 bg-white/[0.03] p-2 flex gap-2">
                                                      {m.image_url ? (
                                                        <img src={m.image_url} alt={m.name} className="w-20 h-20 object-cover rounded" />
                                                      ) : (
                                                        <div className="w-20 h-20 bg-white/5 rounded" />
                                                      )}
                                                      <div className="flex-1 min-w-0">
                                                        <div className="text-[10px] text-white/40 uppercase">Opción {mi + 1}</div>
                                                        <div className="text-white text-sm font-medium">{m.name}</div>
                                                        <div className="text-xs text-white/60 mt-1">
                                                          <span className="font-semibold text-[hsl(var(--accent-green))]/90">Cantidad:</span> {m.quantity}
                                                          {m.calories != null ? ` · ${m.calories} kcal` : ''}
                                                        </div>
                                                        {m.notes && (
                                                          <div className="text-xs text-white/70 mt-1 leading-snug">
                                                            <span className="font-semibold text-[hsl(var(--accent-green))]/90">Preparación:</span> {m.notes}
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            ));
                                          })()}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="bg-white/5 p-4 rounded-lg border border-white/10"><pre className="whitespace-pre-wrap text-sm text-white/60 font-mono">{formatMealPlan(diet.meal_plan)}</pre></div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" className="w-full border-[hsl(var(--accent-green))]/30 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10 bg-transparent" onClick={() => downloadDietPlan(diet)}>
                          <Download className="w-4 h-4 mr-2" />Descargar Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>

        <Dialog open={showGenericModal} onOpenChange={setShowGenericModal}>
          <DialogContent className="bg-[hsl(220,20%,12%)] border-yellow-500/30">
            <DialogHeader>
              <DialogTitle className="text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Plan de dieta genérico
              </DialogTitle>
            </DialogHeader>
            <p className="text-white/70 text-sm leading-relaxed">
              Este plan de dietas es <strong>general</strong>. Para que sea totalmente personalizado a tus objetivos, preferencias e intolerancias, completa el <strong>cuestionario de evaluación inicial</strong> que se abre al iniciar sesión.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setShowGenericModal(false)} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">Entendido</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return <SubscriptionGuard><DietsContent /></SubscriptionGuard>;
};

export default MyDiets;
