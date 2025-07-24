
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const Contact: React.FC = () => {
  return (
    <section id="contacto" className="py-32 bg-gradient-to-br from-nutrition-green via-nutrition-green-emerald to-nutrition-green-dark relative overflow-hidden">
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
            <h2 className="text-4xl font-bold text-white mb-4 title-main">
              Contáctame
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              ¿Listo para comenzar tu transformación? Ponte en contacto conmigo
            </p>
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <ScrollReveal direction="left" delay={400}>
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-white mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-1 title-playful">Teléfono</h4>
                    <p className="text-white/80">+34 697754823</p>
                    <p className="text-sm text-white/60">Lunes a Viernes, 9:00 - 20:00</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-white mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-1 title-playful">Email</h4>
                    <p className="text-white/80">consultajafn@gmail.com</p>
                    <p className="text-sm text-white/60">Respuesta en 24 horas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-white mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-1 title-playful">Dirección</h4>
                    <p className="text-white/80">Consulta con el entrenador</p>
                  
                  </div>
                </div>
              </div>

              {/* Appointment Button */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-white mr-3" />
                  <h4 className="font-bold text-white title-playful">¿Reservamos una cita?</h4>
                </div>
                <p className="text-white/80 mb-4">
                  Agenda una consulta personalizada para conocer tus objetivos y diseñar tu plan ideal.
                </p>
                <Button 
                  className="bg-nutrition-orange hover:bg-nutrition-orange-dark text-white"
                  onClick={() => window.open('https://api.whatsapp.com/send/?phone=34697754823&text=Hola+Jose%2C+quiero+empezar+mi+plan+con+JAFNFIT+%EF%BF%BD&type=phone_number&app_absent=0', '_blank')}
                >
                  ¿Tenemos una cita?
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Map */}
          <ScrollReveal direction="right" delay={600}>
            <div className="h-96 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2397.5!2d-7.5044837!3d42.5279291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDMxJzQwLjUiTiA3wrAzMCcxNi4xIlc!5e0!3m2!1ses!2ses!4v1642000000000!5m2!1ses!2ses"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación José Antonio Dietética"
              ></iframe>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
