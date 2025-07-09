import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Dumbbell, DollarSign, TrendingUp, Calendar, Home, LogOut, Clock, PlusCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AdminClientsTable from './AdminClientsTable';
import AdminDietPlanManager from './AdminDietPlanManager';
import AdminWorkoutManager from './AdminWorkoutManager';
import AdminEarnings from './AdminEarnings';
import AdminPendingPayments from './AdminPendingPayments';
import AdminNewsManager from './AdminNewsManager';
import AdminTestimonials from './AdminTestimonials';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  onNavigateToHome: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToHome, onLogout }) => {
  const [currentView, setCurrentView] = useState<'overview' | 'clients' | 'diet' | 'workout' | 'earnings' | 'pending-payments' | 'news' | 'testimonials'>('overview');
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
        // Fetch total clients
        const { count: clientsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });
        setTotalClients(clientsCount || 0);

        // Fetch total diet plans
        const { count: dietPlansCount } = await supabase
          .from('diet_plans')
          .select('*', { count: 'exact' });
        setTotalDietPlans(dietPlansCount || 0);

        // Fetch total workout plans
        const { count: workoutPlansCount } = await supabase
          .from('workout_plans')
          .select('*', { count: 'exact' });
        setTotalWorkoutPlans(workoutPlansCount || 0);

        // Fetch monthly earnings
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

        // Fetch total news
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
      console.log('Admin logout initiated...');
      await signOut();
      
      // Call the onLogout callback
      onLogout();
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error) {
      console.error('Error during admin logout:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'clients':
        return <AdminClientsTable onGoBack={() => setCurrentView('overview')} />;
      case 'diet':
        return <AdminDietPlanManager onGoBack={() => setCurrentView('overview')} />;
      case 'workout':
        return <AdminWorkoutManager onGoBack={() => setCurrentView('overview')} />;
      case 'earnings':
        return <AdminEarnings onGoBack={() => setCurrentView('overview')} />;
      case 'pending-payments':
        return <AdminPendingPayments onGoBack={() => setCurrentView('overview')} />;
      case 'news':
        return <AdminNewsManager onGoBack={() => setCurrentView('overview')} />;
      case 'testimonials':
        return <AdminTestimonials onBack={() => setCurrentView('overview')} />;
      default:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-nutrition-green">Panel de Administración</h1>
                <p className="text-nutrition-gray">Bienvenido, {user?.email}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={onNavigateToHome}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Inicio
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleAdminLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('clients')}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nutrition-black">Clientes</h3>
                      <p className="text-nutrition-gray">{totalClients} usuarios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('diet')}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nutrition-black">Planes de Dieta</h3>
                      <p className="text-nutrition-gray">{totalDietPlans} planes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('workout')}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <Dumbbell className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nutrition-black">Planes de Ejercicio</h3>
                      <p className="text-nutrition-gray">{totalWorkoutPlans} planes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('pending-payments')}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nutrition-black">Pagos Pendientes</h3>
                      <p className="text-nutrition-gray">Gestionar pagos por Bizum</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('earnings')}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nutrition-black">Ganancias Mensuales</h3>
                      <p className="text-nutrition-gray">€{monthlyEarnings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('news')}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <PlusCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nutrition-black">Creación de Noticias</h3>
                      <p className="text-nutrition-gray">{totalNews} noticias creadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('testimonials')}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nutrition-black">Gestión de Comentarios</h3>
                      <p className="text-nutrition-gray">Revisar testimonios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
