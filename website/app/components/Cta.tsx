'use client';

import { ArrowSvg } from '@/app/components/Icons';
import useScrollReveal from '@/app/lib/useScrollReveal';
import type { Translations } from '@/app/lib/translations';

interface CtaProps {
  t: Translations;
  onOpenDocs: () => void;
}

export default function Cta({ t, onOpenDocs }: CtaProps) {
  const [ref, visible] = useScrollReveal(0.15);

  return (
    <section
      className="relative py-20 lg:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d2655 0%, #091d45 50%, #0C1624 100%)' }}
    >
      <div className="absolute inset-0 hero-grid opacity-20" />

      {/* Lego cube marquee background */}
      <div className="absolute inset-0 flex items-center overflow-hidden opacity-[0.05] pointer-events-none">
        <div className="flex animate-marquee" style={{ width: 'fit-content' }}>
          {Array.from({ length: 28 }, (_, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src="/assets/images/lego_cube.webp" alt="" className="w-[120px] h-[120px] object-contain mx-4 shrink-0 invert" />
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px] animate-float-1" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] animate-float-2" />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 3 === 0 ? 2 : 1,
              height: i % 3 === 0 ? 2 : 1,
              top: `${(i * 21 + 12) % 80}%`,
              left: `${(i * 31 + 8) % 90}%`,
              opacity: 0,
              animation: `starTwinkle ${3 + (i % 3) * 1}s ease-in-out ${i * 0.6}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        ref={ref}
        className={`relative text-center px-5 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="relative text-[28px] lg:text-[48px] font-medium text-white mb-5 leading-tight text-shadow-hero">
          {t.ctaTitle}
        </h2>
        <p className="relative text-white/40 text-base mb-10 max-w-[500px] mx-auto">
          {t.ctaDesc}
        </p>
        <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onOpenDocs} className="btn-hero-primary shimmer-effect text-base px-10 py-4">
            {t.btnDocs} <ArrowSvg />
          </button>
          <a
            href="https://explorer.robotxhub.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-secondary text-base px-10 py-4"
          >
            {t.btnExplorer} <ArrowSvg />
          </a>
        </div>
      </div>
    </section>
  );
}
