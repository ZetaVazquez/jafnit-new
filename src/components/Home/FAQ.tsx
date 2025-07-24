import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ as FAQType } from '@/types';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQType['category']>('General');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const categories: FAQType['category'][] = ['General', 'Precio', 'Nutricion', 'Entrenamiento'];

  const faqs: FAQType[] = [
    // General
    {
      id: '1',
      category: 'General',
      question: '¿Cuál es tu experiencia profesional y metodología?',
      answer: 'Mi enfoque se basa en años de experiencia personal y profesional en transformación corporal. He desarrollado un método integral que combina nutrición personalizada, entrenamiento adaptado y seguimiento constante. Mi propia experiencia perdiendo 30 kilos me permite entender exactamente lo que vives y necesitas. Trabajo con un sistema probado que se adapta a tu vida real, no a la perfecta que no tienes. Cada plan es único porque cada persona es única, y eso marca la diferencia entre el éxito y otro intento fallido.'
    },
    {
      id: '2',
      category: 'General',
      question: '¿Cómo funciona el seguimiento y la comunicación?',
      answer: 'El seguimiento es la clave del éxito. Mantenemos comunicación constante a través de WhatsApp para resolver dudas, hacer ajustes y mantenerte motivado. Realizamos revisiones regulares cada 2-4 semanas donde analizamos tu progreso, medidas, fotos, sensaciones y ajustamos el plan según tus resultados. No es solo enviar un plan y esperar: es un acompañamiento real donde siempre hay soluciones cuando algo no funciona. Tu éxito depende de que te sientas apoyado en cada momento del proceso.'
    },
    {
      id: '3',
      category: 'General',
      question: '¿Cuánto tiempo toma ver resultados reales?',
      answer: 'Los primeros cambios los notas en 2-3 semanas: más energía, mejor digestión, ropa que empieza a quedar diferente. Resultados visibles y medibles aparecen entre 4-8 semanas con constancia. Pero esto no es una carrera de velocidad: construimos hábitos que duran para siempre. Mi objetivo no es que bajes peso rápido y lo recuperes, sino que aprendas a mantenerte en forma de por vida. Los mejores resultados llegan entre los 3-6 meses, cuando ya has integrado todo en tu rutina y ves el cambio real y sostenible.'
    },
    // Precio
    {
      id: '4',
      category: 'Precio',
      question: '¿Qué incluye cada plan y cuáles son las diferencias?',
      answer: 'Plan Básico (€75): Ideal para principiantes. Incluye plan nutricional personalizado, guías básicas de hábitos, 1 revisión por mensaje y guía de compras. Perfecto si quieres empezar con orden pero de forma independiente. Plan Premium (€120/mes): Para quienes buscan resultados serios. Incluye nutrición + entrenamiento personalizado, seguimiento mensual, herramientas estructuradas y soporte básico. Plan PRO (€300/mes, mínimo 6 meses): Para transformación completa. Incluye todo lo anterior + seguimiento quincenal, análisis mensual detallado, soporte directo por WhatsApp, comunidad privada y acompañamiento total. Cada plan se adapta a tu nivel de compromiso y objetivos.'
    },
    {
      id: '5',
      category: 'Precio',
      question: '¿Qué formas de pago aceptas y hay descuentos?',
      answer: 'Acepto transferencia bancaria, tarjeta de crédito/débito y Bizum para mayor comodidad. El Plan Básico es pago único de €75. Los planes Premium y PRO son mensuales pero ofrezco descuentos por pagos trimestrales y semestrales. El Plan PRO requiere mínimo 6 meses porque las transformaciones reales necesitan tiempo y constancia. No hago ofertas flash ni descuentos engañosos: el precio refleja el valor real del servicio personalizado que recibes. La inversión en tu salud y bienestar no tiene precio.'
    },
    {
      id: '6',
      category: 'Precio',
      question: '¿Vale la pena la inversión comparado con otros servicios?',
      answer: 'Comparado con gimnasios, nutricionistas por separado y planes genéricos de internet, mis servicios ofrecen un valor integral incomparable. No pagas solo por un plan: pagas por mi experiencia, mi tiempo personal, seguimiento individualizado y soporte constante. Es la diferencia entre comprar un plan genérico que no funciona vs. tener un profesional comprometido con tu éxito. Mis clientes ahorran tiempo, dinero y frustraciones porque desde el día 1 hacen las cosas bien. Una inversión que se recupera en salud, confianza y resultados duraderos.'
    },
    // Nutrición
    {
      id: '7',
      category: 'Nutricion',
      question: '¿Adaptas los planes a restricciones alimentarias y preferencias?',
      answer: 'Absolutamente. Trabajo con vegetarianos, veganos, celíacos, personas con intolerancias a la lactosa, alergias alimentarias y cualquier restricción médica. También adapto según gustos personales, horarios laborales, presupuesto y estilo de vida. Mi filosofía es que si no te gusta lo que comes, no lo vas a mantener. Por eso diseño menús realistas, variados y que realmente disfrutes. Incluyo opciones múltiples para cada comida, recetas fáciles y alternativas para cualquier situación. Tu plan debe adaptarse a ti, no tú al plan.'
    },
    {
      id: '8',
      category: 'Nutricion',
      question: '¿Cómo manejas las revisiones y ajustes del plan nutricional?',
      answer: 'Las revisiones son esenciales para el éxito. Cada 2-4 semanas evaluamos tu progreso completo: peso, medidas, fotos, energía, digestión, adherencia y satisfacción con las comidas. Ajusto cantidades, cambio alimentos que no te gustan, modifico horarios si es necesario y añado nuevas opciones para evitar el aburrimiento. Si algo no funciona, siempre hay una alternativa. El plan evoluciona contigo y tus circunstancias. No es rígido: es dinámico y se adapta para que siempre tengas éxito y disfrutes del proceso.'
    },
    {
      id: '9',
      category: 'Nutricion',
      question: '¿Incluyes suplementación y cómo la recomiendas?',
      answer: 'Solo recomiendo suplementos cuando son realmente necesarios, no para vender. Evalúo tu alimentación, objetivos, estilo de vida y posibles deficiencias para determinar si necesitas algo específico. Puedo recomendar proteína en polvo si no alcanzas tus requerimientos, vitamina D si tienes deficiencia, omega-3 si no comes pescado, etc. Siempre priorizo obtener nutrientes de alimentos reales. Si recomiendo algo, te explico exactamente por qué, para qué sirve y cómo tomarlo. Transparencia total, sin conflictos de interés.'
    },
    // Entrenamiento
    {
      id: '10',
      category: 'Entrenamiento',
      question: '¿Cómo adaptas las rutinas según el nivel de cada persona?',
      answer: 'Cada rutina se diseña específicamente para tu nivel actual, no para el que deberías tener. Si eres principiante, empezamos desde cero con ejercicios básicos, explicaciones detalladas y progresión gradual. Si tienes experiencia, optimizamos tu entrenamiento para mejores resultados. Considero tu tiempo disponible, lesiones previas, preferencias y objetivos específicos. Incluyo videos explicativos, alternativas para cada ejercicio y progresiones para que siempre avances. El entrenamiento debe ser retador pero realista, efectivo pero sostenible.'
    },
    {
      id: '11',
      category: 'Entrenamiento',
      question: '¿Puedo entrenar en casa o necesito gimnasio obligatoriamente?',
      answer: 'Diseño rutinas tanto para casa como para gimnasio según tus preferencias y posibilidades. Para casa uso peso corporal, bandas elásticas, mancuernas básicas y creatividad para maximizar resultados con equipamiento mínimo. Para gimnasio aprovechamos todas las máquinas y pesos libres disponibles. Lo importante no es dónde entrenas, sino que lo hagas con constancia y técnica correcta. Te enseño a adaptar ejercicios a cualquier situación: viajes, falta de tiempo, espacios reducidos. Siempre hay una manera de entrenar eficazmente.'
    },
    {
      id: '12',
      category: 'Entrenamiento',
      question: '¿Qué pasa si tengo lesiones o limitaciones físicas?',
      answer: 'Trabajo con todo tipo de limitaciones y lesiones previas. Adapto completamente las rutinas para que entrenes de forma segura y efectiva. Si tienes problemas de espalda, rodillas, hombros o cualquier otra limitación, diseño ejercicios alternativos que trabajen los mismos músculos sin agravar tu condición. Siempre recomiendo consultar con tu médico o fisioterapeuta antes de empezar, y mantengo comunicación constante para ajustar según cómo te sientes. Tu seguridad es prioridad: prefiero que entrenes menos pero sin riesgo a que te lesiones por hacer algo inadecuado.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => faq.category === selectedCategory);

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  return (
    <section id="faq" className="py-16 bg-white relative overflow-hidden">
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
          <ScrollReveal direction="down">
            <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
              Preguntas Frecuentes
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
            </p>
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Buttons */}
          <ScrollReveal direction="left" delay={400}>
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
          </ScrollReveal>

          {/* FAQ Items */}
          <ScrollReveal direction="right" delay={600}>
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
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
