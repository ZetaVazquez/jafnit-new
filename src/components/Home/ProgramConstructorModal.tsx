
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Hammer, Dumbbell, Utensils, ClipboardCheck, Calendar, ArrowRight, X, Shield } from 'lucide-react';

interface ProgramConstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuestionnaire: () => void;
}

const ProgramConstructorModal: React.FC<ProgramConstructorModalProps> = ({ isOpen, onClose, onStartQuestionnaire }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[hsl(220,20%,8%)] border-white/10 text-white p-0 [&>button]:hidden">
        <button onClick={onClose} className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Hero */}
        <div className="relative p-8 md:p-12 border-b border-white/10 bg-gradient-to-br from-[hsla(45,100%,51%,0.08)] to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[hsla(45,100%,51%,0.2)] flex items-center justify-center">
              <Hammer className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Constructor</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">⭐ Popular</span>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-white/90 mb-2">
            El nivel donde dejamos de probar y empezamos a <span className="text-[hsl(var(--accent-green-light))]">planificar</span>.
          </p>
          <p className="text-white/50 text-sm">Si has llegado a Constructor es porque ya no necesitas más información. Necesitas <strong className="text-white/70">estructura aplicada</strong>.</p>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          {/* Intro */}
          <div className="space-y-3 text-white/70 leading-relaxed">
            <p>Aquí empezamos a trabajar con <strong className="text-white">planificación real</strong>. Con comidas organizadas. Con entrenamiento estructurado. Con seguimiento.</p>
            <p>Registro de métricas.<br/>Ajustes estratégicos.</p>
            <p className="text-[hsl(var(--accent-green-light))] font-medium">Explorador aporta claridad. Constructor empieza a generar cambios medibles.</p>
          </div>

          {/* What is it really */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Hammer className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
              Qué es Constructor realmente
            </h3>
            <p className="text-white/70 mb-4">Constructor es el punto donde la claridad inicial se convierte en planificación organizada con seguimiento.</p>
            <p className="text-white/70 mb-4">Durante <strong className="text-white">4 semanas</strong> trabajamos con:</p>
            <ul className="space-y-2 mb-4">
              {[
                'Plan nutricional personalizado',
                'Distribución de comidas estructurada',
                'Alternativas e intercambios reales',
                'Plan de entrenamiento con progresión',
                'Sistema de registro semanal',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-[hsl(var(--accent-green-light))] font-medium italic">Aquí ya no exploramos. Construimos resultados.</p>
          </div>

          {/* 3 pillars */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Qué incluye exactamente</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass-card-light p-5 rounded-xl">
                <Utensils className="w-6 h-6 text-[hsl(var(--accent-green-light))] mb-3" />
                <h4 className="font-bold text-white text-sm mb-3">Planificación nutricional</h4>
                <ul className="space-y-1.5">
                  {['Calorías ajustadas a tu contexto', 'Distribución de comidas organizada', 'Opciones intercambiables claras', 'Adaptación a horarios reales'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-[hsl(var(--accent-green-light))] mt-0.5 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card-light p-5 rounded-xl">
                <Dumbbell className="w-6 h-6 text-[hsl(var(--accent-green-light))] mb-3" />
                <h4 className="font-bold text-white text-sm mb-3">Entrenamiento estructurado</h4>
                <ul className="space-y-1.5">
                  {['Rutina planificada con progresión', 'Indicaciones claras por sesión', 'Composición corporal'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-[hsl(var(--accent-green-light))] mt-0.5 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card-light p-5 rounded-xl">
                <ClipboardCheck className="w-6 h-6 text-[hsl(var(--accent-green-light))] mb-3" />
                <h4 className="font-bold text-white text-sm mb-3">Seguimiento y control</h4>
                <ul className="space-y-1.5">
                  {['Registro semanal obligatorio', 'Revisión estructurada', 'Ajustes estratégicos cuando correspondan', 'Panel privado para seguimiento'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-[hsl(var(--accent-green-light))] mt-0.5 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-center text-sm text-white/60 mt-6 italic">Aquí ya no trabajas solo/a. Trabajamos con <strong className="text-white/80">datos reales</strong>.</p>
          </div>

          {/* Process + Rules */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                Cómo funciona el proceso de 4 semanas
              </h3>
              <div className="glass-card-light p-5 rounded-xl">
                <h4 className="font-bold text-[hsl(var(--accent-green-light))] text-sm mb-3">Semana 0 · Análisis y diseño</h4>
                <ul className="space-y-1.5">
                  {[
                    'Revisión completa de evaluación inicial',
                    'Ajuste de calorías y macronutrientes',
                    'Definición de horarios reales',
                    'Planificación de entrenamiento',
                    'Activación del panel privado',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <Check className="w-3 h-3 text-[hsl(var(--accent-green-light))] mt-0.5 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                Normas del programa
              </h3>
              <p className="text-sm text-white/60 mb-4">Para que el método funcione, se respetan estas reglas estructuradas.</p>
              <Button onClick={() => { onClose(); onStartQuestionnaire(); }} className="btn-cta w-full py-3">
                Solicitar Evaluación Inicial <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Investment */}
          <div className="text-center pt-6 border-t border-white/10">
            <div className="mb-4">
              <span className="text-4xl font-bold text-[hsl(var(--accent-green-light))]">99€</span>
              <span className="text-white/40 ml-2">/mes</span>
            </div>
            <p className="text-sm text-white/50 mb-6">Planificación real. Seguimiento real. Resultados reales.</p>
            <Button onClick={() => { onClose(); onStartQuestionnaire(); }} className="btn-cta text-base px-10 py-4">
              Empezar Constructor <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramConstructorModal;
