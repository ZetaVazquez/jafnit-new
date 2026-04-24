
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
  Lock,
  ChevronRight,
  ClipboardList
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
import InitialEvaluationModal from './InitialEvaluationModal';
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
  const [showInitialEvaluation, setShowInitialEvaluation] = useState(false);
  const [reopenEvaluation, setReopenEvaluation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  useEffect(() => {
    if (onViewChange) {
      onViewChange(currentView);
    }
  }, [currentView, onViewChange]);

  useEffect(() => {
    const checkWelcomeModalStatus = async () => {
      if (user && hasActiveSubscription) {
        try {
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
          const hasSeenWelcomeGift = localStorage.getItem(`welcome_gift_seen_${user.id}`);
          if (!hasSeenWelcomeGift) {
            setShowWelcomeModal(true);
          }
        }
      }
    };

    checkWelcomeModalStatus();
  }, [user, hasActiveSubscription]);

  // Comprobar si la evaluación inicial está pendiente (tras el primer pago)
  useEffect(() => {
    const checkInitialEvaluation = async () => {
      if (!user || !hasActiveSubscription) {
        setShowInitialEvaluation(false);
        return;
      }
      try {
        const { data } = await (supabase as any)
          .from('initial_evaluations')
          .select('completed')
          .eq('user_id', user.id)
          .maybeSingle();

        // Si no existe registro o no está completada, mostramos el modal bloqueante
        if (!data || !data.completed) {
          setShowInitialEvaluation(true);
        } else {
          setShowInitialEvaluation(false);
        }
      } catch (error) {
        console.error('Error checking initial evaluation:', error);
      }
    };
    checkInitialEvaluation();
  }, [user, hasActiveSubscription]);

  const handleCloseWelcomeModal = async () => {
    setShowWelcomeModal(false);
    if (user) {
      try {
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
        localStorage.setItem(`welcome_gift_seen_${user.id}`, 'true');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Client dashboard logout initiated...');
      await signOut();
      localStorage.clear();
      if (onLogout) {
        onLogout();
      }
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

  if (currentView === 'goals') return <MyGoals onGoBack={() => setCurrentView('dashboard')} />;
  if (currentView === 'progress') return <MyProgress onGoBack={() => setCurrentView('dashboard')} />;
  if (currentView === 'diets') return <MyDiets onGoBack={() => setCurrentView('dashboard')} />;
  if (currentView === 'workouts') return <MyWorkouts onGoBack={() => setCurrentView('dashboard')} />;
  if (currentView === 'profile') return <UserProfile onGoBack={() => setCurrentView('dashboard')} />;
  if (currentView === 'schedule') return <MySchedule onGoBack={() => setCurrentView('dashboard')} />;
  if (currentView === 'news') return <News onGoBack={() => setCurrentView('dashboard')} />;
  if (currentView === 'gifts') return <Gifts onGoBack={() => setCurrentView('dashboard')} />;

  const dashboardCards = [
    { id: 'profile', icon: User, title: 'Mi Perfil', desc: 'Gestiona tu información personal, configuraciones y preferencias.', premium: false },
    { id: 'goals', icon: Target, title: 'Mis Objetivos', desc: 'Sigue y completa tus objetivos diarios de salud y bienestar.', premium: false },
    { id: 'progress', icon: TrendingUp, title: 'Mi Progreso', desc: 'Visualiza tu evolución y logros a lo largo del tiempo.', premium: false },
    { id: 'questionnaire', icon: ClipboardList, title: 'Mi Cuestionario', desc: 'Revisa o actualiza tu Evaluación Inicial del Método JAFN.', premium: false },
    { id: 'diets', icon: Apple, title: 'Mi Plan Nutricional', desc: 'Accede a tu plan de alimentación personalizado y recetas.', premium: true },
    { id: 'workouts', icon: Dumbbell, title: 'Mis Entrenamientos', desc: 'Descubre y sigue tus rutinas de ejercicios personalizadas.', premium: true },
    { id: 'schedule', icon: Calendar, title: 'Mi Agenda', desc: 'Registra tu progreso diario con un calendario editable.', premium: true },
    { id: 'news', icon: Newspaper, title: 'Noticias', desc: 'Mantente al día con las últimas noticias y actualizaciones.', premium: false },
  ];

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <WelcomeGiftModal 
        isOpen={showWelcomeModal} 
        onClose={handleCloseWelcomeModal} 
      />

      <InitialEvaluationModal
        isOpen={showInitialEvaluation}
        onComplete={() => setShowInitialEvaluation(false)}
        allowClose
        onClose={() => setShowInitialEvaluation(false)}
      />

      {/* Re-apertura manual del cuestionario desde la tarjeta "Mi Cuestionario" */}
      <InitialEvaluationModal
        isOpen={reopenEvaluation}
        onComplete={() => setReopenEvaluation(false)}
        allowClose
        onClose={() => setReopenEvaluation(false)}
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar 
                className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-[hsl(var(--accent-green))] transition-all border-2 border-[hsl(var(--accent-green))]/30"
                onClick={() => setCurrentView('profile')}
              >
                <AvatarImage src={profile?.profile_image_url} />
                <AvatarFallback className="bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))]">
                  {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  ¡Hola, {profile?.name || 'Usuario'}!
                </h1>
                <p className="text-white/50">Bienvenido a tu panel de control</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleChatWithTrainer}
                className="text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleChatWithTrainer}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Bell className="w-4 h-4" />
              </Button>
              {onNavigateToHome && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToHome}
                  className="border-[hsl(var(--accent-green))]/30 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10 bg-transparent"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Página Principal
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/50 hover:text-red-400 hover:bg-red-500/10"
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

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => {
            const locked = card.premium && !hasActiveSubscription;
            return (
              <Card 
                key={card.id}
                className={`cursor-pointer border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group ${locked ? 'opacity-60' : ''}`}
                onClick={() => card.premium ? handlePremiumView(card.id) : setCurrentView(card.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-[hsl(var(--accent-green))]">
                    <card.icon className="w-5 h-5 mr-2" />
                    {card.title}
                    {locked && <Lock className="w-4 h-4 ml-2 text-white/30" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 mb-4">{card.desc}</p>
                  <Button 
                    className={`w-full ${locked 
                      ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10' 
                      : 'bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/30 border border-[hsl(var(--accent-green))]/30'
                    }`}
                    disabled={locked}
                  >
                    {locked ? 'Suscripción Requerida' : (
                      <span className="flex items-center gap-2">
                        Ver {card.title.replace('Mi ', '').replace('Mis ', '')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {/* Gifts Card */}
          <Card 
            className={`cursor-pointer border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm hover:bg-yellow-500/10 transition-all duration-300 ${!hasActiveSubscription ? 'opacity-60' : ''}`}
            onClick={() => hasActiveSubscription ? setCurrentView('gifts') : handlePremiumView('gifts')}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-400">
                <Gift className="w-5 h-5 mr-2" />
                Gifts 🎁
                {!hasActiveSubscription && <Lock className="w-4 h-4 ml-2 text-white/30" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/50 mb-4">
                Accede a tus regalos exclusivos y descargas especiales.
              </p>
              <Button 
                className={`w-full font-bold ${
                  hasActiveSubscription 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30'
                    : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
                }`}
                disabled={!hasActiveSubscription}
              >
                {hasActiveSubscription ? '🎁 Ver Regalos' : 'Suscripción Requerida'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
