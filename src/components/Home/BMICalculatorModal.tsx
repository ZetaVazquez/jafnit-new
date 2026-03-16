import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, X, Activity, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BMICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BMICalculatorModal: React.FC<BMICalculatorModalProps> = ({ isOpen, onClose }) => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<string>('');
  const [showObesityDetails, setShowObesityDetails] = useState(false);

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (heightInMeters > 0 && weightInKg > 0) {
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));

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
    if (bmiValue < 18.5) return { category: 'Bajo peso', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
    if (bmiValue < 25) return { category: 'Normal', color: 'text-[hsl(var(--accent-green))]', bg: 'bg-[hsl(var(--accent-green))]/20', border: 'border-[hsl(var(--accent-green))]/30' };
    if (bmiValue < 30) return { category: 'Sobrepeso', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
    return { category: 'Obesidad', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setRecommendation('');
    setShowObesityDetails(false);
  };

  const isObesity = bmi && bmi >= 30;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[hsl(220,20%,10%)] border-white/10 text-white p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
            <div className="p-2.5 rounded-xl bg-[hsl(var(--accent-green))]/20 border border-[hsl(var(--accent-green))]/30">
              <Calculator className="w-6 h-6 text-[hsl(var(--accent-green))]" />
            </div>
            Calculadora de IMC
          </DialogTitle>
          <p className="text-white/50 text-sm mt-2">
            Calcula tu Índice de Masa Corporal y descubre qué es lo que más te conviene
          </p>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* BMI Scale Reference */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { label: 'Bajo peso', range: '< 18.5', color: 'bg-blue-500/30 border-blue-500/40 text-blue-300' },
              { label: 'Normal', range: '18.5 - 24.9', color: 'bg-[hsl(var(--accent-green))]/30 border-[hsl(var(--accent-green))]/40 text-[hsl(var(--accent-green-light))]' },
              { label: 'Sobrepeso', range: '25 - 29.9', color: 'bg-orange-500/30 border-orange-500/40 text-orange-300' },
              { label: 'Obesidad', range: '≥ 30', color: 'bg-red-500/30 border-red-500/40 text-red-300' },
            ].map((item) => (
              <div key={item.label} className={`rounded-lg border p-2.5 ${item.color}`}>
                <div className="font-semibold">{item.label}</div>
                <div className="opacity-70 mt-0.5">{item.range}</div>
              </div>
            ))}
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="height-modal" className="block text-sm font-medium text-white/60 mb-2">
                Altura (cm)
              </label>
              <input
                type="number"
                id="height-modal"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-[hsl(var(--accent-green))]/50 focus:border-[hsl(var(--accent-green))]/50 outline-none transition-all"
                placeholder="Ej: 170"
              />
            </div>
            <div>
              <label htmlFor="weight-modal" className="block text-sm font-medium text-white/60 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                id="weight-modal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-[hsl(var(--accent-green))]/50 focus:border-[hsl(var(--accent-green))]/50 outline-none transition-all"
                placeholder="Ej: 70"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={calculateBMI}
              disabled={!height || !weight}
              className="flex-1 bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green-dark))] text-black font-semibold py-3 rounded-xl"
            >
              <Activity className="w-4 h-4 mr-2" />
              Calcular IMC
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              className="px-6 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 bg-white/5 rounded-xl"
            >
              Reset
            </Button>
          </div>

          {/* Result */}
          {bmi && (
            <div className={`p-6 rounded-2xl border ${getBMICategory(bmi).bg} ${getBMICategory(bmi).border}`}>
              <div className="text-center mb-4">
                <p className="text-sm text-white/50 mb-1">Tu IMC es:</p>
                <p className={`text-5xl font-bold ${getBMICategory(bmi).color}`}>{bmi}</p>
                <p className={`text-lg font-semibold mt-1 ${getBMICategory(bmi).color}`}>
                  {getBMICategory(bmi).category}
                </p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  {recommendation}
                </p>
                {isObesity && (
                  <Button
                    onClick={() => setShowObesityDetails(!showObesityDetails)}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl"
                    variant="outline"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {showObesityDetails ? 'Ocultar detalles' : 'Consecuencias de la obesidad'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Obesity Details */}
          {showObesityDetails && isObesity && (
            <div className="space-y-4">
              {[
                {
                  title: '🟠 OBESIDAD GRADO I (IMC 30 – 34,9)',
                  borderColor: 'border-orange-500/40',
                  bgColor: 'bg-orange-500/10',
                  titleColor: 'text-orange-400',
                  items: [
                    'Tu cuerpo resiste la insulina y se acerca a la diabetes tipo 2 🍬',
                    'Aumenta la tensión arterial y la carga sobre tu corazón ❤️',
                    'Aparece el cansancio constante, problemas de sueño 😴 y menos energía ⚡',
                    'Dolor articular, inflamación crónica y menos agilidad 🤕',
                    'Ansiedad, frustración y desmotivación 😟',
                  ],
                  keyMessage: 'No esperes a que tu cuerpo grite lo que hoy ya te está susurrando.',
                  actions: ['Crear un déficit calórico moderado', 'Proteger masa muscular con fuerza y proteína', 'Trabajar el estrés y el descanso'],
                },
                {
                  title: '🔶 OBESIDAD GRADO II (IMC 35 – 39,9)',
                  borderColor: 'border-orange-600/40',
                  bgColor: 'bg-orange-600/10',
                  titleColor: 'text-orange-500',
                  items: [
                    'Alta probabilidad de diabetes tipo 2, hígado graso y colesterol elevado 🩸',
                    'Afectación pulmonar: ronquidos, apnea del sueño, cansancio crónico 🫁',
                    'Mayor riesgo de cáncer (mama, colon, hígado) 🎗️',
                    'Disminuye la movilidad, aumentan los dolores y baja la calidad de vida ⚖️',
                  ],
                  keyMessage: 'Tu salud no necesita perfección, necesita acción.',
                  actions: ['Abordaje multidisciplinar', 'Alimentación real, rica en proteína y fibra', 'Ejercicio adaptado a tu movilidad'],
                },
                {
                  title: '🔴 OBESIDAD GRADO III (IMC ≥ 40)',
                  borderColor: 'border-red-500/40',
                  bgColor: 'bg-red-500/10',
                  titleColor: 'text-red-400',
                  items: [
                    'Alta probabilidad de insuficiencia cardíaca, diabetes grave 🚑',
                    'Riesgo duplicado de infartos o muerte prematura 💔',
                    'Limitación en la autonomía personal y mayor aislamiento social 🧍',
                    'La esperanza de vida puede reducirse hasta 10 años ⏳',
                  ],
                  keyMessage: 'No es tarde. No estás solo. Tu cuerpo merece otra oportunidad.',
                  actions: ['Transformación profunda pero acompañada', 'Plan nutricional sin juicios', 'Movimiento adaptado, real y progresivo'],
                },
              ].map((section) => (
                <div key={section.title} className={`p-5 rounded-xl border ${section.borderColor} ${section.bgColor}`}>
                  <h4 className={`font-bold mb-3 ${section.titleColor}`}>{section.title}</h4>
                  <ul className="space-y-1.5 text-sm text-white/60 mb-3">
                    {section.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                  <div className="p-3 rounded-lg bg-[hsl(var(--accent-green))]/10 border border-[hsl(var(--accent-green))]/20 mb-3">
                    <p className="text-sm text-[hsl(var(--accent-green-light))] font-medium">🟢 {section.keyMessage}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/40 mb-1.5">✅ ¿Qué puedes hacer?</p>
                    <ul className="text-xs text-white/50 space-y-1">
                      {section.actions.map((a, i) => (
                        <li key={i}>→ {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BMICalculatorModal;
