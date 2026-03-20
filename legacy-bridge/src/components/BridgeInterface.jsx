import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronDown, Settings, Search, X, Check,
  ExternalLink, RotateCcw, Shield, Clock, Fuel,
  Zap, Copy, ArrowRightLeft,
  Compass, MoreHorizontal, MessageCircle,
  Info, ChevronRight,
  Droplets, PlusCircle, LayoutDashboard, Coins,
  Activity, Globe,
  RefreshCw, Moon, Sun, LogOut} from 'lucide-react';

// ═══════════════════════════════════════════
// 翻译系统
// ═══════════════════════════════════════════
const translations = {
  zh: {
    // 导航标签
    navBridge: '跨链',
    navBridgeItem: '桥接',
    navBridgeDesc: '跨链资产转移',
    navHistory: '历史记录',
    navHistoryDesc: '查看跨链交易记录',
    // 导航栏
    selectNetwork: '选择网络',
    blockLabel: '区块',
    connectBtn: '连接',
    // 按钮状态
    btnConnectWallet: '连接钱包',
    btnSelectTarget: '选择目标链',
    btnEnterAmount: '输入金额',
    btnInsufficientBalance: '余额不足',
    btnConfirming: '确认中...',
    btnBridge: '桥接',
    // 信息面板
    infoRoute: '路由',
    infoBridgeFee: '桥接费',
    infoSlippage: '滑点',
    infoEstArrival: '预计到账',
    infoEstTime: '~30 秒',
    // 底部移动端导航
    mobileNavBridge: '跨链',
    // 推广横幅
    bannerTitle: '桥接 USDT 于 RX 和 BSC',
    bannerDesc: '快速 · 低费率 · 安全',
    // Token 选择器弹窗
    selectToken: '选择代币',
    searchToken: '搜索代币',
    allTokens: '全部代币',
    noTokensFound: '未找到代币',
    // Chain 选择器弹窗
    selectNetworkTitle: '选择网络',
    searchChain: '搜索链',
    allChains: '所有链',
    popularChains: '热门链',
    chains: '链',
    noChains: '未找到链',
    // 钱包弹窗
    connectWallet: '连接钱包',
    walletTerms: '连接钱包即表示您同意 ROBOTX Bridge',
    termsOfService: '服务条款',
    // 成功弹窗
    txSubmitted: '交易已提交',
    estArrival: '预计到账',
    bridgeFee: '桥接费',
    chainId: '链ID',
    close: '关闭',
    explorer: '浏览器',
    // 设置面板
    settings: '设置',
    slippageTolerance: '滑点容差',
    txDeadline: '交易截止时间',
    minutes: '分钟',
    custom: '自定义',
    // 选择网络提示
    selectNetworkHint: '选择网络',
    notSelected: '未选择',
    robotxConfirming: 'ROBOTX 确认中...',
    walletNotDetected_prefix: '未检测到 ',
    walletNotDetected_suffix: ' 扩展，是否前往安装？',
    rxNativeNotSupported: 'RX原生代币不支持跨链到外部链',
  },
  en: {
    // 导航标签
    navBridge: 'Bridge',
    navBridgeItem: 'Bridge',
    navBridgeDesc: 'Cross-chain asset transfer',
    navHistory: 'History',
    navHistoryDesc: 'View bridge transaction history',
    // 导航栏
    selectNetwork: 'Select Network',
    blockLabel: 'Block',
    connectBtn: 'Connect',
    // 按钮状态
    btnConnectWallet: 'Connect Wallet',
    btnSelectTarget: 'Select Target Chain',
    btnEnterAmount: 'Enter Amount',
    btnInsufficientBalance: 'Insufficient Balance',
    btnConfirming: 'Confirming...',
    btnBridge: 'Bridge',
    // 信息面板
    infoRoute: 'Route',
    infoBridgeFee: 'Bridge Fee',
    infoSlippage: 'Slippage',
    infoEstArrival: 'Est. Arrival',
    infoEstTime: '~30s',
    // 底部移动端导航
    mobileNavBridge: 'Bridge',
    // 推广横幅
    bannerTitle: 'Bridge USDT Between RX and BSC',
    bannerDesc: 'Fast · Low fees · Secure',
    // Token 选择器弹窗
    selectToken: 'Select a Token',
    searchToken: 'Search Token',
    allTokens: 'All Tokens',
    noTokensFound: 'No tokens found',
    // Chain 选择器弹窗
    selectNetworkTitle: 'Select a Network',
    searchChain: 'Search Chain',
    allChains: 'All Chains',
    popularChains: 'Popular Chains',
    chains: 'Chains',
    noChains: 'No chains found',
    // 钱包弹窗
    connectWallet: 'Connect Wallet',
    walletTerms: 'By connecting a wallet, you agree to ROBOTX Bridge',
    termsOfService: 'Terms of Service',
    // 成功弹窗
    txSubmitted: 'Transaction Submitted',
    estArrival: 'Estimated arrival',
    bridgeFee: 'Bridge fee',
    chainId: 'ChainID',
    close: 'Close',
    explorer: 'Explorer',
    // 设置面板
    settings: 'Settings',
    slippageTolerance: 'Slippage Tolerance',
    txDeadline: 'Transaction Deadline',
    minutes: 'minutes',
    custom: 'Custom',
    // 选择网络提示
    selectNetworkHint: 'Select Network',
    notSelected: 'Not Selected',
    robotxConfirming: 'ROBOTX Confirming...',
    walletNotDetected_prefix: '',
    walletNotDetected_suffix: ' extension not detected. Go to install?',
    rxNativeNotSupported: 'RX native token cannot be bridged to external chains',
  }
};

// ═══════════════════════════════════════════
// 链配置
// ═══════════════════════════════════════════
const CHAINS = [
  { id: 'robotx', name: 'ROBOTX', chainId: 0xA77, color: '#06B6D4', icon: null, blockTime: '3s', consensus: 'DPoS', nativeCurrency: 'RX' },
  { id: 'bsc', name: 'BNB Chain', chainId: 56, color: '#F0B90B', icon: 'https://cdn.orbiter.finance/icon/chain/56.svg', blockTime: '3s', consensus: 'PoSA', nativeCurrency: 'BNB' },
];

// ═══════════════════════════════════════════
// 代币配置
// ═══════════════════════════════════════════
const TOKENS = [
  { symbol: 'USDT', name: 'Tether USD', color: '#26A17B', decimals: 18, balance: 5000.00, price: 1.00, logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png', contract: process.env.REACT_APP_RX_USDT || '0x366749238c873ec04258d178b357b7e00422c0a4' },
];


// ═══════════════════════════════════════════
// 链→代币支持映射（按链过滤可选代币）
// ═══════════════════════════════════════════
const CHAIN_TOKEN_SUPPORT = {
  robotx: ['USDT'],
  bsc: ['USDT'],
};

const getTokensForChain = (chainId) => {
  const supported = CHAIN_TOKEN_SUPPORT[chainId];
  if (!supported) return TOKENS;
  return TOKENS.filter(tk => supported.includes(tk.symbol));
};

// ═══════════════════════════════════════════
// RPC 工具函数
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
// 桥接配置
// ═══════════════════════════════════════════
const BRIDGE_VAULT = process.env.REACT_APP_RX_BRIDGE_CONTRACT || '0xed8D698d18575d9f732556516A8721ABC8A87171';
// 各链桥合约地址
const BRIDGE_CONTRACTS = {
  56: process.env.REACT_APP_BSC_BRIDGE_CONTRACT || '0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7',    // BSC
};

// 外部链上的代币合约地址
const EXTERNAL_TOKEN_CONTRACTS = {
  56: { // BSC
    USDT: process.env.REACT_APP_BSC_USDT || '0x55d398326f99059fF775485246999027B3197955',
  },
};

const BRIDGE_RPC = process.env.REACT_APP_RX_RPC || 'https://rpc.robotxhub.ai';
const RELAYER_API_BASE = process.env.REACT_APP_RELAYER_API_BASE || 'https://bridge.robotxhub.ai';

// 外部链公共RPC节点
const CHAIN_RPCS = {
  56: 'https://bsc-rpc.publicnode.com',
};

// 外部链ERC-20代币精度映射
const EXTERNAL_TOKEN_DECIMALS = {
  56: { USDT: 18 },
};

const COINGECKO_MAP = {
  tether: 'USDT',
};
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd';

const externalRpcCall = async (chainId, method, params = []) => {
  const rpcUrl = CHAIN_RPCS[chainId];
  if (!rpcUrl) return null;
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: Date.now() })
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
};

const rpcCall = async (method, params = []) => {
  const res = await fetch(BRIDGE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: Date.now() })
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
};

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58Encode = (bytes) => {
  const digits = [0];
  for (const b of bytes) {
    let carry = b;
    for (let j = 0; j < digits.length; j++) { carry += digits[j] << 8; digits[j] = carry % 58; carry = (carry / 58) | 0; }
    while (carry > 0) { digits.push(carry % 58); carry = (carry / 58) | 0; }
  }
  let str = '';
  for (const b of bytes) { if (b === 0) str += '1'; else break; }
  for (let i = digits.length - 1; i >= 0; i--) str += BASE58_ALPHABET[digits[i]];
  return str;
};

