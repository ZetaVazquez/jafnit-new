
import React from 'react';
import { Award, Users, Heart, Target, Sparkles, Zap } from 'lucide-react';

const AboutUs: React.FC = () => {
  const stats = [
    { icon: Users, value: '30+', label: 'Clientes en Seguimiento' },
    { icon: Award, value: '6', label: 'Meses de Experiencia' },
    { icon: Heart, value: '100%', label: 'Compromiso Personal' },
    { icon: Target, value: '100+', label: 'Objetivos Alcanzados' }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-nutrition-green-lighter to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-nutrition-green-light rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-24 h-24 bg-nutrition-accent rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-nutrition-green-emerald rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-nutrition-green-sage rounded-full opacity-20 animate-bounce"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2">
          <Sparkles className="w-8 h-8 text-nutrition-accent opacity-30 animate-pulse" />
        </div>
        <div className="absolute bottom-40 right-1/4">
          <Zap className="w-6 h-6 text-nutrition-green-emerald opacity-40 animate-bounce" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-nutrition-black mb-6 font-sans tracking-tight">
            Mi Historia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Descubre cómo pasé de estar perdido en el mundo de las dietas a convertirme en tu guía hacia una vida más saludable y plena.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-nutrition-green-light">
              <h3 className="text-3xl font-bold text-nutrition-green mb-6 font-sans">
                Todo Comenzó Con Una Pregunta...
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed font-light">
                <span className="text-nutrition-accent font-semibold">"¿Por qué es tan difícil comer bien?"</span> 
                Me hice esta pregunta después de años viendo cómo las personas (incluido yo mismo) luchábamos 
                con dietas restrictivas que no funcionaban a largo plazo.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed font-light">
                Fue entonces cuando decidí estudiar nutrición y entrenamiento personal, no solo para entender 
                la ciencia detrás de la alimentación, sino para <span className="text-nutrition-green font-semibold">
                crear un método que realmente funcionara</span> para personas reales, con vidas reales.
              </p>
            </div>

            <div className="bg-gradient-to-r from-nutrition-green-lighter to-nutrition-green-light rounded-2xl p-8 shadow-lg">
              <h4 className="text-2xl font-bold text-nutrition-green-dark mb-4 font-sans">
                Mi Promesa Para Ti
              </h4>
              <p className="text-lg text-nutrition-green-dark leading-relaxed font-light">
                No más dietas que te hagan sentir culpable. No más restricciones extremas. 
                Solo un <span className="font-semibold">enfoque inteligente, sostenible y personalizado</span> 
                que se adapte a tu vida, no al revés.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-nutrition-green text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                🍎 Sistema Anti-Dieta
              </div>
              <div className="bg-nutrition-green-emerald text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                💪 Entrenamiento Inteligente
              </div>
              <div className="bg-nutrition-accent text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                🎯 Resultados Reales
              </div>
            </div>
          </div>
          
          <div className="relative flex justify-center">
            {/* Decorative rings around the image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full border-4 border-nutrition-green-light opacity-30 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 rounded-full border-2 border-nutrition-accent opacity-20 animate-pulse delay-300"></div>
            </div>
            
            {/* Main image container */}
            <div className="relative z-10 w-72 h-72 rounded-full border-8 border-white shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
              <img
                src="/lovable-uploads/892d4c06-55ec-40c8-b958-b611e50b191c.png"
                alt="José Antonio - Tu Dietista y Entrenador Personal"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating info card */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-nutrition-green-light hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-nutrition-green rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-bold text-nutrition-green text-lg font-sans">José Antonio</h4>
                  <p className="text-nutrition-gray text-sm">Dietista y Entrenador</p>
                  <p className="text-xs text-gray-500 mt-1">Tu Compañero en el Cambio</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section with more dynamic design */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-nutrition-green-light">
          <h3 className="text-3xl font-bold text-center text-nutrition-green mb-8 font-sans">
            Resultados Que Hablan Por Sí Solos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-nutrition-green to-nutrition-green-emerald text-white rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-10 h-10" />
                </div>
                <div className="text-4xl font-bold text-nutrition-green mb-2 font-sans">{stat.value}</div>
                <div className="text-nutrition-gray font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
