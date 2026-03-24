'use client';

import { Terminal } from 'lucide-react';
import CopyBtn from '@/app/components/CopyBtn';
import useScrollReveal from '@/app/lib/useScrollReveal';
import type { Translations } from '@/app/lib/translations';

const NATIVE_METHODS = [
  'getBlockByNumber', 'getBlockByHash', 'getTransactionByHash',
  'getBalance', 'sendRawTransaction', 'getBlockHeight',
  'getAccountInfo', 'getSuperRepresentatives', 'getPendingTransactions',
  'getChainInfo', 'getLatestBlocks', 'getNodeInfo',
];

const EVM_METHODS = [
  'eth_chainId', 'eth_blockNumber', 'eth_getBalance', 'eth_getTransactionCount',
  'eth_getBlockByNumber', 'eth_getBlockByHash', 'eth_getTransactionByHash',
  'eth_getTransactionReceipt', 'eth_sendRawTransaction', 'eth_estimateGas',
  'eth_gasPrice', 'eth_feeHistory', 'net_version', 'net_peerCount', 'web3_clientVersion',
];

const CURL_EXAMPLE = `curl -X POST https://rpc.robotxhub.ai -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"robotx_getChainInfo","params":[],"id":1}'`;

interface RpcApiProps {
  t: Translations;
}

export default function RpcApi({ t }: RpcApiProps) {
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <section id="api" className="relative mx-2 lg:mx-4 rounded-[20px] overflow-hidden py-16 lg:py-24 px-4">
      <div className="absolute inset-0 bg-[#F2F2F2]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: 'url(/assets/images/computer.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div
        ref={ref}
        className={`relative max-w-[1000px] mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Heading */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/8 bg-black/[0.02] text-[10px] font-semibold text-[#05163D]/40 uppercase tracking-[0.25em] mb-4"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            {t.rpcComment}
          </div>
          <h2 className="text-[28px] lg:text-[44px] font-medium text-[#05163D] leading-tight mb-2">{t.rpcTitle}</h2>
          <p className="text-[#05163D]/50 text-sm">{t.rpcDesc}</p>
        </div>

        {/* Method cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Native */}
          <div className="relative rounded-[20px] bg-white border border-black/5 overflow-hidden hover:shadow-card-hover hover:-translate-y-1 hover:border-cyan-200/50 transition-all duration-500 group">
            <div
              className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500"
              style={{ backgroundImage: 'url(/assets/bg/circuit-blue.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="relative px-5 py-3 border-b border-black/5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-cyan-600 text-sm font-bold font-mono">robotx_* Native</span>
              <span className="ml-auto text-[10px] text-slate-400 font-mono">12 methods</span>
            </div>
            <div className="relative p-5 space-y-2 font-mono text-xs">
              {NATIVE_METHODS.map((m) => (
                <div key={m} className="text-[#05163D]/70 hover:text-cyan-600 transition-colors cursor-default">
                  <span className="text-cyan-600">robotx_</span>{m}
                </div>
              ))}
            </div>
          </div>

          {/* EVM */}
          <div className="relative rounded-[20px] bg-white border border-black/5 overflow-hidden hover:shadow-card-hover hover:-translate-y-1 hover:border-purple-200/50 transition-all duration-500 group">
            <div
              className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500"
              style={{ backgroundImage: 'url(/assets/bg/network-nodes.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="relative px-5 py-3 border-b border-black/5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-purple-600 text-sm font-bold font-mono">eth_* EVM Compatible</span>
              <span className="ml-auto text-[10px] text-slate-400 font-mono">15 methods</span>
            </div>
            <div className="relative p-5 space-y-2 font-mono text-xs">
              {EVM_METHODS.map((m) => {
                const [prefix, ...rest] = m.split('_');
                return (
                  <div key={m} className="text-[#05163D]/70 hover:text-purple-600 transition-colors cursor-default">
                    <span className="text-purple-600">{prefix}_</span>{rest.join('_')}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Curl example */}
        <div className="mt-4 bg-[#0c0c0c] rounded-xl overflow-hidden font-mono text-xs">
          <div className="px-4 py-2 bg-[#1a1a1a] border-b border-slate-700 flex items-center gap-2 text-slate-400">
            <Terminal size={12} />
            curl example
            <CopyBtn text={CURL_EXAMPLE} t={t} />
          </div>
          <div className="p-4 text-slate-300">
            <span className="text-emerald-500">$</span>{' '}
            curl -X POST https://rpc.robotxhub.ai \<br />
            {'  '}-H <span className="text-green-400">&quot;Content-Type: application/json&quot;</span> \<br />
            {'  '}-d <span className="text-green-400">&#39;&#123;&quot;jsonrpc&quot;:&quot;2.0&quot;, &quot;method&quot;:&quot;robotx_getChainInfo&quot;, &quot;params&quot;:[], &quot;id&quot;:1&#125;&#39;</span>
          </div>
        </div>
      </div>
    </section>
  );
}
