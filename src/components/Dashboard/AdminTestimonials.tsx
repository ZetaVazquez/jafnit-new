import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, Trash2, ArrowLeft, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface UserTestimonial { id: string; name: string; comment: string; rating: number; status: string; created_at: string; user_id: string; }
interface AdminTestimonialsProps { onBack?: () => void; }

const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({ onBack }) => {
  const [testimonials, setTestimonials] = useState<UserTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selected, setSelected] = useState<UserTestimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase.from('user_testimonials').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) { toast({ title: "Error", description: "No se pudieron cargar los comentarios", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('No auth token');
      const { data, error } = await supabase.functions.invoke('update-testimonial', { body: { testimonialId: id, status }, headers: { Authorization: `Bearer ${token}` } });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      toast({ title: "Actualizado", description: `Comentario ${status === 'approved' ? 'aprobado' : 'rechazado'}` });
    } catch (error: any) { toast({ title: "Error", description: `Error: ${error?.message}`, variant: "destructive" }); }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    try {
      const { error } = await supabase.from('user_testimonials').delete().eq('id', id);
      if (error) throw error;
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast({ title: "Eliminado" });
    } catch (error) { toast({ title: "Error", variant: "destructive" }); }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Aprobado</Badge>;
    if (status === 'rejected') return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Rechazado</Badge>;
    return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Pendiente</Badge>;
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,20%,8%)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--accent-green))]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <div className="container mx-auto px-4 py-8">
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button variant="ghost" size="sm" onClick={onBack} className="text-white/60 hover:text-white hover:bg-white/10">
                    <ArrowLeft className="w-4 h-4 mr-2" />Volver
                  </Button>
                )}
                <span className="text-[hsl(var(--accent-green))]">Gestión de Comentarios</span>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                {testimonials.filter(t => t.status === 'pending').length} pendientes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testimonials.length === 0 ? (
              <div className="text-center py-8 text-white/40">No hay comentarios para revisar</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/50">Nombre</TableHead>
                      <TableHead className="text-white/50">Comentario</TableHead>
                      <TableHead className="text-white/50">Rating</TableHead>
                      <TableHead className="text-white/50">Estado</TableHead>
                      <TableHead className="text-white/50">Fecha</TableHead>
                      <TableHead className="text-white/50">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((t) => (
                      <TableRow key={t.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-white">{t.name}</TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate text-white/60" title={t.comment}>{t.comment.length > 100 ? `${t.comment.substring(0, 100)}...` : t.comment}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex">{[...Array(t.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-current text-yellow-500" />))}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(t.status)}</TableCell>
                        <TableCell className="text-sm text-white/40">{formatDate(t.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => { setSelected(t); setIsDialogOpen(true); }} className="text-white/40 hover:text-white hover:bg-white/10"><Eye className="w-4 h-4" /></Button>
                            {t.status === 'pending' && (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => updateTestimonialStatus(t.id, 'approved')} className="text-emerald-400 hover:bg-emerald-500/10"><Check className="w-4 h-4" /></Button>
                                <Button size="sm" variant="ghost" onClick={() => updateTestimonialStatus(t.id, 'rejected')} className="text-red-400 hover:bg-red-500/10"><X className="w-4 h-4" /></Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => deleteTestimonial(t.id)} className="text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="bg-[hsl(220,15%,13%)] border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="text-[hsl(var(--accent-green))]">Comentario de {selected?.name}</DialogTitle>
                  <DialogDescription className="text-white/40">{selected ? formatDate(selected.created_at) : ''}</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="text-sm text-white/70 whitespace-pre-wrap">{selected?.comment}</div>
                  <div className="flex items-center gap-2">
                    {[...Array(selected?.rating || 0)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-current text-yellow-500" />))}
                    {selected && getStatusBadge(selected.status)}
                  </div>
                </div>
                {selected && (
                  <DialogFooter className="gap-2">
                    {selected.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => { updateTestimonialStatus(selected.id, 'approved'); setIsDialogOpen(false); }} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">Aprobar</Button>
                        <Button size="sm" variant="outline" onClick={() => { updateTestimonialStatus(selected.id, 'rejected'); setIsDialogOpen(false); }} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">Rechazar</Button>
                      </>
                    )}
                    <Button size="sm" onClick={() => { deleteTestimonial(selected.id); setIsDialogOpen(false); }} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">Eliminar</Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTestimonials;
