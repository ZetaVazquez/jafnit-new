
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

const results = [
  { image: '/images/result-1.jpg', name: 'Carlos M.', duration: '6 meses' },
  { image: '/images/result-2.jpg', name: 'María L.', duration: '4 meses' },
  { image: '/images/result-3.jpg', name: 'Alejandro R.', duration: '8 meses' },
  { image: '/images/result-4.jpg', name: 'David P.', duration: '5 meses' },
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

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          {/* Navigation buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[hsl(var(--accent-green))]/20 hover:border-[hsl(var(--accent-green))]/50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[hsl(var(--accent-green))]/20 hover:border-[hsl(var(--accent-green))]/50 transition-all"
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

          {/* Info below */}
          <div className="text-center mt-6">
            <p className="text-white font-bold text-lg">{results[current].name}</p>
            <p className="text-[hsl(var(--accent-green-light))] text-sm font-medium">
              Transformación en {results[current].duration}
            </p>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {results.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-[hsl(var(--accent-green))] w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
