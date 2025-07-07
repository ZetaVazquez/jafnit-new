import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: '¿Cómo funcionan los planes personalizados?',
      answer: 'Cada plan se diseña específicamente para ti después de completar un cuestionario detallado sobre tus objetivos, preferencias alimentarias, disponibilidad para entrenar y historial de salud. No hay dos planes iguales.'
    },
    {
      question: '¿Puedo hacer el entrenamiento en casa?',
      answer: 'Por supuesto. Diseño rutinas adaptadas a tu espacio y equipamiento disponible. Ya sea en casa, en el parque o en el gimnasio, tendrás un plan que funcione para tu situación.'
    },
    {
      question: '¿Qué pasa si no me gustan ciertos alimentos?',
      answer: 'El plan nutricional se adapta completamente a tus gustos y preferencias. Durante el cuestionario inicial especificas qué alimentos no te gustan, alergias o intolerancias, y el plan se diseña sin incluirlos.'
    },
    {
      question: '¿Cuánto tiempo necesito para ver resultados?',
      answer: 'Los primeros cambios suelen notarse en 2-3 semanas (más energía, mejor digestión). Los cambios físicos visibles aparecen entre 4-8 semanas, dependiendo de tu punto de partida y constancia.'
    },
    {
      question: '¿Incluye seguimiento y soporte?',
      answer: 'Sí, todos los planes incluyen seguimiento regular. Dependiendo del plan elegido, puede ser semanal o mensual, con ajustes en tiempo real según tu progreso y necesidades.'
    },
    {
      question: '¿Puedo cambiar de plan más adelante?',
      answer: 'Absolutamente. Conforme evoluciones y cambien tus objetivos, podemos ajustar o cambiar tu plan. La flexibilidad es clave para el éxito a largo plazo.'
    },
    {
      question: '¿Qué diferencia hay con las dietas tradicionales?',
      answer: 'Las dietas tradicionales son temporales y restrictivas. Mi enfoque se basa en educación nutricional y cambios de hábitos sostenibles que puedas mantener de por vida, sin efecto rebote.'
    },
    {
      question: '¿Necesito comprar suplementos especiales?',
      answer: 'No es obligatorio. Primero optimizamos tu alimentación natural. Solo recomiendo suplementos específicos cuando hay carencias identificadas o objetivos muy concretos, y siempre opcionales.'
    }
  ];

  return (
    <section id="faq" className="py-20 dynamic-background relative overflow-hidden">
      {/* Formas geométricas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos grandes */}
        <div className="geometric-shape circle-shape w-32 h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        {/* Círculos medianos */}
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 left-1/6 animate-bounce-gentle"></div>
        
        {/* Triángulos */}
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 right-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Resuelve todas tus dudas antes de comenzar tu transformación
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-2xl border border-nutrition-green-light shadow-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  <span className="font-bold text-nutrition-black title-playful">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
