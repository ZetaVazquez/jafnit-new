
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera, Trash2, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el perfil",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Perfil actualizado",
          description: "Los cambios se han guardado correctamente"
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Eliminar el usuario de auth (esto activará el trigger que elimina todos los datos)
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la cuenta",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Cuenta eliminada",
          description: "Tu cuenta ha sido eliminada permanentemente"
        });
        await signOut();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la cuenta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handlePayment = () => {
    // Redirigir a Bizum (simulado)
    toast({
      title: "Redirigiendo a Bizum",
      description: "Te redirigimos a la plataforma de pago..."
    });
    // En una implementación real, aquí se abriría Bizum
    window.open('https://bizum.es', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={onGoBack}
            variant="ghost"
            className="mb-4 text-nutrition-green hover:text-nutrition-green-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-nutrition-black">Mi Perfil</h1>
          <p className="text-nutrition-gray mt-2">Gestiona tu información personal</p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Información Personal
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => {
                    if (isEditing) {
                      handleSave();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  disabled={loading}
                >
                  {isEditing ? "Guardar" : "Editar"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={formData.profile_image_url} />
                  <AvatarFallback className="text-2xl bg-nutrition-green text-white">
                    {formData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Cambiar foto
                  </Button>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-nutrition-gray mb-2">
                  Email
                </label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-nutrition-gray mb-2">
                  Nombre
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-nutrition-gray mb-2">
                  Descripción
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-nutrition-green">
                <CreditCard className="w-5 h-5 mr-2" />
                Gestión de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Gestiona tus pagos y suscripciones de forma fácil y segura.
              </p>
              <Button
                onClick={handlePayment}
                className="bg-nutrition-green hover:bg-nutrition-green-dark text-white"
              >
                Pagar con Bizum
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Trash2 className="w-5 h-5 mr-2" />
                Zona de Peligro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nutrition-gray mb-4">
                Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
                Esta acción no se puede deshacer.
              </p>
              
              {!showDeleteConfirm ? (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Desactivar Cuenta
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-red-600 font-medium">
                    ¿Estás seguro? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      Sí, eliminar mi cuenta
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
