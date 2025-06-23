
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Apple, 
  Dumbbell,
  LogOut,
  Bell,
  MessageCircle,
  Home,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AdminClientsTable from './AdminClientsTable';
import AdminDietManager from './AdminDietManager';
import AdminWorkoutManager from './AdminWorkoutManager';
import AdminEarnings from './AdminEarnings';

interface AdminDashboardProps {
  onNavigateToHome?: () => void;
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToHome, onLogout }) => {
  const { user, profile, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const handleSignOut = async () => {
    await signOut();
    if (onLogout) {
      onLogout();
    }
  };

  const handleChatWithClients = () => {
    alert('Abriendo chat con tus clientes...');
  };

  if (currentView === 'clients') {
    return <AdminClientsTable onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'diets') {
    return <AdminDietManager onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'workouts') {
    return <AdminWorkoutManager onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'earnings') {
    return <AdminEarnings onGoBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar 
                className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-nutrition-green transition-all"
              >
                <AvatarImage src={profile?.profile_image_url} />
                <AvatarFallback className="bg-nutrition-green text-white">
                  JA
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-nutrition-black">
                  ¡Hola, José Antonio!
                </h1>
                <p className="text-nutrition-gray">Panel de Administrador</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleChatWithClients}
                className="text-nutrition-green hover:bg-nutrition-green-lighter"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat con Clientes
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleChatWithClients}
              >
                <Bell className="w-4 h-4" />
              </Button>
              {onNavigateToHome && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToHome}
                  className="text-nutrition-green border-nutrition-green hover:bg-nutrition-green hover:text-white"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Página Principal
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-nutrition-gray hover:text-nutrition-green"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Clientes Activos</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Users className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Dietas Asignadas</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Apple className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Entrenamientos</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <Dumbbell className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Ingresos Mes</p>
                  <p className="text-2xl font-bold">€2,340</p>
                </div>
                <DollarSign className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Clients Management Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('clients')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Users className="w-5 h-5 mr-2" />
                Gestión de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Ver progreso de clientes, gestionar suscripciones y eliminar usuarios.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Clientes
              </Button>
            </CardContent>
          </Card>

          {/* Diet Management Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('diets')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Apple className="w-5 h-5 mr-2" />
                Sus Dietas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Crear y asignar planes nutricionales personalizados para cada cliente.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Gestionar Dietas
              </Button>
            </CardContent>
          </Card>

          {/* Workout Management Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('workouts')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Dumbbell className="w-5 h-5 mr-2" />
                Sus Entrenamientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Diseñar y asignar rutinas de ejercicios adaptadas a cada cliente.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Gestionar Entrenamientos
              </Button>
            </CardContent>
          </Card>

          {/* Earnings Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('earnings')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <TrendingUp className="w-5 h-5 mr-2" />
                Ganancias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Revisar ingresos mensuales y anuales, estadísticas financieras.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Ganancias
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
