'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Smartphone, Package, Key, Terminal, Lock, Play, RotateCcw } from 'lucide-react';
import useScrollReveal from '@/app/lib/useScrollReveal';
import type { Translations } from '@/app/lib/translations';

interface NodeData {
  id: string;
  name: string;
  sub: string;
  balance: number;
  pending: number;
  role: string;
  color: string;
}

interface NodesMap {
  A: NodeData;
  B: NodeData;
  C: NodeData;
  D: NodeData;
}

interface LogEntry {
  time: string;
  text: string;
  type: string;
}

const INITIAL_NODES: NodesMap = {
  A: { id: 'A', name: 'User A',  sub: 'Sender',   balance: 10, pending: 0, role: 'sender',   color: 'text-pink-600' },
  B: { id: 'B', name: 'Node B',  sub: 'Relay',     balance: 0,  pending: 0, role: 'relay',    color: 'text-cyan-600' },
  C: { id: 'C', name: 'Node C',  sub: 'Relay',     balance: 0,  pending: 0, role: 'relay',    color: 'text-cyan-600' },
  D: { id: 'D', name: 'User D',  sub: 'Receiver',  balance: 0,  pending: 0, role: 'receiver', color: 'text-emerald-600' },
};

const SECRET_KEY = '8888';
const HASH_LOCK  = '0x9f...a2b';

interface HTLCDemoProps {
  t: Translations;
}

