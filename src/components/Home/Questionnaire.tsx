
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-nutrition-green">
              Cuestionario Personalizado
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-nutrition-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Pregunta {currentQuestion + 1} de {questions.length}
          </p>
        </CardHeader>

        <CardContent>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6 text-nutrition-black">
              {currentQuestionData.question}
            </h3>

            <div className="space-y-3">
              {currentQuestionData.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQuestionData.id] === option
                      ? 'border-nutrition-green bg-nutrition-green bg-opacity-10 text-nutrition-green'
                      : 'border-gray-200 hover:border-nutrition-green hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Button>

            <Button
              onClick={nextQuestion}
              disabled={!isAnswered}
              className="flex items-center space-x-2 bg-nutrition-green hover:bg-nutrition-green-dark"
            >
              <span>{currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questionnaire;
