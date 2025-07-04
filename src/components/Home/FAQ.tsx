import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: '¿Cómo funciona el proceso de personalización?',
      answer: 'Comenzamos con un cuestionario detallado sobre tu estilo de vida, objetivos, preferencias alimentarias y limitaciones. Luego diseñamos un plan completamente personalizado que se adapta a tus necesidades específicas y lo ajustamos según tu progreso.'
    },
    {
      question: '¿Qué incluye el seguimiento personalizado?',
      answer: 'El seguimiento incluye revisiones regulares de tu progreso, ajustes en tu plan nutricional y de ejercicios, resolución de dudas, motivación constante y modificaciones según tus resultados y cambios en tu rutina.'
    },
    {
      question: '¿Puedo seguir el plan si tengo restricciones alimentarias?',
      answer: 'Absolutamente. Nuestros planes se adaptan a cualquier restricción alimentaria: vegetariano, vegano, sin gluten, intolerancias, alergias, etc. Diseñamos tu plan considerando todas tus necesidades específicas.'
    },
    {
      question: '¿Cuánto tiempo necesito para ver resultados?',
      answer: 'Los primeros cambios suelen notarse en 2-3 semanas, pero los resultados significativos aparecen entre 4-8 semanas. Recuerda que buscamos cambios duraderos, no soluciones rápidas que no se mantienen en el tiempo.'
    },
    {
      question: '¿Qué pasa si no puedo seguir el plan al 100%?',
      answer: 'Entendemos que la vida real presenta desafíos. Por eso nuestros planes son flexibles y adaptables. Si no puedes seguir algo, lo ajustamos. El objetivo es crear hábitos sostenibles, no perfección.'
    },
    {
      question: '¿Incluye recetas y listas de compra?',
      answer: 'Sí, cada plan incluye recetas detalladas, listas de compra organizadas y sugerencias de meal prep para hacer tu vida más fácil. Todo está diseñado para ser práctico y fácil de seguir.'
    },
    {
      question: '¿Puedo cambiar de plan durante el proceso?',
      answer: 'Por supuesto. Puedes cambiar de plan en cualquier momento según evolucionen tus necesidades, objetivos o circunstancias. Queremos que tengas siempre el nivel de apoyo que necesitas.'
    },
    {
      question: '¿Hay garantía de resultados?',
      answer: 'Si sigues el plan y mantienes comunicación regular con nosotros, garantizamos que verás resultados. Si no estás satisfecho en los primeros 30 días, te devolvemos tu dinero.'
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-20 dynamic-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos grandes */}
        <div className="geometric-shape circle-shape w-32 h-32 top-10 right-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 left-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 left-1/3 animate-bounce-gentle"></div>
        
        {/* Círculos medianos */}
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 right-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 right-1/6 animate-bounce-gentle"></div>
        
        {/* Triángulos */}
        <div className="geometric-shape triangle-shape triangle-up top-40 right-1/2 transform translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 left-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 right-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 left-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 left-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestros servicios y metodología
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-nutrition-black pr-4">
                      {faq.question}
                    </h3>
                    {openItems.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-nutrition-green flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-nutrition-green flex-shrink-0" />
                    )}
                  </button>
                  
                  {openItems.includes(index) && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
