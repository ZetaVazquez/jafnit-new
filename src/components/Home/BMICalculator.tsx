import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBMI] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBMI(Math.round(calculatedBMI * 10) / 10);
      
      if (calculatedBMI < 18.5) {
        setCategory('Bajo peso');
      } else if (calculatedBMI < 25) {
        setCategory('Peso normal');
      } else if (calculatedBMI < 30) {
        setCategory('Sobrepeso');
      } else {
        setCategory('Obesidad');
      }
    }
  };

  const getBMIColor = () => {
    if (!bmi) return 'text-gray-600';
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBMIIcon = () => {
    if (!bmi) return <Calculator className="w-6 h-6" />;
    if (bmi < 18.5) return <TrendingDown className="w-6 h-6" />;
    if (bmi < 25) return <Minus className="w-6 h-6" />;
    return <TrendingUp className="w-6 h-6" />;
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setBMI(null);
    setCategory('');
  };

  return (
    <section id="portfolio" className="py-20 dynamic-background relative overflow-hidden">
      {/* Decorative background elements */}
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
            Conoce tu Índice de Masa Corporal y descubre si estás en tu peso ideal
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-nutrition-black text-center flex items-center justify-center gap-2">
                <Calculator className="w-8 h-8 text-nutrition-green" />
                Calculadora de IMC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="175"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={calculateBMI}
                  className="flex-1 bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest text-white"
                  disabled={!height || !weight}
                >
                  Calcular IMC
                </Button>
                <Button
                  onClick={resetCalculator}
                  variant="outline"
                  className="border-nutrition-green text-nutrition-green hover:bg-nutrition-green hover:text-white"
                >
                  Limpiar
                </Button>
              </div>

              {bmi && (
                <div className="mt-8 p-6 bg-gradient-to-r from-nutrition-green-lighter to-white rounded-lg border-l-4 border-nutrition-green">
                  <div className="text-center">
                    <div className={`flex items-center justify-center gap-2 text-3xl font-bold mb-2 ${getBMIColor()}`}>
                      {getBMIIcon()}
                      {bmi}
                    </div>
                    <h3 className={`text-xl font-semibold mb-4 ${getBMIColor()}`}>
                      {category}
                    </h3>
                    
                    <div className="bg-white/80 rounded-lg p-4 text-left">
                      <h4 className="font-semibold text-nutrition-black mb-2">Categorías de IMC:</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li className="flex justify-between">
                          <span>Bajo peso:</span>
                          <span className="text-blue-600">Menos de 18.5</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Peso normal:</span>
                          <span className="text-green-600">18.5 - 24.9</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sobrepeso:</span>
                          <span className="text-yellow-600">25.0 - 29.9</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Obesidad:</span>
                          <span className="text-red-600">30.0 o más</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-nutrition-green-lighter/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Nota:</strong> El IMC es una herramienta útil, pero no considera la composición corporal. 
                  Para una evaluación completa, consulta con nuestros profesionales.
                </p>
                <Button
                  className="bg-gradient-to-r from-nutrition-green to-nutrition-green-emerald hover:from-nutrition-green-dark hover:to-nutrition-green-forest text-white"
                >
                  Consulta Personalizada
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;
