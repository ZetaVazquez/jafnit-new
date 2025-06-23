
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import HeroCarousel from "@/components/Home/HeroCarousel";
import Pricing from "@/components/Home/Pricing";
import Testimonials from "@/components/Home/Testimonials";
import FAQ from "@/components/Home/FAQ";
import Portfolio from "@/components/Home/Portfolio";
import Contact from "@/components/Home/Contact";
import BMICalculator from "@/components/Home/BMICalculator";
import News from "@/components/Home/News";
import Questionnaire from "@/components/Home/Questionnaire";
import ClientDashboard from "@/components/Dashboard/ClientDashboard";
import AuthModal from "@/components/Auth/AuthModal";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    console.log("User state changed:", { user: !!user, loading });
  }, [user, loading]);

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
    // Optionally show auth modal after questionnaire
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleQuestionnaireClose = () => {
    setShowQuestionnaire(false);
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

  if (user) {
    return <ClientDashboard />;
  }

  if (showQuestionnaire) {
    return (
      <Questionnaire 
        onComplete={handleQuestionnaireComplete}
        onClose={handleQuestionnaireClose}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        isLoggedIn={false}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={() => {}}
      />
      
      <main>
        <section id="inicio">
          <HeroCarousel onStartQuestionnaire={handleStartQuestionnaire} />
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
