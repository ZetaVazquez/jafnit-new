
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ as FAQType } from '@/types';

const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQType['category']>('General');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const categories: FAQType['category'][] = ['General', 'Precio', 'Nutricion', 'Entrenamiento'];

  const faqs: FAQType[] = [
    // General
    {
      id: '1',
      category: 'General',
      question: '¿Cuál es tu experiencia profesional?',
      answer: 'Tengo más de 10 años de experiencia en nutrición y entrenamiento personal, con certificaciones internacionales y más de 500 clientes transformados.'
    },
    {
      id: '2',
      category: 'General',
      question: '¿Trabajas online o presencial?',
      answer: 'Ofrezco ambas modalidades. Sesiones presenciales en mi centro y seguimiento online personalizado para mayor flexibilidad.'
    },
    {
      id: '3',
      category: 'General',
      question: '¿Cuánto tiempo toma ver resultados?',
      answer: 'Los primeros cambios se notan en 2-3 semanas. Resultados significativos en 2-3 meses con el plan adecuado y constancia.'
    },
    // Precio
    {
      id: '4',
      category: 'Precio',
      question: '¿Cuáles son las formas de pago?',
      answer: 'Aceptamos transferencia bancaria, tarjeta de crédito/débito y pagos fraccionados según el plan elegido.'
    },
    {
      id: '5',
      category: 'Precio',
      question: '¿Hay descuentos por pagos anuales?',
      answer: 'Sí, el plan anual incluye un descuento del 15% y beneficios adicionales exclusivos.'
    },
    {
      id: '6',
      category: 'Precio',
      question: '¿Qué incluye cada plan?',
      answer: 'Cada plan incluye evaluación inicial, plan personalizado, seguimiento y ajustes. Los planes superiores incluyen más sesiones y beneficios.'
    },
    // Nutrición
    {
      id: '7',
      category: 'Nutricion',
      question: '¿Crean dietas para vegetarianos/veganos?',
      answer: 'Absolutamente. Adapto todos los planes a preferencias alimentarias, alergias, intolerancias y objetivos específicos.'
    },
    {
      id: '8',
      category: 'Nutricion',
      question: '¿Con qué frecuencia se actualiza el plan?',
      answer: 'Los planes se revisan y ajustan cada 2-4 semanas según tu progreso y feedback para optimizar resultados.'
    },
    {
      id: '9',
      category: 'Nutricion',
      question: '¿Incluye suplementación?',
      answer: 'Sí, evaluamos si necesitas suplementos y te recomiendo solo los necesarios para tus objetivos específicos.'
    },
    // Entrenamiento
    {
      id: '10',
      category: 'Entrenamiento',
      question: '¿Las rutinas son para principiantes?',
      answer: 'Diseño rutinas para todos los niveles, desde principiantes hasta atletas avanzados, adaptadas a tu condición física actual.'
    },
    {
      id: '11',
      category: 'Entrenamiento',
      question: '¿Necesito gimnasio para entrenar?',
      answer: 'No necesariamente. Puedo crear rutinas para casa, parque o gimnasio según tus preferencias y disponibilidad de equipos.'
    },
    {
      id: '12',
      category: 'Entrenamiento',
      question: '¿Incluye entrenamiento personal?',
      answer: 'Los planes superiores incluyen sesiones de entrenamiento personal presencial para técnica correcta y motivación extra.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => faq.category === selectedCategory);

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  return (
    <section id="faq" className="py-32 relative overflow-hidden">
      {/* Formas geométricas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos grandes */}
        <div className="geometric-shape circle-shape w-32 h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        {/* Círculos medianos */}
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 left-1/6 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-14 h-14 bottom-1/2 left-3/4 animate-float"></div>
        
        {/* Triángulos */}
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Buttons */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-nutrition-green text-white'
                      : 'bg-white/80 backdrop-blur-sm text-nutrition-black hover:bg-nutrition-green hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-nutrition-green-light">
                  <button
                    onClick={() => toggleQuestion(faq.id)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-nutrition-black title-playful">{faq.question}</span>
                    {openQuestion === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-nutrition-green" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-nutrition-green" />
                    )}
                  </button>
                  {openQuestion === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
