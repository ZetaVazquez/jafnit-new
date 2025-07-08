import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, Trash2 } from 'lucide-react';
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

interface UserTestimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  status: string;
  created_at: string;
  user_id: string;
}

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<UserTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
      const { error } = await supabase
        .from('user_testimonials')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev =>
        prev.map(testimonial =>
          testimonial.id === id ? { ...testimonial, status } : testimonial
        )
      );

      toast({
        title: "Actualizado",
        description: `Comentario ${status === 'approved' ? 'aprobado' : 'rechazado'} exitosamente`
      });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el comentario",
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gestión de Comentarios</span>
          <Badge variant="outline">
            {testimonials.filter(t => t.status === 'pending').length} pendientes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testimonials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay comentarios para revisar
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">
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
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(testimonial.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {testimonial.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateTestimonialStatus(testimonial.id, 'rejected')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="text-red-600 hover:text-red-700"
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
      </CardContent>
    </Card>
  );
};

export default AdminTestimonials;