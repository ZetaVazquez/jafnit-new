
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contacto" className="py-32 relative overflow-hidden">
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
            Contáctame
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Listo para comenzar tu transformación? Ponte en contacto conmigo
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-nutrition-green-light">
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-nutrition-green mt-1" />
                <div>
                  <h4 className="font-bold text-nutrition-black mb-1 title-playful">Teléfono</h4>
                  <p className="text-gray-600">+34 697754823</p>
                  <p className="text-sm text-gray-500">Lunes a Viernes, 9:00 - 20:00</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-nutrition-green-light">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-nutrition-green mt-1" />
                <div>
                  <h4 className="font-bold text-nutrition-black mb-1 title-playful">Email</h4>
                  <p className="text-gray-600">consultajafn@gmail.com</p>
                  <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-nutrition-green-light">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-nutrition-green mt-1" />
                <div>
                  <h4 className="font-bold text-nutrition-black mb-1 title-playful">Dirección</h4>
                  <p className="text-gray-600">Consulta con el entrenador</p>
               
                </div>
              </div>
            </div>

            {/* Appointment Button */}
            <div className="bg-nutrition-green/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-nutrition-green-light">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-nutrition-green mr-3" />
                <h4 className="font-bold text-nutrition-black title-playful">¿Reservamos una cita?</h4>
              </div>
              <p className="text-gray-600 mb-4">
                Agenda una consulta personalizada para conocer tus objetivos y diseñar tu plan ideal.
              </p>
              <Button className="bg-nutrition-orange hover:bg-nutrition-orange-dark text-white">
                ¿Tenemos una cita?
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="h-96 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-nutrition-green-light">
            <iframe
              src="https://www.google.com/maps/dir//R%C3%BAa+Leopoldo+Calvo+Sotelo,+152,+27400+Monforte+de+Lemos,+Lugo/@42.527893,-7.5870038,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0xd30132c14ab188f:0xe6e45c384c5284f8!2m2!1d-7.5045955!2d42.5279197?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación José Antonio Dietética"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
