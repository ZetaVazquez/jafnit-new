
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<string>('');

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (heightInMeters > 0 && weightInKg > 0) {
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));

      // Determine recommendation
      if (calculatedBMI < 18.5) {
        setRecommendation('Tu IMC indica bajo peso. Te recomendamos enfocarte en una nutrición adecuada para ganar peso de forma saludable.');
      } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
        setRecommendation('¡Felicidades! Tu IMC está en el rango normal. Mantén un estilo de vida equilibrado con buena nutrición y ejercicio regular.');
      } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        setRecommendation('Tu IMC indica sobrepeso. Te recomendamos combinar una dieta balanceada con ejercicio regular para alcanzar un peso saludable.');
      } else {
        setRecommendation('Tu IMC indica obesidad. Es importante que combines una nutrición personalizada con un plan de ejercicios adaptado a tus necesidades.');
      }
    }
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { category: 'Bajo peso', color: 'text-blue-600' };
    if (bmiValue < 25) return { category: 'Normal', color: 'text-nutrition-green' };
    if (bmiValue < 30) return { category: 'Sobrepeso', color: 'text-nutrition-orange' };
    return { category: 'Obesidad', color: 'text-red-600' };
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setRecommendation('');
  };

  return (
    <section id="bmi" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nutrition-black mb-4">
            Calculadora de IMC
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calcula tu Índice de Masa Corporal y descubre qué es lo que más te conviene
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <Calculator className="w-8 h-8 text-nutrition-green mr-3" />
            <h3 className="text-2xl font-bold text-nutrition-black">IMC Calculator</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Altura (cm)
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrition-green focus:border-transparent"
                placeholder="Ej: 170"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrition-green focus:border-transparent"
                placeholder="Ej: 70"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={calculateBMI}
                disabled={!height || !weight}
                className="flex-1 bg-nutrition-green hover:bg-nutrition-green-dark text-white py-3"
              >
                Calcular IMC
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                className="px-6 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Reset
              </Button>
            </div>

            {bmi && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <div className="text-center mb-4">
                  <p className="text-lg text-gray-600">Tu IMC es:</p>
                  <p className="text-4xl font-bold text-nutrition-green">{bmi}</p>
                  <p className={`text-lg font-semibold ${getBMICategory(bmi).color}`}>
                    {getBMICategory(bmi).category}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;
