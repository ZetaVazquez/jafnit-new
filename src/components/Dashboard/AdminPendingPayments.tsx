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

interface AdminPendingPaymentsProps {
  onGoBack: () => void;
}

const AdminPendingPayments: React.FC<AdminPendingPaymentsProps> = ({ onGoBack }) => {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      // First get pending payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('pending_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Then get profiles for each payment
      const paymentsWithProfiles = await Promise.all(
        (paymentsData || []).map(async (payment) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, name, email, created_at, updated_at')
            .eq('id', payment.user_id)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          return {
            ...payment,
            profiles: profileData || null
          } as PendingPayment;
        })
      );

      setPendingPayments(paymentsWithProfiles);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pagos pendientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (payment: PendingPayment) => {
    try {
      // Calcular fechas de suscripción
      const startDate = new Date();
      const endDate = new Date();
      if (payment.plan_type === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 3);
      }

      // Crear o actualizar suscripción
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: payment.user_id,
          plan_type: payment.plan_type,
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          payment_method: 'stripe',
          amount: payment.amount
        });

      if (subscriptionError) throw subscriptionError;

      // Registrar ganancia para el admin
      const { error: earningsError } = await supabase
        .from('admin_earnings')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          amount: payment.amount,
          description: `Pago ${payment.plan_type} - ${payment.profiles?.name}`,
          earning_date: new Date().toISOString().split('T')[0]
        });

      if (earningsError) throw earningsError;

      // Actualizar estado del pago
      const { error: updateError } = await supabase
        .from('pending_payments')
        .update({ status: 'approved' })
        .eq('id', payment.id);

      if (updateError) throw updateError;

      toast({
        title: "Pago aprobado",
        description: `Suscripción activada para ${payment.profiles?.name}`,
      });

      fetchPendingPayments();
    } catch (error) {
      console.error('Error approving payment:', error);
      toast({
        title: "Error",
        description: "No se pudo aprobar el pago.",
        variant: "destructive",
      });
    }
  };

  const handleRejectPayment = async (payment: PendingPayment) => {
    try {
      const { error } = await supabase
        .from('pending_payments')
        .update({ status: 'rejected' })
        .eq('id', payment.id);

      if (error) throw error;

      toast({
        title: "Pago rechazado",
        description: `Pago rechazado para ${payment.profiles?.name}`,
      });

      fetchPendingPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast({
        title: "Error",
        description: "No se pudo rechazar el pago.",
        variant: "destructive",
      });
    }
  };

  const viewReceipt = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,20%,8%)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[hsl(var(--accent-green-light))] mx-auto"></div>
          <p className="mt-4 text-white/60">Cargando pagos pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={onGoBack}
              className="mr-4 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold text-white">Pagos <span className="text-[hsl(var(--accent-green-light))] italic">Pendientes</span></h1>
          </div>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <DollarSign className="w-5 h-5 mr-2" />
              Pagos Pendientes de Aprobación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="text-white/80">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{payment.profiles?.name || 'Usuario desconocido'}</div>
                        <div className="text-sm text-white/50">{payment.profiles?.email || 'Email no disponible'}</div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{payment.plan_type}</TableCell>
                    <TableCell className="font-medium text-[hsl(var(--accent-green-light))]">€{payment.amount}</TableCell>
                    <TableCell>{payment.payment_reference || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={payment.status === 'pending' ? 'default' : 
                                payment.status === 'approved' ? 'secondary' : 'destructive'}
                      >
                        {payment.status === 'pending' ? 'Pendiente' :
                         payment.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(payment.created_at).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewReceipt(payment)}
                          className="text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {payment.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprovePayment(payment)}
                              className="text-[hsl(var(--accent-green-light))] hover:text-white hover:bg-[hsl(var(--accent-green-light))]/20 border border-[hsl(var(--accent-green-light))]/30"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRejectPayment(payment)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/30"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {pendingPayments.length === 0 && (
              <div className="text-center py-8 text-white/50">
                No hay pagos pendientes.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal para ver comprobante */}
        <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Comprobante de Pago</DialogTitle>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div>
                  <strong>Cliente:</strong> {selectedPayment.profiles?.name || 'Usuario desconocido'}
                </div>
                <div>
                  <strong>Plan:</strong> {selectedPayment.plan_type}
                </div>
                <div>
                  <strong>Cantidad:</strong> €{selectedPayment.amount}
                </div>
                {selectedPayment.payment_reference && (
                  <div>
                    <strong>Referencia:</strong> {selectedPayment.payment_reference}
                  </div>
                )}
                {selectedPayment.notes && (
                  <div>
                    <strong>Notas:</strong> {selectedPayment.notes}
                  </div>
                )}
                {selectedPayment.receipt_url && (
                  <div>
                    <strong>Comprobante:</strong>
                    <img 
                      src={`${supabase.storage.from('payment-receipts').getPublicUrl(selectedPayment.receipt_url).data.publicUrl}`}
                      alt="Comprobante de pago"
                      className="mt-2 max-w-full h-auto rounded border"
                    />
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
