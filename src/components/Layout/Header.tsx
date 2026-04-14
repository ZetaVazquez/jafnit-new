
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Settings, Calendar, BookOpen, Dumbbell, CreditCard, MessageCircle, Home, ChevronDown, Calculator, Newspaper, HelpCircle, Mail, Star } from 'lucide-react';
import LoginModal from '@/components/Auth/LoginModal';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onNavigateToHome?: () => void;
  onNavigateToChangePlan?: () => void;
  onStartQuestionnaire?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToGoals?: () => void;
  onNavigateToDiets?: () => void;
  onNavigateToWorkouts?: () => void;
  onNavigateToSchedule?: () => void;
  onOpenBMI?: () => void;
  onOpenGuides?: () => void;
  showDashboard?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn, 
  onLogin, 
  onRegister, 
  onLogout,
  onNavigateToHome,
  onNavigateToChangePlan,
  onStartQuestionnaire,
  onNavigateToDashboard,
  onNavigateToProfile,
  onNavigateToGoals,
  onNavigateToDiets,
  onNavigateToWorkouts,
  onNavigateToSchedule,
  onOpenBMI,
  onOpenGuides,
  showDashboard = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Programas', href: '#pricing' },
    { label: 'Sobre Mí', href: '#sobre-mi' },
    { label: 'Evaluación', href: '#evaluacion' },
  ];

  const moreItems = [
    { label: 'Calculadora de IMC', href: '#bmi', icon: Calculator, action: onOpenBMI },
    { label: 'Guías y Recursos', href: '#guias', icon: BookOpen, action: onOpenGuides },
    { label: 'Opiniones', href: '#testimonios', icon: Star },
    { label: 'Noticias y Actualizaciones', href: '#noticias', icon: Newspaper },
    { label: 'Preguntas Frecuentes', href: '#faq', icon: HelpCircle },
    { label: 'Contáctame', href: '#contacto', icon: Mail },
  ];

  const handleNavClick = (href: string) => {
    if (href === '#evaluacion' && onStartQuestionnaire) {
      onStartQuestionnaire();
      setIsMenuOpen(false);
      return;
    }
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const sidebarItems = [
    { label: 'Mi Perfil', icon: User, action: onNavigateToProfile },
    { label: 'Configuraciones', icon: Settings, action: onNavigateToProfile },
    { label: 'Mis Dietas', icon: BookOpen, action: onNavigateToDiets },
    { label: 'Mis Entrenamientos', icon: Dumbbell, action: onNavigateToWorkouts },
    { label: 'Calendario', icon: Calendar, action: onNavigateToSchedule },
    { label: 'Cambiar mi Plan', icon: CreditCard, action: onNavigateToChangePlan },
  ];

  const handleRegisterClick = () => {
    if (onStartQuestionnaire) {
      onStartQuestionnaire();
    } else {
      onRegister();
    }
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setIsMenuOpen(false);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleLoginSubmit = (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    onLogin();
    setShowLoginModal(false);
  };

  const handleChatWithTrainer = () => {
    window.open('https://api.whatsapp.com/send/?phone=34697754823&text=Hola+Jose%2C+quiero+empezar+mi+plan+con+JAFNFIT+%EF%BF%BD&type=phone_number&app_absent=0', '_blank');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[hsl(220,20%,10%)]/95 backdrop-blur-md shadow-lg shadow-black/20' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/images/logo-metodo-jafn.png" 
                alt="Método JAFN - Dietética y Entrenamiento" 
                className="h-24 lg:h-40 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm text-white/80 hover:text-white transition-colors duration-200 font-medium tracking-wide"
                >
                  {item.label}
                </button>
              ))}
              {/* More dropdown */}
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="text-sm text-white/80 hover:text-white transition-colors duration-200 font-medium tracking-wide flex items-center gap-1"
                >
                  Más <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMoreOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-[hsl(220,20%,12%)] border border-white/10 rounded-lg shadow-xl backdrop-blur-md py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {moreItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { if (item.action) { item.action(); } else { handleNavClick(item.href); } setIsMoreOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-[hsl(var(--accent-green-light))]" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <Button
                    onClick={handleChatWithTrainer}
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  
                  {showDashboard && onNavigateToHome && (
                    <Button
                      onClick={onNavigateToHome}
                      variant="ghost"
                      size="sm"
                      className="hidden lg:flex text-white/80 hover:text-white hover:bg-white/10"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Inicio
                    </Button>
                  )}
                  
                  {onNavigateToDashboard && (
                    <Button
                      onClick={onNavigateToDashboard}
                      className="hidden lg:flex btn-cta text-sm px-5 py-2"
                    >
                      Acceso Clientes
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => setIsSidebarOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  <Button
                    onClick={handleLoginClick}
                    className="btn-cta text-sm px-6 py-2 rounded-md"
                  >
                    Acceso Clientes
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white hover:bg-white/10"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-white/10 bg-[hsl(220,20%,10%)]/98 backdrop-blur-md">
              <nav className="py-4 space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </button>
                ))}

                {/* More items in mobile */}
                <div className="border-t border-white/10 mt-2 pt-2">
                  <p className="px-4 py-2 text-xs text-white/40 font-medium uppercase tracking-wider">Más</p>
                  {moreItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { if (item.action) { item.action(); } else { handleNavClick(item.href); } setIsMenuOpen(false); }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-200 font-medium"
                    >
                      <item.icon className="w-4 h-4 text-[hsl(var(--accent-green-light))]" />
                      {item.label}
                    </button>
                  ))}
                </div>
                
                {isLoggedIn ? (
                  <div className="px-4 mt-4 space-y-2">
                    <Button
                      onClick={() => { handleChatWithTrainer(); setIsMenuOpen(false); }}
                      className="w-full btn-cta"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat con Entrenador
                    </Button>
                    {onNavigateToDashboard && (
                      <Button
                        onClick={() => { onNavigateToDashboard(); setIsMenuOpen(false); }}
                        className="w-full btn-cta"
                      >
                        Acceso Clientes
                      </Button>
                    )}
                    <Button
                      onClick={() => { setIsSidebarOpen(true); setIsMenuOpen(false); }}
                      className="w-full btn-cta"
                    >
                      Menú
                    </Button>
                  </div>
                ) : (
                  <div className="px-4 mt-4 space-y-2">
                    <Button
                      onClick={handleLoginClick}
                      className="w-full btn-cta"
                    >
                      Acceso Clientes
                    </Button>
                    <button
                      onClick={handleRegisterClick}
                      className="w-full py-3 rounded-md font-bold text-sm transition-all duration-300 border border-white/20 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_hsla(142,71%,45%,0.4)]"
                      style={{ backgroundColor: 'hsl(142, 71%, 35%)', color: '#ffffff' }}
                    >
                      Realizar Evaluación
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={handleLoginModalClose}
          onLogin={handleLoginSubmit}
          initialMode="login"
        />
      )}

      {/* Sidebar for logged-in users */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-[hsl(220,20%,12%)] shadow-xl animate-slide-in-right border-l border-white/10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Menú</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)} className="text-white/60 hover:text-white hover:bg-white/10">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 w-full text-left"
                    onClick={() => { item.action?.(); setIsSidebarOpen(false); }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-white/10">
                <Button
                  onClick={() => { onLogout(); setIsSidebarOpen(false); }}
                  variant="outline"
                  className="w-full flex items-center space-x-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
