import React, { useState } from 'react';
import { Calculator, Scale, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(bmiValue);
      
      if (bmiValue < 18.5) {
        setCategory('Bajo peso');
      } else if (bmiValue < 25) {
        setCategory('Peso normal');
      } else if (bmiValue < 30) {
        setCategory('Sobrepeso');
      } else {
        setCategory('Obesidad');
      }
    }
  };

  const getBMIColor = () => {
    if (!bmi) return 'text-gray-600';
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-nutrition-green';
    if (bmi < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <section id="portfolio" className="py-20 dynamic-background relative overflow-hidden">
      {/* Formas geométricas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos grandes */}
        <div className="geometric-shape circle-shape w-32 h-32 top-10 left-10 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-24 h-24 top-1/2 right-20 animate-bounce-gentle"></div>
        <div className="geometric-shape circle-shape w-20 h-20 bottom-20 left-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-16 h-16 top-1/4 right-1/3 animate-bounce-gentle"></div>
        
        {/* Círculos medianos */}
        <div className="geometric-shape circle-shape w-28 h-28 top-1/3 left-1/2 animate-float"></div>
        <div className="geometric-shape circle-shape w-22 h-22 bottom-1/3 right-1/4 animate-pulse-slow"></div>
        <div className="geometric-shape circle-shape w-18 h-18 top-2/3 left-1/6 animate-bounce-gentle"></div>
        
        {/* Triángulos */}
        <div className="geometric-shape triangle-shape triangle-up top-40 left-1/2 transform -translate-x-1/2 animate-rotate-slow"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-40 right-1/4 animate-float"></div>
        <div className="geometric-shape triangle-shape triangle-up top-1/4 left-1/4 animate-bounce-gentle"></div>
        <div className="geometric-shape triangle-shape triangle-down bottom-1/4 right-1/2 animate-pulse-slow"></div>
        <div className="geometric-shape triangle-shape triangle-up top-3/4 right-1/6 animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4 title-main">
            Calculadora de IMC
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conoce tu Índice de Masa Corporal y descubre si necesitas ajustar tu alimentación
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-nutrition-green-light">
            <div className="flex items-center justify-center mb-8">
              <Calculator className="w-12 h-12 text-nutrition-green" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <Label htmlFor="height" className="text-nutrition-black font-semibold mb-2 block">
                  Altura (cm)
                </Label>
                <div className="relative">
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Ej: 170"
                    className="border-nutrition-green-light focus:border-nutrition-green"
                  />
                  <Scale className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="weight" className="text-nutrition-black font-semibold mb-2 block">
                  Peso (kg)
                </Label>
                <div className="relative">
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Ej: 70"
                    className="border-nutrition-green-light focus:border-nutrition-green"
                  />
                  <Target className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <Button
              onClick={calculateBMI}
              className="w-full bg-nutrition-green hover:bg-nutrition-green-dark text-white py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mb-8"
              disabled={!height || !weight}
            >
              Calcular IMC
            </Button>

            {bmi && (
              <div className="text-center p-6 bg-nutrition-green-lighter rounded-xl">
                <h3 className="text-lg font-bold text-nutrition-black mb-2">Tu Resultado:</h3>
                <div className={`text-3xl font-bold mb-2 ${getBMIColor()}`}>
                  IMC: {bmi.toFixed(1)}
                </div>
                <div className={`text-xl font-semibold ${getBMIColor()}`}>
                  {category}
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-bold text-nutrition-green mb-2">Rangos de IMC:</h4>
                  <div className="text-sm space-y-1 text-left">
                    <div className="flex justify-between">
                      <span>Bajo peso:</span>
                      <span className="text-blue-600">Menos de 18.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peso normal:</span>
                      <span className="text-nutrition-green">18.5 - 24.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sobrepeso:</span>
                      <span className="text-orange-600">25.0 - 29.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Obesidad:</span>
                      <span className="text-red-600">30.0 o más</span>
                    </div>
                  </div>
                </div>

                {(bmi < 18.5 || bmi >= 25) && (
                  <div className="mt-6 p-4 bg-nutrition-orange-light rounded-lg">
                    <p className="text-nutrition-black font-semibold">
                      ¿Quieres mejorar tu composición corporal de forma saludable?
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Te ayudo a alcanzar tu peso ideal con un plan personalizado
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;
