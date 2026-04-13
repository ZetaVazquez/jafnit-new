
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

  useEffect(() => { fetchClients(); }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      await supabase.rpc('update_expired_subscriptions');
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles').select('id, name, email, created_at')
        .neq('email', 'josefiguenu@gmail.com').neq('email', 'consultajafn@gmail.com').neq('email', 'zaiidav347@gmail.com');
      if (profilesError) throw profilesError;

      const { data: subscriptionsData, error: subscriptionsError } = await supabase.from('subscriptions').select('*');
      if (subscriptionsError) throw subscriptionsError;

      const { data: stripeSubscriptionsData, error: stripeError } = await supabase.from('stripe_subscriptions').select('*');
      if (stripeError) throw stripeError;

      const clientsData = (profilesData || []).map((profile: any) => {
        const userSubscriptions = subscriptionsData?.filter(sub => sub.user_id === profile.id) || [];
        const userStripeSubscriptions = stripeSubscriptionsData?.filter(sub => sub.user_id === profile.id) || [];
        const traditionalSubscription = userSubscriptions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        const stripeSubscription = userStripeSubscriptions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        let finalSubscription: any = traditionalSubscription;
        if (stripeSubscription && (stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing')) {
          finalSubscription = { id: stripeSubscription.id, status: stripeSubscription.status, plan_type: stripeSubscription.plan_type, end_date: stripeSubscription.current_period_end };
        }
        return {
          id: profile.id, name: profile.name, email: profile.email, created_at: profile.created_at,
          subscription_status: finalSubscription?.status || 'inactive', plan_type: finalSubscription?.plan_type || 'none',
          end_date: finalSubscription?.end_date || null, subscription_id: finalSubscription?.id || null,
          source: stripeSubscription && (stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing') ? 'stripe' : 'traditional'
        };
      });
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({ title: "Error", description: "No se pudieron cargar los clientes.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const updateClientPlan = async (clientId: string, planType: string) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      if (planType === 'none') {
        if (client.subscription_id) {
          if (client.source === 'stripe') { toast({ title: "Información", description: "Las suscripciones de Stripe deben cancelarse desde el panel de Stripe.", variant: "destructive" }); return; }
          else { const { error } = await supabase.from('subscriptions').delete().eq('id', client.subscription_id); if (error) throw error; }
        }
      } else {
        const startDate = new Date(); const endDate = new Date();
        const amount = planType === 'monthly' ? 75 : 210;
        if (planType === 'monthly') { endDate.setMonth(endDate.getMonth() + 1); } else if (planType === 'quarterly') { endDate.setMonth(endDate.getMonth() + 3); }
        if (client.subscription_id) {
          if (client.source === 'stripe') {
            const { error } = await supabase.rpc('admin_update_stripe_subscription_end_date', { p_subscription_id: client.subscription_id, p_new_end: endDate.toISOString() });
            if (error) throw error;
            toast({ title: "Información", description: "Para cambiar el tipo de plan en Stripe, debe hacerse desde el panel de Stripe. Solo se actualizó la fecha." });
          } else {
            const { error } = await supabase.rpc('admin_update_subscription_end_date', { p_subscription_id: client.subscription_id, p_new_end: endDate.toISOString() });
            if (error) throw error;
            const { error: updateError } = await supabase.from('subscriptions').update({ plan_type: planType, status: 'active', start_date: startDate.toISOString(), amount, updated_at: new Date().toISOString() }).eq('id', client.subscription_id);
            if (updateError) throw updateError;
          }
        } else {
          const { error } = await supabase.from('subscriptions').insert({ user_id: clientId, plan_type: planType, status: 'active', start_date: startDate.toISOString(), end_date: endDate.toISOString(), amount, payment_method: 'manual' });
          if (error) throw error;
        }
      }
      toast({ title: "Plan actualizado", description: `El plan del cliente ha sido ${planType === 'none' ? 'eliminado' : 'actualizado'} correctamente.` });
      fetchClients(); setEditingPlan(null);
    } catch (error) { console.error('Error updating plan:', error); toast({ title: "Error", description: "No se pudo actualizar el plan del cliente.", variant: "destructive" }); }
  };

  const updateClientExpirationDate = async (clientId: string, newDate: string) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client || !client.subscription_id) { toast({ title: "Error", description: "No se encontró una suscripción para actualizar.", variant: "destructive" }); return; }
      const isoDate = new Date(newDate).toISOString();
      if (client.source === 'stripe') {
        const { error } = await supabase.rpc('admin_update_stripe_subscription_end_date', { p_subscription_id: client.subscription_id, p_new_end: isoDate });
        if (error) throw error as any;
      } else {
        const { error } = await supabase.rpc('admin_update_subscription_end_date', { p_subscription_id: client.subscription_id, p_new_end: isoDate });
        if (error) throw error as any;
      }
      toast({ title: "Fecha actualizada", description: "La fecha de vencimiento ha sido actualizada correctamente." });
      fetchClients(); setEditingDate(null);
    } catch (error: any) { console.error('Error updating expiration date:', error); toast({ title: "Error", description: `No se pudo actualizar la fecha: ${error?.message || 'Error desconocido'}`, variant: "destructive" }); }
  };

  const deleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${clientName}?`)) return;
    try {
      const { error } = await supabase.auth.admin.deleteUser(clientId);
      if (error) throw error;
      toast({ title: "Cliente eliminado", description: `${clientName} ha sido eliminado exitosamente.` });
      fetchClients();
    } catch (error) { console.error('Error deleting client:', error); toast({ title: "Error", description: "No se pudo eliminar el cliente.", variant: "destructive" }); }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Activo</Badge>;
      case 'expired': return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Expirado</Badge>;
      case 'pending': return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Pendiente</Badge>;
      default: return <Badge className="bg-white/10 text-white/50 border border-white/20">Inactivo</Badge>;
    }
  };

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case 'monthly': return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">Mensual</Badge>;
      case 'quarterly': return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">Trimestral</Badge>;
      default: return <Badge className="bg-white/10 text-white/50 border border-white/20">Sin plan</Badge>;
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient({ id: client.id, name: client.name, email: client.email });
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,20%,8%)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[hsl(var(--accent-green))] mx-auto"></div>
          <p className="mt-4 text-white/50">Cargando clientes...</p>
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
          <h1 className="text-3xl font-bold text-[hsl(var(--accent-green))]">Gestión de Clientes</h1>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Lista de Clientes</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-white/40" />
              <Input placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[hsl(var(--accent-green))]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/50">Cliente</TableHead>
                    <TableHead className="text-white/50">Email</TableHead>
                    <TableHead className="text-white/50">Plan</TableHead>
                    <TableHead className="text-white/50">Estado</TableHead>
                    <TableHead className="text-white/50">Vencimiento</TableHead>
                    <TableHead className="text-white/50">Registro</TableHead>
                    <TableHead className="text-white/50">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{client.name}</TableCell>
                      <TableCell className="text-white/70">{client.email}</TableCell>
                      <TableCell>
                        {editingPlan === client.id ? (
                          <Select defaultValue={client.plan_type === 'none' ? 'none' : client.plan_type} onValueChange={(value) => updateClientPlan(client.id, value)}>
                            <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Sin plan</SelectItem>
                              <SelectItem value="monthly">Mensual</SelectItem>
                              <SelectItem value="quarterly">Trimestral</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center space-x-2">
                            {getPlanBadge(client.plan_type)}
                            <Button variant="ghost" size="sm" onClick={() => setEditingPlan(client.id)} className="text-white/40 hover:text-white hover:bg-white/10">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(client.subscription_status)}</TableCell>
                      <TableCell>
                        {editingDate === client.id ? (
                          <div className="flex items-center space-x-2">
                            <Input type="date" defaultValue={client.end_date ? new Date(client.end_date).toISOString().split('T')[0] : ''} className="w-40 bg-white/5 border-white/10 text-white" onBlur={(e) => { if (e.target.value) updateClientExpirationDate(client.id, e.target.value); }} />
                            <Button variant="ghost" size="sm" onClick={() => setEditingDate(null)} className="text-white/40 hover:text-white hover:bg-white/10">✕</Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm ${client.end_date && new Date(client.end_date) < new Date() ? 'text-red-400' : 'text-white/70'}`}>
                              {client.end_date ? new Date(client.end_date).toLocaleDateString('es-ES') : 'N/A'}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => setEditingDate(client.id)} className="text-white/40 hover:text-white hover:bg-white/10">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-white/50 text-sm">{new Date(client.created_at).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(client)} className="text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10"><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteClient(client.id, client.name)} className="text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedClient && (
        <ClientDetailsModal isOpen={showDetailsModal} onClose={() => { setShowDetailsModal(false); setSelectedClient(null); }} clientId={selectedClient.id} clientName={selectedClient.name} clientEmail={selectedClient.email} />
      )}
    </div>
  );
};

export default AdminClientsTable;