const hexToRXAddress = async (hexAddr) => {
  try {
    const hex = hexAddr.replace(/^0x/i, '');
    if (hex.length !== 40) return hexAddr;
    const payload = new Uint8Array(21);
    payload[0] = 0x41;
    for (let i = 0; i < 20; i++) payload[i + 1] = parseInt(hex.substr(i * 2, 2), 16);
    const h1 = new Uint8Array(await crypto.subtle.digest('SHA-256', payload));
    const h2 = new Uint8Array(await crypto.subtle.digest('SHA-256', h1));
    const full = new Uint8Array(25);
    full.set(payload); full.set(h2.slice(0, 4), 21);
    return 'RX' + base58Encode(full);
  } catch (e) { return hexAddr; }
};

const waitForTx = async (txHash, maxRetries = 10) => {
  for (let i = 0; i < maxRetries; i++) {
    await new Promise(r => setTimeout(r, 3000));
    try {
      const receipt = await rpcCall('eth_getTransactionReceipt', [txHash]);
      if (receipt && receipt.blockHash) return receipt;
    } catch (e) {}
  }
  return null;
};

// chainId → Relayer链key映射
const CHAIN_ID_TO_KEY = {
  56: 'bsc',
};

// 调用Relayer反向跨链API
const callRelayerReverse = async (txHash, destChainId, destAddress, symbol, amount) => {
  const destChain = CHAIN_ID_TO_KEY[destChainId];
  if (!destChain) throw new Error('不支持的目标链: ' + destChainId);
  const resp = await fetch(`${RELAYER_API_BASE}/api/reverse-bridge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Bridge-Key': 'robotx-bridge-relayer-2026',
    },
    body: JSON.stringify({ txHash, destChain, destAddress, symbol, amount: amount.toString() }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || 'Relayer请求失败');
  return data;
};

// ERC-20 余额查询
const getERC20Balance = async (contractAddr, walletAddr) => {
  try {
    const addr = walletAddr.replace(/^0x/i, '').toLowerCase().padStart(64, '0');
    const data = '0x70a08231' + addr;
    const result = await rpcCall('eth_call', [{ to: contractAddr, data }, 'latest']);
    if (result && result !== '0x' && result !== '0x0') {
      return Number(BigInt(result));
    }
    return 0;
  } catch (e) {
    return 0;
  }
};

// ═══════════════════════════════════════════
// RX Token Icon
// ═══════════════════════════════════════════
const RXTokenIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{flexShrink:0}}>
    <defs>
      <linearGradient id="rxHexGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15"/>
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15"/>
      </linearGradient>
    </defs>
    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="url(#rxHexGrad)" stroke="#06B6D4" strokeWidth="1.5"/>
    <circle cx="15" cy="19" r="3.5" fill="#06B6D4"/>
    <circle cx="25" cy="19" r="3.5" fill="#06B6D4"/>
    <rect x="13" y="26" width="14" height="1.5" rx="0.75" fill="#06B6D4" opacity="0.5"/>
    <circle cx="20" cy="9" r="2" fill="#06B6D4"/>
  </svg>
);

// ═══════════════════════════════════════════
// Token Icon
// ═══════════════════════════════════════════
const TokenIcon = ({ token, size = 32 }) => {
  const [imgErr, setImgErr] = useState(false);
  if (token?.logo && !imgErr) {
    return <img src={token.logo} alt={token.symbol} width={size} height={size}
      style={{ borderRadius: '50%', objectFit: 'cover' }} onError={() => setImgErr(true)} />;
  }
  if (token?.symbol === 'RX') return <RXTokenIcon size={size} />;
  if (!token) return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#2e2e2e',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: size * 0.35, color: '#6c6c6c' }}>?</span>
    </div>
  );
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `${token.color}18`,
      border: `1.5px solid ${token.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'monospace', fontWeight: 700, fontSize: size * 0.4, color: token.color }}>
      {token.symbol[0]}
    </div>
  );
};

// ═══════════════════════════════════════════
// Chain Icon
// ═══════════════════════════════════════════
const ChainIcon = ({ chain, size = 20 }) => {
  const [imgErr, setImgErr] = useState(false);
  if (chain?.icon && !imgErr) {
    return <img src={chain.icon} alt={chain.name} width={size} height={size}
      style={{ borderRadius: 4, objectFit: 'cover' }} onError={() => setImgErr(true)} />;
  }
  if (chain?.id === 'robotx') return <img src="/logo.png" alt="RX" width={size} height={size} style={{borderRadius:'50%', objectFit:'contain'}}/>;
  if (!chain) return <div style={{ width: size, height: size, borderRadius: 4, background: '#2e2e2e' }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: 4, background: `${chain.color}25`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, fontWeight: 700, color: chain.color }}>
      {chain.name[0]}
    </div>
  );
};