export default function HTLCDemo({ t }: HTLCDemoProps) {
  const [ref, visible] = useScrollReveal(0.1);

  const [nodes, setNodes]       = useState<NodesMap>(INITIAL_NODES);
  const [step, setStep]         = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs]         = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const addLog = useCallback((msg: string, type: string) => {
    const ts =
      new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
      '.' +
      Math.floor(Math.random() * 999);
    setLogs((p) => [...p, { time: ts, text: msg, type }]);
  }, []);

  const steps = [
    { id: 0,  title: 'SYS.READY',       desc: 'Awaiting command...',            action: () => {} },
    { id: 1,  title: 'HTLC.INIT',        desc: 'A locks 10 RX, generates onion package', action: () => {
      setNodes((p) => ({ ...p, A: { ...p.A, balance: 0 } }));
      addLog(`A >> Generated hash lock: ${HASH_LOCK}`, 'info');
      addLog('A >> Locked 10 RX', 'warn');
      addLog('A >> Encrypting layers...', 'system');
    }},
    { id: 2,  title: 'TX.SEND > B',      desc: 'Encrypted package: A → B',      action: () => addLog('Network >> Transmitting [Encrypted]...', 'dim') },
    { id: 3,  title: 'NODE.B_PROCESS',   desc: 'B peels first onion layer',     action: () => {
      addLog('B >> Layer 1 decrypted', 'success');
      addLog('B >> Received: [Package for C] + [0.5 RX cheque]', 'info');
      setNodes((p) => ({ ...p, B: { ...p.B, pending: 0.5 } }));
    }},
    { id: 4,  title: 'TX.SEND > C',      desc: 'Encrypted package: B → C',      action: () => addLog('Network >> Transmitting [Encrypted]...', 'dim') },
    { id: 5,  title: 'NODE.C_PROCESS',   desc: 'C peels second onion layer',    action: () => {
      addLog('C >> Layer 2 decrypted', 'success');
      addLog('C >> Received: [Package for D] + [0.5 RX cheque]', 'info');
      setNodes((p) => ({ ...p, C: { ...p.C, pending: 0.5 } }));
    }},
    { id: 6,  title: 'TX.SEND > D',      desc: 'Encrypted package: C → D',      action: () => addLog('Network >> Transmitting [Encrypted]...', 'dim') },
    { id: 7,  title: 'NODE.D_UNLOCK',    desc: 'D unlocks with private key',    action: () => {
      addLog('D >> Core layer decrypted!', 'success');
      addLog(`D >> Secret: ${SECRET_KEY}`, 'system');
      addLog('D >> Funds unlocked! +9 RX', 'success');
      setNodes((p) => ({ ...p, D: { ...p.D, balance: 9 } }));
    }},
    { id: 8,  title: 'REVEAL > C',       desc: 'D broadcasts secret to C',      action: () => addLog('Network >> D broadcasts secret -> C', 'system') },
    { id: 9,  title: 'PAYMENT.C',        desc: 'C activates cheque',            action: () => {
      addLog('C >> Cheque activated! +0.5 RX', 'success');
      setNodes((p) => ({ ...p, C: { ...p.C, balance: 0.5, pending: 0 } }));
    }},
    { id: 10, title: 'REVEAL > B',       desc: 'C broadcasts secret to B',      action: () => addLog('Network >> C broadcasts secret -> B', 'system') },
    { id: 11, title: 'PAYMENT.B',        desc: 'B activates cheque',            action: () => {
      addLog('B >> Cheque activated! +0.5 RX', 'success');
      addLog('SYS >> Transaction complete.', 'system');
      setNodes((p) => ({ ...p, B: { ...p.B, balance: 0.5, pending: 0 } }));
      setIsPlaying(false);
    }},
  ];

  // Auto scroll logs
  useEffect(() => {
    if (logs.length > 0 && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [logs]);

  // Auto advance steps
  useEffect(() => {
    if (!isPlaying || step >= steps.length - 1) return;
    const timer = setTimeout(() => {
      const next = step + 1;
      setStep(next);
      steps[next].action();
    }, step === 7 ? 2000 : 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isPlaying]);

  const resetSim = () => {
    setIsPlaying(false);
    setStep(0);
    setNodes(INITIAL_NODES);
    setLogs([]);
  };

  const handleStart = () => {
    setIsPlaying(true);
    if (step === 0) {
      setStep(1);
      steps[1].action();
    }
  };

  // DemoNode sub-component
  const DemoNode = ({ node, index }: { node: NodeData; index: number }) => {
    const isActive = step === index * 2 + 1 || step === 11 - (index - 1) * 2;
    return (
      <div className={`relative z-10 flex flex-col items-center w-24 transition-all duration-500 ${isActive ? 'scale-110' : 'opacity-70'}`}>
        {node.pending > 0 && (
          <div className="absolute -top-8 animate-bounce bg-yellow-50 border border-yellow-300 text-yellow-700 text-[10px] px-2 py-1 rounded font-mono shadow-sm">
            PENDING: {node.pending}
          </div>
        )}
        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border-2 mb-3 transition-all duration-300 ${isActive ? 'border-cyan-400 bg-cyan-50 shadow-button-glow' : 'border-slate-200 bg-white shadow-card'}`}>
          <Smartphone size={28} className={node.color} />
          {isActive && <div className="absolute inset-0 rounded-2xl animate-pulse-ring border-2 border-cyan-400/50" />}
        </div>
        <div className="text-center">
          <div className={`font-bold text-sm ${isActive ? 'text-[#05163D]' : 'text-slate-400'}`}>{node.name}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">{node.sub}</div>
          <div className={`font-mono text-xs px-2 py-0.5 rounded-full border ${node.balance > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            {node.balance.toFixed(1)} RX
          </div>
        </div>
      </div>
    );
  };

  // Moving object
  const MovingObject = () => {
    if (step === 0 || step === 11) return null;
    let leftPos = '0%';
    const isReverse = step > 7;
    if (!isReverse) {
      if (step <= 2) leftPos = '15%';
      if (step === 3 || step === 4) leftPos = '38%';
      if (step === 5 || step === 6) leftPos = '62%';
      if (step === 7) leftPos = '85%';
    } else {
      if (step === 8 || step === 9) leftPos = '62%';
      if (step === 10) leftPos = '38%';
    }

    return (
      <div
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out z-20 flex items-center justify-center w-12 h-12"
        style={{ left: leftPos }}
      >
        {isReverse ? (
          <div className="relative">
            <div className="relative bg-yellow-400 text-white p-2 rounded-full shadow-lg border-2 border-yellow-300 animate-spin-slow">
              <Key size={18} />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-yellow-700 bg-yellow-50 px-1.5 rounded border border-yellow-200">
              8888
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse shadow-lg flex items-center justify-center z-10">
              <Package size={16} className="text-white" />
            </div>
            {step < 5 && <div className="absolute inset-[-4px] rounded-full border-2 border-dashed border-purple-300 animate-spin-slow z-0" />}
            {step < 3 && <div className="absolute inset-[-10px] rounded-full border-2 border-dotted border-cyan-300 animate-spin-reverse z-[-1]" />}
            <div className="absolute -top-7 whitespace-nowrap text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              {step < 3 ? '3 LAYERS' : step < 5 ? '2 LAYERS' : '1 LAYER'}
            </div>
          </div>
        )}
      </div>
    );
  };

  const nodeList = [nodes.A, nodes.B, nodes.C, nodes.D];
  const logColors: Record<string, string> = {
    system: 'text-purple-400',
    success: 'text-green-400',
    warn: 'text-yellow-400',
    dim: 'text-slate-500',
    info: 'text-cyan-300',
  };

  return (
    <section id="demo" className="relative px-4 lg:px-10 xl:px-20 py-16 lg:py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{ backgroundImage: 'url(/assets/images/deploy.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div
        ref={ref}
        className={`relative max-w-[900px] mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Heading */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/8 bg-black/[0.02] text-[10px] font-semibold text-[#05163D]/40 uppercase tracking-[0.25em] mb-4"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500/60" />
            {t.demoComment}
          </div>
          <h2 className="text-[28px] lg:text-[44px] font-medium text-[#05163D] leading-tight mb-2">{t.demoTitle}</h2>
          <p className="text-[#05163D]/50 text-sm">{t.demoDesc}</p>
        </div>

        {/* Demo panel */}
        <div className="rounded-[20px] bg-white p-6 md:p-10 shadow-card relative overflow-hidden border border-black/5">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-black/5 rounded-t-[20px]">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 transition-all duration-500 rounded-tl-[20px]"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Nodes visualization */}
          <div className="relative py-12 mt-4">
            <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-black/5 -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-[10%] h-[2px] bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 -translate-y-1/2 transition-all duration-1000"
              style={{ width: step > 7 ? '80%' : `${Math.min(step * 12, 80)}%`, opacity: step === 0 ? 0 : 1 }}
            />
            {step > 0 && step < 11 && (
              <div
                className="absolute top-1/2 left-[10%] h-[6px] -translate-y-1/2 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-cyan-400/20 blur-[4px] transition-all duration-1000"
                style={{ width: step > 7 ? '80%' : `${Math.min(step * 12, 80)}%` }}
              />
            )}
            <div className="flex justify-between px-[5%] relative">
              {nodeList.map((node, i) => (
                <DemoNode key={node.id} node={node} index={i} />
              ))}
            </div>
            <MovingObject />
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border shadow-sm transition-all duration-300 ${step > 7 ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-white border-black/5 text-cyan-500'}`}>
                {step > 7 ? <Key className="animate-pulse" /> : <Lock />}
              </div>
              <div>
                <div className="text-[10px] text-[#05163D]/40 font-mono uppercase tracking-widest mb-1">{t.demoAction}</div>
                <div className="text-lg font-bold text-[#05163D]">{steps[step].title}</div>
                <div className="text-[#05163D]/50 text-sm">{steps[step].desc}</div>
              </div>
            </div>
            <button
              onClick={step === steps.length - 1 ? resetSim : handleStart}
              disabled={isPlaying && step > 0 && step < steps.length - 1}
              className={`rounded-full px-8 py-3 font-bold transition-all shrink-0 ${
                isPlaying && step > 0 && step < steps.length - 1
                  ? 'bg-slate-100 text-slate-400 cursor-wait'
                  : 'btn-primary'
              }`}
            >
              <span className="flex items-center gap-2">
                {step === steps.length - 1 ? <RotateCcw size={18} /> : <Play size={18} />}
                {step === 0 ? t.demoStart : step === steps.length - 1 ? t.demoReset : t.demoExec}
              </span>
            </button>
          </div>
        </div>

        {/* Log terminal */}
        <div className="mt-4 bg-[#0c0c0c] rounded-xl overflow-hidden shadow-xl font-mono text-xs">
          <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-slate-700">
            <Terminal size={12} className="text-slate-400" />
            <span className="text-slate-400">transaction.log</span>
            <div className="flex gap-1.5 ml-auto">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="h-40 overflow-y-auto p-4 space-y-1.5 scrollbar-hide">
            {logs.length === 0 && <div className="text-slate-600 italic">{t.demoIdle}</div>}
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-slate-600 select-none shrink-0">[{log.time}]</span>
                <span className={logColors[log.type] ?? 'text-cyan-300'}>{log.text}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
