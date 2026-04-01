

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera, Trash2, CreditCard, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PlanRecommendationModal from './PlanRecommendationModal';
import { ChangeEmailModal, ChangePasswordModal } from './ChangeCredentialsModal';

interface UserProfileProps {
  onGoBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onGoBack }) => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    description: profile?.description || '',
    profile_image_url: profile?.profile_image_url || ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile(formData);
      if (error) { toast({ title: "Error", description: "No se pudo actualizar el perfil", variant: "destructive" }); }
      else { toast({ title: "Perfil actualizado", description: "Los cambios se han guardado correctamente" }); setIsEditing(false); }
    } catch (error) { console.error('Error updating profile:', error); toast({ title: "Error", description: "Ocurrió un error inesperado", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) { toast({ title: "Error", description: "No se pudo eliminar la cuenta", variant: "destructive" }); }
      else { toast({ title: "Cuenta eliminada", description: "Tu cuenta ha sido eliminada permanentemente" }); await signOut(); }
    } catch (error) { toast({ title: "Error", description: "Ocurrió un error al eliminar la cuenta", variant: "destructive" }); }
    finally { setLoading(false); setShowDeleteConfirm(false); }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={onGoBack} variant="ghost" className="mb-4 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
          <p className="text-white/50 mt-2">Gestiona tu información personal</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Info */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                Información Personal
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => { if (isEditing) handleSave(); else setIsEditing(true); }}
                  disabled={loading}
                  className={isEditing ? "bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white" : "border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent"}
                >
                  {isEditing ? "Guardar" : "Editar"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20 border-2 border-[hsl(var(--accent-green))]/30">
                  <AvatarImage src={formData.profile_image_url} />
                  <AvatarFallback className="text-2xl bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))]">{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">
                    <Camera className="w-4 h-4 mr-2" />Cambiar foto
                  </Button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Email</label>
                <Input value={user?.email || ''} disabled className="bg-white/5 border-white/10 text-white/60" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Nombre</label>
                <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} disabled={!isEditing} className="bg-white/5 border-white/10 text-white focus:border-[hsl(var(--accent-green))]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Descripción</label>
                <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} disabled={!isEditing} placeholder="Cuéntanos sobre ti..." rows={3} className="bg-white/5 border-white/10 text-white focus:border-[hsl(var(--accent-green))]" />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-[hsl(var(--accent-green))]"><Lock className="w-5 h-5 mr-2" />Seguridad de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-white/50 text-sm">Actualiza tu email o contraseña para mantener tu cuenta segura.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setShowChangeEmail(true)} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent gap-2"><Mail className="w-4 h-4" />Cambiar Email</Button>
                <Button variant="outline" onClick={() => setShowChangePassword(true)} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent gap-2"><Lock className="w-4 h-4" />Cambiar Contraseña</Button>
              </div>
            </CardContent>
          </Card>

          {/* Payments */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-[hsl(var(--accent-green))]"><CreditCard className="w-5 h-5 mr-2" />Gestión de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/50 mb-4">Gestiona tus pagos y suscripciones de forma fácil y segura.</p>
              <Button onClick={() => setShowPlansModal(true)} className="bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/30 border border-[hsl(var(--accent-green))]/30">Gestionar Suscripción</Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-500/30 bg-red-500/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-red-400"><Trash2 className="w-5 h-5 mr-2" />Zona de Peligro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/50 mb-4">Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. Esta acción no se puede deshacer.</p>
              {!showDeleteConfirm ? (
                <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">Desactivar Cuenta</Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-red-400 font-medium">¿Estás seguro? Esta acción no se puede deshacer.</p>
                  <div className="flex space-x-2">
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>Sí, eliminar mi cuenta</Button>
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">Cancelar</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <PlanRecommendationModal isOpen={showPlansModal} onClose={() => setShowPlansModal(false)} onDecideLater={() => setShowPlansModal(false)} recommendedPlan="premium" fromQuestionnaire={false} />
      <ChangeEmailModal isOpen={showChangeEmail} onClose={() => setShowChangeEmail(false)} currentEmail={user?.email || ''} />
      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} />
    </div>
  );
};

export default UserProfile;
