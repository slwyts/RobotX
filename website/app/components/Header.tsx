'use client';

import { Globe, ChevronRight, ExternalLink } from 'lucide-react';
import { RobotXIcon, MetaMaskIcon } from '@/app/components/Icons';
import type { Translations } from '@/app/lib/translations';
import type { Lang } from '@/app/lib/translations';
import { addToMetaMask } from '@/app/lib/rpc';

interface NavItem {
  key: string;
  label: string;
  href: string;
}

interface HeaderProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  scrolled: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  t: Translations;
  onOpenDocs: () => void;
}

export default function Header({ lang, setLang, scrolled, menuOpen, setMenuOpen, t, onOpenDocs }: HeaderProps) {
  const isWhite = scrolled || menuOpen;

  const navItems: NavItem[] = [
    { key: 'home', label: t.navHome, href: '#home' },
    { key: 'demo', label: t.navDemo, href: '#demo' },
    { key: 'docs', label: t.navDocs, href: '#docs' },
    { key: 'api', label: t.navApi, href: '#api' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          isWhite ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5' : ''
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 lg:px-10 py-3">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-0 group">
            <RobotXIcon size={56} className="-mr-2 rounded-full" darkBg={!isWhite} />
            <span className="text-lg font-black tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              <span className={`${isWhite ? 'text-cyan-600' : 'text-cyan-400'} transition-colors`}>ROBOT</span>
              <span className={`${isWhite ? 'text-[#05163D]' : 'text-white'} transition-colors`}>X</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((n) => (
              <a
                key={n.key}
                href={n.href}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold uppercase tracking-wider transition-colors ${
                  isWhite ? 'text-[#05163D]/70 hover:text-cyan-600' : 'text-white/80 hover:text-cyan-300'
                }`}
              >
                {n.label}
              </a>
            ))}
            <span className={`mx-2 ${isWhite ? 'text-black/10' : 'text-white/20'}`}>|</span>
            <a
              href="https://explorer.robotxhub.ai"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-full text-[13px] font-semibold uppercase tracking-wider transition-colors ${
                isWhite ? 'text-[#05163D]/70 hover:text-cyan-600' : 'text-white/80 hover:text-cyan-300'
              }`}
            >
              {t.navExplorer}
            </a>
            <a
              href="https://dex.robotxhub.ai"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-full text-[13px] font-semibold uppercase tracking-wider transition-colors ${
                isWhite ? 'text-[#05163D]/70 hover:text-cyan-600' : 'text-white/80 hover:text-cyan-300'
              }`}
            >
              {t.navDex}
            </a>
            <button
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className={`ml-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isWhite
                  ? 'border-black/10 text-[#05163D]/60 hover:border-cyan-400 hover:text-cyan-600'
                  : 'border-white/20 text-white/60 hover:border-cyan-400 hover:text-cyan-300'
              }`}
            >
              <Globe size={12} className="inline mr-1" />
              {lang === 'en' ? '中文' : 'EN'}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`block w-6 h-[2px] transition-all duration-300 ${isWhite ? 'bg-[#05163D]' : 'bg-white'} ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-[2px] my-[5px] transition-all duration-300 ${isWhite ? 'bg-[#05163D]' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] transition-all duration-300 ${isWhite ? 'bg-[#05163D]' : 'bg-white'} ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        )}
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[56px] bg-white z-[80] overflow-y-auto">
          <nav className="flex flex-col px-5 py-6 gap-1">
            <p className="text-[10px] text-[#05163D]/30 uppercase tracking-[0.2em] font-mono mb-2 px-1">
              {t.featComment}
            </p>
            {navItems.map((n) => (
              <a
                key={n.key}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="py-3.5 text-lg font-medium text-[#05163D] border-b border-black/5 flex items-center justify-between"
              >
                {n.label}
                <ChevronRight size={16} className="text-[#05163D]/20" />
              </a>
            ))}
            <button
              onClick={() => { onOpenDocs(); setMenuOpen(false); }}
              className="py-3.5 text-lg font-medium text-[#05163D] border-b border-black/5 text-left flex items-center justify-between w-full"
            >
              {t.navWhitepaper}
              <ChevronRight size={16} className="text-[#05163D]/20" />
            </button>
            <p className="text-[10px] text-[#05163D]/30 uppercase tracking-[0.2em] font-mono mt-6 mb-2 px-1">
              {t.ecoComment}
            </p>
            <a
              href="https://explorer.robotxhub.ai"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="py-3.5 text-lg font-medium text-[#05163D] border-b border-black/5 flex items-center justify-between"
            >
              {t.navExplorer}
              <ExternalLink size={14} className="text-[#05163D]/20" />
            </a>
            <a
              href="https://dex.robotxhub.ai"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="py-3.5 text-lg font-medium text-[#05163D] border-b border-black/5 flex items-center justify-between"
            >
              {t.navDex}
              <ExternalLink size={14} className="text-[#05163D]/20" />
            </a>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => { addToMetaMask(); setMenuOpen(false); }}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <MetaMaskIcon size={18} />
                {t.btnMetamask}
              </button>
              <button
                onClick={() => { setLang(lang === 'en' ? 'zh' : 'en'); setMenuOpen(false); }}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Globe size={16} />
                {lang === 'en' ? '切换中文' : 'Switch to English'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
