
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ClipboardList } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import { useToast } from '@/hooks/use-toast';

interface QuestionnaireProps {
  onComplete: () => void;
  onClose: () => void;
}

interface QuestionnaireQuestion {
  id: string;
  step: string;
  question: string;
  type: 'multiple-choice' | 'text' | 'form';
  options?: string[];
  required: boolean;
  fields?: { name: string; label: string; type: string; required: boolean; options?: string[] }[];
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const { saveQuestionnaireResponse, loading } = useQuestionnaire();
  const { toast } = useToast();

  const questions: QuestionnaireQuestion[] = [
    {
      id: '1',
      step: '🧭 Paso 1: Definimos tu objetivo',
      question: '¿Qué meta te gustaría alcanzar primero?',
      type: 'multiple-choice',
      options: [
        '🔥 Quiero perder grasa y sentirme más ágil.',
        '💪 Quiero ganar músculo y fuerza sin perder mi estilo de vida.',
        '🌱 Quiero llevar un estilo de vida saludable y equilibrado mientras mejoro mi físico.'
      ],
      required: true
    },
    {
      id: '2',
      step: '🧠 Paso 2: ¿Dónde estás hoy?',
      question: '¿Con cuál de estas situaciones te identificas mejor?',
      type: 'multiple-choice',
      options: [
        '🙇‍♂️ He intentado varias veces cambiar, pero siempre vuelvo a lo mismo.',
        '🧩 Tengo buenos hábitos, pero no termino de ver resultados.',
        '🎯 Es la primera vez que quiero hacerlo de forma seria y con ayuda profesional.'
      ],
      required: true
    },
    {
      id: '3',
      step: '⏰ Paso 3: Tu compromiso',
      question: '¿Estás dispuesto/a a invertir tu tiempo y energía en un cambio real?',
      type: 'multiple-choice',
      options: [
        '✅ Sí, estoy listo/a para priorizarme y avanzar de verdad.',
        '🤔 No estoy seguro/a todavía.'
      ],
      required: true
    },
    {
      id: '4',
      step: '📊 Paso 4: ¿Cómo es tu día a día?',
      question: 'Actualmente, tu vida se parece más a…',
      type: 'multiple-choice',
      options: [
        '💼 Trabajo a jornada completa.',
        '🎓 Estudio o estoy opositando.',
        '🔄 Estoy en transición laboral o con tiempo limitado.',
        '🧘‍♀️ Trabajo desde casa con flexibilidad.'
      ],
      required: true
    },
    {
      id: '5',
      step: '💸 Paso 5: Nivel de compromiso',
      question: '¿Estás preparado/a para invertir en ti también económicamente, con un programa personalizado y guiado?',
      type: 'multiple-choice',
      options: [
        '💳 Sí, valoro un acompañamiento profesional y estoy listo/a para dar el paso.',
        '🕒 Aún no estoy en ese momento, pero me interesa saber más.'
      ],
      required: true
    },
    {
      id: '6',
      step: '✍️ Paso 6: Personaliza tu experiencia',
      question: '¿Qué te ha llevado a querer empezar con nosotros y qué te gustaría lograr?',
      type: 'text',
      required: true
    },
    {
      id: '7',
      step: '🗂️ Paso 7: Ficha del Cliente - JAFNFIT',
      question: 'Complete su información personal para crear su perfil personalizado.',
      type: 'form',
      required: true,
      fields: [
        { name: 'full_name', label: 'Nombre completo', type: 'text', required: true },
        { name: 'birth_date', label: 'Fecha de nacimiento', type: 'date', required: true },
        { name: 'age', label: 'Edad', type: 'number', required: true },
        { name: 'gender', label: 'Sexo', type: 'select', required: true, options: ['Masculino', 'Femenino', 'Otro'] },
        { name: 'phone', label: 'Teléfono / WhatsApp', type: 'tel', required: true },
        { name: 'email', label: 'Correo electrónico', type: 'email', required: true },
        { name: 'dni_nie', label: 'DNI/NIE (opcional)', type: 'text', required: false },
        { name: 'address', label: 'Dirección', type: 'text', required: true },
        { name: 'city', label: 'Ciudad', type: 'text', required: true },
        { name: 'start_date', label: 'Fecha de inicio', type: 'date', required: true },
        { name: 'contracted_program', label: 'Programa contratado', type: 'select', required: true, options: ['Básico (75€)', 'Premium (120€)', 'Pro trimestral (300€)'] },
        { name: 'payment_method', label: 'Forma de pago', type: 'select', required: true, options: ['Tarjeta (Stripe)', 'Transferencia', 'Web'] },
        { name: 'next_renewal', label: 'Próxima renovación', type: 'date', required: false },
        { name: 'acquisition_source', label: 'Fuente de captación', type: 'select', required: true, options: ['Instagram', 'Recomendación', 'WhatsApp', 'Página web', 'Otro'] },
        { name: 'main_objective', label: 'Objetivo principal', type: 'select', required: true, options: ['Pérdida de grasa', 'Rendimiento (oposiciones)', 'Ganancia muscular', 'Recomposición corporal'] },
        { name: 'secondary_objectives', label: 'Objetivos secundarios', type: 'textarea', required: false },
        { name: 'personal_motivation', label: 'Motivación / Razón personal', type: 'textarea', required: true },
        { name: 'commitment_time', label: 'Tiempo estimado de compromiso', type: 'text', required: true },
        { name: 'ninety_day_goal', label: 'Objetivo a 90 días', type: 'textarea', required: true },
        { name: 'initial_weight', label: 'Peso (kg)', type: 'number', required: true },
        { name: 'height_cm', label: 'Altura (cm)', type: 'number', required: true },
        { name: 'bmi', label: 'IMC', type: 'number', required: false },
        { name: 'waist_perimeter', label: 'Perímetro cintura (cm)', type: 'number', required: false },
        { name: 'hip_perimeter', label: 'Perímetro cadera (cm)', type: 'number', required: false },
        { name: 'body_fat_percentage', label: 'Grasa corporal estimada (%)', type: 'number', required: false },
        { name: 'resting_heart_rate', label: 'Frecuencia cardíaca en reposo', type: 'number', required: false },
        { name: 'measurements_date', label: 'Fecha de mediciones', type: 'date', required: true },
        { name: 'daily_activity_level', label: 'Nivel de actividad diaria (NEAT)', type: 'select', required: true, options: ['Sedentario', 'Moderado', 'Activo'] },
        { name: 'current_training', label: 'Entrenamiento actual', type: 'textarea', required: false },
        { name: 'physical_limitations', label: 'Limitaciones físicas o lesiones', type: 'textarea', required: false },
        { name: 'training_availability', label: 'Disponibilidad para entrenar', type: 'textarea', required: false },
        { name: 'meals_per_day', label: 'Número de comidas al día', type: 'number', required: false },
        { name: 'current_diet_type', label: 'Tipo de alimentación actual', type: 'textarea', required: false },
        { name: 'food_restrictions', label: 'Alimentos que no consume o restringe', type: 'textarea', required: false },
        { name: 'current_supplements', label: 'Suplementación actual', type: 'textarea', required: false },
        { name: 'intolerances_allergies', label: 'Intolerancias / Alergias', type: 'textarea', required: false },
        { name: 'pathologies', label: 'Patologías', type: 'textarea', required: false },
        { name: 'daily_water_intake', label: 'Hidratación diaria (agua)', type: 'text', required: false },
        { name: 'professional_notes', label: 'Notas adicionales del profesional', type: 'textarea', required: false }
      ]
    }
  ];

