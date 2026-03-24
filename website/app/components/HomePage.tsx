'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/app/components/Header';
import Hero from '@/app/components/Hero';
import Features from '@/app/components/Features';
import Ecosystem from '@/app/components/Ecosystem';
import Stats from '@/app/components/Stats';
import HTLCDemo from '@/app/components/HTLCDemo';
import Docs from '@/app/components/Docs';
import RpcApi from '@/app/components/RpcApi';
import Cta from '@/app/components/Cta';
import Footer from '@/app/components/Footer';
import DocsDrawer from '@/app/components/DocsDrawer';
import CookieBanner from '@/app/components/CookieBanner';
import { translations } from '@/app/lib/translations';
import { rpcCall } from '@/app/lib/rpc';
import type { Lang } from '@/app/lib/translations';

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('en');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [showCookie, setShowCookie] = useState(true);

  const t = translations[lang];

  // Scroll restore
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Chain data
  const [blockCount, setBlockCount] = useState(0);
  const [txCount, setTxCount]       = useState(0);
  const [srCount]                   = useState(27);
  const [isLive, setIsLive]         = useState(false);

  const fetchChainData = useCallback(async () => {
    const info = await rpcCall('robotx_getChainInfo') as {
      blockHeight?: number;
      totalTransactions?: number;
    } | null;

    if (info) {
      setBlockCount(info.blockHeight ?? 0);
      setTxCount((prev) => {
        const v = info.totalTransactions ?? (info.blockHeight ? info.blockHeight * 2 : prev);
        return v > prev ? v : prev;
      });
      setIsLive(true);
    } else {
      setBlockCount((p) => (p || 15482910) + Math.floor(Math.random() * 3) + 1);
      setTxCount((p)   => (p || 2383920)  + Math.floor(Math.random() * 50) + 10);
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    fetchChainData();
    const iv = setInterval(fetchChainData, 3000);
    return () => clearInterval(iv);
  }, [fetchChainData]);

  return (
    <div className="min-h-screen bg-white bg-lines">
      <Header
        lang={lang}
        setLang={setLang}
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        t={t}
        onOpenDocs={() => setDocsOpen(true)}
      />

      <Hero
        t={t}
        blockCount={blockCount}
        txCount={txCount}
        srCount={srCount}
        isLive={isLive}
        onOpenDocs={() => setDocsOpen(true)}
      />

      <Features t={t} />

      <div className="max-w-[800px] mx-auto px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-[#05163D]/10 to-transparent" />
      </div>

      <Ecosystem t={t} />

      <Stats t={t} blockCount={blockCount} txCount={txCount} srCount={srCount} />

      <div className="max-w-[800px] mx-auto px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-[#05163D]/10 to-transparent" />
      </div>

      <HTLCDemo t={t} />

      <div className="max-w-[800px] mx-auto px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-[#05163D]/10 to-transparent" />
      </div>

      <Docs t={t} />

      <RpcApi t={t} />

      <Cta t={t} onOpenDocs={() => setDocsOpen(true)} />

      <Footer t={t} />

      <DocsDrawer open={docsOpen} onClose={() => setDocsOpen(false)} t={t} />

      {showCookie && <CookieBanner onAccept={() => setShowCookie(false)} t={t} />}
    </div>
  );
}
