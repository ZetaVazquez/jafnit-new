import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface DietPlan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  calories_target: number;
  meal_plan: any;
  created_at: string;
  profiles: {
    name: string;
    email: string;
  };
}

interface AdminDietPlanManagerProps {
  onGoBack: () => void;
}

const AdminDietPlanManager: React.FC<AdminDietPlanManagerProps> = ({ onGoBack }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    description: '',
    calories_target: '',
    meal_plan: '{}'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .neq('email', 'josefiguenu@gmail.com')
        .neq('email', 'consultajafn@gmail.com')
        .neq('email', 'zaiidav347@gmail.com');

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Fetch diet plans
      const { data: plansData, error: plansError } = await supabase
        .from('diet_plans')
        .select(`
          *,
          profiles (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;
      setDietPlans(plansData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar JSON antes de procesar
      let mealPlanJson;
      try {
        mealPlanJson = JSON.parse(formData.meal_plan || '{}');
      } catch (jsonError) {
        const error = jsonError as Error;
        toast({
          title: "Error en el JSON",
          description: `El plan de comidas contiene un error de formato JSON: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      const planData = {
        user_id: formData.user_id,
        title: formData.title,
        description: formData.description,
        calories_target: parseInt(formData.calories_target),
        meal_plan: mealPlanJson
      };

      if (editingPlan) {
        const { error } = await supabase
          .from('diet_plans')
          .update(planData)
          .eq('id', editingPlan.id);

        if (error) throw error;

        toast({
          title: "Plan actualizado",
          description: "El plan de dieta ha sido actualizado correctamente.",
        });
      } else {
        const { error } = await supabase
          .from('diet_plans')
          .insert(planData);

        if (error) throw error;

        toast({
          title: "Plan creado",
          description: "El plan de dieta ha sido creado correctamente.",
        });
      }

      setIsModalOpen(false);
      setEditingPlan(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el plan de dieta.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (plan: DietPlan) => {
    setEditingPlan(plan);
    setFormData({
      user_id: plan.user_id,
      title: plan.title,
      description: plan.description || '',
      calories_target: plan.calories_target?.toString() || '',
      meal_plan: JSON.stringify(plan.meal_plan || {}, null, 2)
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este plan de dieta?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('diet_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Plan eliminado",
        description: "El plan de dieta ha sido eliminado correctamente.",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el plan de dieta.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      title: '',
      description: '',
      calories_target: '',
      meal_plan: '{}'
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nutrition-green-lighter to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green mx-auto"></div>
          <p className="mt-4 text-nutrition-gray">Cargando planes de dieta...</p>
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
            <h1 className="text-3xl font-bold text-nutrition-green">Gestión de Planes de Dieta</h1>
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-nutrition-green hover:bg-nutrition-green-dark text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Plan
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Planes de Dieta</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Calorías Objetivo</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dietPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plan.profiles?.name}</div>
                        <div className="text-sm text-gray-500">{plan.profiles?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{plan.title}</TableCell>
                    <TableCell>{plan.calories_target} cal</TableCell>
                    <TableCell>
                      {new Date(plan.created_at).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(plan)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(plan.id)}
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

            {dietPlans.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay planes de dieta creados.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal for Create/Edit */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Editar Plan de Dieta' : 'Crear Plan de Dieta'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cliente</label>
                <Select
                  value={formData.user_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, user_id: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Ej: Plan de Pérdida de Peso Personalizado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción del plan de dieta..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Calorías Objetivo</label>
                <Input
                  type="number"
                  value={formData.calories_target}
                  onChange={(e) => setFormData(prev => ({ ...prev, calories_target: e.target.value }))}
                  placeholder="Ej: 2000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Plan de Comidas (JSON)</label>
                <Textarea
                  value={formData.meal_plan}
                  onChange={(e) => setFormData(prev => ({ ...prev, meal_plan: e.target.value }))}
                  placeholder='{"desayuno": "...", "almuerzo": "...", "cena": "..."}'
                  rows={5}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-nutrition-green hover:bg-nutrition-green-dark text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingPlan ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDietPlanManager;
