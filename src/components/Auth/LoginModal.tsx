
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  initialMode: 'login' | 'register';
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, initialMode }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Las contraseñas no coinciden",
            variant: "destructive"
          });
          return;
        }

        if (!name.trim()) {
          toast({
            title: "Error", 
            description: "El nombre es requerido",
            variant: "destructive"
          });
          return;
        }

        console.log('Attempting to register user:', { email, name });
        const { error } = await signUp(email, password, name.trim());
        
        if (error) {
          console.error('Registration error:', error);
          toast({
            title: "Error en el registro",
            description: error.message || "No se pudo crear la cuenta",
            variant: "destructive"
          });
        } else {
          toast({
            title: "¡Registro exitoso!",
            description: "Tu cuenta ha sido creada correctamente",
          });
          onClose();
        }
      } else {
        console.log('Attempting to login user:', { email });
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Login error:', error);
          toast({
            title: "Error en el inicio de sesión",
            description: error.message || "Credenciales inválidas",
            variant: "destructive"
          });
        } else {
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente",
          });
          onClose();
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error inesperado",
        description: "Algo salió mal. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-nutrition-black">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <Label htmlFor="name" className="text-nutrition-black">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 border-nutrition-green-light focus:border-nutrition-green focus:ring-nutrition-green"
                  required
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-nutrition-black">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-nutrition-green-light focus:border-nutrition-green focus:ring-nutrition-green"
                required
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-nutrition-black">
                Contraseña
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 border-nutrition-green-light focus:border-nutrition-green focus:ring-nutrition-green"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-nutrition-gray hover:text-nutrition-green"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <Label htmlFor="confirmPassword" className="text-nutrition-black">
                  Confirmar Contraseña
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 border-nutrition-green-light focus:border-nutrition-green focus:ring-nutrition-green"
                    required
                    minLength={6}
                    placeholder="Repite tu contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-nutrition-gray hover:text-nutrition-green"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white py-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...'}
                </div>
              ) : (
                mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-nutrition-gray">
              {mode === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            </p>
            <Button
              variant="ghost"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-nutrition-green hover:text-nutrition-green-dark hover:bg-nutrition-green-lighter mt-2"
              disabled={loading}
            >
              {mode === 'login' ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
