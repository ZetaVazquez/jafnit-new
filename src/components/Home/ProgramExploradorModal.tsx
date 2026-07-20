
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Monitor, Search, Target, Zap, Users, ArrowRight, X } from 'lucide-react';

interface ProgramExploradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuestionnaire: () => void;
}

const ProgramExploradorModal: React.FC<ProgramExploradorModalProps> = ({ isOpen, onClose, onStartQuestionnaire }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[hsl(220,20%,8%)] border-white/10 text-white p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Programa Explorador</DialogTitle>
        <DialogDescription className="sr-only">Detalles del programa Explorador.</DialogDescription>
        {/* Close button */}
        <button onClick={onClose} className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Hero */}
        <div className="relative p-8 md:p-12 border-b border-white/10 bg-gradient-to-br from-[hsla(var(--accent-green)/0.1)] to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[hsla(var(--accent-green)/0.2)] flex items-center justify-center">
              <Search className="w-6 h-6 text-[hsl(var(--accent-green-light))]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Explorador</h2>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-white/90 mb-2">
            El punto de partida cuando sabes que necesitas <span className="text-[hsl(var(--accent-green-light))]">orden</span>.
          </p>
          <p className="text-white/50 text-sm">Si estás leyendo esto es porque algo no termina de encajar.</p>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          {/* Intro */}
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>Puede que entrenes con regularidad y no veas cambios reales en tu <strong className="text-white">composición corporal</strong>. Puede que intentes comer mejor, pero acabes moviendo el compromiso. Puede que no sea lo que haces entre semana, sino lo que ocurre cuando estás cansado, con hambre o sin planificación.</p>
            <p><strong className="text-white">Explorador</strong> no es una solución definitiva.</p>
            <p>Es el <strong className="text-white">primer paso consciente</strong> para entender qué está fallando estructuralmente. No está diseñado para transformar tu cuerpo en una semana. Está diseñado para que identifiques los desajustes que están frenando tu progreso.</p>
          </div>

          {/* What is it */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
              ¿Qué es exactamente Explorador?
            </h3>
            <p className="text-white/70 mb-6">Explorador es una fase inicial de diagnóstico práctico. No trabajamos con teoría superficial. Trabajamos con recursos diseñados para que puedas aplicar estructura desde el primer día y observar cómo responde tu cuerpo cuando dejas de improvisar.</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card-light p-5 rounded-xl">
                <Check className="w-5 h-5 text-[hsl(var(--accent-green-light))] mb-2" />
                <p className="text-sm text-white/80">Recibes entre <strong className="text-white">1 y 4 recursos estratégicos</strong>, seleccionados específicamente para atacar el problema que está limitando tu progreso ahora mismo.</p>
              </div>
              <div className="space-y-3">
                <div className="glass-card-light p-4 rounded-xl flex items-center gap-3">
                  <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                  <span className="text-sm text-white/80">Selecciones con criterio y rentabilidad</span>
                </div>
                <div className="glass-card-light p-4 rounded-xl flex items-center gap-3">
                  <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                  <span className="text-sm text-white/80">Sin compromiso ni artificialidad</span>
                </div>
              </div>
            </div>
          </div>

          {/* How it works + What to expect */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                Cómo funciona
              </h3>
              <p className="text-white/60 text-sm mb-4">Antes de enviarte ningún recurso, realizamos un <strong className="text-white/90">cribado inicial breve</strong>. Analizamos:</p>
              <ul className="space-y-2">
                {['Tu situación actual', 'Tu principal dificultad', 'Tu contexto real', 'Tu objetivo inmediato'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-white/40 mt-4 italic">En función de ese análisis, no recibes contenido al azar.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                Qué puedes esperar en 7 días
              </h3>
              <ul className="space-y-2">
                {[
                  'Entender cómo estructurar tus comidas',
                  'Reducir desorden alimentario',
                  'Organizar tu semana con mayor coherencia',
                  'Detectar tu principal error estructural',
                  'Sentir mayor control sobre tu proceso',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[hsl(var(--accent-green-light))] mt-4 font-medium italic">No es una transformación física radical. Es una transformación en tu forma de organizarte.</p>
            </div>
          </div>

          {/* Investment + For whom */}
          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Inversión</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-[hsl(var(--accent-green-light))]">29€</span>
                <span className="text-white/40 ml-2">· Pago único</span>
              </div>
              <p className="text-sm text-white/50">Sin suscripción. Sin permanencia.<br/>Sin compromiso posterior.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                Para quién es Explorador
              </h3>
              <ul className="space-y-2">
                {[
                  'Sabes que necesitas orden',
                  'Has probado cosas sin estructura',
                  'No quieres comprometerte todavía',
                  'Necesitas orden antes de complejidad',
                  'Quieres probar el sistema con criterio y profundidad',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-6 border-t border-white/10">
            <Button onClick={() => { onClose(); onStartQuestionnaire(); }} className="btn-cta text-base px-10 py-4">
              Empezar Explorador <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-xs text-white/30 mt-3">Si tras aplicar Explorador necesitas mayor profundidad, podrás ascender.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramExploradorModal;
