
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface DietPlan {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  client_name: string;
  calories_target: number;
  created_at: string;
}

interface AdminDietManagerProps {
  onGoBack: () => void;
}

const AdminDietManager: React.FC<AdminDietManagerProps> = ({ onGoBack }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDiet, setEditingDiet] = useState<DietPlan | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    calories_target: '',
    meal_plan: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
    fetchDietPlans();
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
        .select('id, name, email')
        .neq('email', 'josefiguenu@gmail.com')
        .neq('email', 'consultajafn@gmail.com');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchDietPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('diet_plans')
        .select(`
          *,
          profiles!diet_plans_assigned_to_fkey (name)
        `);

      if (error) throw error;

      const plansWithClientNames = data?.map(plan => ({
        ...plan,
        client_name: plan.profiles?.name || 'Sin asignar'
      })) || [];

      setDietPlans(plansWithClientNames);
    } catch (error) {
      console.error('Error fetching diet plans:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !formData.title) {
      toast({
        title: "Error",
        description: "Selecciona un cliente y completa el título.",
        variant: "destructive",
      });
      return;
    }

    try {
      let mealPlanData = null;
      if (formData.meal_plan) {
        try {
          mealPlanData = JSON.parse(formData.meal_plan);
        } catch {
          mealPlanData = { description: formData.meal_plan };
        }
      }

      const dietData = {
        title: formData.title,
        description: formData.description,
        assigned_to: selectedClient,
        user_id: selectedClient,
        calories_target: formData.calories_target ? parseInt(formData.calories_target) : null,
        meal_plan: mealPlanData
      };

      if (editingDiet) {
        const { error } = await supabase
          .from('diet_plans')
          .update(dietData)
          .eq('id', editingDiet.id);

        if (error) throw error;

        toast({
          title: "Dieta actualizada",
          description: "La dieta ha sido actualizada exitosamente.",
        });
      } else {
        const { error } = await supabase
          .from('diet_plans')
          .insert([dietData]);

        if (error) throw error;

        toast({
          title: "Dieta creada",
          description: "La dieta ha sido creada exitosamente.",
        });
      }

      setFormData({ title: '', description: '', calories_target: '', meal_plan: '' });
      setSelectedClient('');
      setShowCreateForm(false);
      setEditingDiet(null);
      fetchDietPlans();
    } catch (error) {
      console.error('Error saving diet plan:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la dieta.",
        variant: "destructive",
      });
    }
  };

  const deleteDiet = async (dietId: string, dietTitle: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la dieta "${dietTitle}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('diet_plans')
        .delete()
        .eq('id', dietId);

      if (error) throw error;

      toast({
        title: "Dieta eliminada",
        description: "La di has been created successfully.",
      });

      fetchDietPlans();
    } catch (error) {
      console.error('Error deleting diet plan:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la dieta.",
        variant: "destructive",
      });
    }
  };

  const editDiet = (diet: DietPlan) => {
    setEditingDiet(diet);
    setFormData({
      title: diet.title,
      description: diet.description || '',
      calories_target: diet.calories_target?.toString() || '',
      meal_plan: diet.meal_plan ? JSON.stringify(diet.meal_plan, null, 2) : ''
    });
    setSelectedClient(diet.assigned_to);
    setShowCreateForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nutrition-green-lighter to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" onClick={onGoBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold text-nutrition-green">Sus Dietas</h1>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-nutrition-green hover:bg-nutrition-green-dark text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Dieta
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Search */}
          <Card>
            <CardHeader>
              <CardTitle>Buscar Cliente</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedClient === client.id 
                        ? 'bg-nutrition-green-lighter border-nutrition-green border-2' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create/Edit Diet Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingDiet ? 'Editar Dieta' : 'Crear Nueva Dieta'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título de la Dieta</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: Plan de Pérdida de Peso"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descripción del plan nutricional..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Calorías Objetivo</label>
                    <Input
                      type="number"
                      value={formData.calories_target}
                      onChange={(e) => setFormData({ ...formData, calories_target: e.target.value })}
                      placeholder="Ej: 2000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Plan de Comidas (JSON o texto)</label>
                    <Textarea
                      value={formData.meal_plan}
                      onChange={(e) => setFormData({ ...formData, meal_plan: e.target.value })}
                      placeholder="Puedes escribir el plan o usar JSON..."
                      rows={6}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      type="submit"
                      className="flex-1 bg-nutrition-green hover:bg-nutrition-green-dark text-white"
                      disabled={!selectedClient}
                    >
                      {editingDiet ? 'Actualizar' : 'Crear'} Dieta
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingDiet(null);
                        setFormData({ title: '', description: '', calories_target: '', meal_plan: '' });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Diet Plans List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Dietas Creadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dietPlans.map((diet) => (
                <div key={diet.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{diet.title}</h3>
                      <p className="text-gray-600 mb-2">Cliente: {diet.client_name}</p>
                      {diet.description && (
                        <p className="text-gray-700 mb-2">{diet.description}</p>
                      )}
                      {diet.calories_target && (
                        <p className="text-sm text-gray-500">Calorías objetivo: {diet.calories_target}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Creado: {new Date(diet.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editDiet(diet)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDiet(diet.id, diet.title)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {dietPlans.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay dietas creadas todavía.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDietManager;
