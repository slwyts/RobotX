'use client';

import { Send, Globe } from 'lucide-react';
import { RobotXIcon, MetaMaskIcon } from '@/app/components/Icons';
import CopyBtn from '@/app/components/CopyBtn';
import { addToMetaMask } from '@/app/lib/rpc';
import type { Translations } from '@/app/lib/translations';

interface FooterProps {
  t: Translations;
}

const DONATION_ADDRESS = 'RXn8Kj2vQm4pYz';

// Inline SVG fallbacks for deprecated lucide icons
const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.633 5.903-5.633Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
  </svg>
);

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z"/>
  </svg>
);

export default function Footer({ t }: FooterProps) {
  const columns = [
    { title: t.footProtocol,  items: [t.footWhitepaper, t.footConsensus, t.footToken, t.footGov] },
    { title: t.footDev,       items: [t.footRpc, t.footExplorer, t.footGithub, t.footSdk] },
    { title: t.footCommunity, items: [t.footTwitter, t.footTelegram, t.footDiscord, t.footBlog] },
    { title: t.footTools,     items: [t.footGasTracker, t.footFaucet, t.footVerify, t.footConverter] },
  ];

  const SocialButtons = [TwitterIcon, GithubIcon, Send, Globe];

  return (
    <footer className="relative bg-[#0C1624] text-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Watermark */}
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden"
        style={{ opacity: 0.03 }}
      >
        <span
          className="text-[180px] lg:text-[280px] font-black tracking-wider whitespace-nowrap"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          ROBOTX
        </span>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10 xl:px-20 pt-12 lg:pt-16">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* Brand column */}
          <div className="mb-10 lg:mb-0">
            <div className="flex items-center gap-2.5 mb-6">
              <RobotXIcon size={76} darkBg />
              <span className="text-lg font-black tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <span className="text-cyan-400">ROBOT</span>
                <span className="text-white">X</span>
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed mb-5">{t.footDesc}</p>
            <button
              onClick={addToMetaMask}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white/50 hover:border-orange-400/30 hover:text-orange-300 transition-all mb-5 group"
            >
              <MetaMaskIcon size={16} />
              <span className="group-hover:translate-x-0.5 transition-transform">{t.btnMetamask}</span>
            </button>
            <div className="flex gap-3">
              {SocialButtons.map((Icon, i) => (
                <div
                  key={i}
                  className="relative bg-white/[0.04] p-3 rounded-xl text-white/40 cursor-pointer border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-500 hover:scale-110 hover:bg-cyan-500/10 overflow-hidden group/s"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover/s:opacity-100 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)' }}
                  />
                  <Icon size={16} className="relative" />
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-white/60 hover:text-white cursor-pointer transition-all hover:translate-x-1 uppercase tracking-wide"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 py-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 font-mono">
          <span>ROBOTX © 2077 | ChainID 0x524F58</span>
          <span className="mt-2 md:mt-0 flex items-center gap-2">
            {t.footDonations}
            <span className="text-cyan-400/60 bg-white/5 px-2 py-0.5 rounded">RXn8Kj2v...Qm4pYz</span>
            <CopyBtn text={DONATION_ADDRESS} t={t} />
          </span>
        </div>
      </div>
    </footer>
  );
}
