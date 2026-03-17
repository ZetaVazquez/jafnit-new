
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Crown, Search, Hammer, Sparkles, RefreshCw, ArrowRight, X, Users } from 'lucide-react';

interface ProgramEstrategaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuestionnaire: () => void;
}

const ProgramEstrategaModal: React.FC<ProgramEstrategaModalProps> = ({ isOpen, onClose, onStartQuestionnaire }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[hsl(220,20%,8%)] border-white/10 text-white p-0 [&>button]:hidden">
        <button onClick={onClose} className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Hero */}
        <div className="relative p-8 md:p-12 border-b border-white/10 bg-gradient-to-br from-[hsla(var(--accent-green)/0.12)] to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[hsla(var(--accent-green)/0.2)] flex items-center justify-center">
              <Crown className="w-6 h-6 text-[hsl(var(--accent-green-light))]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Estratega</h2>
          </div>
          <p className="text-lg font-semibold text-[hsl(var(--accent-green-light))] mb-1">Método Estructura 90™</p>
          <p className="text-xl md:text-2xl font-semibold text-white/90 mb-2">
            Un sistema estructurado de <span className="text-[hsl(var(--accent-green-light))]">90 días</span>
          </p>
          <p className="text-white/50 text-sm">Los cambios sostenibles no se construyen en dos semanas.</p>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          {/* Intro */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3 text-white/70 leading-relaxed">
              <p>Noventa días permiten:</p>
              <ul className="space-y-2">
                {[
                  'Crear adherencia real',
                  'Corregir errores estratégicos',
                  'Ajustar sin improvisar',
                  'Consolidar hábitos medibles',
                  'Optimizar composición corporal con criterio',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                    <span><strong className="text-white">{item.split(' ')[0]}</strong> {item.split(' ').slice(1).join(' ')}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card-light p-6 rounded-xl flex flex-col justify-center">
              <p className="text-sm text-white/70 leading-relaxed">Este método <strong className="text-white">no es intensidad puntual</strong>.</p>
              <p className="text-sm text-[hsl(var(--accent-green-light))] font-medium mt-2">Es estructura aplicada con seguimiento continuo.</p>
            </div>
          </div>

          {/* 4 Phases */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Cómo funciona el proceso</h3>
            <p className="text-sm text-white/50 mb-6">El Método Estructura 90™ está organizado en 4 fases claras. Cada fase tiene un propósito técnico.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: Search, phase: 'Fase 1', title: 'Diagnóstico estratégico',
                  items: ['Composición corporal y hábitos', 'Historial previo', 'Capacidad de adherencia', 'Contexto profesional'],
                  note: 'No empezamos sin entender tu situación real.',
                },
                {
                  icon: Hammer, phase: 'Fase 2', title: 'Construcción de estructura personalizada',
                  items: ['Plan nutricional adaptable', 'Entrenamiento por fases', 'Registro y organización semanal'],
                  note: 'Planificación ajustada a tu contexto real.',
                },
                {
                  icon: RefreshCw, phase: 'Fase 4', title: 'Optimización y consolidación',
                  items: ['Consolidar hábitos sostenibles', 'Optimizar resultados', 'Estabilizar estructura y evitar retrocesos'],
                  note: 'Ajustes según datos, no impulsos.',
                },
              ].map((phase, i) => (
                <div key={i} className="glass-card-light p-5 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <phase.icon className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--accent-green-light))]">{phase.phase}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-3">{phase.title}</h4>
                  <ul className="space-y-1.5 mb-3">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-white/60">
                        <Check className="w-3 h-3 text-[hsl(var(--accent-green-light))] mt-0.5 flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-white/40 italic">{phase.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What includes */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
              Qué incluye exactamente
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Evaluación estratégica completa',
                'Plan nutricional estructurado y ajustable',
                'Entrenamiento planificado por fases',
                'Panel privado personalizado',
                'Revisiones periódicas',
                'Ajustes semanales estratégicos',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 glass-card-light p-3 rounded-lg">
                  <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-4 italic">No es para quien busca soluciones rápidas sin estructura.</p>
          </div>

          {/* Investment + For whom */}
          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Inversión</h3>
              <div className="mb-2">
                <span className="text-sm text-white/40">Desde</span>
                <span className="text-4xl font-bold text-[hsl(var(--accent-green-light))] ml-2">297€</span>
                <span className="text-white/40 ml-2">(3 meses)</span>
              </div>
              <p className="text-sm text-white/50">Versión completa nutrición + entrenamiento.</p>
              <p className="text-xs text-white/30 mt-1">Plazas limitadas para mantener calidad de seguimiento.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                Para quién es este método
              </h3>
              <ul className="space-y-2">
                {[
                  'Quieren resultados sostenibles',
                  'Están dispuestas a comprometerse',
                  'Buscan acompañamiento serio',
                  'Valoran planificación profesional',
                  'No quieren seguir improvisando',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-white/40 mt-3 italic">No se trata de quien busca soluciones rápidas sin estructura.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-6 border-t border-white/10">
            <Button onClick={() => { onClose(); onStartQuestionnaire(); }} className="btn-cta text-base px-10 py-4">
              Solicitar Evaluación Inicial <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramEstrategaModal;
