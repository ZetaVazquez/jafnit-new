
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import HeroCarousel from '@/components/Home/HeroCarousel';
import Portfolio from '@/components/Home/Portfolio';
import News from '@/components/Home/News';
import Testimonials from '@/components/Home/Testimonials';
import FAQ from '@/components/Home/FAQ';
import Pricing from '@/components/Home/Pricing';
import BMICalculator from '@/components/Home/BMICalculator';
import Contact from '@/components/Home/Contact';
import Questionnaire from '@/components/Home/Questionnaire';
import LoginModal from '@/components/Auth/LoginModal';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleStartQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    setShowLogin(true);
  };

  const handleLogin = (email: string, password: string) => {
    // Simulate login
    console.log('Login attempt:', { email, password });
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        <HeroCarousel onStartQuestionnaire={handleStartQuestionnaire} />
        
        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-nutrition-black mb-6">
                  Sobre Nosotros
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  José Antonio es un profesional certificado en nutrición y entrenamiento personal 
                  con más de 10 años de experiencia transformando vidas a través de planes 
                  personalizados y seguimiento profesional.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Nuestro enfoque se basa en la ciencia, la personalización y el acompañamiento 
                  constante para asegurar que alcances tus objetivos de forma sostenible y saludable.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-nutrition-green">500+</div>
                    <div className="text-gray-600">Clientes Transformados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-nutrition-green">10+</div>
                    <div className="text-gray-600">Años de Experiencia</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="José Antonio - Nutricionista y Entrenador"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 rounded-lg border-4 border-nutrition-green border-opacity-20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-nutrition-black mb-4">
                Nuestros Servicios
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ofrecemos soluciones integrales para tu bienestar físico y nutricional
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Nutrición Personalizada',
                  description: 'Planes alimentarios adaptados a tus necesidades, objetivos y preferencias',
                  icon: '🥗',
                },
                {
                  title: 'Entrenamiento Personal',
                  description: 'Rutinas diseñadas específicamente para ti con seguimiento profesional',
                  icon: '💪',
                },
                {
                  title: 'Seguimiento Continuo',
                  description: 'Monitoreo constante de tu progreso con ajustes según resultados',
                  icon: '📊',
                },
                {
                  title: 'Educación Nutricional',
                  description: 'Aprende hábitos saludables para mantener resultados a largo plazo',
                  icon: '🎓',
                },
                {
                  title: 'Suplementación',
                  description: 'Recomendaciones personalizadas de suplementos según tus necesidades',
                  icon: '💊',
                },
                {
                  title: 'Soporte 24/7',
                  description: 'Asistencia y motivación constante a través de nuestra plataforma',
                  icon: '🤝',
                },
              ].map((service, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-nutrition-black mb-4">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Portfolio />
        <News />
        <Testimonials onStartQuestionnaire={handleStartQuestionnaire} />
        <FAQ />
        <Pricing onStartQuestionnaire={handleStartQuestionnaire} />
        <BMICalculator />
        <Contact />

        {/* Call to Action */}
        <section className="py-20 bg-nutrition-green text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              ¿Listo para Transformar tu Vida?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Comienza tu viaje hacia una vida más saludable hoy mismo
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-nutrition-orange hover:bg-nutrition-orange-dark text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Quiero mi Cambio
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modals */}
      {showQuestionnaire && (
        <Questionnaire
          onComplete={handleQuestionnaireComplete}
          onClose={() => setShowQuestionnaire(false)}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default Index;
