
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { QuestionnaireQuestion } from '@/types';

interface QuestionnaireProps {
  onComplete: () => void;
  onClose: () => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions: QuestionnaireQuestion[] = [
    {
      id: '1',
      question: '¿Cuál es tu objetivo principal?',
      type: 'multiple-choice',
      options: ['Perder peso', 'Ganar masa muscular', 'Mantener peso actual', 'Mejorar rendimiento deportivo'],
      required: true
    },
    {
      id: '2',
      question: '¿Cuántos días a la semana puedes entrenar?',
      type: 'multiple-choice',
      options: ['1-2 días', '3-4 días', '5-6 días', 'Todos los días'],
      required: true
    },
    {
      id: '3',
      question: '¿Tienes alguna restricción alimentaria?',
      type: 'multiple-choice',
      options: ['Ninguna', 'Vegetariano', 'Vegano', 'Intolerancia a la lactosa', 'Celiaco', 'Otras'],
      required: true
    },
    {
      id: '4',
      question: '¿Cuál es tu nivel de experiencia en el gimnasio?',
      type: 'multiple-choice',
      options: ['Principiante', 'Intermedio', 'Avanzado', 'Nunca he ido al gimnasio'],
      required: true
    },
    {
      id: '5',
      question: '¿Cuánto tiempo puedes dedicar por sesión de entrenamiento?',
      type: 'multiple-choice',
      options: ['30 minutos', '45 minutos', '60 minutos', '90 minutos o más'],
      required: true
    }
  ];

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const isAnswered = answers[currentQuestionData.id];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-nutrition-green-lighter to-white flex items-center justify-center z-50 p-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-nutrition-green-light rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-24 h-24 bg-nutrition-accent rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-nutrition-green-emerald rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-nutrition-green-sage rounded-full opacity-20 animate-bounce"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2">
          <Sparkles className="w-8 h-8 text-nutrition-accent opacity-30 animate-pulse" />
        </div>
        <div className="absolute bottom-40 right-1/4">
          <Zap className="w-6 h-6 text-nutrition-green-emerald opacity-40 animate-bounce" />
        </div>
      </div>

      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border border-nutrition-green-light shadow-2xl relative z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald bg-clip-text text-transparent font-sans">
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
            <h3 className="text-2xl font-bold mb-8 text-nutrition-black font-sans leading-tight">
              {currentQuestionData.question}
            </h3>

            <div className="space-y-4">
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

            {/* Mensaje especial en la última pregunta */}
            {isLastQuestion && isAnswered && (
              <div className="mt-10 p-8 bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light rounded-2xl border-l-4 border-nutrition-green-emerald shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-nutrition-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-nutrition-green-forest mb-3 font-sans">
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
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </Button>

            <Button
              onClick={nextQuestion}
              disabled={!isAnswered}
              className="flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questionnaire;
