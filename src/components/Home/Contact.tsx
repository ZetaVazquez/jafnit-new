
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-nutrition-green-light/20 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title text-nutrition-black mb-4">
            Contáctanos
          </h2>
          <p className="text-xl text-nutrition-gray max-w-2xl mx-auto">
            Estamos aquí para ayudarte a comenzar tu transformación
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-nutrition-black mb-6 title-playful">
                Información de Contacto
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-nutrition-green mr-4" />
                  <div>
                    <p className="font-semibold text-nutrition-black">Email</p>
                    <p className="text-nutrition-gray">info@nutricionyvida.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-nutrition-green mr-4" />
                  <div>
                    <p className="font-semibold text-nutrition-black">Teléfono</p>
                    <p className="text-nutrition-gray">+34 123 456 789</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-nutrition-green mr-4" />
                  <div>
                    <p className="font-semibold text-nutrition-black">Ubicación</p>
                    <p className="text-nutrition-gray">Madrid, España</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-nutrition-green mr-4" />
                  <div>
                    <p className="font-semibold text-nutrition-black">Horario</p>
                    <p className="text-nutrition-gray">Lun - Vie: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-nutrition-green rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4 title-playful">
                ¿Por qué elegirnos?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-nutrition-accent mr-2">✓</span>
                  Planes 100% personalizados
                </li>
                <li className="flex items-start">
                  <span className="text-nutrition-accent mr-2">✓</span>
                  Seguimiento profesional continuo
                </li>
                <li className="flex items-start">
                  <span className="text-nutrition-accent mr-2">✓</span>
                  Resultados garantizados
                </li>
                <li className="flex items-start">
                  <span className="text-nutrition-accent mr-2">✓</span>
                  Enfoque integral y sostenible
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-nutrition-black mb-6 title-playful">
              Envíanos un Mensaje
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-nutrition-black mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-nutrition-green-light rounded-lg focus:ring-2 focus:ring-nutrition-green focus:border-transparent transition-all"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-nutrition-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-nutrition-green-light rounded-lg focus:ring-2 focus:ring-nutrition-green focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-nutrition-black mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-nutrition-green-light rounded-lg focus:ring-2 focus:ring-nutrition-green focus:border-transparent transition-all"
                  placeholder="+34 123 456 789"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-nutrition-black mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-nutrition-green-light rounded-lg focus:ring-2 focus:ring-nutrition-green focus:border-transparent transition-all resize-none"
                  placeholder="Cuéntanos sobre tus objetivos y cómo podemos ayudarte..."
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <Send className="w-5 h-5 mr-2" />
                Enviar Mensaje
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
