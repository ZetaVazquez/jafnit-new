import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, Dumbbell, DollarSign, TrendingUp, Calendar, Home, LogOut, Clock, PlusCircle, MessageSquare, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AdminClientsTable from './AdminClientsTable';
import AdminDietPlanManager from './AdminDietPlanManager';
import AdminWorkoutManager from './AdminWorkoutManager';
import AdminEarnings from './AdminEarnings';
import AdminPendingPayments from './AdminPendingPayments';
import AdminNewsManager from './AdminNewsManager';
import AdminTestimonials from './AdminTestimonials';
import AdminQuestionnaireResponses from './AdminQuestionnaireResponses';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  onNavigateToHome: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToHome, onLogout }) => {
  const [currentView, setCurrentView] = useState<'overview' | 'clients' | 'diet' | 'workout' | 'earnings' | 'pending-payments' | 'news' | 'testimonials' | 'questionnaire'>('overview');
  const { user, signOut } = useAuth();
  const [totalClients, setTotalClients] = useState(0);
  const [totalDietPlans, setTotalDietPlans] = useState(0);
  const [totalWorkoutPlans, setTotalWorkoutPlans] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [totalNews, setTotalNews] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { count: clientsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .neq('email', 'josefiguenu@gmail.com')
          .neq('email', 'consultajafn@gmail.com')
          .neq('email', 'zaiidav347@gmail.com');
        setTotalClients(clientsCount || 0);

        const { count: dietPlansCount } = await supabase
          .from('diet_plans')
          .select('*', { count: 'exact' });
        setTotalDietPlans(dietPlansCount || 0);

        const { count: workoutPlansCount } = await supabase
          .from('workout_plans')
          .select('*', { count: 'exact' });
        setTotalWorkoutPlans(workoutPlansCount || 0);

        const { data: earningsData, error: earningsError } = await supabase
          .from('admin_earnings')
          .select('amount')
          .gte('earning_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

        if (earningsError) {
          console.error('Error fetching earnings:', earningsError);
        } else {
          const totalEarnings = earningsData?.reduce((sum, earning) => sum + earning.amount, 0) || 0;
          setMonthlyEarnings(totalEarnings);
        }

        const { count: newsCount } = await supabase
          .from('admin_news')
          .select('*', { count: 'exact' });
        setTotalNews(newsCount || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAdminLogout = async () => {
    try {
      await signOut();
      onLogout();
      toast({ title: "Sesión cerrada", description: "Has cerrado sesión exitosamente" });
    } catch (error) {
      console.error('Error during admin logout:', error);
      toast({ title: "Error", description: "Hubo un problema al cerrar sesión", variant: "destructive" });
    }
  };

  const adminCards = [
    { key: 'clients' as const, icon: Users, label: 'Clientes', value: `${totalClients} usuarios`, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/20' },
    { key: 'diet' as const, icon: FileText, label: 'Planes de Dieta', value: `${totalDietPlans} planes`, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/20' },
    { key: 'workout' as const, icon: Dumbbell, label: 'Planes de Ejercicio', value: `${totalWorkoutPlans} planes`, iconColor: 'text-red-400', iconBg: 'bg-red-500/20' },
    { key: 'pending-payments' as const, icon: Clock, label: 'Pagos Pendientes', value: 'Gestionar pagos', iconColor: 'text-orange-400', iconBg: 'bg-orange-500/20' },
    { key: 'earnings' as const, icon: DollarSign, label: 'Ganancias Mensuales', value: `€${monthlyEarnings}`, iconColor: 'text-yellow-400', iconBg: 'bg-yellow-500/20' },
    { key: 'news' as const, icon: PlusCircle, label: 'Creación de Noticias', value: `${totalNews} noticias`, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/20' },
    { key: 'testimonials' as const, icon: MessageSquare, label: 'Gestión de Comentarios', value: 'Revisar testimonios', iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/20' },
    { key: 'questionnaire' as const, icon: ClipboardList, label: 'Respuestas Cuestionarios', value: 'Ver respuestas', iconColor: 'text-teal-400', iconBg: 'bg-teal-500/20' },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'clients': return <AdminClientsTable onGoBack={() => setCurrentView('overview')} />;
      case 'diet': return <AdminDietPlanManager onGoBack={() => setCurrentView('overview')} />;
      case 'workout': return <AdminWorkoutManager onGoBack={() => setCurrentView('overview')} />;
      case 'earnings': return <AdminEarnings onGoBack={() => setCurrentView('overview')} />;
      case 'pending-payments': return <AdminPendingPayments onGoBack={() => setCurrentView('overview')} />;
      case 'news': return <AdminNewsManager onGoBack={() => setCurrentView('overview')} />;
      case 'testimonials': return <AdminTestimonials onBack={() => setCurrentView('overview')} />;
      case 'questionnaire': return <AdminQuestionnaireResponses onGoBack={() => setCurrentView('overview')} />;
      default:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[hsl(var(--accent-green))]">Panel de Administración</h1>
                <p className="text-white/50 mt-1">Bienvenido, {user?.email}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={onNavigateToHome} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">
                  <Home className="w-4 h-4 mr-2" />Inicio
                </Button>
                <Button onClick={handleAdminLogout} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">
                  <LogOut className="w-4 h-4 mr-2" />Cerrar Sesión
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {adminCards.map(({ key, icon: Icon, label, value, iconColor, iconBg }) => (
                <Card
                  key={key}
                  className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_25px_hsla(142,71%,45%,0.15)]"
                  onClick={() => setCurrentView(key)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-xl ${iconBg}`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-white">{label}</h3>
                        <p className="text-white/50">{value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
