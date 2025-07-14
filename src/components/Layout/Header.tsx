
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Settings, Calendar, BookOpen, Dumbbell, Home, Eye, Camera, FileText, CreditCard, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoginModal from '@/components/Auth/LoginModal';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onNavigateToHome?: () => void;
  onNavigateToPortfolio?: () => void;
  onNavigateToNews?: () => void;
  onNavigateToChangePlan?: () => void;
  onStartQuestionnaire?: () => void;
  onNavigateToDashboard?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn, 
  onLogin, 
  onRegister, 
  onLogout,
  onNavigateToHome,
  onNavigateToPortfolio,
  onNavigateToNews,
  onNavigateToChangePlan,
  onStartQuestionnaire,
  onNavigateToDashboard
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigationItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Sobre Mi', href: '#sobre-mi' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Noticias', href: '#noticias' },
    { label: 'Opiniones', href: '#testimonios' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Precios', href: '#precios' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const sidebarItems = [
    { label: 'Mi Perfil', icon: User, href: '#profile' },
    { label: 'Configuraciones', icon: Settings, href: '#settings' },
    { label: 'Mis Dietas', icon: BookOpen, href: '#diets' },
    { label: 'Mis Entrenamientos', icon: Dumbbell, href: '#workouts' },
    { label: 'Calendario', icon: Calendar, href: '#calendar' },
    { label: 'Página de Visitantes', icon: Home, action: onNavigateToHome },
    { label: 'Portfolio', icon: Camera, action: onNavigateToPortfolio },
    { label: 'Noticias para Ti', icon: FileText, action: onNavigateToNews },
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

  // Check if we're on the public page (assuming currentView is not passed as prop, we'll check URL or state)
  const isOnPublicPage = window.location.pathname === '/' && window.location.hash === '';

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-nutrition-green/20">
                <img 
                  src="/lovable-uploads/7a65475a-1feb-4fb7-b32f-5fae0d6019fd.png" 
                  alt="JAFNFIT Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald bg-clip-text text-transparent">
                JAFNFIT
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm xl:text-base text-nutrition-black hover:text-nutrition-green-emerald transition-colors duration-200 font-medium"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  {/* Chat with Trainer Button */}
                  <Button
                    onClick={handleChatWithTrainer}
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex items-center space-x-2 text-nutrition-green-emerald hover:bg-nutrition-green-lighter"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </Button>
                  
                  {/* Back to Public Page - Only show when NOT on public page */}
                  {!isOnPublicPage && (
                    <Button
                      onClick={onNavigateToHome}
                      variant="outline"
                      size="sm"
                      className="hidden lg:flex items-center space-x-2 border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
                    >
                      <Home className="w-4 h-4" />
                      <span>Página Principal</span>
                    </Button>
                  )}
                  
                  {/* My Account Button with updated colors */}
                  {onNavigateToDashboard && (
                    <Button
                      onClick={onNavigateToDashboard}
                      className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
                    >
                      <User className="w-4 h-4" />
                      <span>Mi Cuenta</span>
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => setIsSidebarOpen(true)}
                    variant="outline"
                    className="hidden lg:flex items-center space-x-2 border-nutrition-green-emerald text-nutrition-green-emerald hover:bg-nutrition-green-emerald hover:text-white"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Configuración</span>
                  </Button>
                </>
              ) : (
                <div className="hidden lg:flex items-center space-x-2">
                  {/* Login button with updated colors */}
                  <Button
                    onClick={handleLoginClick}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={handleRegisterClick}
                    className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest text-white"
                  >
                    Registrarse
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t bg-white">
              <nav className="py-4 space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left px-4 py-2 text-nutrition-black hover:text-nutrition-green-emerald hover:bg-gray-50 transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
                
                {isLoggedIn ? (
                  <div className="px-4 mt-4 space-y-2">
                    <Button
                      onClick={() => {
                        handleChatWithTrainer();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat con Entrenador
                    </Button>
                    {!isOnPublicPage && (
                      <Button
                        onClick={() => {
                          onNavigateToHome?.();
                          setIsMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Página Principal
                      </Button>
                    )}
                    {/* Mobile My Account button with updated colors */}
                    {onNavigateToDashboard && (
                      <Button
                        onClick={() => {
                          onNavigateToDashboard();
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Mi Cuenta
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        setIsSidebarOpen(true);
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-nutrition-green-emerald text-nutrition-green-emerald hover:bg-nutrition-green-emerald hover:text-white"
                    >
                      Configuración
                    </Button>
                  </div>
                ) : (
                  <div className="px-4 mt-4 space-y-2">
                    {/* Mobile Login button with updated colors */}
                    <Button
                      onClick={handleLoginClick}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      onClick={handleRegisterClick}
                      className="w-full bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest text-white"
                    >
                      Registrarse
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
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl animate-slide-in-right">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-nutrition-green-emerald">Configuración</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-nutrition-green-lighter text-nutrition-black hover:text-nutrition-green-forest transition-colors duration-200"
                    onClick={(e) => {
                      if (item.action) {
                        e.preventDefault();
                        item.action();
                      }
                      setIsSidebarOpen(false);
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t">
                <Button
                  onClick={() => {
                    onLogout();
                    setIsSidebarOpen(false);
                  }}
                  variant="outline"
                  className="w-full flex items-center space-x-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
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
