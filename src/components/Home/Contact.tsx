import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-nutrition-black mb-4 title-main">
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
                  <p className="text-gray-600">+34 600 123 456</p>
                  <p className="text-sm text-gray-500">Lunes a Viernes, 9:00 - 20:00</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-nutrition-green-light">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-nutrition-green mt-1" />
                <div>
                  <h4 className="font-bold text-nutrition-black mb-1 title-playful">Email</h4>
                  <p className="text-gray-600">info@joseantoniodiet.com</p>
                  <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-nutrition-green-light">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-nutrition-green mt-1" />
                <div>
                  <h4 className="font-bold text-nutrition-black mb-1 title-playful">Dirección</h4>
                  <p className="text-gray-600">Calle de la Salud, 123</p>
                  <p className="text-gray-600">28001 Madrid, España</p>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.4449145084494!2d-3.7025765!3d40.4165001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287b9b3d7b37%3A0xa1c0b8c6e4f5d9c6!2sMadrid%2C%20Spain!5e0!3m2!1sen!2sus!4v1234567890123"
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
