
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, ChefHat, Calendar, Target, Download, Eye, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DietPlan } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionGuard from '@/components/SubscriptionGuard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    const GREEN: [number, number, number] = [34, 197, 94];
    const BLACK: [number, number, number] = [15, 15, 18];
    const WHITE: [number, number, number] = [255, 255, 255];
    const GREY: [number, number, number] = [240, 240, 240];
    const TRAINER = 'JOSÉ ANTONIO FIGUEIRAS NÚÑEZ';
    const userName = (user?.user_metadata?.name || user?.email || 'CLIENTE').toString().toUpperCase();

    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    const drawHeader = () => {
      doc.setFillColor(...BLACK);
      doc.rect(0, 0, pageW, 18, 'F');
      doc.setFillColor(...GREEN);
      doc.rect(0, 18, pageW, 1.5, 'F');
      doc.setTextColor(...WHITE);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(userName, 12, 8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`PLAN DIETÉTICO · ${diet.title.toUpperCase()}`, 12, 13);
      doc.setTextColor(...GREEN);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(TRAINER, pageW - 12, 8, { align: 'right' });
      doc.setTextColor(...WHITE);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('NUTRICIÓN Y ENTRENAMIENTO', pageW - 12, 13, { align: 'right' });
    };

    const drawFooter = (pageNum: number) => {
      doc.setFillColor(...GREEN);
      doc.rect(0, pageH - 8, pageW, 8, 'F');
      doc.setTextColor(...WHITE);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`JAFN FIT · ${TRAINER}`, 12, pageH - 3);
      doc.text(String(pageNum), pageW - 12, pageH - 3, { align: 'right' });
    };

    // ===== COVER =====
    doc.setFillColor(...BLACK);
    doc.rect(0, 0, pageW, pageH, 'F');
    doc.setFillColor(...GREEN);
    doc.rect(0, pageH / 2 - 0.5, pageW, 1, 'F');
    doc.setTextColor(...WHITE);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('PLAN DIETÉTICO', pageW / 2, pageH / 2 - 30, { align: 'center' });
    doc.setTextColor(...GREEN);
    doc.setFontSize(22);
    doc.text('PERSONALIZADO', pageW / 2, pageH / 2 - 18, { align: 'center' });
    doc.setTextColor(...WHITE);
    doc.setFontSize(16);
    doc.text(userName, pageW / 2, pageH / 2 + 18, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(diet.title, pageW / 2, pageH / 2 + 28, { align: 'center' });
    doc.setTextColor(...GREEN);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(TRAINER, pageW / 2, pageH - 30, { align: 'center' });
    doc.setTextColor(...WHITE);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('NUTRICIÓN Y ENTRENAMIENTO', pageW / 2, pageH - 24, { align: 'center' });
    if (diet.calories_target) {
      doc.text(`Objetivo: ${diet.calories_target} kcal/día`, pageW / 2, pageH - 17, { align: 'center' });
    }
    doc.text(`Fecha: ${new Date(diet.created_at).toLocaleDateString('es-ES')}`, pageW / 2, pageH - 12, { align: 'center' });

    const days: any[] = Array.isArray(diet.meal_plan?.days) ? diet.meal_plan.days : [];

    const MEAL_ORDER = ['breakfast','desayuno','lunch','comida','snack','merienda','dinner','cena','otro'];
    const MEAL_LABEL: Record<string, string> = {
      breakfast: 'Desayuno', desayuno: 'Desayuno',
      lunch: 'Comida', comida: 'Comida',
      snack: 'Merienda', merienda: 'Merienda',
      dinner: 'Cena', cena: 'Cena', otro: 'Otro',
    };
    const groupMeals = (meals: any[]) => {
      const groups: Record<string, any[]> = {};
      (meals || []).forEach((m: any) => {
        const k = (m.meal_type || 'otro').toLowerCase();
        (groups[k] = groups[k] || []).push(m);
      });
      return Object.keys(groups)
        .sort((a, b) => MEAL_ORDER.indexOf(a) - MEAL_ORDER.indexOf(b))
        .map((k) => ({ type: k, label: MEAL_LABEL[k] || k, items: groups[k] }));
    };

    if (days.length > 0) {
      // ===== WEEKLY OVERVIEW =====
      doc.addPage();
      drawHeader();
      doc.setTextColor(...BLACK);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(`RESUMEN · PLAN DIETÉTICO DE ${userName}`, 12, 28);

      const allMealTypes = new Set<string>();
      days.forEach((d) => groupMeals(d.meals || []).forEach((g) => allMealTypes.add(g.type)));
      const mealCols = MEAL_ORDER.filter((m) => allMealTypes.has(m));
      const head = [['', ...days.map((d, i) => d.day || `Día ${i + 1}`)]];
      const body = mealCols.map((mt) => {
        const row: string[] = [MEAL_LABEL[mt] || mt];
        days.forEach((d) => {
          const g = groupMeals(d.meals || []).find((x) => x.type === mt);
          row.push(g ? g.items.map((m: any) => m.name).join('\no\n') : '—');
        });
        return row;
      });

      autoTable(doc, {
        startY: 34,
        head,
        body,
        theme: 'grid',
        headStyles: { fillColor: GREEN, textColor: WHITE, fontStyle: 'bold', halign: 'center' },
        alternateRowStyles: { fillColor: GREY },
        styles: { fontSize: 8, cellPadding: 2, valign: 'middle', halign: 'center' },
        columnStyles: { 0: { fillColor: BLACK, textColor: GREEN, fontStyle: 'bold', halign: 'center' } },
        margin: { left: 8, right: 8, bottom: 12 },
        didDrawPage: () => { drawFooter(doc.getCurrentPageInfo().pageNumber); },
      });

      // ===== PER-DAY DETAIL =====
      days.forEach((day: any, idx: number) => {
        doc.addPage();
        drawHeader();
        doc.setTextColor(...BLACK);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(day.day || `Día ${idx + 1}`, 12, 28);

        const groups = groupMeals(day.meals || []);
        const body: any[] = [];
        groups.forEach((g) => {
          const platos = g.items.map((m: any) => m.name).join(' o ');
          const recetas = g.items
            .map((m: any) => {
              const parts: string[] = [];
              if (g.items.length > 1) parts.push(`[${m.name}]`);
              if (m.quantity) parts.push(`CANTIDAD: ${m.quantity}`);
              if (m.calories != null) parts.push(`${m.calories} kcal`);
              if (m.notes) parts.push(`PREPARACIÓN: ${m.notes}`);
              return parts.join('  ');
            })
            .join('\n\n');
          body.push([g.label, platos, recetas || '—']);
        });

        autoTable(doc, {
          startY: 34,
          head: [['Comida', 'Platos', 'Recetas e ingredientes']],
          body,
          theme: 'grid',
          headStyles: { fillColor: GREEN, textColor: WHITE, fontStyle: 'bold', halign: 'center' },
          styles: { fontSize: 9, cellPadding: 3, valign: 'middle' },
          columnStyles: {
            0: { fillColor: BLACK, textColor: GREEN, fontStyle: 'bold', halign: 'center', cellWidth: 30 },
            1: { fillColor: GREY, fontStyle: 'bold', cellWidth: 55, halign: 'center' },
            2: { cellWidth: 'auto' },
          },
          margin: { left: 8, right: 8, bottom: 12 },
          didDrawPage: () => { drawFooter(doc.getCurrentPageInfo().pageNumber); },
        });
      });
    } else {
      doc.addPage();
      drawHeader();
      doc.setTextColor(...BLACK);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('PLAN DE COMIDAS', 12, 28);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(formatMealPlan(diet.meal_plan), pageW - 24);
      doc.text(lines, 12, 38);
      drawFooter(doc.getCurrentPageInfo().pageNumber);
    }

    doc.save(`dieta_${diet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
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
