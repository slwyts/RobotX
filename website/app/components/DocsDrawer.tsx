'use client';

import { useState } from 'react';
import { X, FileText, Code } from 'lucide-react';
import { RobotXIcon } from '@/app/components/Icons';
import { Terminal } from 'lucide-react';
import type { Translations } from '@/app/lib/translations';

// Inline DocTerminal (shared between Docs section & this drawer)
function DocTerminal({ type }: { type: 'whitepaper' | 'protocol' }) {
  const isWP = type === 'whitepaper';

  const txTypes: [string, string, string, string][] = [
    ['0x00', '#4ade80', 'TxTransfer',     'fee: 0.1 RX'],
    ['0x01', '#22d3ee', 'TxVote',         'requires: votePower <= balance'],
    ['0x02', '#facc15', 'TxUnvote',       'releases votePower'],
    ['0x03', '#c084fc', 'TxContractCall', 'smart contract payload'],
    ['0x04', '#f472b6', 'TxStake',        'balance -= value, staked += value'],
    ['0x05', '#f87171', 'TxUnstake',      'staked -= value, balance += value'],
  ];

  return (
    <div className="relative w-full h-[50vh] bg-[#0c0c0c] rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1a] border-b border-slate-700">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal size={12} />
          <span>root@robotx-node:~/archives</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-1 pb-4 text-slate-300 scrollbar-hide">
        <div className="mb-1 text-emerald-500 mt-1">
          <span className="text-purple-400">root@robotx-node:~#</span>{' '}
          cat {isWP ? 'whitepaper_v2.md' : 'protocol_specs.js'}
        </div>
        <div className="space-y-3 pb-8">
          {isWP ? (
            <>
              <div className="border-b border-slate-800 pb-2">
                <span className="text-cyan-400 font-bold">Title:</span> ROBOTX Technical Whitepaper<br />
                <span className="text-cyan-400 font-bold">Version:</span> 2.0.4 (Stable)<br />
                <span className="text-cyan-400 font-bold">ChainID:</span> 0x524F58 (5394264)
              </div>
              <div>
                <span className="text-pink-500 font-bold">## 1. MANIFESTO</span><br />
                <p className="mt-1 pl-2 border-l-2 border-pink-500/30 text-slate-300 leading-relaxed">
                  ROBOTX is a next-generation{' '}
                  <span className="text-yellow-300">decentralized public chain</span>.
                  Built on DPoS consensus with 3-second block times and 27 Super Representative nodes.
                </p>
              </div>
              <div>
                <span className="text-pink-500 font-bold">## 2. TOKENOMICS</span><br />
                <div className="bg-slate-900/50 p-2 border border-slate-700 mt-1 rounded text-xs">
                  <span className="text-cyan-300">Total Supply</span>: 2,100,000,000 RX<br />
                  <span className="text-cyan-300">Foundation</span>: 5,000,000,000 (RXGenesis001)<br />
                  <span className="text-cyan-300">Ecosystem</span>: 3,000,000,000 (RXGenesis002)<br />
                  <span className="text-cyan-300">Development</span>: 2,000,000,000 (RXGenesis003)
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-slate-500">{'// ROBOTX Transaction Types v1.0'}</div>
              {txTypes.map(([code, clr, name, desc], i) => (
                <div key={i} className="pl-2 border-l border-slate-700">
                  <span style={{ color: clr }}>{code}</span>:{' '}
                  <span className="text-white">{name}</span>
                  <span className="text-slate-500 ml-2">{'// '}{desc}</span>
                </div>
              ))}
            </>
          )}
          <div className="mt-4 flex items-center gap-1 text-emerald-500">
            <span className="text-purple-400">root@robotx-node:~#</span>
            <span className="w-2 h-4 bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface DocsDrawerProps {
  open: boolean;
  onClose: () => void;
  t: Translations;
}

export default function DocsDrawer({ open, onClose, t }: DocsDrawerProps) {
  const [activeDoc, setActiveDoc] = useState<'whitepaper' | 'protocol'>('whitepaper');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border-l border-black/10 shadow-2xl h-full p-6 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#05163D]/40 hover:text-[#05163D] transition-colors"
        >
          <X size={24} />
        </button>
        <div className="mt-8 mb-6">
          <h2 className="text-2xl font-black text-[#05163D] flex items-center gap-3">
            <RobotXIcon size={76} />
            {t.docTitle}
            <span className="text-[#05163D]/30 font-light">{t.docSuffix}</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 mt-2 rounded-full" />
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveDoc('whitepaper')}
            className={`flex-1 py-2 text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all ${
              activeDoc === 'whitepaper' ? 'bg-cyan-500 text-white shadow-lg' : 'bg-[#F2F2F2] text-[#05163D]/50'
            }`}
          >
            <FileText size={14} />
            {t.docWhitepaper}
          </button>
          <button
            onClick={() => setActiveDoc('protocol')}
            className={`flex-1 py-2 text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all ${
              activeDoc === 'protocol' ? 'bg-pink-500 text-white shadow-lg' : 'bg-[#F2F2F2] text-[#05163D]/50'
            }`}
          >
            <Code size={14} />
            {t.docProtocol}
          </button>
        </div>
        <DocTerminal type={activeDoc} />
        <div className="mt-6 pt-4 border-t border-black/5 text-center">
          <div className="text-[10px] text-[#05163D]/30 font-mono">{t.docEncrypted}</div>
        </div>
      </div>
    </div>
  );
}
