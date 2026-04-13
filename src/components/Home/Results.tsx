
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Target, Users, Calendar, Award, Flame, Dumbbell } from 'lucide-react';

const results = [
  { image: '/images/results/ana.jpg', name: 'Ana', duration: '5 meses', kg: '-7 kg', goal: 'Definición' },
  { image: '/images/results/rocio.jpg', name: 'Rocío', duration: '6 meses', kg: '-18 kg', goal: 'Pérdida de grasa' },
  { image: '/images/results/xoel.jpg', name: 'Xoel', duration: '4 meses', kg: '+5 kg músculo', goal: 'Recomposición' },
  { image: '/images/results/almu.jpg', name: 'Almu', duration: '5 meses', kg: '-9 kg', goal: 'Pérdida de grasa' },
  { image: '/images/results/sonia.jpg', name: 'Sonia', duration: '4 meses', kg: '-6 kg', goal: 'Definición' },
  { image: '/images/results/javi.jpg', name: 'Javi', duration: '8 meses', kg: '+8 kg músculo', goal: 'Volumen limpio' },
  { image: '/images/results/sonia2.jpg', name: 'Sonia M.', duration: '6 meses', kg: '-10 kg', goal: 'Recomposición' },
  { image: '/images/results/edu.jpg', name: 'Edu', duration: '5 meses', kg: '+4 kg músculo', goal: 'Definición' },
  { image: '/images/results/alicia.jpg', name: 'Alicia', duration: '7 meses', kg: '-12 kg', goal: 'Pérdida de grasa' },
  { image: '/images/results/sonia3.jpg', name: 'Sonia R.', duration: '4 meses', kg: '-5 kg', goal: 'Recomposición' },
];

const stats = [
  { icon: Users, value: '+50', label: 'Clientes transformados' },
  { icon: Target, value: '95%', label: 'Alcanzan su objetivo' },
  { icon: Calendar, value: '4-8', label: 'Meses de media' },
  { icon: Award, value: '100%', label: 'Planes personalizados' },
];

const Results: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + results.length) % results.length);
  const next = () => setCurrent((c) => (c + 1) % results.length);

  return (
    <section id="resultados" className="dark-section py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <TrendingUp className="w-4 h-4 text-[hsl(var(--accent-green))]" />
            <span className="text-white/70 text-sm font-medium">Transformaciones reales</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Resultados con <span className="heading-accent">JAFN</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Estos son algunos de los cambios logrados con planificación, estructura y constancia.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative group text-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[hsl(var(--accent-green))]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[hsl(var(--accent-green))]/10 flex items-center justify-center group-hover:bg-[hsl(var(--accent-green))]/20 transition-colors">
                <stat.icon className="w-6 h-6 text-[hsl(var(--accent-green))]" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/50 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Carousel + Details */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
          {/* Carousel */}
          <div className="relative">
            {/* Navigation buttons */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-10 w-11 h-11 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[hsl(var(--accent-green))]/20 hover:border-[hsl(var(--accent-green))]/50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-10 w-11 h-11 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[hsl(var(--accent-green))]/20 hover:border-[hsl(var(--accent-green))]/50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image with green frame */}
            <div className="rounded-2xl overflow-hidden border-2 border-[hsl(var(--accent-green))] shadow-[0_0_30px_hsla(142,71%,45%,0.15)]">
              <img
                src={results[current].image}
                alt={`Transformación de ${results[current].name}`}
                className="w-full h-auto object-cover"
                loading="lazy"
                width={1024}
                height={640}
              />
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {results.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-[hsl(var(--accent-green))] w-8' : 'bg-white/30 hover:bg-white/50 w-2.5'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Detail Card */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--accent-green))]/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-[hsl(var(--accent-green))]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">{results[current].name}</p>
                <p className="text-white/40 text-sm">Cliente JAFN</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/50 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Duración
                </span>
                <span className="text-white font-semibold text-sm">{results[current].duration}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/50 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Cambio
                </span>
                <span className="text-[hsl(var(--accent-green))] font-semibold text-sm">{results[current].kg}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/50 text-sm flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" /> Objetivo
                </span>
                <span className="text-white font-semibold text-sm">{results[current].goal}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5">
              <p className="text-white/40 text-xs italic text-center">
                "Resultados reales con método, constancia y planificación profesional."
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-[hsl(var(--accent-green))]/10 to-transparent border border-[hsl(var(--accent-green))]/20 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              ¿Quieres ser el próximo?
            </h3>
            <p className="text-white/50 text-sm md:text-base">
              Empieza tu transformación con un plan diseñado 100% para ti. Sin fórmulas mágicas, solo método y compromiso.
            </p>
          </div>
          <a
            href="#programas"
            className="shrink-0 px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{ backgroundColor: 'hsl(142, 71%, 35%)' }}
          >
            Ver programas
          </a>
        </div>
      </div>
    </section>
  );
};

export default Results;
