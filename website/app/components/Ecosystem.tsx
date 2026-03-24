'use client';

import React from 'react';
import { TrendingUp, Gamepad2, Cpu, ArrowLeftRight, Link2, Store, ExternalLink } from 'lucide-react';
import { RobotXIcon } from '@/app/components/Icons';
import useScrollReveal from '@/app/lib/useScrollReveal';
import type { Translations } from '@/app/lib/translations';

interface EcosystemProps {
  t: Translations;
}

export default function Ecosystem({ t }: EcosystemProps) {
  const [ref, visible] = useScrollReveal(0.1);

  const ecosystem = [
    { icon: TrendingUp,    glow: '#06b6d4', title: t.eco1Title, desc: t.eco1Desc, link: 'https://finance.robotxhub.ai', image: '/assets/images/scene_3_cube_face.webp' },
    { icon: Gamepad2,      glow: '#a855f7', title: t.eco2Title, desc: t.eco2Desc, link: 'https://gaming.robotxhub.ai', image: '/assets/images/scene_5_cube_face.webp' },
    { icon: Cpu,           glow: '#f472b6', title: t.eco3Title, desc: t.eco3Desc, link: 'https://ai.robotxhub.ai', image: '/assets/images/computer.webp' },
    { icon: ArrowLeftRight, glow: '#34d399', title: t.eco4Title, desc: t.eco4Desc, link: 'https://dex.robotxhub.ai', image: '/assets/images/globe.webp' },
    { icon: Link2,          glow: '#fbbf24', title: t.eco5Title, desc: t.eco5Desc, link: 'https://bridge.robotxhub.ai', image: '/assets/images/tunnel.webp' },
    { icon: Store,          glow: '#60a5fa', title: t.eco6Title, desc: t.eco6Desc, link: 'https://market.robotxhub.ai', image: '/assets/images/hand.webp' },
  ];

  const cardPositions = [
    { top: '2%', left: '5%' },
    { top: '2%', right: '5%' },
    { top: '38%', left: '-2%' },
    { top: '38%', right: '-2%' },
    { bottom: '5%', left: '12%' },
    { bottom: '5%', right: '12%' },
  ];

  const floatAnims = ['animate-card-float-1', 'animate-card-float-2', 'animate-card-float-3'];
  const blobAnims = ['animate-float-1', 'animate-float-2', 'animate-float-3'];

  const hexDecorations = [
    { size: 16, top: '12%', left: '20%', op: 0.15, d: 0 },
    { size: 10, top: '8%', right: '25%', op: 0.1, d: 0.5 },
    { size: 20, top: '55%', left: '8%', op: 0.08, d: 1 },
    { size: 12, top: '65%', right: '12%', op: 0.12, d: 1.5 },
    { size: 8,  top: '30%', left: '45%', op: 0.06, d: 2 },
    { size: 14, top: '80%', left: '40%', op: 0.05, d: 2.5 },
  ];

  return (
    <section className="relative px-4 lg:px-10 xl:px-20 py-16 lg:py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{ backgroundImage: 'url(/assets/bg/mesh-gradient-blue.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div
        ref={ref}
        className={`relative max-w-[1200px] mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Heading */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/8 bg-black/[0.02] text-[10px] font-semibold text-[#05163D]/40 uppercase tracking-[0.25em] mb-4"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
            {t.ecoComment}
          </div>
          <h2 className="text-[28px] lg:text-[44px] font-medium text-[#05163D] leading-tight mb-4">{t.ecoTitle}</h2>
          <p className="text-[#05163D]/60 text-base leading-relaxed max-w-[600px] mx-auto">{t.ecoDesc}</p>
        </div>

        {/* Hexagon float layout */}
        <div className="relative mx-auto" style={{ height: 'clamp(420px, 60vw, 650px)', maxWidth: '900px' }}>
          {/* Center hex */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full animate-pulse-ring pointer-events-none" style={{ border: '2px solid rgba(16,225,255,0.3)' }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full animate-pulse-ring pointer-events-none" style={{ border: '1px solid rgba(16,225,255,0.15)', animationDelay: '1.5s' }} />
            <div
              className="relative animate-hex-pulse"
              style={{ filter: 'drop-shadow(0 0 40px rgba(6,182,212,0.35)) drop-shadow(0 20px 60px rgba(5,22,61,0.3))' }}
            >
              <RobotXIcon size={400} darkBg />
            </div>
          </div>

          {/* Decorative hexagons */}
          {hexDecorations.map((h, i) => (
            <div
              key={i}
              className={`absolute hexagon ${blobAnims[i % 3]}`}
              style={{
                width: h.size,
                height: h.size,
                background: '#06b6d4',
                opacity: h.op,
                top: h.top,
                left: ('left' in h ? h.left : undefined),
                right: ('right' in h ? (h as { right?: string }).right : undefined),
                animationDelay: `${h.d}s`,
                animationDuration: `${12 + i * 3}s`,
              }}
            />
          ))}

          {/* Ecosystem cards */}
          {ecosystem.map((e, i) => (
            <a
              key={i}
              href={e.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute w-[140px] lg:w-[180px] transition-all duration-700 group ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              style={{ ...cardPositions[i], transitionDelay: `${300 + i * 120}ms` }}
            >
              <div
                className={`relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 overflow-hidden hover:shadow-card-hover hover:border-cyan-200/50 hover:bg-white/90 transition-all duration-300 ${floatAnims[i % 3]}`}
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                {/* Card bg image */}
                <div className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="relative p-4">
                  <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${e.glow}20, ${e.glow}08)`,
                      border: `1px solid ${e.glow}25`,
                      boxShadow: `0 0 0 1px ${e.glow}08, inset 0 1px 0 rgba(255,255,255,0.15)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle, ${e.glow}30, transparent 70%)` }}
                    />
                    {React.createElement(e.icon, {
                      size: 20,
                      className: 'relative',
                      style: { color: e.glow, filter: `drop-shadow(0 0 6px ${e.glow})` },
                    })}
                  </div>
                  <div className="font-semibold text-sm text-[#05163D] mb-1">{e.title}</div>
                  <div className="text-[11px] text-[#05163D]/50 leading-snug line-clamp-2">{e.desc}</div>
                  <div
                    className="mt-2 flex items-center gap-0.5 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-all"
                    style={{ color: e.glow }}
                  >
                    Visit <ExternalLink size={10} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
