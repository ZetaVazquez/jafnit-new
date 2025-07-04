
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Dumbbell, Users, Calendar, MessageCircle, BarChart3 } from 'lucide-react';
import DynamicBackground from '@/components/Layout/DynamicBackground';

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
      <DynamicBackground>
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
              <Card key={index} className="h-full bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-t-4 border-t-nutrition-green shadow-lg">
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

          <div className="mt-16 bg-gradient-to-r from-nutrition-green-lighter/80 to-nutrition-green-light/80 backdrop-blur-sm p-8 rounded-2xl text-center shadow-lg border border-nutrition-green-light">
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

          {/* New Communication Section */}
          <div className="mt-16 bg-gradient-to-r from-nutrition-green-lighter/80 to-nutrition-green-light/80 backdrop-blur-sm rounded-2xl shadow-lg border border-nutrition-green-light overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
              {/* Text Content */}
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl md:text-3xl font-bold text-nutrition-green-dark mb-6 title-playful">
                  💬 LA COMUNICACIÓN ES CLAVE PARA QUE LOGRES TUS OBJETIVOS Y PODAMOS CONOCER TUS NECESIDADES
                </h3>
                <div className="space-y-4 text-nutrition-green-dark">
                  <p className="text-lg leading-relaxed">
                    Nuestro trabajo es conocer tu caso lo mejor posible para poder guiarte y acompañarte.
                  </p>
                  <p className="text-lg leading-relaxed font-semibold">
                    Sin tus mensajes, no podemos cambiarte y mejorarte el plan.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Necesitamos que te comuniques siempre con nosotros para que demos el 100% en nuestro trabajo.
                  </p>
                  <p className="text-lg leading-relaxed">
                    No importa lo que quieras cambiar, <span className="font-bold">SIEMPRE</span> hay otra opción y <span className="font-bold">SIEMPRE</span> hay una solución para todo lo que no te gusta.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Nuestra prioridad es que te guste y puedas seguirlo.
                  </p>
                  <p className="text-lg leading-relaxed font-semibold">
                    Si quieres aprovechar al máximo el servicio, habla con nosotros siempre que lo necesites!
                  </p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-nutrition-green rounded-full"></div>
                    <span className="text-nutrition-green-dark font-medium">Escríbenos cuando lo necesites</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-nutrition-green rounded-full"></div>
                    <span className="text-nutrition-green-dark font-medium">Apoyo y motivación a diario</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-nutrition-green rounded-full"></div>
                    <span className="text-nutrition-green-dark font-medium">Vídeos y documentos educativos</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Phone Mockup */}
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative">
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
                      <div className="flex-1 p-4 space-y-3 bg-gray-50">
                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%]">
                          <p className="text-xs text-gray-600 mb-1">Hola Preciosa!!! Para el ver la báscula la vif me ha dado un poco de bajón, pero al comprar las fuerzas báscula de casa sin parar... Una semana he notado muchísimo cambio y esto es la semana a menos se ve semanejado en la báscula</p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%]">
                          <p className="text-xs text-gray-600 mb-1">Estoy súper contenta la vd, me noto muchísima el cambio y ya estoy viendo a descender algunas depende mis caras gomas cansadas sedes y ayer fue a cenarful con una camiseta ajustada que llevaba mucho tiempo sin atreverme y me sentía GENIAL</p>
                        </div>
                        
                        <div className="self-end bg-nutrition-green text-white p-3 rounded-lg shadow-sm max-w-[85%] ml-auto">
                          <p className="text-xs mb-1">¡Y mil gracias por el reconocimiento que tienes hacia mí sobre mis resultados que es sentirte realmente a seguir! 💗🥹💗💗</p>
                        </div>
                        
                        <div className="self-end bg-nutrition-green text-white p-3 rounded-lg shadow-sm max-w-[85%] ml-auto">
                          <p className="text-xs mb-1">Ay me alegra tanto leer estos mensajes al final que vosotras os deis cuenta de lo que estáis consiguiendo es lo más importante!! que sigais así!!! 💪💪</p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%]">
                          <p className="text-xs text-gray-600 mb-1">Sin vosotros nada de esto sería posible!!! Estoy encantadísima</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pink circle decoration */}
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-20 h-20 bg-pink-300 rounded-full opacity-60 -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DynamicBackground>
    </section>
  );
};

export default Services;
