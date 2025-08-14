
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
import PlanRecommendationModal from '@/components/Dashboard/PlanRecommendationModal';

const Index = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRegistrationAfterQuestionnaire, setShowRegistrationAfterQuestionnaire] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [dashboardView, setDashboardView] = useState<string>('dashboard');
  const [showPlanModal, setShowPlanModal] = useState(false);
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
    setDashboardView('dashboard'); // Reset dashboard view
  };

  const handleLogout = () => {
    setShowDashboard(false);
    setDashboardView('dashboard'); // Reset dashboard view
  };

  // Navigation functions for sidebar
  const handleNavigateToProfile = () => {
    setDashboardView('profile');
    setShowDashboard(true);
  };

  const handleNavigateToGoals = () => {
    setDashboardView('goals');
    setShowDashboard(true);
  };

  const handleNavigateToDiets = () => {
    setDashboardView('diets');
    setShowDashboard(true);
  };

  const handleNavigateToWorkouts = () => {
    setDashboardView('workouts');
    setShowDashboard(true);
  };

  const handleNavigateToSchedule = () => {
    setDashboardView('schedule');
    setShowDashboard(true);
  };

  const handleNavigateToChangePlan = () => {
    setShowPlanModal(true);
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
        <ClientDashboard 
          onNavigateToHome={handleBackToHome} 
          onLogout={handleLogout}
          initialView={dashboardView}
          onViewChange={setDashboardView}
        />
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
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToGoals={handleNavigateToGoals}
            onNavigateToDiets={handleNavigateToDiets}
            onNavigateToWorkouts={handleNavigateToWorkouts}
            onNavigateToSchedule={handleNavigateToSchedule}
            onNavigateToChangePlan={handleNavigateToChangePlan}
            showDashboard={showRegistrationAfterQuestionnaire}
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
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToGoals={handleNavigateToGoals}
            onNavigateToDiets={handleNavigateToDiets}
            onNavigateToWorkouts={handleNavigateToWorkouts}
            onNavigateToSchedule={handleNavigateToSchedule}
            onNavigateToChangePlan={handleNavigateToChangePlan}
            showDashboard={showClientForm}
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
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToGoals={handleNavigateToGoals}
          onNavigateToDiets={handleNavigateToDiets}
          onNavigateToWorkouts={handleNavigateToWorkouts}
          onNavigateToSchedule={handleNavigateToSchedule}
          onNavigateToChangePlan={handleNavigateToChangePlan}
          showDashboard={showDashboard}
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
        <PlanRecommendationModal
          isOpen={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          onDecideLater={() => setShowPlanModal(false)}
          recommendedPlan="premium"
        />
      </DynamicBackground>
    </div>
  );
};

export default Index;
