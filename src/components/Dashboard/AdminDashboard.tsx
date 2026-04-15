import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users, FileText, Dumbbell, DollarSign, Home, LogOut, Clock, PlusCircle, MessageSquare, ClipboardList } from 'lucide-react';
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

        if (!earningsError) {
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

  const cards = [
    { view: 'clients' as const, icon: Users, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30', iconColor: 'text-blue-400', title: 'Clientes', subtitle: `${totalClients} usuarios` },
    { view: 'diet' as const, icon: FileText, color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30', iconColor: 'text-emerald-400', title: 'Planes de Dieta', subtitle: `${totalDietPlans} planes` },
    { view: 'workout' as const, icon: Dumbbell, color: 'from-red-500/20 to-red-600/10 border-red-500/30', iconColor: 'text-red-400', title: 'Planes de Ejercicio', subtitle: `${totalWorkoutPlans} planes` },
    { view: 'pending-payments' as const, icon: Clock, color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30', iconColor: 'text-orange-400', title: 'Pagos Pendientes', subtitle: 'Gestionar pagos' },
    { view: 'earnings' as const, icon: DollarSign, color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30', iconColor: 'text-yellow-400', title: 'Ganancias Mensuales', subtitle: `€${monthlyEarnings}` },
    { view: 'news' as const, icon: PlusCircle, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30', iconColor: 'text-purple-400', title: 'Creación de Noticias', subtitle: `${totalNews} noticias` },
    { view: 'testimonials' as const, icon: MessageSquare, color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30', iconColor: 'text-indigo-400', title: 'Gestión de Comentarios', subtitle: 'Revisar testimonios' },
    { view: 'questionnaire' as const, icon: ClipboardList, color: 'from-teal-500/20 to-teal-600/10 border-teal-500/30', iconColor: 'text-teal-400', title: 'Respuestas de Cuestionarios', subtitle: 'Ver respuestas' },
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
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Panel de <span className="text-[hsl(var(--accent-green-light))] italic">Administración</span>
                </h1>
                <p className="text-white/50 mt-1">Bienvenido, {user?.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={onNavigateToHome}
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Inicio
                </Button>
                <Button
                  onClick={handleAdminLogout}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.view}
                    onClick={() => setCurrentView(card.view)}
                    className={`group relative cursor-pointer rounded-xl border bg-gradient-to-br ${card.color} backdrop-blur-sm p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/20`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-white/5 ${card.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                        <p className="text-white/50 text-sm">{card.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