  const handleAnswer = (answer: string | Record<string, string>) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }));
  };

  const handleTextAnswer = (text: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: text
    }));
  };

  const handleFormAnswer = (fieldName: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: {
        ...((prev[questions[currentQuestion].id] as Record<string, string>) || {}),
        [fieldName]: value
      }
    }));
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      try {
        const responses = {
          health_goals: answers['1'] || '',
          current_situation: answers['2'] || '',
          commitment_level: answers['3'] || '',
          daily_life: answers['4'] || '',
          investment_readiness: answers['5'] || '',
          personal_motivation: answers['6'] || '',
          contact_info: JSON.stringify(answers['7'] || {})
        };

        await saveQuestionnaireResponse(responses);
        
        toast({
          title: "¡Cuestionario completado!",
          description: "Gracias por completar el cuestionario. Te contactaremos pronto.",
        });

        onComplete();
      } catch (error) {
        console.error('Error saving questionnaire:', error);
        toast({
          title: "Error",
          description: "Hubo un problema al guardar tus respuestas. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const isAnswered = () => {
    const answer = answers[currentQuestionData.id];
    if (currentQuestionData.type === 'form') {
      const formData = answer as Record<string, string> || {};
      const requiredFields = currentQuestionData.fields?.filter(field => field.required) || [];
      return requiredFields.every(field => formData[field.name]?.trim());
    }
    if (currentQuestionData.type === 'text') {
      return answer && (answer as string).trim().length > 0;
    }
    return !!answer;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;

  // Shared dark input classes
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-[hsl(var(--accent-green))]/50 focus:border-[hsl(var(--accent-green))]/50 outline-none";
  const labelClass = "text-sm font-medium text-white/60";

  const renderFormField = (field: { name: string; label: string; type: string; required: boolean; options?: string[] }, formData: Record<string, string>) => {
    const isWide = ['address', 'secondary_objectives', 'personal_motivation', 'ninety_day_goal'].includes(field.name) || field.type === 'textarea';

    return (
      <div key={field.name} className={`space-y-2 ${isWide ? 'md:col-span-2' : ''}`}>
        <Label htmlFor={field.name} className={labelClass}>
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        {field.type === 'select' ? (
          <Select value={formData[field.name] || ''} onValueChange={(value) => handleFormAnswer(field.name, value)}>
            <SelectTrigger className={`${inputClass} h-10`}>
              <SelectValue placeholder={`Selecciona ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(220,20%,14%)] border-white/10 text-white">
              {field.options?.map((option, i) => (
                <SelectItem key={i} value={option} className="hover:bg-white/10 focus:bg-white/10 focus:text-white">{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === 'textarea' ? (
          <Textarea
            id={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleFormAnswer(field.name, e.target.value)}
            placeholder={`Describe tu ${field.label.toLowerCase()}`}
            className={`${inputClass} min-h-[80px]`}
            rows={3}
          />
        ) : (
          <Input
            id={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleFormAnswer(field.name, e.target.value)}
            placeholder={`Ingresa tu ${field.label.toLowerCase()}`}
            className={inputClass}
            required={field.required}
          />
        )}
      </div>
    );
  };

  const renderQuestionContent = () => {
    if (currentQuestionData.type === 'multiple-choice') {
      return (
        <div className="space-y-3">
          <p className="text-sm text-white/40 mb-4">🔻 Selecciona una opción:</p>
          {currentQuestionData.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`w-full p-4 text-left rounded-xl border transition-all duration-300 font-medium ${
                answers[currentQuestionData.id] === option
                  ? 'border-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green))]/15 text-white shadow-lg shadow-[hsl(var(--accent-green))]/10 scale-[1.02]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-4 flex-shrink-0 ${
                  answers[currentQuestionData.id] === option
                    ? 'bg-[hsl(var(--accent-green))] border-[hsl(var(--accent-green))]'
                    : 'border-white/30'
                }`}></div>
                <span className="text-sm">{option}</span>
              </div>
            </button>
          ))}
        </div>
      );
    }

    if (currentQuestionData.type === 'text') {
      return (
        <div className="space-y-3">
          <p className="text-sm text-white/40 mb-3">✏️ Campo de texto libre para responder (máx. 500 caracteres).</p>
          <Textarea
            placeholder="Escribe tu respuesta aquí..."
            value={(answers[currentQuestionData.id] as string) || ''}
            onChange={(e) => handleTextAnswer(e.target.value)}
            maxLength={500}
            className={`${inputClass} min-h-[120px] resize-none`}
          />
          <p className="text-xs text-white/30 text-right">
            {((answers[currentQuestionData.id] as string) || '').length}/500 caracteres
          </p>
        </div>
      );
    }

    if (currentQuestionData.type === 'form') {
      const formData = (answers[currentQuestionData.id] as Record<string, string>) || {};
      const fields = currentQuestionData.fields || [];
      
      const sections = [
        { title: '📅 Datos Generales', fields: fields.slice(0, 14) },
        { title: '🧠 Objetivos y Motivación', fields: fields.slice(14, 19) },
        { title: '📏 Datos Físicos', fields: fields.slice(19, 27) },
        { title: '🏋️‍♀️ Información de Actividad', fields: fields.slice(27, 31) },
        { title: '🍽️ Hábitos Alimentarios', fields: fields.slice(31, 38) },
        { title: '💬 Notas Adicionales', fields: fields.slice(38) },
      ];

      return (
        <div className="space-y-8 max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <p className="text-sm text-white/40 mb-2">📍 Complete todos los campos requeridos:</p>
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-base font-semibold text-[hsl(var(--accent-green-light))] mb-4 pb-2 border-b border-white/10">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => renderFormField(field, formData))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-[hsl(220,20%,8%)] flex items-center justify-center z-50 p-4 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--accent-green))]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(var(--accent-green))]/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl bg-[hsl(220,20%,12%)] border border-white/10 rounded-2xl shadow-2xl relative z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[hsl(var(--accent-green))]/20 border border-[hsl(var(--accent-green))]/30">
                <ClipboardList className="w-6 h-6 text-[hsl(var(--accent-green))]" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Cuestionario Personalizado
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[hsl(var(--accent-green))] to-[hsl(var(--accent-green-light))] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-white/40 mt-2">
            Pregunta {currentQuestion + 1} de {questions.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[hsl(var(--accent-green-light))] mb-1">
              {currentQuestionData.step}
            </h3>
            <h4 className="text-xl font-bold text-white leading-tight">
              {currentQuestionData.question}
            </h4>
          </div>

          {renderQuestionContent()}

          {/* Final message */}
          {isLastQuestion && isAnswered() && (
            <div className="mt-8 p-6 rounded-2xl bg-[hsl(var(--accent-green))]/10 border border-[hsl(var(--accent-green))]/20">
              <div className="text-center">
                <div className="w-14 h-14 bg-[hsl(var(--accent-green))]/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-[hsl(var(--accent-green))]/30">
                  <span className="text-2xl">🎉</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  ¡Ya casi estamos!
                </h4>
                <p className="text-white/60">
                  Ahora solo hace falta que seas parte de nuestra familia para poder tomar el cambio que tanto necesitas.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 pt-4 border-t border-white/10 flex justify-between flex-shrink-0">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium border-white/20 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </Button>

          <Button
            onClick={nextQuestion}
            disabled={!isAnswered() || loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green-dark))] text-black disabled:opacity-30"
          >
            <span>{loading ? 'Guardando...' : (isLastQuestion ? 'Finalizar' : 'Siguiente')}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
