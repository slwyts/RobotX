'use client';

import React from 'react';
import { Database, ArrowLeftRight, Users, Zap } from 'lucide-react';
import { ArrowSvg } from '@/app/components/Icons';
import CountUp from '@/app/components/CountUp';
import useScrollReveal from '@/app/lib/useScrollReveal';
import type { Translations } from '@/app/lib/translations';

interface StatsProps {
  t: Translations;
  blockCount: number;
  txCount: number;
  srCount: number;
}

export default function Stats({ t, blockCount, txCount, srCount }: StatsProps) {
  const [ref, visible] = useScrollReveal(0.15);

  const mainStats = [
    { value: blockCount, label: t.statBlocks, color: 'text-cyan-400', hexColor: '#06b6d4', icon: Database },
    { value: txCount,    label: t.statTxns,   color: 'text-cyan-400', hexColor: '#06b6d4', icon: ArrowLeftRight },
    { value: srCount,    label: t.statSR,     color: 'text-purple-400', hexColor: '#a855f7', icon: Users },
  ];

  return (
    <section
      className="relative mx-2 lg:mx-4 rounded-[20px] overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #05163D 0%, #0a1e4a 40%, #0d2655 70%, #05163D 100%)' }}
    >
      {/* Background layers */}
      <div
        className="absolute inset-0 opacity-[0.25] mix-blend-soft-light"
        style={{ backgroundImage: 'url(/assets/bg/stats-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 hero-grid opacity-30" />
      <div className="absolute inset-0 hero-scanlines opacity-50" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[120px] animate-float-1" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[100px] animate-float-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-cyan-500/5 blur-[150px]" />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 3 === 0 ? 2 : 1,
              height: i % 3 === 0 ? 2 : 1,
              top: `${(i * 19 + 8) % 85}%`,
              left: `${(i * 29 + 5) % 92}%`,
              opacity: 0,
              animation: `starTwinkle ${3 + (i % 3) * 1.2}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        ref={ref}
        className={`relative max-w-[1200px] mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Heading */}
        <div className="text-center px-5 pt-16 lg:pt-24 pb-10">
          <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.3em] mb-4 font-mono">NETWORK METRICS</p>
          <h2 className="text-[32px] lg:text-[48px] font-medium text-white leading-tight mb-5 text-shadow-hero">
            {t.statsTitle}
          </h2>
          <p className="text-white/40 text-base leading-relaxed max-w-[600px] mx-auto">{t.statsDesc}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-white/10 pb-8 px-4">
          {mainStats.map((s, i) => (
            <div key={i} className="text-center p-6 group">
              <div
                className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 transition-all duration-500 group-hover:scale-110 border border-white/10 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${s.hexColor}20, transparent)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 25px ${s.hexColor}15`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle, ${s.hexColor}25, transparent 70%)` }}
                />
                {React.createElement(s.icon, { size: 22, className: `relative ${s.color}`, style: { filter: 'drop-shadow(0 0 8px currentColor)' } })}
              </div>
              <p className="text-3xl lg:text-4xl">
                <span className={`${s.color} font-bold animate-number-glow`}>
                  <CountUp target={s.value} active={visible} />
                </span>
              </p>
              <p className="text-white/35 text-sm mt-3 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}

          {/* Block time (static) */}
          <div className="text-center p-6 group">
            <div
              className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 border border-white/10 transition-all duration-500 group-hover:scale-110 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.15), transparent)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 25px rgba(236,72,153,0.12)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%)' }} />
              <Zap size={22} className="relative text-pink-400" style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-pink-400 animate-number-glow">3s</p>
            <p className="text-white/35 text-sm mt-3 uppercase tracking-wider">{t.statTime}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-14 lg:pb-20 pt-4">
          <a
            href="https://explorer.robotxhub.io"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-primary shimmer-effect"
          >
            View Live Data <ArrowSvg />
          </a>
        </div>
      </div>
    </section>
  );
}
