
import React from 'react';
import { Award, Users, Heart, Target } from 'lucide-react';

const AboutUs: React.FC = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Clientes Satisfechos' },
    { icon: Award, value: '5+', label: 'Años de Experiencia' },
    { icon: Heart, value: '95%', label: 'Tasa de Éxito' },
    { icon: Target, value: '1000+', label: 'Objetivos Alcanzados' }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-nutrition-green-lighter to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4">
            Sobre Nosotros
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos más que un servicio de nutrición. Somos tu compañero en el viaje hacia una vida más saludable y equilibrada.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-nutrition-black mb-6">
              Nuestra Misión
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              En JA Dietética, creemos que una alimentación saludable es la base de una vida plena. 
              Nuestro objetivo es hacer que la nutrición sea accesible, personalizada y sostenible para todos.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Con años de experiencia en nutrición deportiva y clínica, hemos ayudado a cientos de personas 
              a alcanzar sus objetivos de salud y bienestar a través de planes alimentarios personalizados 
              y un seguimiento continuo.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-nutrition-green text-white px-4 py-2 rounded-full text-sm font-medium">
                Nutrición Personalizada
              </div>
              <div className="bg-nutrition-green-emerald text-white px-4 py-2 rounded-full text-sm font-medium">
                Seguimiento Continuo
              </div>
              <div className="bg-nutrition-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                Resultados Comprobados
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="José Antonio - Nutricionista"
              className="rounded-lg shadow-xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg">
              <h4 className="font-bold text-nutrition-green text-lg">José Antonio</h4>
              <p className="text-nutrition-gray">Nutricionista Certificado</p>
              <p className="text-sm text-gray-500 mt-1">Máster en Nutrición Deportiva</p>
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
