import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Check, X, Eye, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PendingPayment } from '@/types/database';

interface AdminPendingPaymentsProps { onGoBack: () => void; }

const AdminPendingPayments: React.FC<AdminPendingPaymentsProps> = ({ onGoBack }) => {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { fetchPendingPayments(); }, []);

  const fetchPendingPayments = async () => {
    try {
      const { data: paymentsData, error: paymentsError } = await supabase.from('pending_payments').select('*').order('created_at', { ascending: false });
      if (paymentsError) throw paymentsError;
      const paymentsWithProfiles = await Promise.all(
        (paymentsData || []).map(async (payment) => {
          const { data: profileData } = await supabase.from('profiles').select('id, name, email, created_at, updated_at').eq('id', payment.user_id).maybeSingle();
          return { ...payment, profiles: profileData || null } as PendingPayment;
        })
      );
      setPendingPayments(paymentsWithProfiles);
    } catch (error) { console.error('Error:', error); toast({ title: "Error", description: "No se pudieron cargar los pagos.", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const handleApprovePayment = async (payment: PendingPayment) => {
    try {
      const startDate = new Date(); const endDate = new Date();
      if (payment.plan_type === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
      else endDate.setMonth(endDate.getMonth() + 3);
      const { error: subErr } = await supabase.from('subscriptions').upsert({ user_id: payment.user_id, plan_type: payment.plan_type, status: 'active', start_date: startDate.toISOString(), end_date: endDate.toISOString(), payment_method: 'stripe', amount: payment.amount });
      if (subErr) throw subErr;
      const { error: earnErr } = await supabase.from('admin_earnings').insert({ admin_id: (await supabase.auth.getUser()).data.user?.id, amount: payment.amount, description: `Pago ${payment.plan_type} - ${payment.profiles?.name}`, earning_date: new Date().toISOString().split('T')[0] });
      if (earnErr) throw earnErr;
      const { error: upErr } = await supabase.from('pending_payments').update({ status: 'approved' }).eq('id', payment.id);
      if (upErr) throw upErr;
      toast({ title: "Pago aprobado", description: `Suscripción activada para ${payment.profiles?.name}` });
      fetchPendingPayments();
    } catch (error) { toast({ title: "Error", description: "No se pudo aprobar.", variant: "destructive" }); }
  };

  const handleRejectPayment = async (payment: PendingPayment) => {
    try {
      const { error } = await supabase.from('pending_payments').update({ status: 'rejected' }).eq('id', payment.id);
      if (error) throw error;
      toast({ title: "Pago rechazado" }); fetchPendingPayments();
    } catch (error) { toast({ title: "Error", variant: "destructive" }); }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Pendiente</Badge>;
    if (status === 'approved') return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Aprobado</Badge>;
    return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Rechazado</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,20%,8%)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[hsl(var(--accent-green))] mx-auto"></div>
          <p className="mt-4 text-white/50">Cargando pagos pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onGoBack} className="mr-4 border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver
          </Button>
          <h1 className="text-3xl font-bold text-[hsl(var(--accent-green))]">Pagos Pendientes</h1>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-white"><DollarSign className="w-5 h-5 mr-2 text-[hsl(var(--accent-green))]" />Pagos Pendientes de Aprobación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/50">Cliente</TableHead>
                    <TableHead className="text-white/50">Plan</TableHead>
                    <TableHead className="text-white/50">Cantidad</TableHead>
                    <TableHead className="text-white/50">Referencia</TableHead>
                    <TableHead className="text-white/50">Estado</TableHead>
                    <TableHead className="text-white/50">Fecha</TableHead>
                    <TableHead className="text-white/50">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.map((payment) => (
                    <TableRow key={payment.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="font-medium text-white">{payment.profiles?.name || 'Desconocido'}</div>
                        <div className="text-sm text-white/40">{payment.profiles?.email || ''}</div>
                      </TableCell>
                      <TableCell className="capitalize text-white/70">{payment.plan_type}</TableCell>
                      <TableCell className="font-medium text-[hsl(var(--accent-green))]">€{payment.amount}</TableCell>
                      <TableCell className="text-white/60">{payment.payment_reference || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-white/50">{new Date(payment.created_at).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedPayment(payment); setShowReceiptModal(true); }} className="text-white/40 hover:text-white hover:bg-white/10"><Eye className="w-4 h-4" /></Button>
                          {payment.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleApprovePayment(payment)} className="text-emerald-400 hover:bg-emerald-500/10"><Check className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleRejectPayment(payment)} className="text-red-400 hover:bg-red-500/10"><X className="w-4 h-4" /></Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {pendingPayments.length === 0 && <div className="text-center py-8 text-white/40">No hay pagos pendientes.</div>}
          </CardContent>
        </Card>

        <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
          <DialogContent className="max-w-md bg-[hsl(220,15%,13%)] border-white/10 text-white">
            <DialogHeader><DialogTitle className="text-[hsl(var(--accent-green))]">Comprobante de Pago</DialogTitle></DialogHeader>
            {selectedPayment && (
              <div className="space-y-4 text-white/70">
                <div><strong className="text-white">Cliente:</strong> {selectedPayment.profiles?.name || 'Desconocido'}</div>
                <div><strong className="text-white">Plan:</strong> {selectedPayment.plan_type}</div>
                <div><strong className="text-white">Cantidad:</strong> <span className="text-[hsl(var(--accent-green))]">€{selectedPayment.amount}</span></div>
                {selectedPayment.payment_reference && <div><strong className="text-white">Referencia:</strong> {selectedPayment.payment_reference}</div>}
                {selectedPayment.notes && <div><strong className="text-white">Notas:</strong> {selectedPayment.notes}</div>}
                {selectedPayment.receipt_url && (
                  <div>
                    <strong className="text-white">Comprobante:</strong>
                    <img src={`${supabase.storage.from('payment-receipts').getPublicUrl(selectedPayment.receipt_url).data.publicUrl}`} alt="Comprobante" className="mt-2 max-w-full h-auto rounded border border-white/10" />
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPendingPayments;
