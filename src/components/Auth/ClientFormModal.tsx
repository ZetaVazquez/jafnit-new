import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useClientForm, ClientFormData } from '@/hooks/useClientForm';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const { saveClientForm, loading } = useClientForm();
  const [formData, setFormData] = useState<ClientFormData>({
    start_date: new Date().toISOString().split('T')[0],
    measurements_date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field: keyof ClientFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateBMI = () => {
    if (formData.initial_weight && formData.height_cm) {
      const heightInMeters = formData.height_cm / 100;
      const bmi = formData.initial_weight / (heightInMeters * heightInMeters);
      handleInputChange('bmi', parseFloat(bmi.toFixed(2)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await saveClientForm(formData);
    
    if (error) {
      toast({
        title: "Error",
        description: "Error al guardar la ficha del cliente",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Éxito",
      description: "Ficha del cliente guardada correctamente",
    });
    
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>🗂️ Ficha del Cliente – JAFNFIT</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos Generales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">📅 Datos Generales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Nombre completo</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date || ''}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Sexo</Label>
                <RadioGroup
                  value={formData.gender || ''}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masculino" id="masculino" />
                    <Label htmlFor="masculino">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="femenino" id="femenino" />
                    <Label htmlFor="femenino">Femenino</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dni_nie">DNI/NIE (opcional)</Label>
                <Input
                  id="dni_nie"
                  value={formData.dni_nie || ''}
                  onChange={(e) => handleInputChange('dni_nie', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="start_date">Fecha de inicio</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Programa contratado</Label>
              <RadioGroup
                value={formData.contracted_program || ''}
                onValueChange={(value) => handleInputChange('contracted_program', value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basico" id="basico" />
                  <Label htmlFor="basico">Básico (75 €)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium">Premium (120 €)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pro_trimestral" id="pro_trimestral" />
                  <Label htmlFor="pro_trimestral">Pro trimestral (300 €)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Forma de pago</Label>
              <RadioGroup
                value={formData.payment_method || ''}
                onValueChange={(value) => handleInputChange('payment_method', value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tarjeta" id="tarjeta" />
                  <Label htmlFor="tarjeta">Tarjeta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bizum" id="bizum" />
                  <Label htmlFor="bizum">Bizum</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transferencia" id="transferencia" />
                  <Label htmlFor="transferencia">Transferencia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="web" id="web" />
                  <Label htmlFor="web">Web</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Fuente de captación</Label>
              <RadioGroup
                value={formData.acquisition_source || ''}
                onValueChange={(value) => handleInputChange('acquisition_source', value)}
                className="flex gap-4 flex-wrap"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="instagram" id="instagram" />
                  <Label htmlFor="instagram">Instagram</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recomendacion" id="recomendacion" />
                  <Label htmlFor="recomendacion">Recomendación</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="web" id="web_source" />
                  <Label htmlFor="web_source">Página web</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="otro" id="otro" />
                  <Label htmlFor="otro">Otro</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Contacto y seguimiento */}
          <div className="space-y-4 rounded-lg border border-[hsl(142,71%,45%)]/30 bg-[hsl(142,71%,45%)]/5 p-4">
            <h3 className="text-lg font-semibold">💬 ¿Quieres más información?</h3>
            <p className="text-sm text-muted-foreground">
              Cuéntanos qué necesitas para empezar y nos pondremos en contacto contigo por email, WhatsApp o llamada.
            </p>

            <div>
              <Label htmlFor="info_needed">¿Qué necesitas para empezar?</Label>
              <Textarea
                id="info_needed"
                placeholder="Ej: información sobre los planes, precios, asesoramiento personal..."
                value={formData.info_needed || ''}
                onChange={(e) => handleInputChange('info_needed', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contact_message">Mensaje al entrenador</Label>
              <Textarea
                id="contact_message"
                placeholder="Escribe aquí tu primer mensaje..."
                value={formData.contact_message || ''}
                onChange={(e) => handleInputChange('contact_message', e.target.value)}
              />
            </div>

            <div>
              <Label>Método de contacto preferido</Label>
              <RadioGroup
                value={formData.preferred_contact_method || ''}
                onValueChange={(value) => handleInputChange('preferred_contact_method', value)}
                className="flex gap-4 flex-wrap"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="pcm_email" />
                  <Label htmlFor="pcm_email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="pcm_whatsapp" />
                  <Label htmlFor="pcm_whatsapp">WhatsApp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="llamada" id="pcm_llamada" />
                  <Label htmlFor="pcm_llamada">Llamada</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Objetivos y Motivación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🧠 Objetivos y Motivación</h3>
            
            <div>
              <Label>Objetivo principal</Label>
              <RadioGroup
                value={formData.main_objective || ''}
                onValueChange={(value) => handleInputChange('main_objective', value)}
                className="flex gap-4 flex-wrap"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="perdida_grasa" id="perdida_grasa" />
                  <Label htmlFor="perdida_grasa">Pérdida de grasa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rendimiento" id="rendimiento" />
                  <Label htmlFor="rendimiento">Rendimiento (oposiciones)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ganancia_muscular" id="ganancia_muscular" />
                  <Label htmlFor="ganancia_muscular">Ganancia muscular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recomposicion" id="recomposicion" />
                  <Label htmlFor="recomposicion">Recomposición corporal</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="secondary_objectives">Objetivos secundarios</Label>
              <Textarea
                id="secondary_objectives"
                value={formData.secondary_objectives || ''}
                onChange={(e) => handleInputChange('secondary_objectives', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="personal_motivation">Motivación / Razón personal</Label>
              <Textarea
                id="personal_motivation"
                value={formData.personal_motivation || ''}
                onChange={(e) => handleInputChange('personal_motivation', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="commitment_time">Tiempo estimado de compromiso</Label>
              <Input
                id="commitment_time"
                value={formData.commitment_time || ''}
                onChange={(e) => handleInputChange('commitment_time', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="ninety_day_goal">Objetivo a 90 días</Label>
              <Textarea
                id="ninety_day_goal"
                value={formData.ninety_day_goal || ''}
                onChange={(e) => handleInputChange('ninety_day_goal', e.target.value)}
              />
            </div>
          </div>

          {/* Datos físicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">📏 Datos físicos (mediciones iniciales)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initial_weight">Peso (kg)</Label>
                <Input
                  id="initial_weight"
                  type="number"
                  step="0.1"
                  value={formData.initial_weight || ''}
                  onChange={(e) => {
                    handleInputChange('initial_weight', parseFloat(e.target.value));
                    setTimeout(calculateBMI, 100);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="height_cm">Altura (cm)</Label>
                <Input
                  id="height_cm"
                  type="number"
                  value={formData.height_cm || ''}
                  onChange={(e) => {
                    handleInputChange('height_cm', parseFloat(e.target.value));
                    setTimeout(calculateBMI, 100);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="bmi">IMC</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={formData.bmi || ''}
                  onChange={(e) => handleInputChange('bmi', parseFloat(e.target.value))}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="waist_perimeter">Perímetro cintura (cm)</Label>
                <Input
                  id="waist_perimeter"
                  type="number"
                  step="0.1"
                  value={formData.waist_perimeter || ''}
                  onChange={(e) => handleInputChange('waist_perimeter', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="hip_perimeter">Perímetro cadera (cm)</Label>
                <Input
                  id="hip_perimeter"
                  type="number"
                  step="0.1"
                  value={formData.hip_perimeter || ''}
                  onChange={(e) => handleInputChange('hip_perimeter', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="body_fat_percentage">Grasa corporal estimada (%)</Label>
                <Input
                  id="body_fat_percentage"
                  type="number"
                  step="0.1"
                  value={formData.body_fat_percentage || ''}
                  onChange={(e) => handleInputChange('body_fat_percentage', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="resting_heart_rate">Frecuencia cardíaca en reposo (opcional)</Label>
                <Input
                  id="resting_heart_rate"
                  type="number"
                  value={formData.resting_heart_rate || ''}
                  onChange={(e) => handleInputChange('resting_heart_rate', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="measurements_date">Fecha de medición</Label>
                <Input
                  id="measurements_date"
                  type="date"
                  value={formData.measurements_date || ''}
                  onChange={(e) => handleInputChange('measurements_date', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Información de actividad */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🏋️‍♀️ Información de actividad</h3>
            
            <div>
              <Label>Nivel de actividad diaria (NEAT)</Label>
              <RadioGroup
                value={formData.daily_activity_level || ''}
                onValueChange={(value) => handleInputChange('daily_activity_level', value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sedentario" id="sedentario" />
                  <Label htmlFor="sedentario">Sedentario</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderado" id="moderado" />
                  <Label htmlFor="moderado">Moderado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="activo" id="activo" />
                  <Label htmlFor="activo">Activo</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="current_training">Entrenamiento actual</Label>
              <Textarea
                id="current_training"
                placeholder="Tipo, frecuencia y duración"
                value={formData.current_training || ''}
                onChange={(e) => handleInputChange('current_training', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="physical_limitations">Limitaciones físicas o lesiones</Label>
              <Textarea
                id="physical_limitations"
                value={formData.physical_limitations || ''}
                onChange={(e) => handleInputChange('physical_limitations', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="training_availability">Disponibilidad para entrenar</Label>
              <Textarea
                id="training_availability"
                placeholder="Ej: mañanas, tardes, 3 días/semana..."
                value={formData.training_availability || ''}
                onChange={(e) => handleInputChange('training_availability', e.target.value)}
              />
            </div>
          </div>

          {/* Hábitos alimentarios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🍽️ Hábitos alimentarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meals_per_day">Número de comidas al día</Label>
                <Input
                  id="meals_per_day"
                  type="number"
                  value={formData.meals_per_day || ''}
                  onChange={(e) => handleInputChange('meals_per_day', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="daily_water_intake">Hidratación diaria (agua)</Label>
                <Input
                  id="daily_water_intake"
                  placeholder="Ej: 2-3 litros"
                  value={formData.daily_water_intake || ''}
                  onChange={(e) => handleInputChange('daily_water_intake', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="current_diet_type">Tipo de alimentación actual</Label>
              <Textarea
                id="current_diet_type"
                placeholder="Ej: Omnívora, vegetariana, alta en procesados..."
                value={formData.current_diet_type || ''}
                onChange={(e) => handleInputChange('current_diet_type', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="food_restrictions">Alimentos que no consume o restringe</Label>
              <Textarea
                id="food_restrictions"
                value={formData.food_restrictions || ''}
                onChange={(e) => handleInputChange('food_restrictions', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="current_supplements">Suplementación actual</Label>
              <Textarea
                id="current_supplements"
                value={formData.current_supplements || ''}
                onChange={(e) => handleInputChange('current_supplements', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="intolerances_allergies">Intolerancias / Alergias</Label>
              <Textarea
                id="intolerances_allergies"
                value={formData.intolerances_allergies || ''}
                onChange={(e) => handleInputChange('intolerances_allergies', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pathologies">Patologías</Label>
              <Textarea
                id="pathologies"
                placeholder="Ej: Hipotiroidismo, resistencia a la insulina..."
                value={formData.pathologies || ''}
                onChange={(e) => handleInputChange('pathologies', e.target.value)}
              />
            </div>
          </div>

          {/* Notas adicionales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">💬 Notas adicionales del profesional</h3>
            <div>
              <Label htmlFor="professional_notes">Observaciones</Label>
              <Textarea
                id="professional_notes"
                placeholder="Observaciones psicológicas o motivacionales, barreras detectadas (autoestima, ansiedad, tiempo, etc.), cambios de plan, ajustes futuros, etc."
                value={formData.professional_notes || ''}
                onChange={(e) => handleInputChange('professional_notes', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Ficha'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};