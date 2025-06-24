
import React from 'react';
import { Award, Users, Heart, Target } from 'lucide-react';

const AboutUs: React.FC = () => {
  const stats = [
    { icon: Users, value: '30+', label: 'Clientes en Seguimiento' },
    { icon: Award, value: '6', label: 'Meses de Experiencia' },
    { icon: Heart, value: '100%', label: 'Compromiso Personal' },
    { icon: Target, value: '100+', label: 'Objetivos Alcanzados' }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-nutrition-green-lighter to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4">
            Sobre Nosotros
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un enfoque basado en ciencia y adaptado a tu estilo de vida, para que consigas tus objetivos sin renunciar al placer de comer bien.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-nutrition-black mb-6">
              Nuestra Misión
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              ¡Hola! Soy José Antonio, dietista, entrenador y educador nutricional. 
              Mi misión es ayudarte a mejorar tu bienestar a través de la alimentación, 
              el entrenamiento y la construcción de hábitos sostenibles.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Trabajo cada día para que la alimentación, el entrenamiento y los hábitos saludables 
              dejen de ser un enigma y se conviertan en herramientas que impulsen tu bienestar. 
              Con un trato directo y cercano, valoro especialmente el compromiso y la constancia.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Olvídate de las dietas restrictivas y la confusión sobre qué comer. 
              Te ofrezco un enfoque basado en ciencia para que alcances tus metas sin sacrificios extremos.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-nutrition-green text-white px-4 py-2 rounded-full text-sm font-medium">
                Comer de manera inteligente
              </div>
              <div className="bg-nutrition-green-emerald text-white px-4 py-2 rounded-full text-sm font-medium">
                Entrenar con propósito
              </div>
              <div className="bg-nutrition-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                Hábitos sostenibles
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="/lovable-uploads/e8c5f8a4-4b3d-4c4c-9a4d-5b2c7e8f9a1b.png"
              alt="José Antonio - Dietista y Entrenador"
              className="rounded-lg shadow-xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg">
              <h4 className="font-bold text-nutrition-green text-lg">José Antonio</h4>
              <p className="text-nutrition-gray">Dietista y Entrenador</p>
              <p className="text-sm text-gray-500 mt-1">Educador Nutricional</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-nutrition-green text-white rounded-full mb-4 mx-auto">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-nutrition-green mb-2">{stat.value}</div>
              <div className="text-nutrition-gray font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
