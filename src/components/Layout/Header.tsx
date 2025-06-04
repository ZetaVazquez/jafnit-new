
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Settings, Calendar, BookOpen, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogin, onLogout }) => {
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
  ];

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl lg:text-2xl font-bold text-nutrition-green">
                JA Dietética
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm xl:text-base text-nutrition-black hover:text-nutrition-green transition-colors duration-200 font-medium"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  variant="outline"
                  className="hidden lg:flex items-center space-x-2 border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
                >
                  <User className="w-4 h-4" />
                  <span>Mi Cuenta</span>
                </Button>
              ) : (
                <Button
                  onClick={onLogin}
                  className="hidden lg:flex bg-nutrition-green hover:bg-nutrition-green-dark text-white"
                >
                  Iniciar Sesión
                </Button>
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
                    className="block px-4 py-2 text-nutrition-black hover:text-nutrition-green hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                {!isLoggedIn && (
                  <Button
                    onClick={() => {
                      onLogin();
                      setIsMenuOpen(false);
                    }}
                    className="mx-4 mt-4 bg-nutrition-green hover:bg-nutrition-green-dark text-white w-full"
                  >
                    Iniciar Sesión
                  </Button>
                )}
                {isLoggedIn && (
                  <Button
                    onClick={() => {
                      setIsSidebarOpen(true);
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="mx-4 mt-4 border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white w-full"
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
                <h2 className="text-xl font-bold text-nutrition-green">Mi Cuenta</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-nutrition-black hover:text-nutrition-green transition-colors duration-200"
                    onClick={() => setIsSidebarOpen(false)}
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
