
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  fields?: { name: string; label: string; type: string; required: boolean }[];
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
      step: '📇 Paso 7: Tus datos para poder ayudarte mejor',
      question: 'Déjame tus datos de contacto para enviarte una propuesta personalizada.',
      type: 'form',
      required: true,
      fields: [
        { name: 'name', label: 'Nombre y apellidos', type: 'text', required: true },
        { name: 'email', label: 'Correo electrónico', type: 'email', required: true },
        { name: 'phone', label: 'Teléfono', type: 'tel', required: true },
        { name: 'country', label: 'País de residencia', type: 'text', required: true },
        { name: 'instagram', label: 'Tu cuenta de Instagram (opcional pero recomendado)', type: 'text', required: false }
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
      // Guardar respuestas y completar cuestionario
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

  const renderQuestionContent = () => {
    if (currentQuestionData.type === 'multiple-choice') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-6">🔻 Selecciona una opción:</p>
          {currentQuestionData.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-300 font-medium ${
                answers[currentQuestionData.id] === option
                  ? 'border-nutrition-green-emerald bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light text-nutrition-green-forest shadow-lg scale-105'
                  : 'border-gray-200 hover:border-nutrition-green-emerald hover:bg-nutrition-green-lighter hover:bg-opacity-50 hover:scale-102 hover:shadow-md'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-4 ${
                  answers[currentQuestionData.id] === option
                    ? 'bg-nutrition-green border-nutrition-green'
                    : 'border-gray-300'
                }`}></div>
                {option}
              </div>
            </button>
          ))}
        </div>
      );
    }

    if (currentQuestionData.type === 'text') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">✏️ Campo de texto libre para responder (máx. 500 caracteres).</p>
          <Textarea
            placeholder="Escribe tu respuesta aquí..."
            value={(answers[currentQuestionData.id] as string) || ''}
            onChange={(e) => handleTextAnswer(e.target.value)}
            maxLength={500}
            className="min-h-[120px] resize-none bg-nutrition-green-lighter border-nutrition-green-light focus:border-nutrition-green focus:ring-nutrition-green"
          />
          <p className="text-xs text-gray-500 text-right">
            {((answers[currentQuestionData.id] as string) || '').length}/500 caracteres
          </p>
        </div>
      );
    }

    if (currentQuestionData.type === 'form') {
      const formData = (answers[currentQuestionData.id] as Record<string, string>) || {};
      return (
        <div className="space-y-6">
          <p className="text-sm text-gray-600 mb-6">📍 Campos:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestionData.fields?.map((field, index) => (
              <div key={index} className={`space-y-2 ${field.name === 'instagram' ? 'md:col-span-2' : ''}`}>
                <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFormAnswer(field.name, e.target.value)}
                  placeholder={`Ingresa tu ${field.label.toLowerCase()}`}
                  className="w-full bg-nutrition-green-lighter border-nutrition-green-light focus:border-nutrition-green focus:ring-nutrition-green"
                  required={field.required}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 dynamic-background flex items-center justify-center z-50 p-4 overflow-hidden">
      {/* Decorative background elements con más círculos y triángulos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="geometric-shape circle-shape w-32 h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
      </div>

      <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm border border-nutrition-green-light shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald bg-clip-text text-transparent title-main">
              Cuestionario Personalizado
            </CardTitle>
            <Button variant="ghost" onClick={onClose} className="hover:bg-nutrition-green-lighter rounded-full">
              ✕
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mt-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3 font-medium">
            Pregunta {currentQuestion + 1} de {questions.length}
          </p>
        </CardHeader>

        <CardContent>
          <div className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-nutrition-green-emerald mb-2 title-playful">
                {currentQuestionData.step}
              </h3>
              <h4 className="text-xl font-bold mb-6 text-nutrition-black title-playful leading-tight">
                {currentQuestionData.question}
              </h4>
            </div>

            {renderQuestionContent()}

            {/* Mensaje especial en la última pregunta */}
            {isLastQuestion && isAnswered() && (
              <div className="mt-10 p-8 bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light rounded-2xl border-l-4 border-nutrition-green-emerald shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-nutrition-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <h4 className="text-2xl font-bold text-nutrition-green-forest mb-3 title-playful">
                    ¡Ya casi estamos!
                  </h4>
                  <p className="text-lg text-nutrition-green-dark font-medium">
                    Ahora solo hace falta que seas parte de nuestra familia para poder tomar el cambio que tanto necesitas.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black border-none"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </Button>

            <Button
              onClick={nextQuestion}
              disabled={!isAnswered() || loading}
              className="flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Guardando...' : (currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente')}</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questionnaire;
