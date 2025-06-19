
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Settings, Calendar, BookOpen, Dumbbell, Home, Eye, Camera, FileText, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  onStartQuestionnaire
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', href: '#home' },
    { label: 'Sobre Nosotros', href: '#about' },
    { label: 'Servicios', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Noticias', href: '#news' },
    { label: 'Opiniones', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Precios', href: '#pricing' },
    { label: 'Contacto', href: '#contact' },
  ];

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

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">JA</span>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald bg-clip-text text-transparent">
                JA Dietética
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm xl:text-base text-nutrition-black hover:text-nutrition-green-emerald transition-colors duration-200 font-medium"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  variant="outline"
                  className="hidden lg:flex items-center space-x-2 border-nutrition-green-emerald text-nutrition-green-emerald hover:bg-nutrition-green-emerald hover:text-white"
                >
                  <User className="w-4 h-4" />
                  <span>Mi Cuenta</span>
                </Button>
              ) : (
                <div className="hidden lg:flex items-center space-x-2">
                  <Button
                    onClick={onLogin}
                    variant="outline"
                    className="border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
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
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 text-nutrition-black hover:text-nutrition-green-emerald hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                {!isLoggedIn && (
                  <div className="px-4 mt-4 space-y-2">
                    <Button
                      onClick={() => {
                        onLogin();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
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
                {isLoggedIn && (
                  <Button
                    onClick={() => {
                      setIsSidebarOpen(true);
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="mx-4 mt-4 border-nutrition-green-emerald text-nutrition-green-emerald hover:bg-nutrition-green-emerald hover:text-white w-full"
                  >
                    Mi Cuenta
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar for logged-in users */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl animate-slide-in-right">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-nutrition-green-emerald">Mi Cuenta</h2>
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
