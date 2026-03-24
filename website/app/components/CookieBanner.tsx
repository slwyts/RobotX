'use client';

import type { Translations } from '@/app/lib/translations';

interface CookieBannerProps {
  onAccept: () => void;
  t: Translations;
}

export default function CookieBanner({ onAccept, t }: CookieBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-black/10 px-5 py-3 flex items-center justify-between z-[70] text-xs">
      <span className="text-slate-500">
        {t.cookieText}{' '}
        <span className="text-cyan-600 hover:underline cursor-pointer">{t.cookiePolicy}</span>
        {' & '}
        <span className="text-cyan-600 hover:underline cursor-pointer">{t.cookiePrivacy}</span>.
      </span>
      <button
        onClick={onAccept}
        className="btn-primary !py-1.5 !px-5 !text-xs !min-h-0 ml-4 shrink-0"
      >
        {t.cookieOk}
      </button>
    </div>
  );
}
