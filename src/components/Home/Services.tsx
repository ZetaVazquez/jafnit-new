
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Dumbbell, Users, Calendar, MessageCircle, BarChart3 } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Apple,
      title: 'Planes Nutricionales Personalizados',
      description: 'Diseñamos planes de alimentación adaptados a tus objetivos, preferencias y estilo de vida.',
      features: ['Análisis nutricional completo', 'Menús semanales', 'Lista de compras', 'Recetas saludables']
    },
    {
      icon: Dumbbell,
      title: 'Entrenamiento Personalizado',
      description: 'Rutinas de ejercicio complementarias a tu plan nutricional para maximizar resultados.',
      features: ['Rutinas adaptadas', 'Videos explicativos', 'Progress tracking', 'Ajustes semanales']
    },
    {
      icon: Users,
      title: 'Seguimiento Individualizado',
      description: 'Acompañamiento personalizado con revisiones regulares y ajustes según tu progreso.',
      features: ['Consultas regulares', 'Análisis de progreso', 'Ajustes del plan', 'Soporte continuo']
    },
    {
      icon: Calendar,
      title: 'Planificación de Comidas',
      description: 'Organización completa de tus comidas con horarios y preparación anticipada.',
      features: ['Calendario de comidas', 'Meal prep', 'Horarios optimizados', 'Preparación por lotes']
    },
    {
      icon: MessageCircle,
      title: 'Soporte 24/7',
      description: 'Comunicación directa con tu nutricionista para resolver dudas y mantenerte motivado.',
      features: ['Chat directo', 'Respuesta rápida', 'Motivación constante', 'Resolución de dudas']
    },
    {
      icon: BarChart3,
      title: 'Análisis de Progreso',
      description: 'Seguimiento detallado de tu evolución con métricas y gráficos personalizados.',
      features: ['Métricas corporales', 'Gráficos de progreso', 'Reportes mensuales', 'Análisis de tendencias']
    }
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos un enfoque integral para tu bienestar, combinando nutrición, ejercicio y seguimiento personalizado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="h-full bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-4 border-nutrition-green shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald text-white rounded-full mb-4 mx-auto">
                  <service.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl text-nutrition-black title-playful">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-nutrition-gray mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-nutrition-gray">
                      <div className="w-2 h-2 bg-nutrition-green rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-white/90 backdrop-blur-sm p-8 rounded-2xl text-center shadow-lg border border-nutrition-green-light">
          <h3 className="text-2xl font-bold text-nutrition-green-dark mb-4 title-playful">
            ¿Necesitas algo más específico?
          </h3>
          <p className="text-nutrition-gray mb-6 max-w-2xl mx-auto">
            Ofrecemos consultas personalizadas para necesidades específicas como nutrición deportiva, 
            trastornos alimentarios, alergias e intolerancias, y mucho más.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-white/90 text-nutrition-green px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              Nutrición Deportiva
            </span>
            <span className="bg-white/90 text-nutrition-green px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              Pérdida de Peso
            </span>
            <span className="bg-white/90 text-nutrition-green px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              Ganancia Muscular
            </span>
            <span className="bg-white/90 text-nutrition-green px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              Alergias e Intolerancias
            </span>
          </div>
        </div>

        {/* Communication Section */}
        <div className="mt-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-nutrition-green-light overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-bold text-nutrition-green-dark mb-6 title-playful">
                💬 EL DIÁLOGO CONSTANTE ES FUNDAMENTAL PARA ALCANZAR TUS METAS Y ENTENDER TUS REQUERIMIENTOS
              </h3>
              <div className="space-y-4 text-nutrition-green-dark">
                <p className="text-lg leading-relaxed">
                  Mi objetivo es comprender tu situación de manera completa para ofrecerte la mejor orientación y apoyo.
                </p>
                <p className="text-lg leading-relaxed font-semibold">
                  La comunicación es esencial para personalizar y optimizar tu plan de forma efectiva.
                </p>
                <p className="text-lg leading-relaxed">
                  Mantén el contacto conmigo para que pueda brindarte el máximo valor en mi asesoramiento.
                </p>
                <p className="text-lg leading-relaxed">
                  Cualquier ajuste que necesites, <span className="font-bold">SIEMPRE</span> existe una alternativa y <span className="font-bold">SIEMPRE</span> encontramos la mejor solución para ti.
                </p>
                <p className="text-lg leading-relaxed">
                  Mi enfoque se centra en que te sientas cómodo y puedas mantener el plan a largo plazo.
                </p>
                <p className="text-lg leading-relaxed font-semibold">
                  Para maximizar los beneficios de nuestro trabajo conjunto, mantente en contacto cuando lo requieras!
                </p>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-nutrition-green rounded-full"></div>
                  <span className="text-nutrition-green-dark font-medium">Contáctame cuando lo necesites</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-nutrition-green rounded-full"></div>
                  <span className="text-nutrition-green-dark font-medium">Soporte y motivación diarios</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-nutrition-green rounded-full"></div>
                  <span className="text-nutrition-green-dark font-medium">Material educativo y recursos</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Phone Mockup */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative transform rotate-6">
                {/* Phone Frame */}
                <div className="relative w-64 h-[520px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 pt-3 pb-1 bg-gray-50">
                      <span className="text-sm font-medium">13:17</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 bg-gray-800 rounded-sm"></div>
                        <div className="w-1 h-3 bg-gray-800 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* WhatsApp Header */}
                    <div className="bg-nutrition-green p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">JAFNFIT - José Antonio</h4>
                        <p className="text-green-100 text-xs">en línea</p>
                      </div>
                    </div>
                    
                    {/* Chat Content */}
                    <div className="flex-1 p-4 space-y-3 bg-gray-50 h-full">
                      <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%] rounded-bl-none">
                        <p className="text-xs text-gray-700">Hola, tenía que decírtelo... ¡Estoy flipando! 😍 me está encantando el menú, por fin como bien sin sentir que estoy a dieta.</p>
                        <p className="text-xs text-gray-400 mt-1 text-right">8:27</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%] rounded-bl-none">
                        <p className="text-xs text-gray-700">Me preparé las tostadas que me indicaste, probé las combinaciones y el boniato... ¡riquísimo y no paso hambre!</p>
                        <p className="text-xs text-gray-400 mt-1 text-right">8:28</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%] rounded-bl-none">
                        <p className="text-xs text-gray-700">¡Desde la última vez bajé ya 2 kg sin darme cuenta! Gracias 🙏 💚</p>
                        <p className="text-xs text-gray-400 mt-1 text-right">8:29</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
