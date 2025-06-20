
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Save, X, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { BodyMeasurement } from '@/types/database';
import { Textarea } from '@/components/ui/textarea';

interface BodyMeasurementsProps {
  onClose: () => void;
}

const BodyMeasurements: React.FC<BodyMeasurementsProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    body_fat_percentage: '',
    muscle_mass: '',
    waist_circumference: '',
    chest_circumference: '',
    hip_circumference: '',
    notes: '',
    measured_at: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      fetchMeasurements();
    }
  }, [user]);

  const fetchMeasurements = async () => {
    try {
      const { data, error } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', user?.id)
        .order('measured_at', { ascending: false });

      if (error) {
        console.error('Error fetching measurements:', error);
        return;
      }

      setMeasurements(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const measurementData = {
        user_id: user.id,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : null,
        waist_circumference: formData.waist_circumference ? parseFloat(formData.waist_circumference) : null,
        chest_circumference: formData.chest_circumference ? parseFloat(formData.chest_circumference) : null,
        hip_circumference: formData.hip_circumference ? parseFloat(formData.hip_circumference) : null,
        notes: formData.notes || null,
        measured_at: formData.measured_at
      };

      let error;
      if (editingId) {
        ({ error } = await supabase
          .from('body_measurements')
          .update(measurementData)
          .eq('id', editingId));
      } else {
        ({ error } = await supabase
          .from('body_measurements')
          .insert(measurementData));
      }

      if (error) {
        console.error('Error saving measurement:', error);
        toast({
          title: "Error",
          description: "No se pudo guardar la medición",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Guardado",
        description: "Medición guardada correctamente"
      });

      setShowAddForm(false);
      setEditingId(null);
      resetForm();
      fetchMeasurements();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (measurement: BodyMeasurement) => {
    setFormData({
      weight: measurement.weight?.toString() || '',
      body_fat_percentage: measurement.body_fat_percentage?.toString() || '',
      muscle_mass: measurement.muscle_mass?.toString() || '',
      waist_circumference: measurement.waist_circumference?.toString() || '',
      chest_circumference: measurement.chest_circumference?.toString() || '',
      hip_circumference: measurement.hip_circumference?.toString() || '',
      notes: measurement.notes || '',
      measured_at: measurement.measured_at
    });
    setEditingId(measurement.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta medición?')) return;

    try {
      const { error } = await supabase
        .from('body_measurements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting measurement:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la medición",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Eliminado",
        description: "Medición eliminada correctamente"
      });

      fetchMeasurements();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      weight: '',
      body_fat_percentage: '',
      muscle_mass: '',
      waist_circumference: '',
      chest_circumference: '',
      hip_circumference: '',
      notes: '',
      measured_at: new Date().toISOString().split('T')[0]
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nutrition-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mediciones Corporales</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="bg-nutrition-green hover:bg-nutrition-green-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Medición
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4 mr-2" />
            Cerrar
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Medición' : 'Nueva Medición'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="measured_at">Fecha</Label>
                <Input
                  id="measured_at"
                  type="date"
                  value={formData.measured_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, measured_at: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="body_fat_percentage">Grasa Corporal (%)</Label>
                <Input
                  id="body_fat_percentage"
                  type="number"
                  step="0.1"
                  placeholder="15.5"
                  value={formData.body_fat_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, body_fat_percentage: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="muscle_mass">Masa Muscular (kg)</Label>
                <Input
                  id="muscle_mass"
                  type="number"
                  step="0.1"
                  placeholder="45.0"
                  value={formData.muscle_mass}
                  onChange={(e) => setFormData(prev => ({ ...prev, muscle_mass: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="waist_circumference">Cintura (cm)</Label>
                <Input
                  id="waist_circumference"
                  type="number"
                  step="0.1"
                  placeholder="80.0"
                  value={formData.waist_circumference}
                  onChange={(e) => setFormData(prev => ({ ...prev, waist_circumference: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="chest_circumference">Pecho (cm)</Label>
                <Input
                  id="chest_circumference"
                  type="number"
                  step="0.1"
                  placeholder="100.0"
                  value={formData.chest_circumference}
                  onChange={(e) => setFormData(prev => ({ ...prev, chest_circumference: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="hip_circumference">Cadera (cm)</Label>
                <Input
                  id="hip_circumference"
                  type="number"
                  step="0.1"
                  placeholder="95.0"
                  value={formData.hip_circumference}
                  onChange={(e) => setFormData(prev => ({ ...prev, hip_circumference: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                placeholder="Observaciones adicionales..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-nutrition-green hover:bg-nutrition-green-dark">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {measurements.map((measurement) => (
          <Card key={measurement.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">
                  {new Date(measurement.measured_at).toLocaleDateString('es-ES')}
                </h4>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(measurement)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(measurement.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {measurement.weight && (
                  <div>
                    <span className="text-nutrition-gray">Peso:</span>
                    <div className="font-medium">{measurement.weight} kg</div>
                  </div>
                )}
                {measurement.body_fat_percentage && (
                  <div>
                    <span className="text-nutrition-gray">Grasa:</span>
                    <div className="font-medium">{measurement.body_fat_percentage}%</div>
                  </div>
                )}
                {measurement.muscle_mass && (
                  <div>
                    <span className="text-nutrition-gray">Músculo:</span>
                    <div className="font-medium">{measurement.muscle_mass} kg</div>
                  </div>
                )}
                {measurement.waist_circumference && (
                  <div>
                    <span className="text-nutrition-gray">Cintura:</span>
                    <div className="font-medium">{measurement.waist_circumference} cm</div>
                  </div>
                )}
              </div>
              {measurement.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <span className="text-sm text-nutrition-gray">Notas:</span>
                  <p className="text-sm mt-1">{measurement.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {measurements.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-nutrition-gray">No hay mediciones registradas</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-nutrition-green hover:bg-nutrition-green-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primera Medición
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BodyMeasurements;
