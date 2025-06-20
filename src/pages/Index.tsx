
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

  useEffect(() => {
    console.log("User state changed:", { user: !!user, loading });
  }, [user, loading]);

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

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <section id="inicio">
          <HeroCarousel />
        </section>
        
        <section id="calculadora-imc">
          <BMICalculator />
        </section>
        
        <section id="cuestionario">
          <Questionnaire />
        </section>
        
        <section id="precios">
          <Pricing />
        </section>
        
        <section id="testimonios">
          <Testimonials />
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
