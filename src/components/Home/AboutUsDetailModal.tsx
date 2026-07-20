
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Search, Hammer, BarChart3, RefreshCw, Check, XCircle, Heart, Users, Sparkles, Shield, Target } from 'lucide-react';

interface AboutUsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuestionnaire: () => void;
}

const AboutUsDetailModal: React.FC<AboutUsDetailModalProps> = ({ isOpen, onClose, onStartQuestionnaire }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[hsl(220,20%,8%)] border-white/10 text-white p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Sobre Nosotros</DialogTitle>
        <DialogDescription className="sr-only">Información detallada sobre el método JAFN.</DialogDescription>
        <button onClick={onClose} className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Hero */}
        <div className="relative p-8 md:p-12 border-b border-white/10 bg-gradient-to-br from-[hsla(var(--accent-green)/0.1)] to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[hsla(var(--accent-green)/0.2)] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[hsl(var(--accent-green-light))]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Sobre Mí</h2>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-white/90">
            Organización, criterio y <span className="text-[hsl(var(--accent-green-light))]">estructura aplicada</span>
          </p>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          {/* Intro */}
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p className="text-lg">Entrenar mejor y alimentarse mejor no es una cuestión de motivación.</p>
            <p className="text-lg text-[hsl(var(--accent-green-light))] font-medium">Es una cuestión de <strong>estructura, planificación y criterio profesional</strong>.</p>
            <p>Soy <strong className="text-white">José Antonio</strong>, dietista y entrenador. Trabajo con personas que buscan resultados medibles y sostenibles, no cambios rápidos que desaparecen en pocas semanas.</p>
            <div className="glass-card-light p-5 rounded-xl border-l-4 border-[hsl(var(--accent-green))]">
              <p className="text-white/80">A lo largo de mi experiencia he comprobado algo constante:</p>
              <p className="text-white font-semibold mt-2">La mayoría no fracasa por falta de esfuerzo. Fracasa por falta de sistema.</p>
            </div>
            <p>Se esfuerzan, entrenan e intentan mejorar su alimentación. Pero sin una estructura que organice el proceso, los resultados no se mantienen.</p>
          </div>

          {/* My approach */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
              Mi enfoque profesional
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card-light p-5 rounded-xl">
                <h4 className="font-bold text-red-400 text-sm mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> No trabajo con:
                </h4>
                <ul className="space-y-2">
                  {['Dietas genéricas', 'Rutinas copiadas', 'Promesas irreales', 'Cambios extremos en plazos absurdos'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                      <XCircle className="w-3.5 h-3.5 text-red-400/60 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card-light p-5 rounded-xl">
                <h4 className="font-bold text-[hsl(var(--accent-green-light))] text-sm mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Trabajo con:
                </h4>
                <ul className="space-y-2">
                  {['Planificación estructurada', 'Progresión lógica', 'Seguimiento real', 'Ajustes basados en datos', 'Adaptación al contexto individual'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                      <Check className="w-3.5 h-3.5 text-[hsl(var(--accent-green-light))] flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Program design considerations */}
          <div>
            <p className="text-white/70 mb-4">Cada programa se diseña considerando:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: '💼', text: 'Tu entorno profesional' },
                { icon: '⏰', text: 'Tu disponibilidad real' },
                { icon: '📊', text: 'Tu nivel de experiencia' },
                { icon: '🎯', text: 'Tu capacidad de adherencia' },
                { icon: '🏆', text: 'Tu objetivo específico' },
              ].map((item, i) => (
                <div key={i} className="glass-card-light p-4 rounded-xl text-center">
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <p className="text-xs text-white/70">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[hsl(var(--accent-green-light))] mt-4 font-medium italic text-center">
              Porque un buen sistema no es el más complejo — es el que puedes sostener.
            </p>
          </div>

          {/* 4 pillars */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
              Cómo trabajo
            </h3>
            <p className="text-white/60 text-sm mb-6">Mi método se basa en cuatro pilares:</p>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { icon: Search, num: '1', title: 'Diagnóstico real', desc: 'Antes de planificar, analizamos tu punto de partida.' },
                { icon: Hammer, num: '2', title: 'Construcción estructurada', desc: 'Diseñamos nutrición y entrenamiento con coherencia interna.' },
                { icon: BarChart3, num: '3', title: 'Seguimiento estratégico', desc: 'Medimos, analizamos y ajustamos.' },
                { icon: RefreshCw, num: '4', title: 'Consolidación', desc: 'Convertimos el proceso en sistema.' },
              ].map((pillar, i) => (
                <div key={i} className="glass-card-light p-5 rounded-xl text-center hover:scale-[1.02] transition-transform">
                  <div className="w-10 h-10 rounded-full bg-[hsla(var(--accent-green)/0.2)] flex items-center justify-center mx-auto mb-3">
                    <pillar.icon className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                  </div>
                  <span className="text-xs font-bold text-[hsl(var(--accent-green-light))]">Pilar {pillar.num}</span>
                  <h4 className="font-bold text-white text-sm mt-1 mb-2">{pillar.title}</h4>
                  <p className="text-xs text-white/50">{pillar.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-white/60 mt-6 font-medium">No vendo intensidad — <span className="text-[hsl(var(--accent-green-light))]">construyo estructura</span>.</p>
          </div>

          {/* What to expect */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
              Qué puedes esperar trabajando conmigo
            </h3>
            <p className="text-sm text-white/60 mb-4">Si decides empezar un proceso dentro de metodojafn.com, puedes esperar:</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Claridad en cada decisión',
                'Planificación adaptada a tu realidad',
                'Seguimiento profesional serio',
                'Ajustes con fundamento técnico',
                'Un proceso organizado y coherente',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 glass-card-light p-3 rounded-lg">
                  <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-white/50 mt-4 italic">No trabajo con fórmulas mágicas sino con método.</p>
          </div>

          {/* Target audience */}
          <div className="glass-card-light p-6 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
              A quién va dirigido mi trabajo
            </h3>
            <p className="text-sm text-white/60 mb-4">Este sistema es para personas que:</p>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                'Quieren hacerlo bien',
                'Valoran la planificación profesional',
                'Buscan resultados sostenibles',
                'Están dispuestas a comprometerse con estructura',
                'No quieren seguir improvisando',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="w-4 h-4 text-[hsl(var(--accent-green-light))] flex-shrink-0" />{item}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-4 italic">No es para quien busca soluciones rápidas sin implicación.</p>
          </div>

          {/* CTA */}
          <div className="text-center pt-6 border-t border-white/10">
            <Button onClick={() => { onClose(); onStartQuestionnaire(); }} className="btn-cta text-base px-10 py-4">
              Solicitar Evaluación Inicial
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutUsDetailModal;
