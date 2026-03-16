import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Download, ShoppingCart, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Guide {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  pdf_url: string;
  regular_price: number;
  discounted_price: number;
  category?: string;
  is_active: boolean;
}

interface GuidePurchase {
  guide_id: string;
}

interface GuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidesModal: React.FC<GuidesModalProps> = ({ isOpen, onClose }) => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [purchasedGuides, setPurchasedGuides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchGuides();
      if (user) {
        checkSubscriptionStatus();
        fetchPurchasedGuides();
      }
    }
  }, [isOpen, user]);

  const fetchGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuides(data || []);
    } catch (error) {
      console.error('Error fetching guides:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las guías',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    try {
      const { data: stripeSubscription } = await supabase
        .from('stripe_subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

      const { data: regularSubscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      setHasActiveSubscription(!!(stripeSubscription || regularSubscription));
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const fetchPurchasedGuides = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('guide_purchases')
        .select('guide_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setPurchasedGuides((data || []).map((p: GuidePurchase) => p.guide_id));
    } catch (error) {
      console.error('Error fetching purchased guides:', error);
    }
  };

  const getPrice = (guide: Guide) => {
    return hasActiveSubscription ? guide.discounted_price : guide.regular_price;
  };

  const handlePurchase = async (guide: Guide) => {
    if (!user) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para comprar guías',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Próximamente',
      description: 'La funcionalidad de pago se implementará próximamente',
    });
  };

  const handleDownload = async (guide: Guide) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para descargar',
        variant: 'destructive',
      });
      return;
    }
    try {
      const link = document.createElement('a');
      link.href = `/guides/${guide.pdf_url}`;
      link.download = guide.pdf_url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: 'Descarga iniciada',
        description: 'Tu guía se está descargando',
      });
    } catch (error) {
      console.error('Error downloading guide:', error);
      toast({
        title: 'Error',
        description: 'No se pudo descargar la guía',
        variant: 'destructive',
      });
    }
  };

  const isPurchased = (guideId: string) => purchasedGuides.includes(guideId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[hsl(220,20%,10%)] border-white/10 text-white p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
            <div className="p-2.5 rounded-xl bg-[hsl(var(--accent-green))]/20 border border-[hsl(var(--accent-green))]/30">
              <BookOpen className="w-6 h-6 text-[hsl(var(--accent-green))]" />
            </div>
            Guías y Recursos
          </DialogTitle>
          <p className="text-white/50 text-sm mt-2">
            Descarga guías exclusivas para complementar tu entrenamiento y nutrición
          </p>
          {user && hasActiveSubscription && (
            <Badge className="mt-3 bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green-light))] border border-[hsl(var(--accent-green))]/30 w-fit">
              ¡Descuento especial por ser miembro activo!
            </Badge>
          )}
        </DialogHeader>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[hsl(var(--accent-green))]"></div>
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No hay guías disponibles en este momento</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {guides.map((guide) => (
                <Card
                  key={guide.id}
                  className="bg-white/5 border-white/10 hover:border-[hsl(var(--accent-green))]/30 transition-all duration-300 overflow-hidden group"
                >
                  {guide.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={guide.image_url}
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white mb-1">
                          {guide.title}
                        </CardTitle>
                        {guide.category && (
                          <Badge variant="outline" className="text-white/50 border-white/20 text-xs">
                            {guide.category}
                          </Badge>
                        )}
                      </div>
                      {isPurchased(guide.id) && (
                        <CheckCircle className="w-5 h-5 text-[hsl(var(--accent-green))] flex-shrink-0" />
                      )}
                    </div>
                    <CardDescription className="text-white/40 text-sm">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          {hasActiveSubscription && user && (
                            <div className="text-xs text-white/30 line-through">
                              €{guide.regular_price.toFixed(2)}
                            </div>
                          )}
                          <div className="text-2xl font-bold text-[hsl(var(--accent-green))]">
                            €{getPrice(guide).toFixed(2)}
                          </div>
                        </div>
                        {hasActiveSubscription && user && (
                          <Badge className="bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green-light))] border border-[hsl(var(--accent-green))]/30">
                            -{Math.round((1 - guide.discounted_price / guide.regular_price) * 100)}%
                          </Badge>
                        )}
                      </div>

                      {isPurchased(guide.id) ? (
                        <Button
                          onClick={() => handleDownload(guide)}
                          className="w-full bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green-dark))] text-black font-semibold rounded-xl"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handlePurchase(guide)}
                          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Comprar Ahora
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!user && (
            <div className="mt-6 text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/50 text-sm">
                ¿Eres miembro? <span className="text-[hsl(var(--accent-green-light))] font-medium">Inicia sesión para obtener descuentos especiales</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuidesModal;
