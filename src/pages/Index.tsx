
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import HeroCarousel from "@/components/Home/HeroCarousel";
import AboutUs from "@/components/Home/AboutUs";
import Services from "@/components/Home/Services";
import Pricing from "@/components/Home/Pricing";
import Testimonials from "@/components/Home/Testimonials";
import FAQ from "@/components/Home/FAQ";
import Portfolio from "@/components/Home/Portfolio";
import Contact from "@/components/Home/Contact";
import BMICalculator from "@/components/Home/BMICalculator";
import News from "@/components/Home/News";
import Questionnaire from "@/components/Home/Questionnaire";
import ClientDashboard from "@/components/Dashboard/ClientDashboard";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import AuthModal from "@/components/Auth/AuthModal";
import PlanRecommendationModal from "@/components/Dashboard/PlanRecommendationModal";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<'public' | 'dashboard'>('public');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("User state changed:", { user: !!user, loading, isAdmin });
    
    if (user && !isAdmin) {
      // Check if user has an active subscription
      const checkSubscription = async () => {
        try {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();
          
          // Only show plan modal if user has no active subscription
          if (!subscription) {
            setShowPlanModal(true);
          }
        } catch (error) {
          // If no subscription found, show plan modal
          setShowPlanModal(true);
        }
      };
      
      checkSubscription();
      setCurrentView('dashboard');
    } else if (user && isAdmin) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('public');
    }
  }, [user, loading, isAdmin]);

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleStartQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleQuestionnaireClose = () => {
    setShowQuestionnaire(false);
  };

  const handleNavigateToHome = () => {
    setCurrentView('public');
  };

  const handleNavigateToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    try {
      console.log('Logout initiated...');
      await signOut();
      setCurrentView('public');
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nutrition-green-lighter to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green mx-auto"></div>
          <p className="mt-4 text-nutrition-gray">Cargando...</p>
        </div>
      </div>
    );
  }

  if (showQuestionnaire) {
    return (
      <Questionnaire 
        onComplete={handleQuestionnaireComplete}
        onClose={handleQuestionnaireClose}
      />
    );
  }

  // Show admin dashboard for admin users
  if (user && isAdmin && currentView === 'dashboard') {
    return (
      <AdminDashboard 
        onNavigateToHome={handleNavigateToHome}
        onLogout={handleLogout}
      />
    );
  }

  // Show client dashboard for regular users
  if (user && !isAdmin && currentView === 'dashboard') {
    return (
      <>
        <ClientDashboard 
          onNavigateToHome={handleNavigateToHome}
          onLogout={handleLogout}
        />
        <PlanRecommendationModal
          isOpen={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          onDecideLater={() => setShowPlanModal(false)}
          recommendedPlan="quarterly"
        />
      </>
    );
  }

  // Show public view
  return (
    <div className="min-h-screen">
      <Header 
        isLoggedIn={!!user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        onNavigateToDashboard={user ? handleNavigateToDashboard : undefined}
      />
      
      <main>
        <section id="inicio">
          <HeroCarousel onStartQuestionnaire={handleStartQuestionnaire} />
        </section>
        
        <section id="sobre-nosotros">
          <AboutUs />
        </section>
        
        <section id="servicios">
          <Services />
        </section>
        
        <section id="calculadora-imc">
          <BMICalculator />
        </section>
        
        <section id="precios">
          <Pricing onStartQuestionnaire={handleStartQuestionnaire} />
        </section>
        
        <section id="testimonios">
          <Testimonials onStartQuestionnaire={handleStartQuestionnaire} />
        </section>
        
        <section id="portfolio">
          <Portfolio />
        </section>
        
        <section id="noticias">
          <News />
        </section>
        
        <section id="faq">
          <FAQ />
        </section>
        
        <section id="contacto">
          <Contact />
        </section>
      </main>
      
      <Footer />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      
      <Toaster />
    </div>
  );
};

export default Index;
