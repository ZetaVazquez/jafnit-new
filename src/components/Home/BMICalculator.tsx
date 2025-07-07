import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<string>('');
  const [showObesityModal, setShowObesityModal] = useState(false);

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

  const isObesity = bmi && bmi >= 30;

  return (
    <section id="portfolio" className="py-16 bg-gradient-to-br from-nutrition-green-lighter to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
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
                className="px-6 bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-3"
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
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {recommendation}
                  </p>
                  {isObesity && (
                    <Button
                      onClick={() => setShowObesityModal(true)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2"
                    >
                      Consecuencias de la obesidad
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de consecuencias de la obesidad */}
      <Dialog open={showObesityModal} onOpenChange={setShowObesityModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 mb-4">
              Consecuencias de la Obesidad
            </DialogTitle>
            <Button
              onClick={() => setShowObesityModal(false)}
              className="absolute right-4 top-4 h-6 w-6 p-0 bg-transparent hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-8 text-sm leading-relaxed">
            {/* Obesidad Grado I */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded">
              <h3 className="text-lg font-bold text-orange-600 mb-3">
                🟠 OBESIDAD GRADO I (IMC 30 – 34,9)
              </h3>
              <p className="font-semibold mb-3">Muchos cambios ya han comenzado:</p>
              <ul className="space-y-2 mb-4">
                <li>• Tu cuerpo resiste la insulina y se acerca a la diabetes tipo 2 🍬</li>
                <li>• Aumenta la tensión arterial y la carga sobre tu corazón ❤️</li>
                <li>• Aparece el cansancio constante, problemas de sueño 😴 y menos energía ⚡</li>
                <li>• Dolor articular, inflamación crónica y menos agilidad 🤕</li>
                <li>• Ansiedad, frustración y desmotivación 😟</li>
              </ul>
              <div className="bg-green-100 p-4 rounded mb-4">
                <p className="font-semibold">🔑 Estás a tiempo de revertirlo sin complicaciones graves.</p>
                <p className="mt-2">Este es el punto donde un pequeño cambio marca una gran diferencia.</p>
                <p className="mt-2 text-green-700 font-semibold">🟢 Mensaje clave: No esperes a que tu cuerpo grite lo que hoy ya te está susurrando.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">✅ ¿Qué puedes hacer?</p>
                <ul className="space-y-1">
                  <li>🍴 Crear un déficit calórico moderado, con saciedad</li>
                  <li>💪 Proteger masa muscular con fuerza y proteína</li>
                  <li>🧘 Trabajar el estrés y el descanso</li>
                  <li>🎯 Medir progreso más allá del peso</li>
                </ul>
              </div>
            </div>

            {/* Obesidad Grado II */}
            <div className="bg-orange-100 border-l-4 border-orange-500 p-6 rounded">
              <h3 className="text-lg font-bold text-orange-700 mb-3">
                🔶 OBESIDAD GRADO II (IMC 35 – 39,9)
              </h3>
              <p className="font-semibold mb-3">Los riesgos se intensifican. El sistema metabólico está más comprometido:</p>
              <ul className="space-y-2 mb-4">
                <li>• Alta probabilidad de diabetes tipo 2, hígado graso y colesterol elevado 🩸</li>
                <li>• Afectación pulmonar: ronquidos, apnea del sueño, cansancio crónico 🫁</li>
                <li>• Mayor riesgo de cáncer (mama, colon, hígado) 🎗️</li>
                <li>• Disminuye la movilidad, aumentan los dolores y baja la calidad de vida ⚖️</li>
              </ul>
              <div className="bg-green-100 p-4 rounded mb-4">
                <p className="font-semibold">🔑 Tu cuerpo ya está sufriendo las consecuencias, aunque no siempre lo notes.</p>
                <p className="mt-2">Con intervención adecuada, puedes recuperar el control.</p>
                <p className="mt-2 text-green-700 font-semibold">🟢 Mensaje clave: Tu salud no necesita perfección, necesita acción.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">✅ ¿Qué puedes hacer?</p>
                <ul className="space-y-1">
                  <li>👨‍⚕️ Abordaje multidisciplinar (nutrición, entrenamiento y apoyo emocional)</li>
                  <li>🥑 Alimentación real, rica en proteína y fibra</li>
                  <li>🚶‍♂️ Ejercicio adaptado a tu movilidad</li>
                  <li>📊 Seguimiento constante para sostener el cambio</li>
                </ul>
              </div>
            </div>

            {/* Obesidad Grado III */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
              <h3 className="text-lg font-bold text-red-700 mb-3">
                🔴 OBESIDAD GRADO III (IMC ≥ 40)
              </h3>
              <p className="font-semibold mb-3">Ya no se trata solo de salud. Se trata de supervivencia.</p>
              <ul className="space-y-2 mb-4">
                <li>• Alta probabilidad de insuficiencia cardíaca, diabetes grave, enfermedades respiratorias 🚑</li>
                <li>• Riesgo duplicado de infartos o muerte prematura 💔</li>
                <li>• Limitación en la autonomía personal y mayor aislamiento social 🧍</li>
                <li>• La esperanza de vida puede reducirse hasta 10 años ⏳</li>
              </ul>
              <div className="bg-green-100 p-4 rounded mb-4">
                <p className="font-semibold">🔑 Este no es un momento para ignorar lo que pasa. Es el momento de priorizarte.</p>
                <p className="mt-2 text-green-700 font-semibold">🟢 Mensaje clave: No es tarde. No estás solo. Tu cuerpo merece otra oportunidad.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">✅ ¿Qué puedes hacer?</p>
                <ul className="space-y-1">
                  <li>🔁 Transformación profunda pero acompañada</li>
                  <li>🥗 Plan nutricional sin juicios ni prohibiciones</li>
                  <li>🏋️‍♀️ Movimiento adaptado, real y progresivo</li>
                  <li>🧠 Intervención psicológica o emocional si es necesario</li>
                  <li>📆 Seguimiento profesional comprometido contigo</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BMICalculator;
