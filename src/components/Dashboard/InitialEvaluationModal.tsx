import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ClipboardList, ChevronLeft, ChevronRight, Save, CheckCircle2, X, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface InitialEvaluationModalProps {
  isOpen: boolean;
  onComplete: () => void;
  /**
   * Permite cerrar el modal aunque la evaluación no esté completada.
   * Se usa cuando el cliente reabre la evaluación desde su perfil tras haberla completado.
   */
  allowClose?: boolean;
  onClose?: () => void;
}

type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'tel' | 'email';
export interface EvaluationField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  full?: boolean;
}
export interface EvaluationBlock {
  key: string;
  column: string;
  title: string;
  description?: string;
  conditional?: 'female_only';
  fields: EvaluationField[];
}

export const EVALUATION_BLOCKS: EvaluationBlock[] = [
  {
    key: 'block_1_identification',
    column: 'block_1_identification',
    title: '1. Identificación y contexto estratégico',
    description: 'Datos personales, contexto vital, objetivos y motivación.',
    fields: [
      { name: 'full_name', label: 'Nombre y apellidos', type: 'text' },
      { name: 'birth_date', label: 'Fecha de nacimiento', type: 'date' },
      { name: 'age', label: 'Edad', type: 'number' },
      { name: 'gender', label: 'Sexo', type: 'select', options: ['Masculino', 'Femenino', 'Otro'] },
      { name: 'phone', label: 'Teléfono', type: 'tel' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'country', label: 'País', type: 'text' },
      { name: 'city', label: 'Ciudad', type: 'text' },
      { name: 'province', label: 'Provincia', type: 'text' },
      { name: 'address', label: 'Dirección completa', type: 'text', full: true },
      { name: 'profession', label: 'Profesión', type: 'text' },
      { name: 'work_type', label: 'Tipo de trabajo', type: 'select', options: ['Sedentario', 'Activo', 'Muy activo'] },
      { name: 'work_schedule', label: 'Horario laboral habitual', type: 'text' },
      { name: 'rotating_shifts', label: '¿Turnos rotativos?', type: 'select', options: ['Sí', 'No'] },
      { name: 'remote_work', label: '¿Teletrabajo o presencial?', type: 'select', options: ['Teletrabajo', 'Presencial', 'Mixto'] },
      { name: 'expected_start_date', label: 'Fecha prevista de inicio', type: 'date' },
      { name: 'living_situation', label: '¿Vives sol@ o acompañad@?', type: 'text' },
      { name: 'dependents', label: '¿Tienes hijos o personas a tu cargo?', type: 'text' },
      { name: 'family_responsibility_level', label: 'Nivel de responsabilidad familiar (0-10)', type: 'number' },
      { name: 'weekly_personal_time', label: 'Tiempo real disponible para ti a la semana', type: 'text' },
      { name: 'who_cooks', label: '¿Quién cocina habitualmente?', type: 'text' },
      { name: 'who_shops', label: '¿Quién realiza la compra?', type: 'text' },
      { name: 'routine_stability', label: 'Nivel de estabilidad de tus rutinas (0-10)', type: 'number' },
      { name: 'recent_changes', label: 'Cambios importantes en los últimos 6 meses', type: 'textarea', full: true },
      { name: 'upcoming_changes', label: 'Cambios previstos en los próximos 3 meses', type: 'textarea', full: true },
      { name: 'stress_level', label: 'Nivel de estrés actual (0-10)', type: 'number' },
      { name: 'main_stress_source', label: 'Fuente principal de estrés', type: 'text' },
      { name: 'main_objective', label: 'Objetivo principal', type: 'textarea', full: true },
      { name: 'short_term_objective', label: 'Objetivo a corto plazo (8-12 semanas)', type: 'textarea', full: true },
      { name: 'mid_term_objective', label: 'Objetivo a medio plazo (3-6 meses)', type: 'textarea', full: true },
      { name: 'long_term_objective', label: 'Objetivo a largo plazo', type: 'textarea', full: true },
      { name: 'time_horizon', label: 'Horizonte temporal esperado', type: 'text' },
      { name: 'real_priority', label: 'Prioridad real', type: 'select', options: ['Estética', 'Salud', 'Rendimiento', 'Energía'] },
      { name: 'success_indicator', label: '¿Cómo sabrás que lo has conseguido?', type: 'textarea', full: true },
      { name: 'life_change_if_achieved', label: '¿Qué cambiaría en tu vida si lo logras?', type: 'textarea', full: true },
      { name: 'current_commitment', label: 'Nivel de compromiso actual (0-10)', type: 'number' },
      { name: 'reason_to_start_now', label: 'Motivo real para comenzar ahora', type: 'textarea', full: true },
      { name: 'previous_attempts', label: 'Intentos previos similares', type: 'textarea', full: true },
      { name: 'why_didnt_work', label: '¿Por qué no funcionaron?', type: 'textarea', full: true },
      { name: 'main_obstacles', label: 'Principales obstáculos actuales', type: 'textarea', full: true },
    ],
  },
  {
    key: 'block_2_health_screening',
    column: 'block_2_health_screening',
    title: '2. Cribado de salud y aptitud para el ejercicio',
    description: 'Indica si tienes alguna de estas condiciones (marca las que apliquen).',
    fields: [
      { name: 'cardiovascular_disease', label: 'Enfermedad cardiovascular diagnosticada', type: 'checkbox' },
      { name: 'hypertension', label: 'Hipertensión', type: 'checkbox' },
      { name: 'diabetes', label: 'Diabetes', type: 'checkbox' },
      { name: 'respiratory_disease', label: 'Enfermedad respiratoria', type: 'checkbox' },
      { name: 'metabolic_disease', label: 'Enfermedad metabólica', type: 'checkbox' },
      { name: 'neurological_disease', label: 'Enfermedad neurológica', type: 'checkbox' },
      { name: 'autoimmune_disease', label: 'Enfermedad autoinmune', type: 'checkbox' },
      { name: 'chronic_pain', label: 'Dolor crónico', type: 'checkbox' },
      { name: 'recent_surgery', label: 'Cirugía reciente', type: 'checkbox' },
      { name: 'recent_injuries', label: 'Lesiones recientes', type: 'checkbox' },
      { name: 'smoking', label: 'Tabaquismo', type: 'checkbox' },
      { name: 'family_cardiovascular_history', label: 'Antecedentes familiares cardiovasculares', type: 'checkbox' },
      { name: 'health_details', label: 'Detalles adicionales sobre tu salud', type: 'textarea', full: true },
      { name: 'current_medication', label: 'Medicación actual', type: 'textarea', full: true },
      { name: 'medical_clearance', label: '¿Tienes autorización médica para hacer ejercicio?', type: 'select', options: ['Sí', 'No', 'No aplica'] },
    ],
  },
  {
    key: 'block_3_dietary_history',
    column: 'block_3_dietary_history',
    title: '3. Historial dietético y conducta alimentaria',
    description: 'Tu relación con la comida, dietas previas y estructura nutricional.',
    fields: [
      { name: 'previous_diets', label: 'Dietas o planes previos', type: 'textarea', full: true },
      { name: 'rebound_effect', label: '¿Has sufrido efecto rebote?', type: 'select', options: ['Sí', 'No', 'A veces'] },
      { name: 'severe_restriction_periods', label: '¿Has pasado por periodos de restricción severa?', type: 'textarea', full: true },
      { name: 'meals_per_day', label: 'Número de comidas al día', type: 'number' },
      { name: 'eating_schedule', label: 'Horario habitual de comidas', type: 'text', full: true },
      { name: 'food_restrictions', label: 'Alimentos que no consumes', type: 'textarea', full: true },
      { name: 'intolerances_allergies', label: 'Intolerancias o alergias', type: 'textarea', full: true },
      { name: 'current_supplements', label: 'Suplementación actual', type: 'textarea', full: true },
      { name: 'water_intake', label: 'Hidratación diaria (litros)', type: 'text' },
      { name: 'alcohol_consumption', label: 'Consumo de alcohol', type: 'text' },
      { name: 'binge_eating', label: '¿Episodios de atracones?', type: 'select', options: ['Nunca', 'A veces', 'Frecuentemente'] },
      { name: 'emotional_eating', label: '¿Comes por emociones?', type: 'select', options: ['Nunca', 'A veces', 'Frecuentemente'] },
      { name: 'planning_level', label: 'Nivel de planificación semanal (0-10)', type: 'number' },
      { name: 'intestinal_frequency', label: 'Frecuencia intestinal', type: 'text' },
      { name: 'frequent_bloating', label: 'Hinchazón frecuente', type: 'select', options: ['Sí', 'No', 'A veces'] },
      { name: 'reflux', label: 'Reflujo', type: 'select', options: ['Sí', 'No', 'A veces'] },
      { name: 'food_intolerance_perceived', label: 'Alimentos que percibes que no toleras bien', type: 'textarea', full: true },
    ],
  },
  {
    key: 'block_4_training_profile',
    column: 'block_4_training_profile',
    title: '4. Perfil de entrenamiento y capacidad física',
    description: 'Tu experiencia y disponibilidad para entrenar.',
    fields: [
      { name: 'strength_training_experience', label: 'Experiencia previa en entrenamiento de fuerza', type: 'textarea', full: true },
      { name: 'years_training', label: 'Años entrenando', type: 'number' },
      { name: 'current_training', label: 'Entrenamiento actual', type: 'textarea', full: true },
      { name: 'training_frequency', label: 'Frecuencia de entrenamiento (días/semana)', type: 'number' },
      { name: 'session_duration', label: 'Duración media por sesión (min)', type: 'number' },
      { name: 'training_location', label: 'Lugar de entrenamiento', type: 'select', options: ['Gimnasio', 'Casa', 'Aire libre', 'Mixto'] },
      { name: 'available_equipment', label: 'Material disponible', type: 'textarea', full: true },
      { name: 'physical_limitations', label: 'Limitaciones físicas o lesiones', type: 'textarea', full: true },
      { name: 'cardio_experience', label: 'Experiencia con cardio', type: 'textarea', full: true },
      { name: 'flexibility_mobility', label: 'Movilidad y flexibilidad', type: 'text' },
      { name: 'recovery_time', label: 'Tiempo que tardas en recuperarte tras sesiones intensas', type: 'text' },
      { name: 'progression_feeling', label: 'Sensación de progresión en los últimos meses', type: 'textarea', full: true },
      { name: 'preferred_training_time', label: 'Franja horaria preferida para entrenar', type: 'text' },
      { name: 'training_motivation', label: 'Motivación actual con el entrenamiento (0-10)', type: 'number' },
    ],
  },
  {
    key: 'block_5_lifestyle_recovery',
    column: 'block_5_lifestyle_recovery',
    title: '5. Estilo de vida, estrés y recuperación',
    description: 'Sueño, descanso, hábitos y gestión del estrés.',
    fields: [
      { name: 'sleep_hours', label: 'Horas de sueño habituales', type: 'number' },
      { name: 'sleep_quality', label: 'Calidad del sueño (0-10)', type: 'number' },
      { name: 'difficulty_falling_asleep', label: 'Dificultad para conciliar el sueño', type: 'select', options: ['Nunca', 'A veces', 'Frecuentemente'] },
      { name: 'night_awakenings', label: 'Despertares nocturnos', type: 'select', options: ['Nunca', 'A veces', 'Frecuentemente'] },
      { name: 'pre_sleep_routine', label: '¿Rutina previa al sueño establecida?', type: 'select', options: ['Sí', 'No'] },
      { name: 'screen_time', label: 'Tiempo medio diario frente a pantallas', type: 'text' },
      { name: 'energy_level', label: 'Nivel de energía habitual (0-10)', type: 'number' },
      { name: 'fatigue_frequency', label: 'Frecuencia de fatiga', type: 'select', options: ['Rara vez', 'A veces', 'Frecuentemente', 'Constante'] },
      { name: 'stress_management', label: '¿Cómo gestionas el estrés?', type: 'textarea', full: true },
      { name: 'relaxation_practices', label: 'Prácticas de relajación (meditación, yoga...)', type: 'textarea', full: true },
      { name: 'social_support', label: 'Apoyo social en tu proceso', type: 'textarea', full: true },
      { name: 'hobbies', label: 'Aficiones / actividades que disfrutas', type: 'textarea', full: true },
    ],
  },
  {
    key: 'block_6_medical_clinical',
    column: 'block_6_medical_clinical',
    title: '6. Historial médico complementario y variables clínicas',
    description: 'Antecedentes y analíticas si dispones de ellas (puedes dejar en blanco).',
    fields: [
      { name: 'family_history', label: 'Antecedentes médicos familiares relevantes', type: 'textarea', full: true },
      { name: 'personal_history', label: 'Antecedentes médicos personales', type: 'textarea', full: true },
      { name: 'water_retention', label: 'Retención de líquidos frecuente', type: 'select', options: ['Sí', 'No', 'A veces'] },
      { name: 'analytics_date', label: 'Fecha de la última analítica', type: 'date' },
      { name: 'glucose', label: 'Glucosa', type: 'text' },
      { name: 'cholesterol_total', label: 'Colesterol total', type: 'text' },
      { name: 'hdl', label: 'HDL', type: 'text' },
      { name: 'ldl', label: 'LDL', type: 'text' },
      { name: 'triglycerides', label: 'Triglicéridos', type: 'text' },
      { name: 'tsh', label: 'TSH', type: 'text' },
      { name: 'free_t4', label: 'T4 libre', type: 'text' },
      { name: 'ferritin', label: 'Ferritina', type: 'text' },
      { name: 'vitamin_d', label: 'Vitamina D', type: 'text' },
      { name: 'b12', label: 'Vitamina B12', type: 'text' },
      { name: 'other_markers', label: 'Otros marcadores relevantes', type: 'textarea', full: true },
    ],
  },
  {
    key: 'block_7_hormonal_health',
    column: 'block_7_hormonal_health',
    title: '7. Salud hormonal y ciclo menstrual (solo mujeres)',
    description: 'Si no aplica, puedes saltar este bloque dejando los campos vacíos.',
    conditional: 'female_only',
    fields: [
      { name: 'menstrual_status', label: 'Estado menstrual actual', type: 'select', options: ['Regular', 'Irregular', 'Ausente', 'Menopausia', 'No aplica'] },
      { name: 'cycle_length', label: 'Duración media del ciclo (días)', type: 'number' },
      { name: 'period_duration', label: 'Duración de la regla (días)', type: 'number' },
      { name: 'menstrual_pain', label: 'Dolor menstrual (0-10)', type: 'number' },
      { name: 'pms_symptoms', label: 'Síntomas premenstruales', type: 'textarea', full: true },
      { name: 'contraception', label: 'Anticoncepción / regulación hormonal actual', type: 'textarea', full: true },
      { name: 'menopause_confirmed', label: '¿Menopausia confirmada?', type: 'select', options: ['Sí', 'No', 'No aplica'] },
      { name: 'menopause_age_changes', label: 'Edad aproximada de inicio de cambios', type: 'number' },
      { name: 'hot_flashes', label: 'Sofocos', type: 'select', options: ['Nunca', 'A veces', 'Frecuentemente'] },
      { name: 'hormonal_diagnoses', label: 'Diagnósticos hormonales (SOP, endometriosis, tiroides...)', type: 'textarea', full: true },
    ],
  },
  {
    key: 'block_8_anthropometry',
    column: 'block_8_anthropometry',
    title: '8. Antropometría y mediciones',
    description: 'Mediciones iniciales. Si no las conoces, déjalas en blanco.',
    fields: [
      { name: 'weight', label: 'Peso (kg)', type: 'number' },
      { name: 'height', label: 'Altura (cm)', type: 'number' },
      { name: 'bmi', label: 'IMC', type: 'number' },
      { name: 'body_fat', label: '% Grasa corporal estimada', type: 'number' },
      { name: 'muscle_mass', label: 'Masa muscular (kg)', type: 'number' },
      { name: 'neck_perimeter', label: 'Perímetro cuello (cm)', type: 'number' },
      { name: 'arm_perimeter', label: 'Perímetro brazo (cm)', type: 'number' },
      { name: 'waist_perimeter', label: 'Perímetro cintura (cm)', type: 'number' },
      { name: 'abdomen_perimeter', label: 'Perímetro abdomen (cm)', type: 'number' },
      { name: 'hip_perimeter', label: 'Perímetro cadera (cm)', type: 'number' },
      { name: 'thigh_perimeter', label: 'Perímetro muslo (cm)', type: 'number' },
      { name: 'measurement_date', label: 'Fecha de las mediciones', type: 'date' },
      { name: 'measurement_notes', label: 'Notas adicionales sobre las mediciones', type: 'textarea', full: true },
    ],
  },
];

