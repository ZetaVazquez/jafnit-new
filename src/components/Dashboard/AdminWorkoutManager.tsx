
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

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  client_name: string;
  difficulty_level: string;
  exercises?: any;
  created_at: string;
}

interface AdminWorkoutManagerProps {
  onGoBack: () => void;
}

const AdminWorkoutManager: React.FC<AdminWorkoutManagerProps> = ({ onGoBack }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty_level: 'intermediate',
    exercises: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
    fetchWorkoutPlans();
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
        .rpc('get_active_profiles')
        .neq('email', 'josefiguenu@gmail.com')
        .neq('email', 'consultajafn@gmail.com')
        .neq('email', 'zaiidav347@gmail.com');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchWorkoutPlans = async () => {
    try {
      // First get the workout plans
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workout_plans')
        .select('*');

      if (workoutsError) throw workoutsError;

      // Then get the profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name');

      if (profilesError) throw profilesError;

      // Combine the data
      const plansWithClientNames = workoutsData?.map(plan => {
        const clientProfile = profilesData?.find(profile => profile.id === plan.assigned_to);
        return {
          ...plan,
          client_name: clientProfile?.name || 'Sin asignar'
        };
      }) || [];

      setWorkoutPlans(plansWithClientNames);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
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
      let exercisesData = null;
      if (formData.exercises) {
        try {
          exercisesData = JSON.parse(formData.exercises);
        } catch {
          exercisesData = { description: formData.exercises };
        }
      }

      const workoutData = {
        title: formData.title,
        description: formData.description,
        assigned_to: selectedClient,
        user_id: selectedClient,
        difficulty_level: formData.difficulty_level,
        exercises: exercisesData
      };

      if (editingWorkout) {
        const { error } = await supabase
          .from('workout_plans')
          .update(workoutData)
          .eq('id', editingWorkout.id);

        if (error) throw error;

        toast({
          title: "Entrenamiento actualizado",
          description: "El entrenamiento ha sido actualizado exitosamente.",
        });
      } else {
        const { error } = await supabase
          .from('workout_plans')
          .insert([workoutData]);

        if (error) throw error;

        toast({
          title: "Entrenamiento creado",
          description: "El entrenamiento ha sido creado exitosamente.",
        });
      }

      setFormData({ title: '', description: '', difficulty_level: 'intermediate', exercises: '' });
      setSelectedClient('');
      setShowCreateForm(false);
      setEditingWorkout(null);
      fetchWorkoutPlans();
    } catch (error) {
      console.error('Error saving workout plan:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el entrenamiento.",
        variant: "destructive",
      });
    }
  };

  const deleteWorkout = async (workoutId: string, workoutTitle: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el entrenamiento "${workoutTitle}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', workoutId);

      if (error) throw error;

      toast({
        title: "Entrenamiento eliminado",
        description: "El entrenamiento ha sido eliminado exitosamente.",
      });

      fetchWorkoutPlans();
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el entrenamiento.",
        variant: "destructive",
      });
    }
  };

  const editWorkout = (workout: WorkoutPlan) => {
    setEditingWorkout(workout);
    setFormData({
      title: workout.title,
      description: workout.description || '',
      difficulty_level: workout.difficulty_level || 'intermediate',
      exercises: workout.exercises ? JSON.stringify(workout.exercises, null, 2) : ''
    });
    setSelectedClient(workout.assigned_to);
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
            <h1 className="text-3xl font-bold text-nutrition-green">Sus Entrenamientos</h1>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-nutrition-green hover:bg-nutrition-green-dark text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Entrenamiento
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

          {/* Create/Edit Workout Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingWorkout ? 'Editar Entrenamiento' : 'Crear Nuevo Entrenamiento'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título del Entrenamiento</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: Rutina de Fuerza - Principiante"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descripción del entrenamiento..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Nivel de Dificultad</label>
                    <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Principiante</SelectItem>
                        <SelectItem value="intermediate">Intermedio</SelectItem>
                        <SelectItem value="advanced">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Ejercicios (JSON o texto)</label>
                    <Textarea
                      value={formData.exercises}
                      onChange={(e) => setFormData({ ...formData, exercises: e.target.value })}
                      placeholder="Puedes escribir los ejercicios o usar JSON..."
                      rows={6}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      type="submit"
                      className="flex-1 bg-nutrition-green hover:bg-nutrition-green-dark text-white"
                      disabled={!selectedClient}
                    >
                      {editingWorkout ? 'Actualizar' : 'Crear'} Entrenamiento
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingWorkout(null);
                        setFormData({ title: '', description: '', difficulty_level: 'intermediate', exercises: '' });
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

        {/* Workout Plans List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Entrenamientos Creados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workoutPlans.map((workout) => (
                <div key={workout.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{workout.title}</h3>
                      <p className="text-gray-600 mb-2">Cliente: {workout.client_name}</p>
                      {workout.description && (
                        <p className="text-gray-700 mb-2">{workout.description}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Dificultad: {workout.difficulty_level === 'beginner' ? 'Principiante' : 
                                   workout.difficulty_level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Creado: {new Date(workout.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editWorkout(workout)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteWorkout(workout.id, workout.title)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {workoutPlans.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay entrenamientos creados todavía.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminWorkoutManager;
