import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, Trash2, ArrowLeft, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface UserTestimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  status: string;
  created_at: string;
  user_id: string;
}

interface AdminTestimonialsProps {
  onBack?: () => void;
}

const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({ onBack }) => {
  const [testimonials, setTestimonials] = useState<UserTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selected, setSelected] = useState<UserTestimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('user_testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los comentarios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      console.log('Starting update for testimonial:', { id, status });
      
      // Obtener el token de autenticación actual
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Llamar a la función edge para actualizar el testimonial
      const { data, error } = await supabase.functions.invoke('update-testimonial', {
        body: {
          testimonialId: id,
          status: status
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Function result:', { data, error });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error from function');
      }

      console.log('Update successful, updating local state');

      setTestimonials(prev =>
        prev.map(testimonial =>
          testimonial.id === id ? { ...testimonial, status } : testimonial
        )
      );

      toast({
        title: "Actualizado",
        description: `Comentario ${status === 'approved' ? 'aprobado' : 'rechazado'} exitosamente`
      });
    } catch (error: any) {
      console.error('Full error object:', error);
      toast({
        title: "Error",
        description: `No se pudo actualizar el comentario: ${error?.message || 'Error desconocido'}`,
        variant: "destructive"
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;

    try {
      const { error } = await supabase
        .from('user_testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));

      toast({
        title: "Eliminado",
        description: "Comentario eliminado exitosamente"
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el comentario",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Comentarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Cargando comentarios...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white p-4 md:p-8">
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            )}
            <span>Gestión de Comentarios</span>
          </div>
          <Badge variant="outline" className="text-white/80 border-white/20">
            {testimonials.filter(t => t.status === 'pending').length} pendientes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testimonials.length === 0 ? (
          <div className="text-center py-8 text-white/50">
            No hay comentarios para revisar
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="text-white/80">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Comentario</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">
                      {testimonial.name}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={testimonial.comment}>
                        {testimonial.comment.length > 100
                          ? `${testimonial.comment.substring(0, 100)}...`
                          : testimonial.comment}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(testimonial.status)}
                    </TableCell>
                    <TableCell className="text-sm text-white/50">
                      {formatDate(testimonial.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelected(testimonial); setIsDialogOpen(true); }}
                          className="border-white/20 text-white/80 hover:bg-white/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {testimonial.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                              className="text-green-400 hover:text-green-300 border-green-500/30 hover:bg-green-500/10"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateTestimonialStatus(testimonial.id, 'rejected')}
                              className="text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Comentario de {selected?.name}</DialogTitle>
              <DialogDescription>
                {selected ? formatDate(selected.created_at) : ''}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {selected?.comment}
              </div>
              <div className="flex items-center gap-2">
                {[...Array(selected?.rating || 0)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                ))}
                {selected && getStatusBadge(selected.status)}
              </div>
            </div>
            {selected && (
              <DialogFooter className="gap-2">
                {selected.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => { updateTestimonialStatus(selected.id, 'approved'); setIsDialogOpen(false); }}>
                      Aprobar
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => { updateTestimonialStatus(selected.id, 'rejected'); setIsDialogOpen(false); }}>
                      Rechazar
                    </Button>
                  </>
                )}
                <Button size="sm" variant="destructive" onClick={() => { deleteTestimonial(selected.id); setIsDialogOpen(false); }}>
                  Eliminar
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
    </div>
  );
};

export default AdminTestimonials;