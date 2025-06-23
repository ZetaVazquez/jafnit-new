
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Check, X, Eye, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PendingPayment {
  id: string;
  user_id: string;
  plan_type: string;
  amount: number;
  payment_reference: string;
  receipt_url: string;
  notes: string;
  status: string;
  created_at: string;
  profiles: {
    name: string;
    email: string;
  };
}

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
      const { data, error } = await supabase
        .from('pending_payments')
        .select(`
          *,
          profiles (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingPayments(data || []);
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
          payment_method: 'bizum',
          amount: payment.amount
        });

      if (subscriptionError) throw subscriptionError;

      // Registrar ganancia para el admin
      const { error: earningsError } = await supabase
        .from('admin_earnings')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          amount: payment.amount,
          description: `Pago ${payment.plan_type} - ${payment.profiles.name}`,
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
        description: `Suscripción activada para ${payment.profiles.name}`,
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
        description: `Pago rechazado para ${payment.profiles.name}`,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nutrition-green-lighter to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green mx-auto"></div>
          <p className="mt-4 text-nutrition-gray">Cargando pagos pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={onGoBack}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold text-nutrition-green">Pagos Pendientes</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pagos por Bizum Pendientes de Aprobación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.profiles?.name}</div>
                        <div className="text-sm text-gray-500">{payment.profiles?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{payment.plan_type}</TableCell>
                    <TableCell className="font-medium">€{payment.amount}</TableCell>
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
                          variant="outline"
                          size="sm"
                          onClick={() => viewReceipt(payment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {payment.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprovePayment(payment)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectPayment(payment)}
                              className="text-red-600 hover:text-red-700"
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
              <div className="text-center py-8 text-gray-500">
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
                  <strong>Cliente:</strong> {selectedPayment.profiles?.name}
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
