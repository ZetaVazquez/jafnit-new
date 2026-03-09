
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Settings, Calendar, BookOpen, Dumbbell, CreditCard, MessageCircle, Home, ChevronDown, Calculator, Newspaper, HelpCircle, Mail } from 'lucide-react';
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
  showDashboard = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Programas', href: '#programas' },
    { label: 'Método', href: '#metodo' },
    { label: 'Sobre Mí', href: '#sobre-mi' },
    { label: 'Evaluación', href: '#evaluacion' },
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
                className="h-16 lg:h-24 w-auto"
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
                
                {isLoggedIn ? (
                  <div className="px-4 mt-4 space-y-2">
                    <Button
                      onClick={() => { handleChatWithTrainer(); setIsMenuOpen(false); }}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
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
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
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
                    <Button
                      onClick={handleRegisterClick}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      Realizar Evaluación
                    </Button>
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
