
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Target, 
  TrendingUp, 
  Calendar, 
  Apple, 
  Dumbbell,
  LogOut,
  Bell,
  MessageCircle,
  Home,
  Newspaper,
  Gift,
  Lock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import MyGoals from './MyGoals';
import MyProgress from './MyProgress';
import MyDiets from './MyDiets';
import MyWorkouts from './MyWorkouts';
import UserProfile from './UserProfile';
import MySchedule from './MySchedule';
import News from './News';
import Gifts from './Gifts';
import WelcomeGiftModal from './WelcomeGiftModal';
import SubscriptionInfo from './SubscriptionInfo';
import { TodayGoalsWidget, WorkoutStatsWidget, ActiveDaysWidget } from './DashboardWidgets';
import { useToast } from '@/hooks/use-toast';

interface ClientDashboardProps {
  onNavigateToHome?: () => void;
  onLogout?: () => void;
  initialView?: string;
  onViewChange?: (view: string) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onNavigateToHome, onLogout, initialView = 'dashboard', onViewChange }) => {
  const { user, profile, signOut } = useAuth();
  const { hasActiveSubscription, loading: subscriptionLoading } = useSubscription();
  const [currentView, setCurrentView] = useState<string>(initialView);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { toast } = useToast();

  // Actualizar la vista cuando cambie el initialView
  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  // Notificar cambios de vista al componente padre
  useEffect(() => {
    if (onViewChange) {
      onViewChange(currentView);
    }
  }, [currentView, onViewChange]);

  // Verificar si debe mostrar el modal de bienvenida
  useEffect(() => {
    const checkWelcomeModalStatus = async () => {
      if (user && hasActiveSubscription) {
        try {
          // Verificar en la base de datos si ya se mostró el modal
          const { data: modalInteraction } = await supabase
            .from('user_modal_interactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('modal_type', 'welcome_gift')
            .maybeSingle();

          if (!modalInteraction) {
            setShowWelcomeModal(true);
          }
        } catch (error) {
          console.error('Error checking welcome modal status:', error);
          // Fallback a localStorage
          const hasSeenWelcomeGift = localStorage.getItem(`welcome_gift_seen_${user.id}`);
          if (!hasSeenWelcomeGift) {
            setShowWelcomeModal(true);
          }
        }
      }
    };

    checkWelcomeModalStatus();
  }, [user, hasActiveSubscription]);

  const handleCloseWelcomeModal = async () => {
    setShowWelcomeModal(false);
    if (user) {
      try {
        // Guardar en la base de datos que ya se mostró el modal
        await supabase
          .from('user_modal_interactions')
          .upsert({
            user_id: user.id,
            modal_type: 'welcome_gift'
          }, { 
            onConflict: 'user_id,modal_type' 
          });
      } catch (error) {
        console.error('Error saving welcome modal interaction:', error);
        // Fallback a localStorage
        localStorage.setItem(`welcome_gift_seen_${user.id}`, 'true');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Client dashboard logout initiated...');
      await signOut();
      
      // Clear any stored data
      localStorage.clear();
      
      // Call the onLogout callback if provided
      if (onLogout) {
        onLogout();
      }
      
      // Force reload to ensure clean state
      window.location.href = '/';
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error) {
      console.error('Error during logout from client dashboard:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión",
        variant: "destructive",
      });
      
      // Force logout even if there's an error
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const handleChatWithTrainer = () => {
    if (!hasActiveSubscription) {
      toast({
        title: "Suscripción requerida",
        description: "Necesitas una suscripción activa para acceder al chat con el entrenador",
        variant: "destructive"
      });
      return;
    }
    alert('Abriendo chat con tu entrenador personal...');
  };

  // Función para verificar acceso a secciones premium
  const handlePremiumView = (view: string) => {
    if (!hasActiveSubscription) {
      toast({
        title: "Suscripción requerida",
        description: "Esta función está disponible solo para usuarios con suscripción activa",
        variant: "destructive"
      });
      return;
    }
    setCurrentView(view);
  };

  if (currentView === 'goals') {
    return <MyGoals onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'progress') {
    return <MyProgress onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'diets') {
    return <MyDiets onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'workouts') {
    return <MyWorkouts onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'profile') {
    return <UserProfile onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'schedule') {
    return <MySchedule onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'news') {
    return <News onGoBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'gifts') {
    return <Gifts onGoBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {/* Welcome Gift Modal */}
      <WelcomeGiftModal 
        isOpen={showWelcomeModal} 
        onClose={handleCloseWelcomeModal} 
      />

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar 
                className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-nutrition-green transition-all"
                onClick={() => setCurrentView('profile')}
              >
                <AvatarImage src={profile?.profile_image_url} />
                <AvatarFallback className="bg-nutrition-green text-white">
                  {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-nutrition-black">
                  ¡Hola, {profile?.name || 'Usuario'}!
                </h1>
                <p className="text-nutrition-gray">Bienvenido a tu panel de control</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleChatWithTrainer}
                className="text-nutrition-green hover:bg-nutrition-green-lighter"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleChatWithTrainer}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TodayGoalsWidget />
          <WorkoutStatsWidget />
          <ActiveDaysWidget />
        </div>

        {/* Subscription Info */}
        <div className="mb-8">
          <SubscriptionInfo />
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('profile')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <User className="w-5 h-5 mr-2" />
                Mi Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Gestiona tu información personal, configuraciones y preferencias.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Goals Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('goals')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Target className="w-5 h-5 mr-2" />
                Mis Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Sigue y completa tus objetivos diarios de salud y bienestar.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Objetivos
              </Button>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('progress')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <TrendingUp className="w-5 h-5 mr-2" />
                Mi Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Visualiza tu evolución y logros a lo largo del tiempo.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Progreso
              </Button>
            </CardContent>
          </Card>

          {/* Diets Card */}
          <Card 
            className={`cursor-pointer hover:shadow-lg transition-shadow ${
              !hasActiveSubscription ? 'opacity-75' : ''
            }`}
            onClick={() => handlePremiumView('diets')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Apple className="w-5 h-5 mr-2" />
                Mi Plan Nutricional
                {!hasActiveSubscription && <Lock className="w-4 h-4 ml-2 text-gray-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Accede a tu plan de alimentación personalizado y recetas.
              </p>
              <Button 
                className={`w-full ${
                  hasActiveSubscription 
                    ? 'bg-nutrition-green hover:bg-nutrition-green-dark text-white'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!hasActiveSubscription}
              >
                {hasActiveSubscription ? 'Ver Plan' : 'Suscripción Requerida'}
              </Button>
            </CardContent>
          </Card>

          {/* Workouts Card */}
          <Card 
            className={`cursor-pointer hover:shadow-lg transition-shadow ${
              !hasActiveSubscription ? 'opacity-75' : ''
            }`}
            onClick={() => handlePremiumView('workouts')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Dumbbell className="w-5 h-5 mr-2" />
                Mis Entrenamientos
                {!hasActiveSubscription && <Lock className="w-4 h-4 ml-2 text-gray-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Descubre y sigue tus rutinas de ejercicios personalizadas.
              </p>
              <Button 
                className={`w-full ${
                  hasActiveSubscription 
                    ? 'bg-nutrition-green hover:bg-nutrition-green-dark text-white'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!hasActiveSubscription}
              >
                {hasActiveSubscription ? 'Ver Entrenamientos' : 'Suscripción Requerida'}
              </Button>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card 
            className={`cursor-pointer hover:shadow-lg transition-shadow ${
              !hasActiveSubscription ? 'opacity-75' : ''
            }`}
            onClick={() => handlePremiumView('schedule')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Calendar className="w-5 h-5 mr-2" />
                Mi Agenda
                {!hasActiveSubscription && <Lock className="w-4 h-4 ml-2 text-gray-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Registra tu progreso diario con un calendario editable.
              </p>
              <Button 
                className={`w-full ${
                  hasActiveSubscription 
                    ? 'bg-nutrition-green hover:bg-nutrition-green-dark text-white'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!hasActiveSubscription}
              >
                {hasActiveSubscription ? 'Ver Agenda' : 'Suscripción Requerida'}
              </Button>
            </CardContent>
          </Card>

          {/* News Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('news')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <Newspaper className="w-5 h-5 mr-2" />
                Noticias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Mantente al día con las últimas noticias y actualizaciones.
              </p>
              <Button className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white">
                Ver Noticias
              </Button>
            </CardContent>
          </Card>

          {/* Gifts Card */}
          <Card 
            className={`cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 ${
              !hasActiveSubscription ? 'opacity-75' : ''
            }`}
            onClick={() => hasActiveSubscription ? setCurrentView('gifts') : handlePremiumView('gifts')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <Gift className="w-5 h-5 mr-2" />
                Gifts 🎁
                {!hasActiveSubscription && <Lock className="w-4 h-4 ml-2 text-gray-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                Accede a tus regalos exclusivos y descargas especiales.
              </p>
              <Button 
                className={`w-full font-bold ${
                  hasActiveSubscription 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!hasActiveSubscription}
              >
                {hasActiveSubscription ? 'Ver Regalos' : 'Suscripción Requerida'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
