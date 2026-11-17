
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ as FAQType } from '@/types';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQType['category']>('General');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const categories: FAQType['category'][] = ['General', 'Precio', 'Nutricion', 'Entrenamiento'];

  const faqs: FAQType[] = [
    { id: '1', category: 'General', question: '¿Qué es FIT PLATFORM?', answer: 'Es la aplicación que reúne en un solo panel la gestión de un negocio de entrenamiento y nutrición: fichas de clientes, valoración inicial, planes de entrenamiento y de alimentación, seguimiento de hábitos y comunicación con cada persona. No es una plantilla de terceros: son los mismos módulos que un profesional ya usa cada día con sus clientes, ordenados en una única herramienta.' },
    { id: '2', category: 'General', question: '¿Para quién está pensada?', answer: 'Para entrenadores personales, nutricionistas y centros deportivos que trabajan con varias personas a la vez y necesitan que cada una tenga su propio plan. Si hoy repartes PDFs y mensajes sueltos por WhatsApp, la plataforma cubre el recorrido completo: valoración, diseño, entrega y control, sin cambiar tu forma de trabajar.' },
    { id: '3', category: 'General', question: '¿Cómo empiezo a utilizarla?', answer: 'El primer paso es una demostración. En esa sesión se recorren los módulos con datos de ejemplo y se revisa tu caso concreto: cuántos clientes manejas, qué quieres automatizar y qué prefieres seguir decidiendo tú. A partir de ahí se configura el acceso para tu equipo y se cargan tus propios ejercicios, comidas y plantillas.' },
    { id: '4', category: 'General', question: '¿Quién ve los datos de salud de mis clientes?', answer: 'Cada cliente accede a su propio plan y a sus propias medidas, nunca a la información de otros. Los datos de salud, lesiones y valoraciones quedan en la ficha privada que gestiona el profesional responsable del caso. El reparto por permisos está configurado en la base de datos, no depende de que cada usuario sea cuidadoso con lo que comparte.' },
    { id: '5', category: 'Precio', question: '¿Cuánto cuesta la plataforma?', answer: 'No publicamos una tarifa cerrada. El coste se acuerda después de la demostración en función del número de profesionales que la van a usar y del volumen de clientes que gestionas. Así pagas por lo que realmente vas a utilizar y no por un paquete que incluye módulos que no te sirven.' },
    { id: '6', category: 'Precio', question: '¿Qué se tiene en cuenta al calcular el precio?', answer: 'El tamaño del equipo, el número de clientes activos y los módulos que necesites activar: solo entrenamiento, solo nutrición o ambos con seguimiento. También influye si quieres carga inicial de tu propia biblioteca de ejercicios y comidas. Todo eso se concreta en la demostración, con un desglose claro antes de decidir nada.' },
    { id: '7', category: 'Precio', question: '¿Cómo se gestiona el pago?', answer: 'El cobro se realiza con tarjeta a través de una pasarela segura, igual que hoy se hacen las suscripciones en la web. No hace falta instalar nada ni gestionar servidores: la plataforma ya está en marcha y solo hay que dar de alta a tu equipo y a tus clientes.' },
    { id: '8', category: 'Nutricion', question: '¿La plataforma ya trae una biblioteca de comidas?', answer: 'Sí. Incluye una biblioteca de platos con sus calorías, proteínas, hidratos y grasas reales, gramos y medida casera para cada ingrediente. Los valores nutricionales se apoyan en tablas de composición de alimentos, así que no hay que escribir plato por plato desde cero: se selecciona, se ajustan las cantidades y el total del día se calcula solo.' },
    { id: '9', category: 'Nutricion', question: '¿Cubre restricciones y alergias?', answer: 'Están previstas las opciones habituales: sin gluten, sin lactosa, sin frutos secos, vegano, vegetariano, keto y las etiquetas de objetivo como ganancia de masa muscular o pérdida de peso. Al generar un plan se filtran los platos que no encajan con lo que ha indicado esa persona, y las etiquetas se ven tanto en la biblioteca como en la ficha de cada comida.' },
    { id: '10', category: 'Nutricion', question: '¿El plan de comidas lo hace la inteligencia artificial?', answer: 'La IA propone el borrador a partir de la valoración y de los gustos declarados, pero nada llega al cliente sin que el profesional lo revise y lo apruebe. Los menús se generan distintos entre sí y con variedad semanal, y las calorías del plan salen de las comidas y cantidades reales, no de un número fijo asignado por defecto.' },
    { id: '11', category: 'Entrenamiento', question: '¿Qué incluye la biblioteca de ejercicios?', answer: 'Fichas con vídeo o GIF de demostración, miniatura, ejecución detallada y errores comunes, agrupadas por músculo: bíceps, tríceps y antebrazo; cuádriceps, isquiotibiales, gemelos y aductores; glúteo mayor, medio y piriforme, además de cardio con sus métodos de intensidad y modalidades. Puedes cargar tus propios vídeos y reutilizarlos en todas las rutinas.' },
    { id: '12', category: 'Entrenamiento', question: '¿Cómo se construye una rutina?', answer: 'Se parte de la valoración del cliente: objetivo, días disponibles, nivel, material y lesiones. El motor propone una estructura y tú ajustas dificultad, ejercicios y modalidades de cardio antes de aprobarla. Cada ejercicio arrastra su ejecución y sus errores comunes, de modo que el cliente ve la explicación sin que tengas que escribirla en cada plan.' },
    { id: '13', category: 'Entrenamiento', question: '¿Qué ve el cliente y qué veo yo?', answer: 'El cliente entra en su zona, consulta su entrenamiento y su alimentación, descarga el plan en PDF y puede escribirte cuando tiene una duda concreta. Tú conservas el control: apruebas cada plan antes de que se publique, revisas el seguimiento y decides los ajustes. Ninguna rutina generada automáticamente se entrega sin tu visto bueno.' }
  ];

  const filteredFAQs = faqs.filter(faq => faq.category === selectedCategory);

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  return (
    <section id="faq" className="py-14 md:py-20 dark-section relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[hsla(var(--accent-green)/0.05)] blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <ScrollReveal direction="down">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--text-primary))] mb-4">
              Preguntas{' '}
              <em className="heading-accent not-italic font-bold italic">Frecuentes</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg text-[hsl(var(--text-secondary))] max-w-2xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre FIT PLATFORM
            </p>
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Category Buttons */}
          <div className="lg:col-span-3">
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-[hsl(var(--accent-green))] text-white shadow-lg shadow-[hsla(var(--accent-green)/0.3)]'
                      : 'glass-card-light text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsla(0,0%,100%,0.12)]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="lg:col-span-9">
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="glass-card-light overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => toggleQuestion(faq.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-[hsla(0,0%,100%,0.05)] transition-colors duration-200"
                  >
                    <span className="font-semibold text-[hsl(var(--text-primary))] flex-1 pr-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-[hsl(var(--accent-green-light))] flex-shrink-0 transition-transform duration-300 ${openQuestion === faq.id ? 'rotate-180' : ''}`} />
                  </button>
                  {openQuestion === faq.id && (
                    <div className="px-6 pb-5 border-t border-[hsla(0,0%,100%,0.08)]">
                      <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed pt-4">{faq.answer}</p>
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