const InitialEvaluationModal: React.FC<InitialEvaluationModalProps> = ({ isOpen, onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentBlock, setCurrentBlock] = useState(0);
  const [blockData, setBlockData] = useState<Record<string, Record<string, any>>>({});
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const loadEvaluation = async () => {
      if (!isOpen || !user) return;
      setInitialLoading(true);
      try {
        const { data } = await (supabase as any)
          .from('initial_evaluations')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data) {
          setEvaluationId(data.id);
          const loaded: Record<string, Record<string, any>> = {};
          EVALUATION_BLOCKS.forEach(b => {
            loaded[b.key] = (data[b.column] as Record<string, any>) || {};
          });
          setBlockData(loaded);
          // Si ya está completado, no mostrar el modal
          if (data.completed) {
            onComplete();
            return;
          }
        } else {
          const initial: Record<string, Record<string, any>> = {};
          EVALUATION_BLOCKS.forEach(b => { initial[b.key] = {}; });
          setBlockData(initial);
        }
      } catch (err) {
        console.error('Error loading evaluation:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadEvaluation();
  }, [isOpen, user, onComplete]);

  if (!isOpen) return null;

  const block = EVALUATION_BLOCKS[currentBlock];
  const data = blockData[block?.key] || {};

  const updateField = (name: string, value: any) => {
    setBlockData(prev => ({
      ...prev,
      [block.key]: { ...(prev[block.key] || {}), [name]: value }
    }));
  };

  const saveBlock = async (markCompleted = false): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
      const payload: Record<string, any> = { user_id: user.id };
      EVALUATION_BLOCKS.forEach(b => {
        payload[b.column] = blockData[b.key] || {};
      });
      if (markCompleted) {
        payload.completed = true;
        payload.completed_at = new Date().toISOString();
      }

      let result;
      if (evaluationId) {
        result = await (supabase as any)
          .from('initial_evaluations')
          .update(payload)
          .eq('id', evaluationId)
          .select()
          .single();
      } else {
        result = await (supabase as any)
          .from('initial_evaluations')
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) throw result.error;
      if (result.data) setEvaluationId(result.data.id);
      return true;
    } catch (err: any) {
      console.error('Error saving block:', err);
      toast({
        title: 'Error al guardar',
        description: err.message || 'No se pudo guardar el progreso.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndContinue = async () => {
    const ok = await saveBlock(false);
    if (!ok) return;
    toast({ title: 'Bloque guardado', description: 'Tu progreso se ha guardado.' });
    if (currentBlock < EVALUATION_BLOCKS.length - 1) {
      setCurrentBlock(currentBlock + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentBlock > 0) setCurrentBlock(currentBlock - 1);
  };

  const handleFinish = async () => {
    const ok = await saveBlock(true);
    if (!ok) return;
    toast({ title: '¡Evaluación completada!', description: 'Gracias por completar tu evaluación inicial.' });
    onComplete();
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-[hsl(var(--accent-green))]/50 focus:border-[hsl(var(--accent-green))]/50 outline-none";
  const labelClass = "text-sm font-medium text-white/70";

  const renderField = (field: EvaluationField) => {
    const value = data[field.name] ?? '';
    const isFull = field.full || field.type === 'textarea';

    return (
      <div key={field.name} className={`space-y-2 ${isFull ? 'md:col-span-2' : ''}`}>
        {field.type !== 'checkbox' && (
          <Label htmlFor={field.name} className={labelClass}>{field.label}</Label>
        )}
        {field.type === 'select' ? (
          <Select value={value} onValueChange={v => updateField(field.name, v)}>
            <SelectTrigger className={`${inputClass} h-10`}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(220,20%,14%)] border-white/10 text-white">
              {field.options?.map(opt => (
                <SelectItem key={opt} value={opt} className="hover:bg-white/10 focus:bg-white/10 focus:text-white">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === 'textarea' ? (
          <Textarea
            id={field.name}
            value={value}
            onChange={e => updateField(field.name, e.target.value)}
            className={`${inputClass} min-h-[80px]`}
          />
        ) : field.type === 'checkbox' ? (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
            <Checkbox
              id={field.name}
              checked={!!value}
              onCheckedChange={c => updateField(field.name, !!c)}
              className="border-white/30 data-[state=checked]:bg-[hsl(var(--accent-green))] data-[state=checked]:border-[hsl(var(--accent-green))]"
            />
            <Label htmlFor={field.name} className="text-sm text-white/80 cursor-pointer">{field.label}</Label>
          </div>
        ) : (
          <Input
            id={field.name}
            type={field.type}
            value={value}
            onChange={e => updateField(field.name, e.target.value)}
            className={inputClass}
          />
        )}
      </div>
    );
  };

  // Pantalla introductoria con el mensaje del entrenador
  if (showIntro && !initialLoading) {
    return (
      <div className="fixed inset-0 bg-[hsl(220,20%,8%)]/95 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--accent-green))]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(var(--accent-green))]/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-2xl bg-[hsl(220,20%,12%)] border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-[hsl(var(--accent-green))]/20 border border-[hsl(var(--accent-green))]/30">
              <ClipboardList className="w-7 h-7 text-[hsl(var(--accent-green))]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Evaluación Inicial Profesional</h2>
              <p className="text-sm text-white/50">Método JAFN</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 space-y-3 text-white/80 leading-relaxed">
            <p>Hola 😊</p>
            <p>Te envío el documento de <strong className="text-white">Evaluación Inicial del Método JAFN</strong>.</p>
            <p>Es el paso previo imprescindible antes de diseñar tu estrategia personalizada. A partir de la información que completes podré analizar tu situación con profundidad y establecer un plan adaptado a tu contexto real.</p>
            <p>Rellénalo con calma. Si hay apartados que no conoces (analíticas, valores concretos, datos técnicos), puedes dejarlos en blanco.</p>
            <p>Cuando lo tengas listo, me lo envías y avanzamos al siguiente paso.</p>
            <p>Cualquier duda mientras lo completas, escríbeme 💪🏻</p>
          </div>

          <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-[hsl(var(--accent-green))]/10 border border-[hsl(var(--accent-green))]/20">
            <Lock className="w-4 h-4 text-[hsl(var(--accent-green))] flex-shrink-0" />
            <p className="text-xs text-white/70">
              Este cuestionario es <strong className="text-white">obligatorio</strong> para continuar. Puedes guardar tu progreso por bloques y completarlo más tarde.
            </p>
          </div>

          <Button
            onClick={() => setShowIntro(false)}
            className="w-full btn-cta h-12 text-base"
          >
            Comenzar evaluación
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-[hsl(220,20%,8%)] flex items-center justify-center z-[100]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[hsl(var(--accent-green))]" />
      </div>
    );
  }

  const progress = ((currentBlock + 1) / EVALUATION_BLOCKS.length) * 100;
  const isLast = currentBlock === EVALUATION_BLOCKS.length - 1;

  return (
    <div className="fixed inset-0 bg-[hsl(220,20%,8%)] flex items-center justify-center z-[100] p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--accent-green))]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(var(--accent-green))]/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl bg-[hsl(220,20%,12%)] border border-white/10 rounded-2xl shadow-2xl relative z-10 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-[hsl(var(--accent-green))]/20 border border-[hsl(var(--accent-green))]/30 flex-shrink-0">
                <ClipboardList className="w-6 h-6 text-[hsl(var(--accent-green))]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-bold text-white truncate">Evaluación Inicial JAFN</h2>
                <p className="text-xs text-white/40">Bloque {currentBlock + 1} de {EVALUATION_BLOCKS.length}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-white/40 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Lock className="w-3 h-3" />
              Obligatorio
            </div>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[hsl(var(--accent-green))] to-[hsl(var(--accent-green-light))] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[hsl(var(--accent-green-light))] mb-1">{block.title}</h3>
            {block.description && <p className="text-sm text-white/50">{block.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {block.fields.map(renderField)}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/10 flex-shrink-0 flex items-center justify-between gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentBlock === 0 || loading}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {!isLast ? (
              <Button onClick={handleSaveAndContinue} disabled={loading} className="btn-cta">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Guardando...' : 'Guardar y continuar'}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => saveBlock(false).then(ok => ok && toast({ title: 'Progreso guardado' }))}
                  disabled={loading}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar progreso
                </Button>
                <Button onClick={handleFinish} disabled={loading} className="btn-cta">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {loading ? 'Finalizando...' : 'Finalizar evaluación'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialEvaluationModal;
