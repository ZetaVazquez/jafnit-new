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
import ClientDashboard from '@/components/Dashboard/ClientDashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [userName, setUserName] = useState('');

  const handleStartQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    setLoginMode('register');
    setShowLogin(true);
  };

  const handleLogin = (email: string, password: string) => {
    // Simulate login
    console.log('Login attempt:', { email, password });
    setIsLoggedIn(true);
    setUserName(email.split('@')[0]); // Use first part of email as name
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    setLoginMode('login');
    setShowLogin(true);
  };

  const handleShowRegister = () => {
    setLoginMode('register');
    setShowLogin(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  // If logged in, show dashboard
  if (isLoggedIn) {
    return <ClientDashboard userName={userName} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogin={handleShowLogin}
        onRegister={handleShowRegister}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        <HeroCarousel onStartQuestionnaire={handleStartQuestionnaire} />
        
        {/* About Section */}
        <section id="about" className="py-20 bg-gradient-to-br from-nutrition-green-lighter to-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-4xl font-bold text-nutrition-black mb-8">
                  Sobre Nosotros
                </h2>
                
                {/* Quien soy */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-nutrition-green-forest mb-4">¿Quién soy?</h3>
                  <p className="text-lg text-nutrition-gray mb-4">
                    Soy José Antonio, un profesional certificado en nutrición y entrenamiento personal 
                    con una pasión genuina por ayudar a las personas a transformar sus vidas a través 
                    de hábitos saludables y sostenibles.
                  </p>
                </div>

                {/* Mi experiencia */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-nutrition-green-emerald mb-4">Mi Experiencia</h3>
                  <p className="text-lg text-nutrition-gray mb-4">
                    Con más de 10 años de experiencia en el sector de la salud y el fitness, 
                    he tenido el privilegio de acompañar a más de 500 personas en su viaje 
                    hacia una vida más saludable y plena.
                  </p>
                </div>

                {/* Como puedo ayudarte */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-nutrition-green-dark mb-4">¿Cómo puedo ayudarte?</h3>
                  <p className="text-lg text-nutrition-gray mb-4">
                    Mi enfoque se basa en la personalización, la ciencia y el acompañamiento 
                    constante. Creo planes únicos que se adaptan a tu estilo de vida, 
                    objetivos y preferencias, asegurando resultados sostenibles.
                  </p>
                </div>

                {/* Frase motivadora */}
                <div className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald p-6 rounded-lg shadow-lg">
                  <p className="text-white text-lg font-medium italic text-center">
                    "Pequeños cambios, grandes resultados"
                  </p>
                  <p className="text-white text-base mt-2 text-center opacity-90">
                    Porque mejorar tu salud no significa restringirte, sino aprender a comer y entrenar de forma inteligente
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-nutrition-green-emerald">500+</div>
                    <div className="text-nutrition-gray">Clientes Transformados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-nutrition-green-emerald">10+</div>
                    <div className="text-nutrition-gray">Años de Experiencia</div>
                  </div>
                </div>
              </div>
              
              <div className="relative order-1 lg:order-2">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="José Antonio - Nutricionista y Entrenador"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 rounded-lg border-4 border-nutrition-green-emerald border-opacity-20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gradient-to-br from-nutrition-gray-lighter to-nutrition-green-lighter">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-nutrition-black mb-4">
                Nuestros Servicios
              </h2>
              <p className="text-xl text-nutrition-gray max-w-2xl mx-auto">
                Ofrecemos soluciones integrales para tu bienestar físico y nutricional
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Nutrición Personalizada',
                  description: 'Planes alimentarios adaptados a tus necesidades, objetivos y preferencias',
                  icon: '🥗',
                  color: 'from-nutrition-green to-nutrition-green-emerald'
                },
                {
                  title: 'Entrenamiento Personal',
                  description: 'Rutinas diseñadas específicamente para ti con seguimiento profesional',
                  icon: '💪',
                  color: 'from-nutrition-green-emerald to-nutrition-green-lime'
                },
                {
                  title: 'Seguimiento Continuo',
                  description: 'Monitoreo constante de tu progreso con ajustes según resultados',
                  icon: '📊',
                  color: 'from-nutrition-green-lime to-nutrition-green'
                },
                {
                  title: 'Educación Nutricional',
                  description: 'Aprende hábitos saludables para mantener resultados a largo plazo',
                  icon: '🎓',
                  color: 'from-nutrition-green-dark to-nutrition-green-forest'
                },
                {
                  title: 'Suplementación',
                  description: 'Recomendaciones personalizadas de suplementos según tus necesidades',
                  icon: '💊',
                  color: 'from-nutrition-green-forest to-nutrition-green-darker'
                },
                {
                  title: 'Soporte 24/7',
                  description: 'Asistencia y motivación constante a través de nuestra plataforma',
                  icon: '🤝',
                  color: 'from-nutrition-green-darker to-nutrition-green-dark'
                },
              ].map((service, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-nutrition-green-emerald">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-nutrition-black mb-4 text-center">{service.title}</h3>
                  <p className="text-nutrition-gray text-center">{service.description}</p>
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
        <section className="py-20 bg-gradient-to-r from-nutrition-green via-nutrition-green-emerald to-nutrition-green-sage text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              ¿Listo para Transformar tu Vida?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Comienza tu viaje hacia una vida más saludable hoy mismo
            </p>
            <button
              onClick={handleShowRegister}
              className="bg-gradient-to-r from-nutrition-accent to-nutrition-accent-dark hover:from-nutrition-accent-dark hover:to-nutrition-accent text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
          initialMode={loginMode}
        />
      )}
    </div>
  );
};

export default Index;
