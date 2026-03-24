'use client';

import { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import type { Translations } from '@/app/lib/translations';

interface CopyBtnProps {
  text: string;
  t?: Pick<Translations, 'copied'>;
}

export default function CopyBtn({ text, t }: CopyBtnProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (text) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 text-slate-400 hover:text-cyan-500 transition-colors"
      title={copied ? (t?.copied ?? 'Copied!') : 'Copy'}
    >
      {copied
        ? <CheckCircle size={14} className="text-green-500" />
        : <Copy size={14} />
      }
    </button>
  );
}
