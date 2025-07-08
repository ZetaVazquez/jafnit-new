import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
}

interface TestimonialSection {
  title: string;
  testimonials: Testimonial[];
}

interface TestimonialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonialSections: TestimonialSection[];
}

interface UserTestimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  status: string;
  created_at: string;
}

const TestimonialsModal: React.FC<TestimonialsModalProps> = ({ isOpen, onClose, testimonialSections }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userTestimonials, setUserTestimonials] = useState<UserTestimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    comment: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserTestimonials();
    }
  }, [isOpen]);

  const fetchUserTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('user_testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching user testimonials:', error);
    }
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar registrado para enviar un comentario",
        variant: "destructive"
      });
      return;
    }

    if (!newTestimonial.name.trim() || !newTestimonial.comment.trim()) {
      toast({
        title: "Error", 
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_testimonials')
        .insert({
          user_id: user.id,
          name: newTestimonial.name.trim(),
          comment: newTestimonial.comment.trim(),
          rating: newTestimonial.rating
        });

      if (error) throw error;

      toast({
        title: "¡Enviado!",
        description: "Tu comentario ha sido enviado y está pendiente de revisión"
      });

      setNewTestimonial({ name: '', comment: '', rating: 5 });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el comentario. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-nutrition-green-lighter">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl md:text-3xl font-bold text-nutrition-green">
              Opiniones de Nuestros Clientes
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-nutrition-gray hover:text-nutrition-green"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Original testimonials organized by sections */}
          {testimonialSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-nutrition-green mb-6 title-playful">
                  {section.title}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md border border-nutrition-green-light">
                    <div className="flex items-center mb-3">
                      <div>
                        <h4 className="font-bold text-nutrition-black text-sm title-playful mb-1">{testimonial.name}</h4>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current text-nutrition-green" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-nutrition-green-dark text-sm leading-relaxed">"{testimonial.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* User submitted testimonials */}
          {userTestimonials.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-nutrition-green mb-6 title-playful">
                  Más Comentarios de Clientes
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md border border-nutrition-green-light">
                    <div className="flex items-center mb-3">
                      <div>
                        <h4 className="font-bold text-nutrition-black text-sm title-playful mb-1">{testimonial.name}</h4>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current text-nutrition-green" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-nutrition-green-dark text-sm leading-relaxed">"{testimonial.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit new testimonial form */}
          {user && (
            <div className="bg-white/80 rounded-lg p-6 border border-nutrition-green-light">
              <h3 className="text-xl font-bold text-nutrition-green mb-4">Deja tu Comentario</h3>
              
              <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-nutrition-green-dark mb-2">
                    Tu Nombre
                  </label>
                  <Input
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: María, 32 años"
                    className="border-nutrition-green-light focus:border-nutrition-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-nutrition-green-dark mb-2">
                    Tu Comentario
                  </label>
                  <Textarea
                    value={newTestimonial.comment}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Comparte tu experiencia..."
                    rows={4}
                    className="border-nutrition-green-light focus:border-nutrition-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-nutrition-green-dark mb-2">
                    Calificación
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewTestimonial(prev => ({ ...prev, rating }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            rating <= newTestimonial.rating
                              ? 'fill-current text-nutrition-green'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green text-white font-bold py-2 rounded-lg"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
                </Button>
              </form>

              <p className="text-xs text-nutrition-gray mt-2">
                Tu comentario será revisado por nuestro equipo antes de ser publicado.
              </p>
            </div>
          )}

          {!user && (
            <div className="bg-nutrition-green-lighter/50 rounded-lg p-4 text-center">
              <p className="text-nutrition-green-dark">
                <strong>Regístrate</strong> para poder dejar tu comentario y compartir tu experiencia
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialsModal;