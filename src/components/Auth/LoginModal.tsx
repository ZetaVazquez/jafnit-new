
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  initialMode?: 'login' | 'register';
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      // Handle registration
      if (password === confirmPassword) {
        onLogin(email, password);
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-nutrition-green border-2">
        <CardHeader className="bg-gradient-to-r from-nutrition-green-lighter to-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald bg-clip-text text-transparent">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </CardTitle>
            <Button variant="ghost" onClick={onClose} className="hover:bg-nutrition-green-lighter">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-nutrition-black font-medium">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  required={!isLogin}
                  className="border-nutrition-green focus:ring-nutrition-green focus:border-nutrition-green"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-nutrition-black font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="border-nutrition-green focus:ring-nutrition-green focus:border-nutrition-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-nutrition-black font-medium">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
                className="border-nutrition-green focus:ring-nutrition-green focus:border-nutrition-green"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-nutrition-black font-medium">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu contraseña"
                  required={!isLogin}
                  className="border-nutrition-green focus:ring-nutrition-green focus:border-nutrition-green"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest text-white"
            >
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-nutrition-black">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </p>
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-nutrition-green-emerald hover:text-nutrition-green-forest p-0 font-medium"
            >
              {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;
