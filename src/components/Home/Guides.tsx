import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Download, ShoppingCart, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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

const Guides: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [purchasedGuides, setPurchasedGuides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchGuides();
    if (user) {
      checkSubscriptionStatus();
      fetchPurchasedGuides();
    }
  }, [user]);

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
      // Check Stripe subscription
      const { data: stripeSubscription } = await supabase
        .from('stripe_subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

      // Check regular subscription
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

    // TODO: Implement Stripe payment integration
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
      // Get the signed URL for the PDF
      const { data, error } = await supabase.storage
        .from('guides')
        .createSignedUrl(guide.pdf_url, 3600); // Valid for 1 hour

      if (error) throw error;

      // Open download in new tab
      window.open(data.signedUrl, '_blank');

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

  if (loading) {
    return (
      <section id="guias" className="py-16 bg-gradient-to-br from-white to-nutrition-green-lighter">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutrition-green"></div>
          </div>
        </div>
      </section>
    );
  }

  if (guides.length === 0) {
    return null;
  }

  return (
    <section id="guias" className="py-16 bg-gradient-to-br from-white to-nutrition-green-lighter">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-nutrition-green" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-nutrition-green mb-4">
            Guías y Recursos
          </h2>
          <p className="text-lg text-nutrition-gray max-w-2xl mx-auto">
            Descarga guías exclusivas para complementar tu entrenamiento y nutrición
          </p>
          {user && hasActiveSubscription && (
            <Badge className="mt-4 bg-green-500 text-white">
              ¡Tienes descuento especial por ser miembro activo!
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card 
              key={guide.id} 
              className="hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {guide.image_url && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={guide.image_url}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-nutrition-green mb-2">
                      {guide.title}
                    </CardTitle>
                    {guide.category && (
                      <Badge variant="outline" className="mb-2">
                        {guide.category}
                      </Badge>
                    )}
                  </div>
                  {isPurchased(guide.id) && (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <CardDescription className="text-nutrition-gray">
                  {guide.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {hasActiveSubscription && user && (
                        <div className="text-sm text-gray-500 line-through">
                          €{guide.regular_price.toFixed(2)}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-nutrition-green">
                        €{getPrice(guide).toFixed(2)}
                      </div>
                    </div>
                    {hasActiveSubscription && user && (
                      <Badge className="bg-green-500 text-white">
                        -{Math.round((1 - guide.discounted_price / guide.regular_price) * 100)}%
                      </Badge>
                    )}
                  </div>

                  {isPurchased(guide.id) ? (
                    <Button
                      onClick={() => handleDownload(guide)}
                      className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(guide)}
                      className="w-full bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest text-white"
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

        {!user && (
          <div className="mt-12 text-center bg-white/80 backdrop-blur-sm p-6 rounded-lg">
            <p className="text-nutrition-gray mb-4">
              ¿Eres miembro? <strong>Inicia sesión para obtener descuentos especiales</strong>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Guides;
