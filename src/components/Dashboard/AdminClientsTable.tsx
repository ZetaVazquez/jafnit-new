
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  subscription_status: string;
  plan_type: string;
  end_date: string | null;
  created_at: string;
}

interface AdminClientsTableProps {
  onGoBack: () => void;
}

const AdminClientsTable: React.FC<AdminClientsTableProps> = ({ onGoBack }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
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
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          created_at,
          subscriptions (
            status,
            plan_type,
            end_date
          )
        `)
        .neq('email', 'josefiguenu@gmail.com')
        .neq('email', 'consultajafn@gmail.com');

      if (error) throw error;

      const clientsData = data?.map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        created_at: profile.created_at,
        subscription_status: profile.subscriptions?.[0]?.status || 'inactive',
        plan_type: profile.subscriptions?.[0]?.plan_type || 'none',
        end_date: profile.subscriptions?.[0]?.end_date || null
      })) || [];

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

      fetchClients(); // Refresh the list
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

  const isExpired = (endDate: string | null) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nutrition-green-lighter to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green mx-auto"></div>
          <p className="mt-4 text-nutrition-gray">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={onGoBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-nutrition-green">Gestión de Clientes</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {client.plan_type === 'none' ? 'Sin plan' : client.plan_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.subscription_status)}>
                        {client.subscription_status === 'active' ? 'Activo' : 
                         client.subscription_status === 'expired' ? 'Expirado' :
                         client.subscription_status === 'pending' ? 'Pendiente' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.end_date ? (
                        <span className={isExpired(client.end_date) ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          {new Date(client.end_date).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
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
                          onClick={() => alert(`Ver detalles de ${client.name}`)}
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
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No se encontraron clientes con ese criterio de búsqueda.' : 'No hay clientes registrados.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminClientsTable;
