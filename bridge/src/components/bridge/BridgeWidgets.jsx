import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRightLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Info,
  MessageCircle,
  Moon,
  RefreshCw,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { CHAINS, NAV_CHAINS, TOKEN_ADDRESSES, getTokensForChain } from './constants';

const RXTokenIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
    <defs>
      <linearGradient id="rxHexGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="url(#rxHexGrad)" stroke="#06B6D4" strokeWidth="1.5" />
    <circle cx="15" cy="19" r="3.5" fill="#06B6D4" />
    <circle cx="25" cy="19" r="3.5" fill="#06B6D4" />
    <rect x="13" y="26" width="14" height="1.5" rx="0.75" fill="#06B6D4" opacity="0.5" />
    <circle cx="20" cy="9" r="2" fill="#06B6D4" />
  </svg>
);

export const TokenIcon = ({ token, size = 32 }) => {
  const [imgErr, setImgErr] = useState(false);

  if (token?.logo && !imgErr) {
    return (
      <img
        src={token.logo}
        alt={token.symbol}
        width={size}
        height={size}
        style={{ borderRadius: '50%', objectFit: 'cover' }}
        onError={() => setImgErr(true)}
      />
    );
  }

  if (token?.symbol === 'RX') return <RXTokenIcon size={size} />;

  if (!token) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#2e2e2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: size * 0.35, color: '#6c6c6c' }}>?</span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `${token.color}18`,
        border: `1.5px solid ${token.color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontWeight: 700,
        fontSize: size * 0.4,
        color: token.color,
      }}
    >
      {token.symbol[0]}
    </div>
  );
};

export const ChainIcon = ({ chain, size = 20 }) => {
  const [imgErr, setImgErr] = useState(false);

  if (chain?.icon && !imgErr) {
    return (
      <img
        src={chain.icon}
        alt={chain.name}
        width={size}
        height={size}
        style={{ borderRadius: 4, objectFit: 'cover' }}
        onError={() => setImgErr(true)}
      />
    );
  }

  if (chain?.id === 'robotx') {
    return (
      <img
        src="https://robotxhub.io/assets/images/logo.png"
        alt="RX"
        width={size}
        height={size}
        style={{ borderRadius: '50%', objectFit: 'contain' }}
      />
    );
  }

  if (!chain) {
    return <div style={{ width: size, height: size, borderRadius: 4, background: '#2e2e2e' }} />;
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        background: `${chain.color}25`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        fontWeight: 700,
        color: chain.color,
      }}
    >
      {chain.name[0]}
    </div>
  );
};

export const FlipArrowIcon = () => (
  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--t-bg-card,#fff)', border: '2px solid var(--t-border-solid,#dce0e6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t-accent,#06B6D4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  </div>
);

export const RobotXNavLogo = () => (
  <div className="flex items-center gap-1 cursor-pointer group">
    <img src="https://robotxhub.io/assets/images/logo.png" alt="RobotX" width="80" height="80" className="-mr-1 rounded-full" style={{ objectFit: 'contain' }} />
    <span className="text-lg font-black tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
      <span className="text-cyan-400">ROBOT</span>
      <span className="text-white">X</span>
    </span>
  </div>
);

export const NavTab = ({ tab, activeNav, onSelect }) => {
  const [dropOpen, setDropOpen] = useState(false);
  const ref = useRef(null);
  const isActive = activeNav === tab.id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          if (tab.items) {
            setDropOpen(!dropOpen);
          } else {
            onSelect(tab.id);
            setDropOpen(false);
          }
        }}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[15px] font-semibold transition-all ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
      >
        {tab.label}
        {tab.items && <ChevronDown size={14} className={`transition-transform ${dropOpen ? 'rotate-180 text-slate-300' : 'text-slate-500'}`} />}
      </button>
      {tab.items && dropOpen && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-[#15151e] border border-slate-800/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] py-2 min-w-[240px] max-w-[calc(100vw-32px)] overflow-hidden" style={{ animation: 'fadeInScale 0.15s ease-out' }}>
            {tab.items.map((item, index) => (
              <button key={index} onClick={() => { onSelect(tab.id); setDropOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${item.active ? 'bg-white/[0.03]' : 'hover:bg-white/[0.03]'}`}>
                <div className={`p-1.5 rounded-lg ${item.active ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                <div className="text-left">
                  <div className={`text-sm font-semibold ${item.active ? 'text-white' : 'text-slate-300'}`}>{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
                {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const NavChainSelector = ({ t }) => {
  const [open, setOpen] = useState(false);
  const [chain, setChain] = useState(NAV_CHAINS[0]);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-transparent hover:border-slate-700/50 transition-all">
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${chain.color}25` }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: chain.color, boxShadow: `0 0 6px ${chain.color}80` }} />
        </div>
        <span className="text-white text-sm font-medium hidden md:block">{chain.name}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-[220px] bg-[#15151e] border border-slate-800/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] py-2 z-50" style={{ animation: 'fadeInScale 0.15s ease-out' }}>
          <div className="px-3 py-2 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{t.selectNetwork}</div>
          {NAV_CHAINS.map((item) => (
            <button key={item.id} onClick={() => { setChain(item); setOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${chain.id === item.id ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'}`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${item.color}20` }}>
                <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
              </div>
              <div className="flex-1 text-left">
                <span className={`text-sm font-medium ${chain.id === item.id ? 'text-white' : 'text-slate-300'}`}>{item.name}</span>
                <span className="text-[10px] text-slate-600 ml-1.5">{item.blockTime} · {item.consensus}</span>
              </div>
              {chain.id === item.id && <Check size={14} className="ml-auto text-cyan-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ChainSelectorModal = ({ onSelect, onClose, currentChain, excludeChainId, t }) => {
  const [search, setSearch] = useState('');
  const [viewAll, setViewAll] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const popularIds = ['robotx', 'arbitrum', 'ethereum', 'optimism', 'base', 'bsc'];
  const allChains = CHAINS.filter((chain) => chain.chainId !== excludeChainId);
  const popularChains = allChains.filter((chain) => popularIds.includes(chain.id));
  const searchResult = allChains.filter((chain) => chain.name.toLowerCase().includes(search.toLowerCase()) || chain.id.includes(search.toLowerCase()));
  const displayChains = search ? searchResult : viewAll ? allChains : popularChains;

  const handleSelect = (chain) => {
    onSelect(chain);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1202] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur" />
      <div className="relative w-full max-w-[24rem] mx-4 bg-[#1a1a1a] rounded-2xl border border-[#2e2e2e] p-2 flex flex-col overflow-hidden animate-[fadeInScale_0.6s_ease]" style={{ maxHeight: '40rem' }} onClick={(event) => event.stopPropagation()}>
        <input type="text" className="absolute -z-10 opacity-0" />
        <div className="p-2">
          <div className="text-[#fafafa] text-lg mb-4 font-medium" style={{ lineHeight: 1 }}>{t.selectNetworkTitle}</div>
          <div className="flex items-center gap-2 w-full bg-[#2e2e2e] rounded-xl p-2 mb-2">
            <Search size={15} className="text-[#6c6c6c] flex-shrink-0" />
            <input ref={inputRef} value={search} onChange={(event) => setSearch(event.target.value.trim())} placeholder={t.searchChain} style={{ userSelect: 'all' }} className="w-full bg-transparent text-[#fafafa] text-sm outline-none placeholder:text-[#6c6c6c]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {!search && (
            <div onClick={() => setViewAll(!viewAll)} className="cursor-pointer hover:bg-[#2e2e2e] hover:rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {CHAINS.slice(0, 3).map((chain) => (
                    <div key={chain.id} className="w-6 h-6 rounded-full border-2 border-[#1a1a1a] overflow-hidden">
                      <ChainIcon chain={chain} size={20} />
                    </div>
                  ))}
                </div>
                <span className="text-[#fafafa] text-sm font-medium">{t.allChains}</span>
              </div>
              {viewAll && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#4a9eff" />
                  <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )}
          {!search && <div className="text-[#929292] text-sm px-2 pt-2 pb-1">{viewAll ? t.chains : t.popularChains}</div>}
          {displayChains.map((chain) => (
            <div key={chain.id} onClick={() => handleSelect(chain)} className="cursor-pointer hover:bg-[#2e2e2e] hover:rounded-lg p-2 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2">
                <ChainIcon chain={chain} size={24} />
                <span className="text-[#fafafa] text-sm">{chain.name}</span>
              </div>
              {currentChain?.id === chain.id && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#4a9eff" />
                  <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
          {displayChains.length === 0 && (
            <div className="flex justify-center items-center py-12 flex-col gap-2">
              <div className="text-sm text-[#fafafa]">{t.noChains}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TokenSelectorModal = ({ onSelect, onClose, currentToken, fromChain, toChain, t, isRealWallet: isReal }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('from-chain');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const chainTokens = (() => {
    const fromTokens = getTokensForChain(fromChain?.id);
    const toTokens = getTokensForChain(toChain?.id);
    const toSymbols = toTokens.map((token) => token.symbol);
    const intersection = fromTokens.filter((token) => toSymbols.includes(token.symbol));
    return intersection.length > 0 ? intersection : fromTokens;
  })();
  const filtered = chainTokens.filter((token) => token.symbol.toLowerCase().includes(search.toLowerCase()) || token.name.toLowerCase().includes(search.toLowerCase()));
  const quickTokens = chainTokens.filter((token) => ['RX', 'ETH', 'USDT', 'BNB'].includes(token.symbol));

  return (
    <div className="fixed inset-0 z-[1202] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur" />
      <div className="relative w-full max-w-[27.5rem] mx-4 bg-[#1a1a1a] rounded-2xl border border-[#2e2e2e] p-4 flex flex-col overflow-hidden animate-[fadeInScale_0.6s_ease]" style={{ maxHeight: '40rem' }} onClick={(event) => event.stopPropagation()}>
        <div className="flex justify-between items-center">
          <div className="text-[#fafafa] text-lg font-medium" style={{ lineHeight: 1 }}>{t.selectToken}</div>
          <X size={20} className="cursor-pointer text-[#fafafa]" onClick={onClose} />
        </div>
        <div className="w-full flex flex-col overflow-hidden pt-4 space-y-2">
          <div className="flex items-center gap-2 px-0">
            <div onClick={() => setActiveTab('from-chain')} className={`flex-1 flex items-center cursor-pointer py-2 px-1 rounded-xl transition-colors ${activeTab === 'from-chain' ? '' : 'opacity-50'} hover:bg-[#2e2e2e]`}>
              <div className="relative mr-1">
                <TokenIcon token={currentToken} size={32} />
              </div>
              <label className="px-2 cursor-pointer text-base flex flex-col">
                <span className="font-medium text-[#fafafa]" style={{ lineHeight: 1 }}>{currentToken?.symbol || 'Token'}</span>
                <div className="text-xs text-[#6c6c6c]">{fromChain?.name || t.notSelected}</div>
              </label>
            </div>
            <div className="w-7 h-7 rounded-lg bg-[#2e2e2e] flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-200 flex-shrink-0">
              <ArrowRightLeft size={14} className="text-white" />
            </div>
            <div onClick={() => setActiveTab('to-chain')} className={`flex-1 flex items-center justify-end cursor-pointer py-2 px-1 rounded-xl transition-colors ${activeTab === 'to-chain' ? '' : 'opacity-50'} hover:bg-[#2e2e2e]`}>
              <label className="px-2 cursor-pointer text-base flex flex-col text-right">
                <span className="font-medium text-[#fafafa]" style={{ lineHeight: 1 }}>{currentToken?.symbol || 'Token'}</span>
                <div className="text-xs text-[#6c6c6c]">{toChain?.name || t.notSelected}</div>
              </label>
              <div className="relative">
                <TokenIcon token={currentToken} size={32} />
              </div>
            </div>
          </div>
          <div className="w-full h-0.5 bg-[#2e2e2e] relative overflow-hidden rounded-full">
            <div className={`w-5/12 h-full bg-white absolute top-0 rounded-full transition-all duration-200 ${activeTab === 'from-chain' ? 'left-0' : 'right-0'}`} />
          </div>
        </div>
        <div className="flex items-center rounded-xl py-2.5 px-3 bg-[#2e2e2e] mt-3">
          <Search size={20} className="text-[#6c6c6c] flex-shrink-0" />
          <input ref={inputRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchToken} style={{ userSelect: 'all' }} className="flex-1 ml-2 bg-transparent text-[#fafafa] text-sm outline-none placeholder:text-[#6c6c6c]" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mt-3 scrollbar-none">
          {quickTokens.map((token) => (
            <div key={token.symbol} onClick={() => { onSelect(token); onClose(); }} className="flex items-center gap-1 shrink-0 rounded-full bg-[#2e2e2e] hover:bg-[#404040] text-sm cursor-pointer transition-colors" style={{ padding: '4px 10px 4px 4px' }}>
              <div className="relative mr-0.5">
                <TokenIcon token={token} size={24} />
              </div>
              <span className="text-[#fafafa]">{token.symbol}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#929292] mt-2 mb-1.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.6">
            <circle cx="4" cy="4" r="2.5" />
            <circle cx="12" cy="4" r="2.5" />
            <circle cx="4" cy="12" r="2.5" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          <span>{t.allTokens}</span>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {filtered.map((token) => (
            <div key={token.symbol} onClick={() => { onSelect(token); onClose(); }} className="flex justify-between items-center gap-2 p-2 hover:bg-[#2e2e2e] rounded-xl transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="relative mr-1">
                  <TokenIcon token={token} size={36} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-[#fafafa] text-sm font-medium">{token.symbol}</span>
                    {token.symbol === 'RX' && <div className="bg-[#2e2e2e] text-xs text-[#fafafa] rounded-full px-2 py-0.5 ml-1">Gas Token</div>}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-[#b0b0b0]">{token.name}</span>
                    <span className="text-xs text-[#b0b0b0]">{TOKEN_ADDRESSES[token.symbol] || ''}</span>
                  </div>
                </div>
              </div>
              {!isReal && <span className="text-xs text-[#b0b0b0] font-mono">{token.balance.toLocaleString()}</span>}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="flex justify-center items-center py-12 flex-col gap-2">
              <div className="text-sm text-[#fafafa]">{t.noTokensFound}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SettingsPanel = ({ slippage, setSlippage, deadline, setDeadline, onClose, t }) => {
  const ref = useRef(null);
  const slippagePresets = ['0.1', '0.5', '1.0'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute top-14 right-0 w-[320px] max-w-[calc(100vw-32px)] bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl p-4 z-[60] shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-[fadeInScale_0.15s_ease-out]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-white font-semibold text-sm">{t.settings}</span>
        <button onClick={onClose}><X size={14} className="text-[#6c6c6c] hover:text-white transition-colors" /></button>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[#b0b0b0] text-xs font-medium">{t.slippageTolerance}</span>
          <Info size={12} className="text-[#6c6c6c]" />
        </div>
        <div className="flex gap-2">
          {slippagePresets.map((preset) => (
            <button key={preset} onClick={() => setSlippage(preset)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${slippage === preset ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-[#2e2e2e] text-[#b0b0b0] border border-transparent hover:bg-[#404040]'}`}>
              {preset}%
            </button>
          ))}
          <div className="flex-1 relative">
            <input value={!slippagePresets.includes(slippage) ? slippage : ''} onChange={(event) => { if (/^[0-9]*\.?[0-9]*$/.test(event.target.value)) setSlippage(event.target.value); }} placeholder={t.custom} className="w-full py-2 px-3 rounded-xl text-sm font-medium bg-[#2e2e2e] text-white border border-transparent focus:border-cyan-500/30 outline-none text-center placeholder:text-[#6c6c6c]" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c6c6c] text-xs">%</span>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[#b0b0b0] text-xs font-medium">{t.txDeadline}</span>
          <Info size={12} className="text-[#6c6c6c]" />
        </div>
        <div className="flex items-center gap-2">
          <input value={deadline} onChange={(event) => { if (/^\d*$/.test(event.target.value)) setDeadline(event.target.value); }} className="w-20 py-2 px-3 rounded-xl text-sm font-medium bg-[#2e2e2e] text-white border border-transparent focus:border-cyan-500/30 outline-none text-center" />
          <span className="text-[#6c6c6c] text-xs">{t.minutes}</span>
        </div>
      </div>
    </div>
  );
};

export const WalletModal = ({ onConnect, onClose, t }) => {
  const wallets = [
    { name: 'MetaMask', icon: '\uD83E\uDD8A', popular: true },
    { name: 'Coinbase Wallet', icon: '\uD83D\uDD35', popular: true },
    { name: 'WalletConnect', icon: '\uD83D\uDD17', popular: false },
    { name: 'ROBOTX Wallet', icon: '\uD83E\uDD16', popular: true },
    { name: 'OKX Wallet', icon: '\u26A1', popular: false },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-[400px] mx-4 bg-[#1a1a1a] rounded-3xl border border-[#2e2e2e] p-6 animate-[fadeInScale_0.2s_ease-out]" onClick={(event) => event.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white font-semibold text-lg">{t.connectWallet}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2e2e2e] hover:bg-[#404040] transition-colors"><X size={16} className="text-[#b0b0b0]" /></button>
        </div>
        <div className="space-y-2">
          {wallets.map((wallet) => (
            <button key={wallet.name} onClick={() => onConnect(wallet.name)} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#0f0f0f] border border-[#2e2e2e] hover:border-[#404040] hover:bg-[#1a1a1a] transition-all duration-150 group">
              <span className="text-2xl w-8 text-center">{wallet.icon}</span>
              <span className="text-white text-sm font-medium flex-1 text-left group-hover:text-cyan-300 transition-colors">{wallet.name}</span>
              {wallet.popular && <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-medium">Popular</span>}
              <ChevronRight size={14} className="text-[#6c6c6c] group-hover:text-[#b0b0b0] transition-colors" />
            </button>
          ))}
        </div>
        <p className="text-[#6c6c6c] text-[11px] text-center mt-5 leading-relaxed">
          {t.walletTerms}
          <br />
          <span className="text-cyan-400/60 hover:text-cyan-400 cursor-pointer">{t.termsOfService}</span>
        </p>
      </div>
    </div>
  );
};

export const SuccessModal = ({ fromChain, toChain, fromToken, toToken, amount, txHash: initialTxHash, sourceTxHash, onClose, t }) => {
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState(initialTxHash);

  useEffect(() => {
    if (!sourceTxHash || !initialTxHash || initialTxHash !== sourceTxHash) return;
    if (fromChain?.id === 'robotx') return;

    let alive = true;
    const poll = async () => {
      try {
        const response = await fetch(`/api/release-status?sourceTxHash=${sourceTxHash}`);
        const data = await response.json();
        if (alive && data.status === 'released' && data.robotxTxHash) {
          let hash = data.robotxTxHash;
          if (!hash.startsWith('0x')) hash = `0x${hash}`;
          setTxHash(hash);
        }
      } catch {
      }
    };

    poll();
    const timer = setInterval(poll, 3000);
    const timeout = setTimeout(() => clearInterval(timer), 120000);

    return () => {
      alive = false;
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [fromChain, initialTxHash, sourceTxHash]);

  const copyHash = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-[400px] mx-4 bg-[#1a1a1a] rounded-3xl border border-[#2e2e2e] p-6 text-center animate-[fadeInScale_0.2s_ease-out]" onClick={(event) => event.stopPropagation()}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center">
          <Check size={32} className="text-green-400" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">{t.txSubmitted}</h3>
        <p className="text-[#b0b0b0] text-sm mb-1">{amount} {fromToken?.symbol} → {toToken?.symbol}</p>
        <div className="flex items-center justify-center gap-2 text-[#6c6c6c] text-xs mb-4">
          <span>{fromChain?.name}</span>
          <ArrowRightLeft size={12} />
          <span>{toChain?.name}</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-[#0f0f0f] rounded-xl px-4 py-2.5 mb-4 mx-auto max-w-[320px]">
          <span className="text-[#6c6c6c] text-xs flex-shrink-0">TX</span>
          <span className="text-cyan-400 text-xs font-mono truncate">{txHash}</span>
          <button onClick={copyHash} className="flex-shrink-0 hover:scale-110 transition-transform">
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-[#6c6c6c] hover:text-white" />}
          </button>
        </div>
        <div className="bg-[#0f0f0f] rounded-xl px-4 py-3 mb-5 mx-auto max-w-[320px] space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#6c6c6c]">{t.estArrival}</span>
            <span className="text-[#b0b0b0]">~30s</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#6c6c6c]">{t.bridgeFee}</span>
            <span className="text-[#b0b0b0]">0%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#6c6c6c]">{t.chainId}</span>
            <span className="text-[#b0b0b0] font-mono">0x524F58</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {txHash === sourceTxHash && fromChain?.id !== 'robotx' ? (
              <button className="flex-1 py-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400/50 text-xs font-medium flex items-center justify-center gap-1 cursor-wait">
                <RefreshCw size={11} className="animate-spin" />
                {t.robotxConfirming}
              </button>
            ) : (
              <button onClick={() => window.open(`https://explorer.robotxhub.io/?tx=${txHash}`, '_blank')} className="flex-1 py-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 text-xs font-medium hover:bg-cyan-500/25 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                <ExternalLink size={11} />
                ROBOTX Explorer
              </button>
            )}
            {sourceTxHash && sourceTxHash !== txHash && (() => {
              const explorers = {
                56: 'https://bscscan.com/tx/',
                1: 'https://etherscan.io/tx/',
                42161: 'https://arbiscan.io/tx/',
                8453: 'https://basescan.org/tx/',
                10: 'https://optimistic.etherscan.io/tx/',
                137: 'https://polygonscan.com/tx/',
              };
              const chainId = fromChain?.id !== 'robotx' ? fromChain?.chainId : toChain?.chainId;
              const url = explorers[chainId];
              return url ? (
                <button onClick={() => window.open(url + sourceTxHash, '_blank')} className="flex-1 py-2.5 rounded-2xl bg-purple-500/15 text-purple-400 text-xs font-medium hover:bg-purple-500/25 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  <ExternalLink size={11} />
                  {fromChain?.id !== 'robotx' ? fromChain?.name : toChain?.name} Scan
                </button>
              ) : null;
            })()}
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-2xl bg-[#2e2e2e] text-white text-sm font-medium hover:bg-[#404040] transition-colors">{t.close}</button>
        </div>
      </div>
    </div>
  );
};

export const ThemeSwitcher = ({ theme, onChange }) => {
  const items = [
    { key: 'dark', label: 'Dark' },
    { key: 'dim', label: 'Dim' },
    { key: 'light', label: 'Light' },
  ];

  return (
    <div className="theme-switcher">
      {items.map((item) => (
        <button key={item.key} onClick={() => onChange(item.key)} className={`theme-btn ${theme === item.key ? 'active' : ''}`}>
          {item.key === 'dark' ? <Moon size={10} /> : <Sun size={10} />} {item.label}
        </button>
      ))}
    </div>
  );
};

export const FloatingSupportButton = () => (
  <button className="fixed right-4 bottom-20 md:bottom-6 z-40 w-11 h-11 rounded-full bg-cyan-500 hover:bg-cyan-600 shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:shadow-[0_4px_20px_rgba(6,182,212,0.6)] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95">
    <MessageCircle size={18} className="text-white" />
  </button>
);