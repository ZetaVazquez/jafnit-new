
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "¿Cómo funciona el plan personalizado?",
      answer: "Creamos un plan único para ti basado en tu cuestionario inicial, objetivos, estilo de vida y preferencias alimentarias. Incluye menús semanales, rutinas de ejercicio y seguimiento personalizado."
    },
    {
      question: "¿Cuánto tiempo tardaré en ver resultados?",
      answer: "Los primeros cambios suelen notarse en 2-3 semanas. Resultados más significativos se ven entre 4-8 semanas, dependiendo de tu situación inicial y adherencia al plan."
    },
    {
      question: "¿Necesito experiencia previa en nutrición o ejercicio?",
      answer: "No es necesario. Nuestros planes están diseñados para todos los niveles, desde principiantes hasta personas con experiencia. Te guiamos paso a paso."
    },
    {
      question: "¿Puedo cambiar de plan en cualquier momento?",
      answer: "Sí, puedes actualizar tu plan según evolucionen tus necesidades y objetivos. Te ayudamos a elegir la mejor opción en cada momento."
    },
    {
      question: "¿Qué incluye el seguimiento personalizado?",
      answer: "Incluye revisiones regulares de tu progreso, ajustes en tu plan según sea necesario, resolución de dudas y motivación continua para mantenerte en el camino correcto."
    },
    {
      question: "¿Los planes se adaptan a restricciones alimentarias?",
      answer: "Absolutamente. Consideramos alergias, intolerancias, preferencias veganas/vegetarianas y cualquier otra restricción alimentaria en tu plan personalizado."
    },
    {
      question: "¿Cómo se realizan las consultas de seguimiento?",
      answer: "Las consultas pueden ser online (videollamada) o presenciales según tu plan. También ofrecemos soporte por mensajería para dudas rápidas entre consultas."
    },
    {
      question: "¿Qué pasa si no estoy satisfecho con los resultados?",
      answer: "Trabajamos contigo para ajustar el plan hasta encontrar lo que mejor funcione. Nuestro objetivo es tu éxito y satisfacción a largo plazo."
    }
  ];

  return (
    <section id="faq" className="py-16 bg-gradient-to-br from-white to-nutrition-green-light/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title text-nutrition-black mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-nutrition-gray max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestros servicios
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-2xl shadow-lg border border-nutrition-green-light overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:bg-nutrition-green-light/10 transition-colors">
                  <span className="font-semibold text-nutrition-black title-playful">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-nutrition-gray leading-relaxed">
                  {faq.answer}
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
