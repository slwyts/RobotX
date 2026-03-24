'use client';

import { Play, Terminal } from 'lucide-react';
import { MetaMaskIcon, ArrowSvg } from '@/app/components/Icons';
import CountUp from '@/app/components/CountUp';
import type { Translations } from '@/app/lib/translations';
import { addToMetaMask } from '@/app/lib/rpc';

interface HeroProps {
  t: Translations;
  blockCount: number;
  txCount: number;
  srCount: number;
  isLive: boolean;
  onOpenDocs: () => void;
}

export default function Hero({ t, blockCount, txCount, srCount, isLive, onOpenDocs }: HeroProps) {
  const stats = [
    { value: blockCount, label: t.statBlocks, color: 'text-cyan-300' },
    { value: txCount, label: t.statTxns, color: 'text-cyan-300' },
    { value: srCount, label: t.statSR, color: 'text-purple-300', isStatic: true },
    { label: t.statTime, color: 'text-pink-300', staticVal: '3s' },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 130% 120% at 50% 55%, #2856cc 0%, #1c44b5 30%, #102e8a 55%, #081f5e 80%, #05163D 100%)',
      }}
    >
      {/* Grid + scanlines */}
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute inset-0 hero-scanlines" />

      {/* Xerox scan texture */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-screen"
        style={{ backgroundImage: 'url(/assets/images/xerox_scan.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[120px] animate-float-1" style={{ background: '#06b6d4', top: '-5%', left: '15%' }} />
        <div className="absolute w-[350px] h-[350px] rounded-full opacity-10 blur-[100px] animate-float-2" style={{ background: '#a855f7', top: '40%', right: '5%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.08] blur-[80px] animate-float-3" style={{ background: '#ec4899', bottom: '5%', left: '50%' }} />
      </div>

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1,
              height: i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1,
              top: `${(i * 17 + 5) % 90}%`,
              left: `${(i * 23 + 10) % 95}%`,
              opacity: 0,
              animation: `starTwinkle ${2.5 + (i % 4) * 0.7}s ease-in-out ${i * 0.4}s infinite`,
            }}
          />
        ))}
      </div>

      {/* SVG diagonal stripes */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 1401 760" fill="none" overflow="visible">
          {[
            { delay: '0s', d: 'M1127.83 -899.985L1078.63 -1016.77L540.815 553.942L-681.57 31.322L-637.264 135.165L539.676 568.559L1127.83 -899.964V-899.985Z' },
            { delay: '0.1s', d: 'M538.536 584.339L-592.514 239.917L-547.956 344.31L537.029 604.033L1224.65 -670.364L1176.75 -784.043L538.536 584.339Z' },
            { delay: '0.2s', d: 'M-503.438 448.637L-456.543 558.509L534.036 642.615L1314.82 -456.291L1273.76 -553.746L535.774 619.812C302.866 581.249 -503.438 448.637 -503.438 448.637Z' },
            { delay: '0.3s', d: 'M1371.67 -321.311L532.323 664.678L-416.673 652.579L-370.841 760.144L530.507 688.053L1419.94 -206.764L1371.67 -321.311Z' },
            { delay: '0.4s', d: 'M1468.35 -91.8551L528.823 710.161L-326.809 862.594L-282.464 966.5L526.331 742.335L1519.03 28.4238L1468.33 -91.8975L1468.35 -91.8551Z' },
            { delay: '0.5s', d: 'M-237.269 1069.94C-225.873 1097.33 -193.464 1171.84 -193.464 1171.84L521.058 811.211L1615.2 256.67L1566.43 141.087L524.033 772.542L-237.211 1069.92L-237.269 1069.96V1069.94Z' },
            { delay: '0.6s', d: 'M1712.48 487.52C1701.49 461.121 1664.62 372.487 1664.62 372.487L518.122 849.416L-149.661 1278.47L-105.49 1380.94L514.471 897.222L1712.58 487.541L1712.5 487.478L1712.48 487.52Z' },
          ].map((p, i) => (
            <path key={i} className="hero-path" style={{ animationDelay: p.delay }} d={p.d} fill="#05163D" />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
        <div className="flex-[1] min-h-[120px] md:min-h-[70px]" />

        {/* Badge */}
        <div
          className="hero-fade-in inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-2xl md:rounded-full border border-cyan-400/30 bg-cyan-400/10 backdrop-blur-sm text-cyan-300 text-[10px] md:text-xs font-mono mb-4 md:mb-8 max-w-[90vw] text-center flex-wrap justify-center"
          style={{ animationDelay: '0.2s' }}
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`} />
          {t.heroBadge}
        </div>

        {/* Title */}
        <div className="hero-fade-in relative mb-3" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[200px] bg-cyan-500/10 blur-[80px] rounded-full" />
          </div>
          <h1>
            <span
              className="relative block text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 text-shadow-hero"
              style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.08em' }}
            >
              ROBOTX
            </span>
          </h1>
        </div>

        <p
          className="hero-fade-in text-2xl md:text-3xl lg:text-4xl font-extralight tracking-[0.15em] text-white/80 mb-6"
          style={{ animationDelay: '0.4s', fontFamily: "'Inter', sans-serif" }}
        >
          {t.heroSubtitle}
        </p>

        <p
          className="hero-fade-in text-white/60 text-[13px] md:text-[15px] leading-relaxed max-w-[480px] mb-6 md:mb-10"
          style={{ animationDelay: '0.5s' }}
        >
          {t.heroDesc}
        </p>

        {/* CTA Buttons */}
        <div className="hero-fade-in flex flex-col sm:flex-row gap-3 mb-8 md:mb-16" style={{ animationDelay: '0.7s' }}>
          <a href="#demo" className="btn-hero-primary shimmer-effect">
            <Play size={18} />
            {t.btnDemo}
          </a>
          <button onClick={onOpenDocs} className="btn-hero-secondary">
            <Terminal size={18} />
            {t.btnDocs}
          </button>
          <button
            onClick={addToMetaMask}
            className="btn-hero-secondary !border-orange-400/40 !text-orange-300 hover:!bg-orange-400 hover:!text-white hover:!border-transparent"
          >
            <MetaMaskIcon size={18} />
            {t.btnMetamask}
          </button>
        </div>

        {/* Stats */}
        <div className="hero-fade-in grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl w-full" style={{ animationDelay: '0.9s' }}>
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className={`font-mono text-2xl md:text-3xl font-black ${s.color} tabular-nums animate-number-glow`}>
                {s.staticVal ?? (
                  s.isStatic ? s.value : <CountUp target={s.value ?? 0} active={true} />
                )}
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex-[0.8] md:flex-[1.5]" />
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full block" preserveAspectRatio="none">
          <path d="M0,50 C240,75 480,20 720,50 C960,80 1200,25 1440,50 L1440,80 L0,80 Z" fill="white" opacity="0.5" />
          <path d="M0,60 C360,80 720,30 1080,60 C1260,72 1380,45 1440,60 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
