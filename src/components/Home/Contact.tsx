
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const Contact: React.FC = () => {
  return (
    <section id="contacto" className="py-20 dark-section relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[hsla(var(--accent-green)/0.06)] blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <ScrollReveal direction="down">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--text-primary))] mb-4">
              <em className="heading-accent not-italic font-bold italic">Contáctame</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg text-[hsl(var(--text-secondary))] max-w-2xl mx-auto">
              ¿Listo para comenzar tu transformación? Ponte en contacto conmigo
            </p>
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <ScrollReveal direction="left" delay={400}>
            <div className="space-y-6">
              {[
                { icon: Phone, title: 'Teléfono', line1: '+34 697754823', line2: 'Lunes a Viernes, 9:00 - 20:00' },
                { icon: Mail, title: 'Email', line1: 'consultajafn@gmail.com', line2: 'Respuesta en 24 horas' },
                { icon: MapPin, title: 'Dirección', line1: 'Consulta con el entrenador', line2: '' },
              ].map((item, i) => (
                <div key={i} className="glass-card-light p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-[hsla(var(--accent-green)/0.15)] flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[hsl(var(--text-primary))] mb-1">{item.title}</h4>
                      <p className="text-[hsl(var(--text-secondary))] text-sm">{item.line1}</p>
                      {item.line2 && <p className="text-[hsl(var(--text-secondary))] text-xs opacity-60">{item.line2}</p>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Appointment Button */}
              <div className="glass-card-light p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsla(var(--accent-green)/0.15)] flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                  </div>
                  <h4 className="font-bold text-[hsl(var(--text-primary))]">¿Reservamos una cita?</h4>
                </div>
                <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
                  Agenda una consulta personalizada para conocer tus objetivos y diseñar tu plan ideal.
                </p>
                <Button
                  className="btn-cta"
                  onClick={() => window.open('https://api.whatsapp.com/send/?phone=34697754823&text=Hola+Jose%2C+quiero+empezar+mi+plan+con+JAFNFIT+%EF%BF%BD&type=phone_number&app_absent=0', '_blank')}
                >
                  ¿Tenemos una cita?
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Map */}
          <ScrollReveal direction="right" delay={600}>
            <div className="h-full min-h-[400px] glass-card-light overflow-hidden">
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
