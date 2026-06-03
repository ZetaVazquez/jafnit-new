
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Trash2, Eye, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ClientDetailsModal from './ClientDetailsModal';

interface Client {
  id: string;
  name: string;
  email: string;
  subscription_status: string;
  plan_type: string;
  end_date: string | null;
  created_at: string;
  subscription_id?: string;
  source?: string;
}

interface StripeSubscription {
  id: string;
  status: string;
  plan_type: string;
  current_period_end: string;
}

interface TraditionalSubscription {
  id: string;
  status: string;
  plan_type: string;
  end_date: string;
}

interface AdminClientsTableProps {
  onGoBack: () => void;
}

const AdminClientsTable: React.FC<AdminClientsTableProps> = ({ onGoBack }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string; email: string } | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      // Primero actualizar suscripciones expiradas
      await supabase.rpc('update_expired_subscriptions');

      // Obtener perfiles solo de usuarios que han tenido al menos una suscripción o pago
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          created_at
        `)
        .neq('email', 'josefiguenu@gmail.com')
        .neq('email', 'consultajafn@gmail.com')
        .neq('email', 'zaiidav347@gmail.com');

      if (profilesError) throw profilesError;

      // Obtener suscripciones tradicionales
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*');

      if (subscriptionsError) throw subscriptionsError;

      // Obtener pagos pendientes
      const { data: pendingPaymentsData, error: pendingPaymentsError } = await supabase
        .from('pending_payments')
        .select('user_id');

      if (pendingPaymentsError) throw pendingPaymentsError;

      // Obtener suscripciones de Stripe
      const { data: stripeSubscriptionsData, error: stripeError } = await supabase
        .from('stripe_subscriptions')
        .select('*');

      if (stripeError) throw stripeError;

      // Mapear todos los perfiles (no filtrar por pagos)
      const clientsData = (profilesData || []).map((profile: any) => {
        // Buscar suscripciones para este usuario
        const userSubscriptions = subscriptionsData?.filter(sub => sub.user_id === profile.id) || [];
        const userStripeSubscriptions = stripeSubscriptionsData?.filter(sub => sub.user_id === profile.id) || [];
        
        // Obtener la suscripción más reciente de cada tipo
        const traditionalSubscription = userSubscriptions.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        
        const stripeSubscription = userStripeSubscriptions.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        
        let finalSubscription: any = traditionalSubscription;
        
        // Si hay suscripción de Stripe activa, usar esa
        if (stripeSubscription && (stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing')) {
          finalSubscription = {
            id: stripeSubscription.id,
            status: stripeSubscription.status,
            plan_type: stripeSubscription.plan_type,
            end_date: stripeSubscription.current_period_end
          };
        }

        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          created_at: profile.created_at,
          subscription_status: finalSubscription?.status || 'inactive',
          plan_type: finalSubscription?.plan_type || 'none',
          end_date: finalSubscription?.end_date || null,
          subscription_id: finalSubscription?.id || null,
          source: stripeSubscription && (stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing') ? 'stripe' : 'traditional'
        };
      });

      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateClientPlan = async (clientId: string, planType: string) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;

      if (planType === 'none') {
        // Eliminar suscripción existente
        if (client.subscription_id) {
          if (client.source === 'stripe') {
            // Para Stripe, solo marcar como inactiva (no podemos eliminar desde aquí)
            toast({
              title: "Información",
              description: "Las suscripciones de Stripe deben cancelarse desde el panel de Stripe.",
              variant: "destructive",
            });
            return;
          } else {
            const { error } = await supabase
              .from('subscriptions')
              .delete()
              .eq('id', client.subscription_id);

            if (error) throw error;
          }
        }
      } else {
        // Calcular fechas
        const startDate = new Date();
        const endDate = new Date();
        const amount = planType === 'monthly' ? 75 : 210;
        
        if (planType === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (planType === 'quarterly') {
          endDate.setMonth(endDate.getMonth() + 3);
        }

        if (client.subscription_id) {
          // Actualizar suscripción existente usando RPCs
          if (client.source === 'stripe') {
            // Actualizar suscripción de Stripe
            const { error } = await supabase.rpc('admin_update_stripe_subscription_end_date', {
              p_subscription_id: client.subscription_id,
              p_new_end: endDate.toISOString(),
            });
            if (error) throw error;

            // También actualizar el plan_type si es necesario (esto requeriría otro RPC)
            toast({
              title: "Información",
              description: "Para cambiar el tipo de plan en Stripe, debe hacerse desde el panel de Stripe. Solo se actualizó la fecha.",
            });
          } else {
            // Actualizar suscripción tradicional
            const { error } = await supabase.rpc('admin_update_subscription_end_date', {
              p_subscription_id: client.subscription_id,
              p_new_end: endDate.toISOString(),
            });
            if (error) throw error;

            // Actualizar también el tipo de plan
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({
                plan_type: planType,
                status: 'active',
                start_date: startDate.toISOString(),
                amount: amount,
                updated_at: new Date().toISOString()
              })
              .eq('id', client.subscription_id);

            if (updateError) throw updateError;
          }
        } else {
          // Crear nueva suscripción tradicional
          const { error } = await supabase
            .from('subscriptions')
            .insert({
              user_id: clientId,
              plan_type: planType,
              status: 'active',
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              amount: amount,
              payment_method: 'manual'
            });

          if (error) throw error;
        }
      }

      toast({
        title: "Plan actualizado",
        description: `El plan del cliente ha sido ${planType === 'none' ? 'eliminado' : 'actualizado'} correctamente.`,
      });

      fetchClients(); // Refrescar la lista
      setEditingPlan(null);
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el plan del cliente.",
        variant: "destructive",
      });
    }
  };

  const updateClientExpirationDate = async (clientId: string, newDate: string) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client || !client.subscription_id) {
        toast({
          title: "Error",
          description: "No se encontró una suscripción para actualizar.",
          variant: "destructive",
        });
        return;
      }

      const isoDate = new Date(newDate).toISOString();

      if (client.source === 'stripe') {
        // Actualizar suscripción de Stripe vía RPC (seguridad con SECURITY DEFINER)
        const { error } = await supabase.rpc('admin_update_stripe_subscription_end_date', {
          p_subscription_id: client.subscription_id,
          p_new_end: isoDate,
        });
        if (error) throw error as any;
      } else {
        // Actualizar suscripción tradicional vía RPC
        const { error } = await supabase.rpc('admin_update_subscription_end_date', {
          p_subscription_id: client.subscription_id,
          p_new_end: isoDate,
        });
        if (error) throw error as any;
      }

      toast({
        title: "Fecha actualizada",
        description: "La fecha de vencimiento ha sido actualizada correctamente.",
      });

      fetchClients(); // Refrescar la lista
      setEditingDate(null);
    } catch (error: any) {
      console.error('Error updating expiration date:', error);
      toast({
        title: "Error",
        description: `No se pudo actualizar la fecha de vencimiento: ${error?.message || 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const deleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${clientName}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(clientId);
      
      if (error) throw error;

      toast({
        title: "Cliente eliminado",
        description: `${clientName} ha sido eliminado exitosamente.`,
      });

      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'monthly':
        return 'bg-blue-100 text-blue-800';
      case 'quarterly':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpired = (endDate: string | null) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient({
      id: client.id,
      name: client.name,
      email: client.email
    });
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedClient(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,20%,8%)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[hsl(var(--accent-green-light))] mx-auto"></div>
          <p className="mt-4 text-white/60">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="mr-4 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-white">Gestión de <span className="text-[hsl(var(--accent-green-light))] italic">Clientes</span></h1>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
          <CardHeader>
            <CardTitle className="text-white">Lista de Clientes</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-white/40" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table className="text-white/80">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      {editingPlan === client.id ? (
                        <Select
                          defaultValue={client.plan_type === 'none' ? 'none' : client.plan_type}
                          onValueChange={(value) => updateClientPlan(client.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sin plan</SelectItem>
                            <SelectItem value="monthly">Mensual</SelectItem>
                            <SelectItem value="quarterly">Trimestral</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Badge className={getPlanColor(client.plan_type)}>
                            {client.plan_type === 'none' ? 'Sin plan' : 
                             client.plan_type === 'monthly' ? 'Mensual' : 
                             client.plan_type === 'quarterly' ? 'Trimestral' : 'Sin plan'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPlan(client.id)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.subscription_status)}>
                        {client.subscription_status === 'active' ? 'Activo' : 
                         client.subscription_status === 'expired' ? 'Expirado' :
                         client.subscription_status === 'pending' ? 'Pendiente' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {editingDate === client.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="date"
                            defaultValue={client.end_date ? new Date(client.end_date).toISOString().split('T')[0] : ''}
                            onBlur={(e) => {
                              if (e.target.value) {
                                updateClientExpirationDate(client.id, e.target.value);
                              } else {
                                setEditingDate(null);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (e.currentTarget.value) {
                                  updateClientExpirationDate(client.id, e.currentTarget.value);
                                } else {
                                  setEditingDate(null);
                                }
                              } else if (e.key === 'Escape') {
                                setEditingDate(null);
                              }
                            }}
                            className="w-36"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {client.end_date ? (
                            <span className={isExpired(client.end_date) ? 'text-red-600 font-medium' : 'text-gray-600'}>
                              {new Date(client.end_date).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                          {client.subscription_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingDate(client.id)}
                              className="opacity-50 hover:opacity-100"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(client.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(client)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {(client.subscription_status === 'expired' || client.subscription_status === 'inactive') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteClient(client.id, client.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-white/50">
                {searchTerm ? 'No se encontraron clientes con ese criterio de búsqueda.' : 'No hay clientes registrados.'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Detalles del Cliente */}
        {selectedClient && (
          <ClientDetailsModal
            isOpen={showDetailsModal}
            onClose={handleCloseDetailsModal}
            clientId={selectedClient.id}
            clientName={selectedClient.name}
            clientEmail={selectedClient.email}
          />
        )}
      </div>
    </div>
  );
};

export default AdminClientsTable;
