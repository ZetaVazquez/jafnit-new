
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import HeroCarousel from '@/components/Home/HeroCarousel';
import AboutUs from '@/components/Home/AboutUs';
import Services from '@/components/Home/Services';
import Testimonials from '@/components/Home/Testimonials';
import Pricing from '@/components/Home/Pricing';
import Contact from '@/components/Home/Contact';
import FAQ from '@/components/Home/FAQ';
import News from '@/components/Home/News';
import BMICalculator from '@/components/Home/BMICalculator';
import Questionnaire from '@/components/Home/Questionnaire';
import ClientDashboard from '@/components/Dashboard/ClientDashboard';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import SubscriptionGuard from '@/components/SubscriptionGuard';
import AuthModal from '@/components/Auth/AuthModal';
import { ClientFormModal } from '@/components/Auth/ClientFormModal';
import { useAuth } from '@/hooks/useAuth';
import DynamicBackground from '@/components/Layout/DynamicBackground';

const Index = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRegistrationAfterQuestionnaire, setShowRegistrationAfterQuestionnaire] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const { user, isAdmin } = useAuth();

  const handleStartQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  const handleCloseQuestionnaire = () => {
    setShowQuestionnaire(false);
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    setShowRegistrationAfterQuestionnaire(true);
  };

  const handleGoToDashboard = () => {
    setShowDashboard(true);
  };

  const handleRegistrationComplete = () => {
    setShowRegistrationAfterQuestionnaire(false);
    setShowClientForm(true);
  };

  const handleClientFormComplete = () => {
    setShowClientForm(false);
    setShowDashboard(true);
  };

  const handleBackToHome = () => {
    setShowDashboard(false);
  };

  const handleLogout = () => {
    setShowDashboard(false);
  };

  const handleLogin = () => {
    // Login logic handled by auth system
  };

  const handleRegister = () => {
    handleStartQuestionnaire();
  };

  if (showDashboard && user) {
    return isAdmin ? (
      <AdminDashboard onNavigateToHome={handleBackToHome} onLogout={handleLogout} />
    ) : (
      <SubscriptionGuard strictMode={true}>
        <ClientDashboard onNavigateToHome={handleBackToHome} onLogout={handleLogout} />
      </SubscriptionGuard>
    );
  }

  if (showQuestionnaire) {
    return (
      <Questionnaire 
        onClose={handleCloseQuestionnaire}
        onComplete={handleQuestionnaireComplete}
      />
    );
  }

  if (showRegistrationAfterQuestionnaire) {
    return (
      <div className="min-h-screen">
        <DynamicBackground>
          <Header 
            isLoggedIn={!!user}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            onNavigateToHome={handleBackToHome}
            onNavigateToDashboard={handleGoToDashboard}
          />
          <AuthModal 
            isOpen={true}
            onClose={() => setShowRegistrationAfterQuestionnaire(false)}
            onSuccess={handleRegistrationComplete}
            initialTab="register"
          />
        </DynamicBackground>
      </div>
    );
  }

  if (showClientForm) {
    return (
      <div className="min-h-screen">
        <DynamicBackground>
          <Header 
            isLoggedIn={!!user}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            onNavigateToHome={handleBackToHome}
            onNavigateToDashboard={handleGoToDashboard}
          />
          <ClientFormModal 
            isOpen={true}
            onClose={() => setShowClientForm(false)}
            onSuccess={handleClientFormComplete}
          />
        </DynamicBackground>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DynamicBackground>
        <Header 
          isLoggedIn={!!user}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onLogout={handleLogout}
          onNavigateToHome={handleBackToHome}
          onNavigateToDashboard={handleGoToDashboard}
          onStartQuestionnaire={handleStartQuestionnaire}
        />
        <main>
          <HeroCarousel onStartQuestionnaire={handleStartQuestionnaire} />
          <AboutUs onQuestionnaireOpen={handleStartQuestionnaire} />
          <Services />
          <Testimonials onStartQuestionnaire={handleStartQuestionnaire} />
          <Pricing onStartQuestionnaire={handleStartQuestionnaire} />
          <BMICalculator />
          <News />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </DynamicBackground>
    </div>
  );
};

export default Index;
