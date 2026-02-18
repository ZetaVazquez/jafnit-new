
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
}

export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ isOpen, onClose, currentEmail }) => {
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || newEmail === currentEmail) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "Correo de verificación enviado",
          description: `Se ha enviado un enlace de confirmación a ${newEmail}. Revisa tu bandeja de entrada para completar el cambio.`
        });
        setNewEmail('');
        onClose();
      }
    } catch {
      toast({ title: "Error", description: "Ocurrió un error inesperado", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-nutrition-green" />
            Cambiar Email
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="current-email">Email actual</Label>
            <Input id="current-email" value={currentEmail} disabled className="bg-gray-50 mt-1" />
          </div>
          <div>
            <Label htmlFor="new-email">Nuevo email</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nuevo@email.com"
              required
              className="mt-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Recibirás un correo de verificación en la nueva dirección para confirmar el cambio.
          </p>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !newEmail || newEmail === currentEmail}
              className="flex-1 bg-nutrition-green hover:bg-nutrition-green-dark text-white"
            >
              {loading ? "Enviando..." : "Confirmar cambio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = form.newPassword === form.confirmPassword;
  const isValid = form.newPassword.length >= 6 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: form.newPassword });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Contraseña actualizada", description: "Tu contraseña ha sido cambiada correctamente." });
        setForm({ newPassword: '', confirmPassword: '' });
        onClose();
      }
    } catch {
      toast({ title: "Error", description: "Ocurrió un error inesperado", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-nutrition-green" />
            Cambiar Contraseña
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <div className="relative mt-1">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) => setForm(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirmar contraseña</Label>
            <div className="relative mt-1">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Repite la contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !isValid}
              className="flex-1 bg-nutrition-green hover:bg-nutrition-green-dark text-white"
            >
              {loading ? "Guardando..." : "Cambiar contraseña"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