// ═══════════════════════════════════════════
// 翻转箭头 SVG (精确复刻 Orbiter arrow-down.svg)
// ═══════════════════════════════════════════
const FlipArrowIcon = () => (
  <div style={{width:40, height:40, borderRadius:'50%', background:'var(--t-bg-card,#fff)', border:'2px solid var(--t-border-solid,#dce0e6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t-accent,#06B6D4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <polyline points="19 12 12 19 5 12"/>
    </svg>
  </div>
);

// ═══════════════════════════════════════════
// ROBOTX Nav Logo (对齐DEX RobotXNavLogo)
// ═══════════════════════════════════════════
const RobotXNavLogo = () => (
  <div className="flex items-center gap-1 cursor-pointer group">
    <img src="/logo.png" alt="RobotX" width="80" height="80" className="-mr-1 rounded-full" style={{objectFit:"contain"}}/>
    <span className="text-lg font-black tracking-wider" style={{fontFamily:"'Orbitron', sans-serif"}}>
        <span className="text-cyan-400">ROBOT</span>
        <span className="text-white">X</span>
      </span>
  </div>
);

// ═══════════════════════════════════════════
// 导航标签组件（带悬停下拉）(对齐DEX NavTab)
// ═══════════════════════════════════════════
const NavTab = ({ tab, activeNav, onSelect }) => {
  const [dropOpen, setDropOpen] = useState(false);
  const ref = useRef(null);
  const isActive = activeNav === tab.id;
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => { if (tab.items) setDropOpen(!dropOpen); else { onSelect(tab.id); setDropOpen(false); } }}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[15px] font-semibold transition-all ${
          isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}>
        {tab.label}
        {tab.items && <ChevronDown size={14} className={`transition-transform ${dropOpen ? 'rotate-180 text-slate-300' : 'text-slate-500'}`}/>}
      </button>
      {tab.items && dropOpen && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-[#15151e] border border-slate-800/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] py-2 min-w-[240px] max-w-[calc(100vw-32px)] overflow-hidden"
               style={{ animation: 'fadeInScale 0.15s ease-out' }}>
            {tab.items.map((item, i) => (
              <button key={i} onClick={() => { onSelect(tab.id); setDropOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  item.active ? 'bg-white/[0.03]' : 'hover:bg-white/[0.03]'
                }`}>
                <div className={`p-1.5 rounded-lg ${item.active ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                <div className="text-left">
                  <div className={`text-sm font-semibold ${item.active ? 'text-white' : 'text-slate-300'}`}>{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
                {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"/>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// 导航栏链选择器 (对齐DEX ChainSelector)
// ═══════════════════════════════════════════
const NAV_CHAINS = [
  { name: 'ROBOTX', color: '#06B6D4', id: 'robotx', chainId: 0xA77, blockTime: '3s', consensus: 'DPoS' },
  { name: 'BNB Chain', color: '#F0B90B', id: 'bsc', chainId: 56, blockTime: '3s', consensus: 'PoSA' },
];

const NavChainSelector = ({ t }) => {
  const [open, setOpen] = useState(false);
  const [chain, setChain] = useState(NAV_CHAINS[0]);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-transparent hover:border-slate-700/50 transition-all">
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${chain.color}25` }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: chain.color, boxShadow: `0 0 6px ${chain.color}80` }}/>
        </div>
        <span className="text-white text-sm font-medium hidden md:block">{chain.name}</span>
        <ChevronDown size={14} className="text-slate-400"/>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-[220px] bg-[#15151e] border border-slate-800/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] py-2 z-50"
             style={{ animation: 'fadeInScale 0.15s ease-out' }}>
          <div className="px-3 py-2 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{t.selectNetwork}</div>
          {NAV_CHAINS.map(c => (
            <button key={c.id} onClick={() => { setChain(c); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${chain.id === c.id ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'}`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${c.color}20` }}>
                <div className="w-3 h-3 rounded-full" style={{ background: c.color }}/>
              </div>
              <div className="flex-1 text-left">
                <span className={`text-sm font-medium ${chain.id === c.id ? 'text-white' : 'text-slate-300'}`}>{c.name}</span>
                <span className="text-[10px] text-slate-600 ml-1.5">{c.blockTime} · {c.consensus}</span>
              </div>
              {chain.id === c.id && <Check size={14} className="ml-auto text-cyan-400"/>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// Chain Selector Modal
// ═══════════════════════════════════════════
const ChainSelectorModal = ({ onSelect, onClose, currentChain, excludeChainId, t }) => {
  const [search, setSearch] = useState('');
  const [viewAll, setViewAll] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const popularIds = ['robotx', 'bsc'];
  const allChains = CHAINS.filter(c => c.chainId !== excludeChainId);
  const popularChains = allChains.filter(c => popularIds.includes(c.id));
  const searchResult = allChains.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search.toLowerCase()));
  const displayChains = search ? searchResult : viewAll ? allChains : popularChains;

  const handleSelect = (chain) => { onSelect(chain); onClose(); };

  return (
    <div className="fixed inset-0 z-[1202] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur" />
      <div className="relative w-full max-w-[24rem] mx-4 bg-[#1a1a1a] rounded-2xl border border-[#2e2e2e] p-2 flex flex-col overflow-hidden
        animate-[fadeInScale_0.6s_ease]" style={{ maxHeight: '40rem' }} onClick={e => e.stopPropagation()}>
        <input type="text" className="absolute -z-10 opacity-0" />

        <div className="p-2">
          <div className="text-[#fafafa] text-lg mb-4 font-medium" style={{ lineHeight: 1 }}>{t.selectNetworkTitle}</div>
          <div className="flex items-center gap-2 w-full bg-[#2e2e2e] rounded-xl p-2 mb-2">
            <Search size={15} className="text-[#6c6c6c] flex-shrink-0" />
            <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value.trim())}
              placeholder={t.searchChain} style={{ userSelect: 'all' }}
              className="w-full bg-transparent text-[#fafafa] text-sm outline-none placeholder:text-[#6c6c6c]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!search && (
            <div onClick={() => setViewAll(!viewAll)}
              className="cursor-pointer hover:bg-[#2e2e2e] hover:rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {CHAINS.slice(0, 3).map(c => (
                    <div key={c.id} className="w-6 h-6 rounded-full border-2 border-[#1a1a1a] overflow-hidden">
                      <ChainIcon chain={c} size={20} />
                    </div>
                  ))}
                </div>
                <span className="text-[#fafafa] text-sm font-medium">{t.allChains}</span>
              </div>
              {viewAll && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#4a9eff"/>
                  <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          )}

          {!search && (
            <div className="text-[#929292] text-sm px-2 pt-2 pb-1">
              {viewAll ? t.chains : t.popularChains}
            </div>
          )}

          {displayChains.map(chain => (
            <div key={chain.id} onClick={() => handleSelect(chain)}
              className="cursor-pointer hover:bg-[#2e2e2e] hover:rounded-lg p-2 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2">
                <ChainIcon chain={chain} size={24} />
                <span className="text-[#fafafa] text-sm">{chain.name}</span>
              </div>
              {currentChain?.id === chain.id && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#4a9eff"/>
                  <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

// ═══════════════════════════════════════════
// Token Selector Modal
// ═══════════════════════════════════════════
const TOKEN_ADDRESSES = {
  // RX: native token, no contract address
  // ETH: native token, no contract address
  USDT: '0xc213...b58e8f',
  USDC: '0x3c49...5c3359',
  BNB: '0x2170...b4Ece8',
  DAI: '0x6B17...1d0F',
};

const TokenSelectorModal = ({ onSelect, onClose, currentToken, fromChain, toChain, t, isRealWallet: isReal }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('from-chain');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const chainTokens = (() => {
    const from = getTokensForChain(fromChain?.id);
    const to = getTokensForChain(toChain?.id);
    const toSymbols = to.map(t => t.symbol);
    const intersection = from.filter(tk => toSymbols.includes(tk.symbol));
    return intersection.length > 0 ? intersection : from;
  })();
  const filtered = chainTokens.filter(tk =>
    tk.symbol.toLowerCase().includes(search.toLowerCase()) ||
    tk.name.toLowerCase().includes(search.toLowerCase())
  );
  const quickTokens = chainTokens.filter(tk => ['RX', 'ETH', 'USDT', 'BNB'].includes(tk.symbol));

  return (
    <div className="fixed inset-0 z-[1202] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur" />
      <div className="relative w-full max-w-[27.5rem] mx-4 bg-[#1a1a1a] rounded-2xl border border-[#2e2e2e]
        p-4 flex flex-col overflow-hidden animate-[fadeInScale_0.6s_ease]"
        style={{ maxHeight: '40rem' }} onClick={e => e.stopPropagation()}>

        <div className="flex justify-between items-center">
          <div className="text-[#fafafa] text-lg font-medium" style={{ lineHeight: 1 }}>{t.selectToken}</div>
          <X size={20} className="cursor-pointer text-[#fafafa]" onClick={onClose} />
        </div>

        <div className="w-full flex flex-col overflow-hidden pt-4 space-y-2">
          <div className="flex items-center gap-2 px-0">
            <div onClick={() => setActiveTab('from-chain')}
              className={`flex-1 flex items-center cursor-pointer py-2 px-1 rounded-xl transition-colors
                ${activeTab === 'from-chain' ? '' : 'opacity-50'} hover:bg-[#2e2e2e]`}>
              <div className="relative mr-1">
                <TokenIcon token={currentToken} size={32} />

              </div>
              <label className="px-2 cursor-pointer text-base flex flex-col">
                <span className="font-medium text-[#fafafa]" style={{ lineHeight: 1 }}>{currentToken?.symbol || 'Token'}</span>
                <div className="text-xs text-[#6c6c6c]">{fromChain?.name || t.notSelected}</div>
              </label>
            </div>

            <div className="w-7 h-7 rounded-lg bg-[#2e2e2e] flex items-center justify-center cursor-pointer
              active:scale-95 transition-all duration-200 flex-shrink-0">
              <ArrowRightLeft size={14} className="text-white" />
            </div>

            <div onClick={() => setActiveTab('to-chain')}
              className={`flex-1 flex items-center justify-end cursor-pointer py-2 px-1 rounded-xl transition-colors
                ${activeTab === 'to-chain' ? '' : 'opacity-50'} hover:bg-[#2e2e2e]`}>
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
            <div className={`w-5/12 h-full bg-white absolute top-0 rounded-full transition-all duration-200
              ${activeTab === 'from-chain' ? 'left-0' : 'right-0'}`} />
          </div>
        </div>

        <div className="flex items-center rounded-xl py-2.5 px-3 bg-[#2e2e2e] mt-3">
          <Search size={20} className="text-[#6c6c6c] flex-shrink-0" />
          <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t.searchToken} style={{ userSelect: 'all' }}
            className="flex-1 ml-2 bg-transparent text-[#fafafa] text-sm outline-none placeholder:text-[#6c6c6c]" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mt-3 scrollbar-none">
          {quickTokens.map(tk => (
            <div key={tk.symbol} onClick={() => { onSelect(tk); onClose(); }}
              className="flex items-center gap-1 shrink-0 rounded-full bg-[#2e2e2e] hover:bg-[#404040]
                text-sm cursor-pointer transition-colors" style={{ padding: '4px 10px 4px 4px' }}>
              <div className="relative mr-0.5">
                <TokenIcon token={tk} size={24} />

              </div>
              <span className="text-[#fafafa]">{tk.symbol}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-[#929292] mt-2 mb-1.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.6">
            <circle cx="4" cy="4" r="2.5"/><circle cx="12" cy="4" r="2.5"/>
            <circle cx="4" cy="12" r="2.5"/><circle cx="12" cy="12" r="2.5"/>
          </svg>
          <span>{t.allTokens}</span>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {filtered.map(token => (
            <div key={token.symbol} onClick={() => { onSelect(token); onClose(); }}
              className="flex justify-between items-center gap-2 p-2 hover:bg-[#2e2e2e] rounded-xl
                transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="relative mr-1">
                  <TokenIcon token={token} size={36} />

                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-[#fafafa] text-sm font-medium">{token.symbol}</span>
                    {token.symbol === 'RX' && (
                      <div className="bg-[#2e2e2e] text-xs text-[#fafafa] rounded-full px-2 py-0.5 ml-1">
                        Gas Token
                      </div>
                    )}
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

// ═══════════════════════════════════════════
// Settings Panel
// ═══════════════════════════════════════════
const SettingsPanel = ({ slippage, setSlippage, deadline, setDeadline, onClose, t }) => {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  const slippagePresets = ['0.1', '0.5', '1.0'];
  return (
    <div ref={ref} className="absolute top-14 right-0 w-[320px] max-w-[calc(100vw-32px)] bg-[#1a1a1a] border border-[#2e2e2e]
      rounded-2xl p-4 z-[60] shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-[fadeInScale_0.15s_ease-out]">
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
          {slippagePresets.map(p => (
            <button key={p} onClick={() => setSlippage(p)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-150
                ${slippage === p
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'bg-[#2e2e2e] text-[#b0b0b0] border border-transparent hover:bg-[#404040]'}`}>
              {p}%
            </button>
          ))}
          <div className="flex-1 relative">
            <input value={!slippagePresets.includes(slippage) ? slippage : ''}
              onChange={e => { if (/^[0-9]*\.?[0-9]*$/.test(e.target.value)) setSlippage(e.target.value); }}
              placeholder={t.custom}
              className="w-full py-2 px-3 rounded-xl text-sm font-medium bg-[#2e2e2e] text-white
                border border-transparent focus:border-cyan-500/30 outline-none text-center placeholder:text-[#6c6c6c]" />
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
          <input value={deadline} onChange={e => { if (/^\d*$/.test(e.target.value)) setDeadline(e.target.value); }}
            className="w-20 py-2 px-3 rounded-xl text-sm font-medium bg-[#2e2e2e] text-white
              border border-transparent focus:border-cyan-500/30 outline-none text-center" />
          <span className="text-[#6c6c6c] text-xs">{t.minutes}</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// Wallet Modal
// ═══════════════════════════════════════════
const WalletModal = ({ onConnect, onClose, t }) => {
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
      <div className="relative w-full max-w-[400px] mx-4 bg-[#1a1a1a] rounded-3xl border border-[#2e2e2e] p-6
        animate-[fadeInScale_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white font-semibold text-lg">{t.connectWallet}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg
            bg-[#2e2e2e] hover:bg-[#404040] transition-colors"><X size={16} className="text-[#b0b0b0]" /></button>
        </div>
        <div className="space-y-2">
          {wallets.map(w => (
            <button key={w.name} onClick={() => onConnect(w.name)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#0f0f0f] border border-[#2e2e2e]
                hover:border-[#404040] hover:bg-[#1a1a1a] transition-all duration-150 group">
              <span className="text-2xl w-8 text-center">{w.icon}</span>
              <span className="text-white text-sm font-medium flex-1 text-left group-hover:text-cyan-300 transition-colors">{w.name}</span>
              {w.popular && <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-medium">Popular</span>}
              <ChevronRight size={14} className="text-[#6c6c6c] group-hover:text-[#b0b0b0] transition-colors" />
            </button>
          ))}
        </div>
        <p className="text-[#6c6c6c] text-[11px] text-center mt-5 leading-relaxed">
          {t.walletTerms}<br />
          <span className="text-cyan-400/60 hover:text-cyan-400 cursor-pointer">{t.termsOfService}</span>
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// Success Modal
// ═══════════════════════════════════════════
const SuccessModal = ({ fromChain, toChain, fromToken, toToken, amount, txHash: initialTxHash, sourceTxHash, onClose, t }) => {
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState(initialTxHash);
  const bridgeFeeText = fromChain?.id === 'robotx' ? '4%' : '1%';
  // 正向跨链时: txHash===sourceTxHash 说明前端没拿到ROBOTX链真实hash, 需要轮询Relayer
  useEffect(() => {
    if (!sourceTxHash || !initialTxHash || initialTxHash !== sourceTxHash) return;
    if (fromChain?.id === 'robotx') return; // 反向跨链不需要
    let alive = true;
    const poll = async () => {
      try {
        const res = await fetch(`${RELAYER_API_BASE}/api/release-status?sourceTxHash=${sourceTxHash}`);
        const data = await res.json();
        if (alive && data.status === 'released' && data.robotxTxHash) {
          let h = data.robotxTxHash;
          if (!h.startsWith('0x')) h = '0x' + h;
          setTxHash(h);
        }
      } catch(e) {}
    };
    poll();
    const timer = setInterval(poll, 3000);
    const timeout = setTimeout(() => { clearInterval(timer); }, 120000); // 2分钟超时
    return () => { alive = false; clearInterval(timer); clearTimeout(timeout); };
  }, [initialTxHash, sourceTxHash, fromChain]);
  const copyHash = () => { navigator.clipboard.writeText(txHash); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-[400px] mx-4 bg-[#1a1a1a] rounded-3xl border border-[#2e2e2e] p-6 text-center
        animate-[fadeInScale_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/15 border-2 border-green-500/40
          flex items-center justify-center">
          <Check size={32} className="text-green-400" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">{t.txSubmitted}</h3>
        <p className="text-[#b0b0b0] text-sm mb-1">
          {amount} {fromToken?.symbol} → {toToken?.symbol}
        </p>
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
            <span className="text-[#b0b0b0]">{bridgeFeeText}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#6c6c6c]">{t.chainId}</span>
            <span className="text-[#b0b0b0] font-mono">0xA77</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {txHash === sourceTxHash && fromChain?.id !== 'robotx' ? (
              <button className="flex-1 py-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400/50 text-xs font-medium flex items-center justify-center gap-1 cursor-wait">
                <RefreshCw size={11} className="animate-spin" />{t.robotxConfirming}
              </button>
            ) : (
              <button onClick={() => window.open(`https://explorer.robotxhub.io/?tx=${txHash}`, '_blank')} className="flex-1 py-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 text-xs font-medium hover:bg-cyan-500/25 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                <ExternalLink size={11} />ROBOTX Explorer
              </button>
            )}
            {sourceTxHash && sourceTxHash !== txHash && (() => {
              const exps = {56:'https://bscscan.com/tx/'};
              const cid = fromChain?.id !== 'robotx' ? fromChain?.chainId : toChain?.chainId;
              const u = exps[cid];
              return u ? <button onClick={() => window.open(u + sourceTxHash, '_blank')} className="flex-1 py-2.5 rounded-2xl bg-purple-500/15 text-purple-400 text-xs font-medium hover:bg-purple-500/25 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                <ExternalLink size={11} />{fromChain?.id !== 'robotx' ? fromChain?.name : toChain?.name} Scan
              </button> : null;
            })()}
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-2xl bg-[#2e2e2e] text-white text-sm font-medium hover:bg-[#404040] transition-colors">{t.close}</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// 主组件
// ═══════════════════════════════════════════

// ========== ThemeSwitcher ==========
const ThemeSwitcher = ({ theme, onChange }) => {
  const items = [
    { key: 'dark', label: 'Dark' },
    { key: 'dim', label: 'Dim' },
    { key: 'light', label: 'Light' },
  ];
  return (
    <div className="theme-switcher">
      {items.map(it => (
        <button key={it.key} onClick={() => onChange(it.key)}
          className={`theme-btn ${theme === it.key ? 'active' : ''}`}>
          {it.key === 'dark' ? <Moon size={10}/> : <Sun size={10}/>} {it.label}
        </button>
      ))}
    </div>
  );
};

const BridgeInterface = () => {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  // 导航标签配置 (需要依赖 t)
  const NAV_TABS = [
    {
      id: 'bridge', label: t.navBridge, active: true,
      items: [
        { icon: <ArrowRightLeft size={16}/>, label: t.navBridgeItem, desc: t.navBridgeDesc, active: true },
        { icon: <Clock size={16}/>, label: t.navHistory, desc: t.navHistoryDesc },
      ]
    },
  ];

  // 核心状态
  const [fromChain, setFromChain] = useState(CHAINS[0]);
  const [toChain, setToChain] = useState(null);
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');

  // UI 状态
  const [showFromChainSelector, setShowFromChainSelector] = useState(false);
  const [showToChainSelector, setShowToChainSelector] = useState(false);
  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false);
  const [showToTokenSelector, setShowToTokenSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // 设置
  const [slippage, setSlippage] = useState('0.5');
  const [deadline, setDeadline] = useState('30');

  // 钱包
  const [isConnected, setIsConnected] = useState(false);

  // CoinGecko实时价格
  const [livePrices, setLivePrices] = useState(null);
  useEffect(() => {
    let alive = true;
    const fetchPrices = async () => {
      try {
        const res = await fetch(COINGECKO_URL);
        const data = await res.json();
        const prices = {};
        for (const [geckoId, symbol] of Object.entries(COINGECKO_MAP)) {
          if (data[geckoId] && data[geckoId].usd > 0) prices[symbol] = data[geckoId].usd;
        }
        if (alive && Object.keys(prices).length > 0) setLivePrices(prices);
      } catch (e) {}
    };
    fetchPrices();
    const timer = setInterval(fetchPrices, 60000);
    return () => { alive = false; clearInterval(timer); };
  }, []);
  const getTokenPrice = useCallback((token) => {
    if (!token) return 0;
    return (livePrices && livePrices[token.symbol]) || token.price;
  }, [livePrices]);
  const [connectedWallet, setConnectedWallet] = useState('');
  const [isBridging, setIsBridging] = useState(false);
  const [isRealWallet, setIsRealWallet] = useState(false);
  const [rxBalance, setRxBalance] = useState(0);
  const [tokenBalances, setTokenBalances] = useState({});
  const [accountInfo, setAccountInfo] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [rawHexAddress, setRawHexAddress] = useState('');
  const [externalNativeBalance, setExternalNativeBalance] = useState(0);
  const [externalTokenBalances, setExternalTokenBalances] = useState({});

  // 导航
  const [theme, setTheme] = useState('light');
  const [activeNav, setActiveNav] = useState('bridge');
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 链数据
  const [chainData, setChainData] = useState({ blockHeight: 0, txCount: 0, srCount: 0, epochBlock: 0 });

  // RPC 轮询
  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const blockHex = await rpcCall('eth_blockNumber', []);
        if (alive && blockHex) {
          const blockHeight = parseInt(blockHex, 16) || 0;
          setChainData({
            blockHeight,
            txCount: 0,
            srCount: 0,
            epochBlock: 0,
          });
        }
      } catch (_) {}
    };
    poll();
    const timer = setInterval(poll, 6000);
    return () => { alive = false; clearInterval(timer); };
  }, []);

  // 余额轮询 (MetaMask连接后)
  useEffect(() => {
    if (!isConnected || !walletAddress || !isRealWallet) return;
    let alive = true;
    const fetchBalance = async () => {
      try {
        const balance = await rpcCall('eth_getBalance', [rawHexAddress || walletAddress, 'latest']);
        if (alive) {
          const bal = balance ? Number(BigInt(balance)) : 0;
          setRxBalance(bal / 1e18);
        }
      } catch (e) {}
    };
    fetchBalance();
    const timer = setInterval(fetchBalance, 10000);
    return () => { alive = false; clearInterval(timer); };
  }, [isConnected, walletAddress, isRealWallet, rawHexAddress]);

  // 账户信息轮询
  useEffect(() => {
    if (!isConnected || !walletAddress || !isRealWallet) return;
    let alive = true;
    const fetchAccountInfo = async () => {
      try {
        const nonceHex = await rpcCall('eth_getTransactionCount', [rawHexAddress || walletAddress, 'latest']);
        if (alive && nonceHex) setAccountInfo({ nonce: parseInt(nonceHex, 16) || 0 });
      } catch (e) {}
    };
    fetchAccountInfo();
    const timer = setInterval(fetchAccountInfo, 10000);
    return () => { alive = false; clearInterval(timer); };
  }, [isConnected, walletAddress, isRealWallet, rawHexAddress]);

  // ERC-20 代币余额轮询
  useEffect(() => {
    if (!isConnected || !rawHexAddress || !isRealWallet) return;
    let alive = true;
    const fetchTokenBalances = async () => {
      const balances = {};
      for (const token of TOKENS) {
        if (!token.contract) continue;
        try {
          const raw = await getERC20Balance(token.contract, rawHexAddress);
          balances[token.symbol] = raw / Math.pow(10, token.decimals);
        } catch (e) {
          balances[token.symbol] = 0;
        }
      }
      if (alive) setTokenBalances(balances);
    };
    fetchTokenBalances();
    const timer = setInterval(fetchTokenBalances, 15000);
    return () => { alive = false; clearInterval(timer); };
  }, [isConnected, rawHexAddress, isRealWallet]);

  // 外部链余额轮询 (从源链公共RPC查询真实余额)
  useEffect(() => {
    if (!isConnected || !rawHexAddress || !isRealWallet || fromChain?.id === 'robotx') {
      setExternalNativeBalance(0);
      setExternalTokenBalances({});
      return;
    }
    let alive = true;
    const fetchExternalBalances = async () => {
      const chainId = fromChain.chainId;
      if (!rawHexAddress || !rawHexAddress.startsWith('0x') || rawHexAddress.length < 42) return;
      try {
        const result = await externalRpcCall(chainId, 'eth_getBalance', [rawHexAddress, 'latest']);
        if (alive && result) setExternalNativeBalance(Number(BigInt(result)) / 1e18);
      } catch (e) {}
      const contracts = EXTERNAL_TOKEN_CONTRACTS[chainId] || {};
      const decimalsMap = EXTERNAL_TOKEN_DECIMALS[chainId] || {};
      const balances = {};
      for (const [symbol, contractAddr] of Object.entries(contracts)) {
        if (contractAddr === 'native') continue;
        try {
          const addr = rawHexAddress.replace(/^0x/i, '').toLowerCase().padStart(64, '0');
          const data = '0x70a08231' + addr;
          const result = await externalRpcCall(chainId, 'eth_call', [{ to: contractAddr, data }, 'latest']);
          if (result && result !== '0x' && result !== '0x0') {
            const decimals = decimalsMap[symbol] || 18;
            balances[symbol] = Number(BigInt(result)) / Math.pow(10, decimals);
          } else {
            balances[symbol] = 0;
          }
        } catch (e) { balances[symbol] = 0; }
      }
      if (alive) setExternalTokenBalances(balances);
    };
    fetchExternalBalances();
    const timer = setInterval(fetchExternalBalances, 15000);
    return () => { alive = false; clearInterval(timer); };
  }, [isConnected, rawHexAddress, isRealWallet, fromChain]);

  // 监听fromChain变化，自动验证fromToken兼容性
  useEffect(() => {
    if (fromChain && fromToken) {
      const supported = CHAIN_TOKEN_SUPPORT[fromChain.id];
      if (supported && !supported.includes(fromToken.symbol)) {
        const firstSupported = TOKENS.find(tk => supported.includes(tk.symbol));
        if (firstSupported) setFromToken(firstSupported);
      }
    }
  }, [fromChain]);

  // 跨链同币种锁定: toToken始终跟随fromToken
  useEffect(() => {
    if (fromToken && (!toToken || toToken.symbol !== fromToken.symbol)) {
      setToToken(fromToken);
    }
  }, [fromToken]);

  // 监听toChain变化，自动验证toToken兼容性
  useEffect(() => {
    if (toChain && toToken) {
      const supported = CHAIN_TOKEN_SUPPORT[toChain.id];
      if (supported && !supported.includes(toToken.symbol)) {
        const firstSupported = TOKENS.find(tk => supported.includes(tk.symbol));
        if (firstSupported) setToToken(firstSupported);
      }
    }
  }, [toChain]);

  // 反向跨链时: toChain变化需检查fromToken是否被目标链支持
  useEffect(() => {
    if (fromChain?.id === 'robotx' && toChain && fromToken) {
      const supported = CHAIN_TOKEN_SUPPORT[toChain.id];
      if (supported && !supported.includes(fromToken.symbol)) {
        const firstSupported = TOKENS.find(tk => supported.includes(tk.symbol));
        if (firstSupported) {
          setFromToken(firstSupported);
          setToToken(firstSupported);
        }
      }
    }
  }, [toChain]);

  // 计算接收金额(正向1%手续费, 反向4%手续费)
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && fromToken && toToken && toChain) {
      const feeRate = fromChain?.id === 'robotx' ? 0.04 : 0.01;
      const fee = parseFloat(amount) * feeRate;
      const afterFee = parseFloat(amount) - fee;
      const receive = afterFee * (getTokenPrice(fromToken) / getTokenPrice(toToken));
      setReceiveAmount(receive > 0 ? receive.toFixed(getTokenPrice(toToken) >= 100 ? 8 : 4) : '0');
    } else {
      setReceiveAmount('');
    }
  }, [amount, fromToken, toToken, toChain, getTokenPrice]);

  // 获取代币真实余额
  const getTokenBal = (token) => {
    // 外部链(Base/ETH/BSC等): 只显示公共RPC查到的真实余额, 绝不显示虚拟数据
    if (fromChain?.id !== 'robotx') {
      if (!isRealWallet || !rawHexAddress) return 0;
      const contracts = EXTERNAL_TOKEN_CONTRACTS[fromChain?.chainId] || {};
      if (contracts[token.symbol] === 'native') return externalNativeBalance;
      return externalTokenBalances[token.symbol] !== undefined ? externalTokenBalances[token.symbol] : 0;
    }
    // ROBOTX链: 真实钱包用RPC余额, 模拟钱包用演示数据
    if (!isRealWallet) return token.balance;
    if (token.symbol === 'RX') return rxBalance;
    return tokenBalances[token.symbol] !== undefined ? tokenBalances[token.symbol] : 0;
  };

  // 翻转链
  const handleFlip = useCallback(() => {
    if (!toChain) return;
    setFromChain(prev => { setToChain(prev); return toChain; });
    setFromToken(prev => { setToToken(prev); return toToken; });
  }, [toChain, toToken]);

  // 跨链交易
  const handleBridge = useCallback(async () => {
    setIsBridging(true);
    const isFromRobotx = fromChain?.id === 'robotx';
    const isToRobotx = toChain?.id === 'robotx';

    if (!isFromRobotx && isToRobotx && window.ethereum) {
      // ===== 外部链 → ROBOTX (合约交互桥接) =====
      try {
        const provider = window.ethereum;
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        const userAddr = accounts[0];
        const destAddr = rawHexAddress || walletAddress || userAddr;

        // 切换到源链
        const sourceChainHex = '0x' + fromChain.chainId.toString(16);
        try { await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: sourceChainHex }] }); }
        catch (sw) { console.log('chain switch:', sw); }

        const tokenSymbol = fromToken?.symbol;
        const externalContracts = EXTERNAL_TOKEN_CONTRACTS[fromChain.chainId] || {};
        const tokenContract = externalContracts[tokenSymbol];
        // 外部链ERC-20用实际精度(EXTERNAL_TOKEN_DECIMALS), 原生代币用18
        const externalDec = EXTERNAL_TOKEN_DECIMALS[fromChain.chainId]?.[tokenSymbol];
        const decimals = (tokenContract && tokenContract !== 'native' && externalDec !== undefined) ? externalDec : (fromToken?.decimals || 18);
        const rawAmount = BigInt(Math.round(parseFloat(amount) * (10 ** decimals)));
        const bridgeTarget = BRIDGE_CONTRACTS[fromChain.chainId] || BRIDGE_VAULT;

        let sourceTxHash;
        if (!tokenContract || tokenContract === 'native') {
          // 原生代币: 调用合约 depositNative(destAddress) 或直接转账到Vault
          if (bridgeTarget !== BRIDGE_VAULT) {
            // 合约模式: depositNative(string destAddress)
            const destBytes = new TextEncoder().encode(destAddr);
            const destHex = Array.from(destBytes).map(b => b.toString(16).padStart(2, '0')).join('');
            // ABI: depositNative(string) = 0xd51ba8f6
            // encode: offset(32) + length(32) + data(padded)
            const paddedLen = Math.ceil(destHex.length / 2 / 32) * 32;
            const depositData = '0xd51ba8f6' +
              '0000000000000000000000000000000000000000000000000000000000000020' +
              (destHex.length / 2).toString(16).padStart(64, '0') +
              destHex.padEnd(paddedLen * 2, '0');
            sourceTxHash = await provider.request({
              method: 'eth_sendTransaction',
              params: [{ from: userAddr, to: bridgeTarget, value: '0x' + rawAmount.toString(16), data: depositData }]
            });
          } else {
            // EOA模式: 直接转账
            sourceTxHash = await provider.request({
              method: 'eth_sendTransaction',
              params: [{ from: userAddr, to: BRIDGE_VAULT, value: '0x' + rawAmount.toString(16) }]
            });
          }
        } else {
          // ERC-20: 先approve合约, 再调用depositToken
          if (bridgeTarget !== BRIDGE_VAULT) {
            // 等待交易确认
            const waitForReceipt = async (txHash, maxWait = 60000) => {
              const start = Date.now();
              while (Date.now() - start < maxWait) {
                try {
                  const receipt = await window.ethereum.request({
                    method: 'eth_getTransactionReceipt', params: [txHash]
                  });
                  if (receipt && receipt.blockNumber) return receipt;
                } catch (_) {}
                await new Promise(r => setTimeout(r, 2000));
              }
              throw new Error('Transaction confirmation timeout');
            };
            // Step 1: 检查授权额度, 智能approve (兼容ETH USDT等要求先清零的代币)
            const allowanceData = '0xdd62ed3e' +
              userAddr.slice(2).toLowerCase().padStart(64, '0') +
              bridgeTarget.slice(2).toLowerCase().padStart(64, '0');
            let currentAllowance = 0n;
            try {
              const allowanceResult = await provider.request({
                method: 'eth_call',
                params: [{ to: tokenContract, data: allowanceData }, 'latest']
              });
              currentAllowance = BigInt(allowanceResult || '0x0');
            } catch (_) {}
            if (currentAllowance < rawAmount) {
              // 已有授权但不够, 先清零再授权 (ETH USDT要求approve前allowance必须为0)
              if (currentAllowance > 0n) {
                const approveZeroData = '0x095ea7b3' +
                  bridgeTarget.slice(2).toLowerCase().padStart(64, '0') +
                  '0'.padStart(64, '0');
                const zeroTx = await provider.request({
                  method: 'eth_sendTransaction',
                  params: [{ from: userAddr, to: tokenContract, data: approveZeroData }]
                });
                await waitForReceipt(zeroTx);
              }
              const approveData = '0x095ea7b3' +
                bridgeTarget.slice(2).toLowerCase().padStart(64, '0') +
                rawAmount.toString(16).padStart(64, '0');
              const approveTxHash = await provider.request({
                method: 'eth_sendTransaction',
                params: [{ from: userAddr, to: tokenContract, data: approveData }]
              });
              await waitForReceipt(approveTxHash);
            }
            // Step 2: depositToken(address token, uint256 amount, string destAddress)
            const destBytes = new TextEncoder().encode(destAddr);
            const destHex = Array.from(destBytes).map(b => b.toString(16).padStart(2, '0')).join('');
            const paddedLen = Math.ceil(destHex.length / 2 / 32) * 32;
            // ABI: depositToken(address,uint256,string) = 0xa10d0960
            // keccak256("depositToken(address,uint256,string)") 前4字节
            const depositTokenData = '0xa10d0960' +
              tokenContract.slice(2).toLowerCase().padStart(64, '0') +
              rawAmount.toString(16).padStart(64, '0') +
              '0000000000000000000000000000000000000000000000000000000000000060' +
              (destHex.length / 2).toString(16).padStart(64, '0') +
              destHex.padEnd(paddedLen * 2, '0');
            sourceTxHash = await provider.request({
              method: 'eth_sendTransaction',
              params: [{ from: userAddr, to: bridgeTarget, data: depositTokenData }]
            });
          } else {
            // EOA模式: 直接transfer到Vault
            const transferData = '0xa9059cbb' +
              BRIDGE_VAULT.slice(2).toLowerCase().padStart(64, '0') +
              rawAmount.toString(16).padStart(64, '0');
            sourceTxHash = await provider.request({
              method: 'eth_sendTransaction',
              params: [{ from: userAddr, to: tokenContract, data: transferData }]
            });
          }
        }

        setSuccessData({
          fromChain, toChain, fromToken, toToken, amount,
          txHash: sourceTxHash,
          sourceTxHash,
        });
        setAmount(''); setReceiveAmount('');
        setIsBridging(false);
      } catch (e) {
        setIsBridging(false);
        alert(t.btnBridge + ' failed: ' + e.message);
      }
    } else if (isRealWallet && isFromRobotx && !isToRobotx) {
      // ===== ROBOTX → 外部链 (反向跨链: 发送到Vault → Relayer调用外部链withdraw) =====
      try {
        // 切换到 ROBOTX 链
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xA77' }]
          });
        } catch (sw) {}

        const userAddr = rawHexAddress || walletAddress;

        // 检查: RX原生代币不支持反向跨链(必须在转账前拦截,防止资金卡在VAULT)
        if (fromToken?.symbol === "RX") {
          throw new Error(t.rxNativeNotSupported);
        }

        // MetaMask签名发送(弹窗确认)
        let robotxTxHash;
        let rawAmountStr;

        if (fromToken?.symbol === 'RX') {
          // 原生RX转账到Vault (通过MetaMask签名)
          const rawVal = Math.round(parseFloat(amount) * 1e6);
          rawAmountStr = rawVal.toString();
          robotxTxHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: rawHexAddress || walletAddress,
              to: BRIDGE_VAULT,
              value: '0x' + rawVal.toString(16),
            }]
          });
        } else {
          // ERC-20 转账到 Vault (通过MetaMask签名)
          const decimals = fromToken?.decimals || 18;
          const rawAmount = BigInt(Math.round(parseFloat(amount) * (10 ** decimals)));
          rawAmountStr = rawAmount.toString();
          const transferData = '0xa9059cbb' +
            BRIDGE_VAULT.slice(2).toLowerCase().padStart(64, '0') +
            rawAmount.toString(16).padStart(64, '0');
          robotxTxHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: rawHexAddress || walletAddress,
              to: fromToken.contract,
              data: transferData,
              value: '0x0',
            }]
          });
        }

        // 等待ROBOTX链交易确认
        await waitForTx(robotxTxHash, 10);

        // 获取用户外部链地址 (MetaMask当前地址)
        let extAddr = userAddr;
        if (window.ethereum) {
          try {
            const accts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accts && accts[0]) extAddr = accts[0];
          } catch (_) {}
        }
        if (!extAddr || !extAddr.startsWith('0x')) {
          throw new Error('Please connect MetaMask to get external chain address');
        }

        // 调用Relayer反向跨链API
        const relayerResult = await callRelayerReverse(
          robotxTxHash, toChain.chainId, extAddr,
          fromToken?.symbol, rawAmountStr
        );

        setSuccessData({
          fromChain, toChain, fromToken, toToken, amount,
          txHash: robotxTxHash,
          sourceTxHash: relayerResult.withdrawTx || robotxTxHash,
        });
        setAmount(''); setReceiveAmount('');
        setIsBridging(false);
      } catch (e) {
        setIsBridging(false);
        alert(t.btnBridge + ' failed: ' + e.message);
      }
    } else if (isRealWallet && isFromRobotx && isToRobotx) {
      setIsBridging(false);
      alert('Same-chain transfer is not supported in this bridge UI.');
    } else {
      // 模拟模式
      setTimeout(() => {
        const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setSuccessData({ fromChain, toChain, fromToken, toToken, amount, txHash });
        setAmount(''); setReceiveAmount('');
        setIsBridging(false);
      }, 2500);
    }
  }, [fromChain, toChain, fromToken, toToken, amount, isRealWallet, accountInfo, rawHexAddress, walletAddress]);

  // 连接钱包
  const handleConnect = useCallback(async (name) => {
    // MetaMask / OKX / Trust 等注入式钱包
    const provider = window.ethereum;
    if (name === 'MetaMask' || name === 'OKX Wallet' || name === 'Trust Wallet' || name === 'Coinbase Wallet') {
      if (!provider) {
        const urls = {
          'MetaMask': 'https://metamask.io/download/',
          'OKX Wallet': 'https://www.okx.com/web3',
          'Trust Wallet': 'https://trustwallet.com/download',
          'Coinbase Wallet': 'https://www.coinbase.com/wallet/downloads',
        };
        if (window.confirm(t.walletNotDetected_prefix + name + t.walletNotDetected_suffix)) {
          window.open(urls[name] || 'https://metamask.io/download/', '_blank');
        }
        return;
      }
      try {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xA77',
              chainName: 'ROBOTX Mainnet',
              nativeCurrency: { name: 'RX', symbol: 'RX', decimals: 18 },
              rpcUrls: ['https://rpc.robotxhub.ai'],
              blockExplorerUrls: ['https://explorer.robotxhub.ai'],
            }]
          });
        } catch (addErr) {}
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          const hex = accounts[0];
          setRawHexAddress(hex);
          setWalletAddress(hex);
          setConnectedWallet(name);
          setIsConnected(true);
          setIsRealWallet(true);
          setShowWalletModal(false);
        }
      } catch (e) { console.error(name + '连接失败:', e); }
    } else {
      // WalletConnect 等暂用模拟
      setWalletAddress('0x1111111111111111111111111111111111111111');
      setConnectedWallet(name);
      setIsConnected(true);
      setIsRealWallet(false);
      setRxBalance(12580);
      setShowWalletModal(false);
    }
  }, []);

  // 按钮状态
  const getButtonState = () => {
    if (!isConnected) return { text: t.btnConnectWallet, style: 'wallet', action: () => setShowWalletModal(true), disabled: false };
    if (!toChain) return { text: t.btnSelectTarget, style: 'disabled', disabled: true };
    if (!amount || parseFloat(amount) <= 0) return { text: t.btnEnterAmount, style: 'disabled', disabled: true };
    const bal = getTokenBal(fromToken);
    if (parseFloat(amount) > bal) return { text: `${fromToken.symbol} ${t.btnInsufficientBalance}`, style: 'error', disabled: true };
    if (isBridging) return { text: t.btnConfirming, style: 'loading', disabled: true, loading: true };
    return { text: t.btnBridge, style: 'bridge', action: handleBridge, disabled: false };
  };

  const btn = getButtonState();
  const usdValue = amount && parseFloat(amount) > 0 ? (parseFloat(amount) * getTokenPrice(fromToken)) : 0;
  const receiveUsd = receiveAmount && parseFloat(receiveAmount) > 0 ? (parseFloat(receiveAmount) * toToken.price) : 0;
  const feeRate = fromChain?.id === 'robotx' ? 0.05 : 0.01;
  const bridgeFee = amount && parseFloat(amount) > 0 ? parseFloat(amount) * feeRate : 0;
  const hasValidBridge = amount && parseFloat(amount) > 0 && toChain;

  return (
    <div data-theme={theme} className="min-h-screen w-full pb-20 md:pb-0" style={{ background: 'var(--t-bg)' }}>
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)', filter: 'blur(120px)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', filter: 'blur(120px)' }} />
      </div>

      {/* 顶部导航栏 */}
      <nav style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64, padding: '0 20px', borderBottom: '1px solid rgba(30,41,59,0.3)',
        background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40,
      }}>
        {/* 左侧: Logo + 导航标签 */}
        <div className="flex items-center gap-1">
          <RobotXNavLogo />
          <div className="hidden md:flex items-center gap-0.5 ml-4">
            {NAV_TABS.map(tab => (
              <NavTab key={tab.id} tab={tab} activeNav={activeNav} onSelect={setActiveNav}/>
            ))}
          </div>
          <button className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors ml-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <MoreHorizontal size={22}/>
          </button>
        </div>

        {/* 右侧 */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block"><ThemeSwitcher theme={theme} onChange={setTheme} /></div>
          {/* 语言切换按钮 */}
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-transparent hover:border-slate-700/50 transition-all"
            title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            <Globe size={14} className="text-cyan-400" />
            <span className="text-white text-xs font-medium">{lang === 'zh' ? 'EN' : '中'}</span>
          </button>

          {/* 实时区块高度 */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-slate-800/40 text-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.6)' }}/>
            <span className="text-slate-500">{t.blockLabel}</span>
            <span className="text-green-400 font-semibold">{chainData.blockHeight ? `#${chainData.blockHeight.toLocaleString()}` : '...'}</span>
          </div>

          {/* 链选择器 */}
          <div class="hidden md:block"><NavChainSelector t={t} /></div>

          {/* 钱包按钮 */}
          {isConnected ? (
            <div className="relative">
              <button onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-transparent hover:border-slate-700/50 transition-all">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#0a0a0f]"/>
                </div>
                <span className="hidden md:inline text-white text-sm font-medium font-mono">{walletAddress ? (walletAddress.length > 12 ? walletAddress.slice(0, 8) + '...' + walletAddress.slice(-4) : walletAddress) : '0x1234...5678'}</span>
                <ChevronDown size={14} className={`hidden md:inline text-slate-400 transition-transform ${showWalletDropdown ? 'rotate-180' : ''}`}/>
              </button>
              {showWalletDropdown && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setShowWalletDropdown(false)}/>
                  <div className="absolute right-0 top-full mt-2 w-[280px] max-w-[calc(100vw-32px)] rounded-xl border shadow-2xl z-[91] overflow-hidden" style={{background:'var(--card-bg, #16161e)', borderColor:'var(--border, #2a2a3a)'}}>
                    <div className="px-4 py-3" style={{borderBottom:'1px solid var(--border, #2a2a3a)'}}>
                      <div className="text-[10px] uppercase tracking-wider mb-1" style={{color:'var(--text-muted, #888)'}}>Wallet Address</div>
                      <div className="text-xs font-mono break-all" style={{color:'var(--text, #fff)'}}>{walletAddress || '0x1234567890abcdef1234567890abcdef12345678'}</div>
                    </div>
                    <button onClick={() => { const addr = walletAddress || rawHexAddress; navigator.clipboard.writeText(addr).then(() => { setCopiedAddress(true); setTimeout(() => setCopiedAddress(false), 2000); }); }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left" style={{color:'var(--text, #fff)'}}>
                      {copiedAddress ? <Check size={16} className="text-green-400"/> : <Copy size={16} className="text-cyan-400"/>}
                      <span className="text-sm">{copiedAddress ? (lang === 'zh' ? '已复制' : 'Copied!') : (lang === 'zh' ? '复制地址' : 'Copy Address')}</span>
                    </button>
                    <button onClick={() => { setIsConnected(false); setConnectedWallet(''); setIsRealWallet(false); setWalletAddress(''); setRawHexAddress(''); setRxBalance(0); setTokenBalances({}); setAccountInfo(null); setExternalNativeBalance(0); setExternalTokenBalances({}); setShowWalletDropdown(false); }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-left" style={{borderTop:'1px solid var(--border, #2a2a3a)'}}>
                      <LogOut size={16} className="text-red-400"/>
                      <span className="text-sm text-red-400">{lang === 'zh' ? '断开连接' : 'Disconnect'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => setShowWalletModal(true)}
              className="px-5 py-2 rounded-full bg-cyan-500/15 text-cyan-400 font-semibold text-sm border border-cyan-500/25 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all">
              {t.connectBtn}
            </button>
          )}
        </div>
      </nav>

      {/* 移动端导航抽屉 */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[80]" style={{ position: 'fixed' }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}/>
          <div className="absolute top-0 left-0 w-[280px] h-full bg-[#12121a] border-r border-slate-800/60 p-5 overflow-y-auto" style={{ animation: 'fadeInScale 0.2s ease-out' }}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-bold text-lg">ROBOTX</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400"><X size={20}/></button>
            </div>
            {NAV_TABS.map(tab => (
              <div key={tab.id} className="mb-2">
                <button onClick={() => { setActiveNav(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${activeNav === tab.id ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}>
                  {tab.label}
                </button>
                {tab.items && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {tab.items.map((item, i) => (
                      <button key={i} onClick={() => { setActiveNav(tab.id); setMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-colors">
                        <span className={item.active ? 'text-cyan-400' : ''}>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* 移动端主题切换 */}
            <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center gap-2 px-4">
              <ThemeSwitcher theme={theme} onChange={setTheme} />
            </div>
            {/* 移动端语言切换 */}
            <div className="mt-4 pt-4 border-t border-slate-800/60">
              <button onClick={() => { setLang(lang === 'zh' ? 'en' : 'zh'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                <Globe size={16} className="text-cyan-400" />
                {lang === 'zh' ? 'English' : '中文'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <main className="relative z-10 pt-6 md:pt-10 px-3">
        <div className="w-full max-w-[30.5rem] mx-auto">

          {/* 推广横幅 */}
          <div className="mb-4 rounded-2xl overflow-hidden border border-[#2e2e2e]/50 bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]
            p-3 flex items-center gap-3 cursor-pointer hover:border-[#404040] transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
              <Zap size={16} className="text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{t.bannerTitle}</div>
              <div className="text-[#6c6c6c] text-[11px]">{t.bannerDesc}</div>
            </div>
            <ChevronRight size={16} className="text-[#6c6c6c] flex-shrink-0 group-hover:text-[#b0b0b0] transition-colors" />
          </div>

          {/* 卡片头部 */}
          <div className="flex justify-between items-center mb-2 px-1">
            <div className="flex items-center bg-[#2e2e2e] rounded-full">
              <span className="px-3 py-1 text-white text-base font-medium">Bridge</span>
            </div>
            <div className="flex items-center gap-0 text-sm relative">
              <div className="w-9 h-9 flex items-center justify-center bg-[#2e2e2e] hover:bg-[#404040]
                p-1.5 rounded-xl cursor-pointer ml-3 transition-colors">
                <Clock size={20} className="text-[#b0b0b0]" />
              </div>
              <div onClick={() => setShowSettings(!showSettings)}
                className="w-9 h-9 flex items-center justify-center bg-[#2e2e2e] hover:bg-[#404040]
                  p-1.5 rounded-xl cursor-pointer ml-3 transition-colors relative z-[1]">
                <Settings size={20} className="text-[#b0b0b0]" />
              </div>
              {showSettings && <SettingsPanel slippage={slippage} setSlippage={setSlippage}
                deadline={deadline} setDeadline={setDeadline} onClose={() => setShowSettings(false)} t={t} />}
            </div>
          </div>

          {/* SELL 卡片 */}
          <div className="w-full bg-[#1a1a1a] rounded-2xl border border-transparent hover:border-[#6c6c6c] transition-colors group/sell">
            <div className="px-4 py-3 flex items-center justify-between">
              <button onClick={() => setShowFromChainSelector(true)}
                className="flex items-center gap-2 rounded-xl py-2.5 px-3 bg-[#2e2e2e] whitespace-nowrap cursor-pointer">
                <ChainIcon chain={fromChain} size={24} />
                <span className="text-[#fafafa] text-sm">{fromChain.name}</span>
                <ChevronDown size={14} strokeWidth={2} className="text-white" />
              </button>
            </div>

            <div className="w-full p-4 bg-[#2e2e2e] relative rounded-2xl">
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center text-[#b0b0b0] font-medium">Sell</div>
                {isConnected && fromToken && (
                  <div className="flex items-center gap-2 opacity-0 group-hover/sell:opacity-100 transition-all duration-75">
                    {[25, 50, 75, 100].map(pct => (
                      <div key={pct} onClick={() => setAmount(String((getTokenBal(fromToken)) * pct / 100))}
                        className="cursor-pointer font-medium text-xs text-white bg-[#1a1a1a] border rounded-full
                          border-[#404040] py-1 px-1.5 hover:bg-[#2e2e2e] transition-all duration-150">
                        {pct === 100 ? 'MAX' : `${pct}%`}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full flex mt-1.5 justify-between items-center">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <input value={amount}
                    onChange={e => { if (/^[0-9]*\.?[0-9]*$/.test(e.target.value)) setAmount(e.target.value); }}
                    placeholder="0" style={{ userSelect: 'all' }}
                    className={`text-left placeholder:text-[#b0b0b0] font-medium truncate transition-all duration-75 w-full
                      bg-transparent outline-none text-[#fafafa]
                      ${amount.length > 16 ? 'text-xl' : amount.length > 10 ? 'text-2xl' : 'text-4xl'}`} />
                </div>
                <div className="flex-shrink-0 ml-2">
                  <div onClick={() => setShowFromTokenSelector(true)}
                    className="flex items-center px-3 rounded-full cursor-pointer bg-[#1a1a1a] hover:bg-[#404040]
                      py-2 font-medium border border-[#404040] transition-all duration-300">
                    <div className="relative mr-1">
                      <TokenIcon token={fromToken} size={32} />
                      <div className="absolute right-0 bottom-0 rounded-md p-px bg-[#1a1a1a] overflow-hidden">
                        <ChainIcon chain={fromChain} size={14} />
                      </div>
                    </div>
                    <label className="px-2 cursor-pointer text-base flex flex-col">
                      <span className="font-medium text-[#fafafa]" style={{ lineHeight: 1 }}>{fromToken.symbol}</span>
                      <div className="text-sm text-[#6c6c6c]">{fromChain.name}</div>
                    </label>
                    <ChevronDown size={16} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="w-full flex mt-1.5 justify-between items-center text-sm text-[#b0b0b0]">
                <span>Est. Value: ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                {isConnected && <span className="text-xs">{getTokenBal(fromToken).toLocaleString()} {fromToken.symbol}</span>}
              </div>

              <div className="cursor-pointer absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2
                hover:scale-95 transition-all duration-200" onClick={handleFlip}>
                <FlipArrowIcon />
              </div>
            </div>
          </div>

          {/* BUY 卡片 */}
          <div className="w-full bg-[#1a1a1a] rounded-2xl border border-transparent hover:border-[#6c6c6c] transition-colors mt-1">
            <div className="px-4 py-3 flex items-center justify-between">
              <button onClick={() => setShowToChainSelector(true)}
                className="flex items-center gap-2 rounded-xl py-2.5 px-3 bg-[#2e2e2e] whitespace-nowrap cursor-pointer">
                {toChain ? (
                  <>
                    <ChainIcon chain={toChain} size={24} />
                    <span className="text-[#fafafa] text-sm">{toChain.name}</span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-[#404040] flex items-center justify-center">
                      <Search size={12} className="text-[#6c6c6c]" />
                    </div>
                    <span className="text-cyan-400 text-sm">{t.selectNetworkHint}</span>
                  </>
                )}
                <ChevronDown size={14} strokeWidth={2} className="text-white" />
              </button>
              {toChain && (
                <div className="flex items-center gap-1 text-[10px] text-[#6c6c6c] bg-[#0f0f0f] rounded-full px-2 py-0.5 border border-[#2e2e2e]">
                  <Zap size={9} className="text-cyan-400" />
                  <span>ROBOTX Router</span>
                </div>
              )}
            </div>

            <div className="w-full p-4 bg-[#2e2e2e] rounded-2xl">
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center text-[#b0b0b0] font-medium">Buy</div>
              </div>

              <div className="w-full flex mt-1.5 justify-between items-center">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className={`text-left font-medium truncate transition-all duration-75
                    ${receiveAmount && parseFloat(receiveAmount) > 0 ? 'text-[#fafafa]' : 'text-[#b0b0b0]'}
                    ${(receiveAmount || '0').length > 16 ? 'text-xl' : (receiveAmount || '0').length > 10 ? 'text-2xl' : 'text-4xl'}`}
                    style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {receiveAmount || '0'}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {toChain ? (
                    <div 
                      className="flex items-center px-3 rounded-full bg-[#1a1a1a]
                        py-2 font-medium border border-[#404040] transition-all duration-300">
                      <div className="relative mr-1">
                        <TokenIcon token={toToken} size={32} />
                        <div className="absolute right-0 bottom-0 rounded-md p-px bg-[#1a1a1a] overflow-hidden">
                          <ChainIcon chain={toChain} size={14} />
                        </div>
                      </div>
                      <label className="px-2 text-base flex flex-col">
                        <span className="font-medium text-[#fafafa]" style={{ lineHeight: 1 }}>{toToken.symbol}</span>
                        <div className="text-sm text-[#6c6c6c]">{toChain.name}</div>
                      </label>
                      
                    </div>
                  ) : (
                    <div onClick={() => setShowToChainSelector(true)}
                      className="flex items-center px-3 rounded-full cursor-pointer bg-[#1a1a1a] hover:bg-[#404040]
                        py-2 font-medium border border-[#404040] transition-all duration-300">
                      <TokenIcon token={null} size={32} />
                      <label className="px-2 cursor-pointer text-base flex flex-col">
                        <span className="font-medium text-[#6c6c6c]" style={{ lineHeight: 1 }}>Token</span>
                        <div className="text-sm text-[#404040]">{t.notSelected}</div>
                      </label>
                      <ChevronDown size={16} className="text-[#6c6c6c]" />
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full flex mt-1.5 justify-between items-center text-sm text-[#b0b0b0]">
                <span>Est. Value: ${receiveUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-3">
            <button onClick={btn.action} disabled={btn.disabled}
              className={`w-full h-14 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200
                ${btn.style === 'error'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed'
                  : btn.style === 'disabled'
                  ? 'bg-[#2e2e2e] text-[#6c6c6c] cursor-not-allowed'
                  : btn.style === 'loading'
                  ? 'bg-[#2e2e2e] text-[#6c6c6c] cursor-wait'
                  : btn.style === 'wallet'
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:brightness-110'}`}>
              {btn.loading && <RotateCcw size={16} className="animate-spin" />}
              {btn.text}
            </button>
          </div>

          {/* 信息面板 */}
          {hasValidBridge && (
            <div className="mt-3 rounded-2xl bg-[#0f0f0f]/80 border border-[#1e1e1e] overflow-hidden">
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#1e1e1e]">
                <div className="flex items-center gap-1.5 text-xs text-[#b0b0b0]">
                  <span>1 {fromToken.symbol} ≈ {(getTokenPrice(fromToken) / getTokenPrice(toToken)).toFixed(6)} {toToken.symbol}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#6c6c6c]">
                  <Clock size={11} />
                  <span>~{toChain?.blockTime === '3s' || fromChain.blockTime === '3s' ? '30' : '60'}s</span>
                </div>
              </div>
              <div className="px-4 py-2.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6c6c6c] flex items-center gap-1.5"><Zap size={11} className="text-cyan-400/60" />{t.infoRoute}</span>
                  <span className="text-[#b0b0b0]">ROBOTX Bridge</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6c6c6c] flex items-center gap-1.5"><Fuel size={11} />{t.infoBridgeFee}</span>
                  <span className="text-[#b0b0b0]">{bridgeFee.toFixed(6)} {fromToken.symbol} <span className="text-[#6c6c6c]">({fromChain?.id === 'robotx' ? '4' : '1'}%)</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6c6c6c] flex items-center gap-1.5"><Shield size={11} />{t.infoSlippage}</span>
                  <span className="text-[#b0b0b0]">{slippage}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6c6c6c] flex items-center gap-1.5"><Clock size={11} />{t.infoEstArrival}</span>
                  <span className="text-green-400">{t.infoEstTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* 底部品牌 */}
          <div className="flex flex-col items-center mt-8 mb-4 select-none">
            <div className="flex items-center gap-1.5 text-[10px] text-[#6c6c6c]/50 font-mono">
              <Shield size={9} />Powered by ROBOTX Bridge Protocol v2.0
            </div>
          </div>
        </div>
      </main>

      {/* 移动端底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-[#1e1e1e]"
        style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
          {[
            { key: 'bridge', label: t.mobileNavBridge, icon: ArrowRightLeft },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeNav === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveNav(tab.key)}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-150
                  ${active ? 'text-cyan-400' : 'text-[#6c6c6c]'}`}>
                <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
                <span className={`text-[10px] font-medium ${active ? 'text-cyan-400' : 'text-[#6c6c6c]'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>

      {/* 客服 FAB */}
      <button className="fixed right-4 bottom-20 md:bottom-6 z-40 w-11 h-11 rounded-full
        bg-cyan-500 hover:bg-cyan-600 shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:shadow-[0_4px_20px_rgba(6,182,212,0.6)]
        flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95">
        <MessageCircle size={18} className="text-white" />
      </button>

      {/* 模态框 */}
      {showFromChainSelector && (
        <ChainSelectorModal currentChain={fromChain} excludeChainId={toChain?.chainId}
          onSelect={setFromChain} onClose={() => setShowFromChainSelector(false)} t={t} />
      )}
      {showToChainSelector && (
        <ChainSelectorModal currentChain={toChain} excludeChainId={fromChain?.chainId}
          onSelect={setToChain} onClose={() => setShowToChainSelector(false)} t={t} />
      )}
      {showFromTokenSelector && (
        <TokenSelectorModal currentToken={fromToken} fromChain={fromChain} toChain={toChain}
          onSelect={tk => { setFromToken(tk); setToToken(tk); setShowFromTokenSelector(false); }}
          onClose={() => setShowFromTokenSelector(false)} t={t} isRealWallet={isRealWallet} />
      )}
      {showToTokenSelector && (
        <TokenSelectorModal currentToken={toToken} fromChain={fromChain} toChain={toChain}
          onSelect={tk => { setToToken(tk); setShowToTokenSelector(false); }}
          onClose={() => setShowToTokenSelector(false)} t={t} isRealWallet={isRealWallet} />
      )}
      {showWalletModal && <WalletModal onConnect={handleConnect} onClose={() => setShowWalletModal(false)} t={t} />}
      {successData && <SuccessModal {...successData} onClose={() => setSuccessData(null)} t={t} />}
    </div>
  );
};

export default BridgeInterface;
