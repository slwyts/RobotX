'use client';

import React from 'react';
import { Shield, Zap, Layers, Database, Users, Lock, ChevronRight } from 'lucide-react';
import useScrollReveal from '@/app/lib/useScrollReveal';
import type { Translations } from '@/app/lib/translations';

interface FeaturesProps {
  t: Translations;
}

export default function Features({ t }: FeaturesProps) {
  const [ref, visible] = useScrollReveal(0.1);

  const features = [
    { icon: Shield, glow: '#06b6d4', title: t.feat1Title, desc: t.feat1Desc, image: '/assets/images/feat-dpos.png', bg: 'from-[#ecfeff] via-[#f0f9ff] to-white' },
    { icon: Zap,    glow: '#a855f7', title: t.feat2Title, desc: t.feat2Desc, image: '/assets/images/feat-rpc.png', bg: 'from-[#faf5ff] via-[#f5f3ff] to-white' },
    { icon: Layers, glow: '#ec4899', title: t.feat3Title, desc: t.feat3Desc, image: '/assets/images/feat-shadowlink.png', bg: 'from-[#fdf2f8] via-[#fce7f3] to-white' },
    { icon: Database, glow: '#10b981', title: t.feat4Title, desc: t.feat4Desc, image: '/assets/images/feat-token.png', bg: 'from-[#ecfdf5] via-[#f0fdf4] to-white' },
    { icon: Users,  glow: '#f59e0b', title: t.feat5Title, desc: t.feat5Desc, image: '/assets/images/feat-staking.png', bg: 'from-[#fffbeb] via-[#fef3c7] to-white' },
    { icon: Lock,   glow: '#3b82f6', title: t.feat6Title, desc: t.feat6Desc, image: '/assets/images/feat-htlc.png', bg: 'from-[#eff6ff] via-[#dbeafe] to-white' },
  ];

  return (
    <section className="relative px-4 lg:px-10 xl:px-20 py-16 lg:py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{ backgroundImage: 'url(/assets/bg/blockchain-abstract.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
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
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
            {t.featComment}
          </div>
          <h2 className="text-[28px] lg:text-[44px] font-medium text-[#05163D] leading-tight">
            {t.featTitle}
          </h2>
          <div className="mx-auto mt-4 w-16 h-1 rounded-full gradient-border" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group rounded-[20px] bg-gradient-to-b ${f.bg} overflow-hidden transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1.5 border border-transparent hover:border-black/5`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Image */}
              <div className="w-full aspect-[4/3] overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[11px] font-bold text-[#05163D]/40 font-mono border border-white/50 shadow-sm">
                  0{i + 1}
                </div>
                <div
                  className="absolute top-4 right-4 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ background: f.glow }}
                />
              </div>

              {/* Text */}
              <div className="px-6 lg:px-8 pt-5 pb-7">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${f.glow}12`, border: `1px solid ${f.glow}20` }}
                  >
                    {React.createElement(f.icon, { size: 16, style: { color: f.glow } })}
                  </div>
                  <h3 className="text-lg font-semibold text-[#05163D]">{f.title}</h3>
                </div>
                <p className="text-sm text-[#05163D]/60 leading-relaxed mb-4">{f.desc}</p>
                <div
                  className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ color: f.glow }}
                >
                  Learn more <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
