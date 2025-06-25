
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
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { user, isAdmin } = useAuth();

  const handleStartQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  const handleCloseQuestionnaire = () => {
    setShowQuestionnaire(false);
  };

  const handleGoToDashboard = () => {
    setShowDashboard(true);
  };

  const handleBackToHome = () => {
    setShowDashboard(false);
  };

  const handleLogout = () => {
    setShowDashboard(false);
  };

  if (showDashboard && user) {
    return isAdmin ? (
      <AdminDashboard onNavigateToHome={handleBackToHome} onLogout={handleLogout} />
    ) : (
      <ClientDashboard onBackToHome={handleBackToHome} />
    );
  }

  if (showQuestionnaire) {
    return (
      <Questionnaire 
        onClose={handleCloseQuestionnaire}
        onComplete={handleGoToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroCarousel onStartQuestionnaire={handleStartQuestionnaire} />
        <AboutUs />
        <Services />
        <Testimonials />
        <Pricing onStartQuestionnaire={handleStartQuestionnaire} />
        <BMICalculator />
        <News />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
