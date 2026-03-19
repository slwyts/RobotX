export const translations = {
  zh: {
    navBridge: '跨链',
    navBridgeItem: '桥接',
    navBridgeDesc: '跨链资产转移',
    navHistory: '历史记录',
    navHistoryDesc: '查看跨链交易记录',
    selectNetwork: '选择网络',
    blockLabel: '区块',
    connectBtn: '连接',
    btnConnectWallet: '连接钱包',
    btnSelectTarget: '选择目标链',
    btnEnterAmount: '输入金额',
    btnInsufficientBalance: '余额不足',
    btnConfirming: '确认中...',
    btnBridge: '桥接',
    infoRoute: '路由',
    infoBridgeFee: '桥接费',
    infoSlippage: '滑点',
    infoEstArrival: '预计到账',
    infoEstTime: '~30 秒',
    mobileNavBridge: '跨链',
    bannerTitle: '桥接 RX 到 Ethereum',
    bannerDesc: '快速 · 低费率 · 安全',
    selectToken: '选择代币',
    searchToken: '搜索代币',
    allTokens: '全部代币',
    noTokensFound: '未找到代币',
    selectNetworkTitle: '选择网络',
    searchChain: '搜索链',
    allChains: '所有链',
    popularChains: '热门链',
    chains: '链',
    noChains: '未找到链',
    connectWallet: '连接钱包',
    walletTerms: '连接钱包即表示您同意 ROBOTX Bridge',
    termsOfService: '服务条款',
    txSubmitted: '交易已提交',
    estArrival: '预计到账',
    bridgeFee: '桥接费',
    chainId: '链ID',
    close: '关闭',
    explorer: '浏览器',
    settings: '设置',
    slippageTolerance: '滑点容差',
    txDeadline: '交易截止时间',
    minutes: '分钟',
    custom: '自定义',
    selectNetworkHint: '选择网络',
    notSelected: '未选择',
    robotxConfirming: 'ROBOTX 确认中...',
    walletNotDetected_prefix: '未检测到 ',
    walletNotDetected_suffix: ' 扩展，是否前往安装？',
    rxNativeNotSupported: 'RX原生代币不支持跨链到外部链',
  },
  en: {
    navBridge: 'Bridge',
    navBridgeItem: 'Bridge',
    navBridgeDesc: 'Cross-chain asset transfer',
    navHistory: 'History',
    navHistoryDesc: 'View bridge transaction history',
    selectNetwork: 'Select Network',
    blockLabel: 'Block',
    connectBtn: 'Connect',
    btnConnectWallet: 'Connect Wallet',
    btnSelectTarget: 'Select Target Chain',
    btnEnterAmount: 'Enter Amount',
    btnInsufficientBalance: 'Insufficient Balance',
    btnConfirming: 'Confirming...',
    btnBridge: 'Bridge',
    infoRoute: 'Route',
    infoBridgeFee: 'Bridge Fee',
    infoSlippage: 'Slippage',
    infoEstArrival: 'Est. Arrival',
    infoEstTime: '~30s',
    mobileNavBridge: 'Bridge',
    bannerTitle: 'Bridge RX to Ethereum',
    bannerDesc: 'Fast · Low fees · Secure',
    selectToken: 'Select a Token',
    searchToken: 'Search Token',
    allTokens: 'All Tokens',
    noTokensFound: 'No tokens found',
    selectNetworkTitle: 'Select a Network',
    searchChain: 'Search Chain',
    allChains: 'All Chains',
    popularChains: 'Popular Chains',
    chains: 'Chains',
    noChains: 'No chains found',
    connectWallet: 'Connect Wallet',
    walletTerms: 'By connecting a wallet, you agree to ROBOTX Bridge',
    termsOfService: 'Terms of Service',
    txSubmitted: 'Transaction Submitted',
    estArrival: 'Estimated arrival',
    bridgeFee: 'Bridge fee',
    chainId: 'ChainID',
    close: 'Close',
    explorer: 'Explorer',
    settings: 'Settings',
    slippageTolerance: 'Slippage Tolerance',
    txDeadline: 'Transaction Deadline',
    minutes: 'minutes',
    custom: 'Custom',
    selectNetworkHint: 'Select Network',
    notSelected: 'Not Selected',
    robotxConfirming: 'ROBOTX Confirming...',
    walletNotDetected_prefix: '',
    walletNotDetected_suffix: ' extension not detected. Go to install?',
    rxNativeNotSupported: 'RX native token cannot be bridged to external chains',
  },
};

export const CHAINS = [
  { id: 'robotx', name: 'ROBOTX', chainId: 0x524F58, color: '#06B6D4', icon: null, blockTime: '3s', consensus: 'DPoS', nativeCurrency: 'RX' },
  { id: 'ethereum', name: 'Ethereum', chainId: 1, color: '#627EEA', icon: 'https://cdn.orbiter.finance/icon/chain/1.svg', blockTime: '12s', consensus: 'PoS', nativeCurrency: 'ETH' },
  { id: 'arbitrum', name: 'Arbitrum', chainId: 42161, color: '#28A0F0', icon: 'https://cdn.orbiter.finance/icon/chain/42161.svg', blockTime: '0.26s', consensus: 'Nitro', nativeCurrency: 'ETH' },
  { id: 'base', name: 'Base', chainId: 8453, color: '#0052FF', icon: 'https://cdn.orbiter.finance/icon/chain/8453.svg', blockTime: '2s', consensus: 'OP', nativeCurrency: 'ETH' },
  { id: 'optimism', name: 'Optimism', chainId: 10, color: '#FF0420', icon: 'https://cdn.orbiter.finance/icon/chain/10.svg', blockTime: '2s', consensus: 'OP', nativeCurrency: 'ETH' },
  { id: 'polygon', name: 'Polygon', chainId: 137, color: '#8247E5', icon: 'https://cdn.orbiter.finance/icon/chain/137.svg', blockTime: '2s', consensus: 'PoS', nativeCurrency: 'MATIC' },
  { id: 'bsc', name: 'BNB Chain', chainId: 56, color: '#F0B90B', icon: 'https://cdn.orbiter.finance/icon/chain/56.svg', blockTime: '3s', consensus: 'PoSA', nativeCurrency: 'BNB' },
];

export const TOKENS = [
  { symbol: 'RX', name: 'ROBOTX', color: '#06B6D4', decimals: 6, balance: 12580.0, price: 2.45, logo: null, contract: null },
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA', decimals: 18, balance: 3.5821, price: 2650.32, logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png', contract: '0x4630917c0c9871398aaf7f5ba47738c0aa39b836' },
  { symbol: 'USDT', name: 'Tether USD', color: '#26A17B', decimals: 6, balance: 5000.0, price: 1.0, logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png', contract: '0x366749238c873ec04258d178b357b7e00422c0a4' },
  { symbol: 'USDC', name: 'USD Coin', color: '#2775CA', decimals: 6, balance: 3200.5, price: 1.0, logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png', contract: '0x7d7e19c484244741530cb27c993a54219e195cc6' },
  { symbol: 'BNB', name: 'BNB', color: '#F0B90B', decimals: 18, balance: 8.25, price: 635.2, logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png', contract: '0x22131cabac05cd131d0d48c4aaf0877aa5400d85' },
  { symbol: 'DAI', name: 'Dai', color: '#F5AC37', decimals: 18, balance: 800.0, price: 1.0, logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png', contract: '0xdd96950b01aae6d78bbbf323bedd2e3422cff814' },
  { symbol: 'POL', name: 'Polygon', color: '#8247E5', decimals: 18, balance: 0, price: 0.45, logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png', contract: '0x8Ee160E90E388Bb860d397346197289489982248' },
];

export const CHAIN_TOKEN_SUPPORT = {
  robotx: ['RX', 'ETH', 'USDT', 'USDC', 'BNB', 'DAI', 'POL'],
  ethereum: ['ETH', 'USDT', 'USDC', 'DAI'],
  arbitrum: ['ETH', 'USDT', 'USDC'],
  base: ['ETH', 'USDC'],
  optimism: ['ETH', 'USDT', 'USDC'],
  polygon: ['POL', 'USDT', 'USDC', 'DAI'],
  bsc: ['ETH', 'USDT', 'USDC', 'BNB'],
};

export const getTokensForChain = (chainId) => {
  const supported = CHAIN_TOKEN_SUPPORT[chainId];
  if (!supported) return TOKENS;
  return TOKENS.filter((token) => supported.includes(token.symbol));
};

export const BRIDGE_VAULT = '0xed8D698d18575d9f732556516A8721ABC8A87171';

export const BRIDGE_CONTRACTS = {
  56: '0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7',
  1: '0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7',
  42161: '0x4Cb8f948c16AECD6ce0250f0B97e9BD3e65906dE',
  8453: '0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7',
  10: '0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7',
  137: '0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7',
};

export const EXTERNAL_TOKEN_CONTRACTS = {
  56: {
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    BNB: 'native',
    ETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  },
  1: {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    ETH: 'native',
  },
  42161: {
    ETH: 'native',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  8453: {
    ETH: 'native',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  10: {
    ETH: 'native',
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  },
  137: {
    POL: 'native',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  },
};

export const BRIDGE_RPC = 'https://rpc.robotxhub.io';

export const CHAIN_RPCS = {
  1: 'https://ethereum-rpc.publicnode.com',
  42161: 'https://arb1.arbitrum.io/rpc',
  8453: 'https://base-mainnet.public.blastapi.io',
  10: 'https://mainnet.optimism.io',
  137: 'https://polygon-bor-rpc.publicnode.com',
  56: 'https://bsc-rpc.publicnode.com',
};

export const EXTERNAL_TOKEN_DECIMALS = {
  42161: { USDT: 6, USDC: 6 },
  8453: { USDC: 6 },
  10: { USDT: 6, USDC: 6 },
  137: { USDT: 6, USDC: 6 },
};

export const COINGECKO_MAP = {
  ethereum: 'ETH',
  binancecoin: 'BNB',
  tether: 'USDT',
  'usd-coin': 'USDC',
  dai: 'DAI',
  'polygon-ecosystem-token': 'POL',
};

export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,tether,usd-coin,dai,polygon-ecosystem-token&vs_currencies=usd';

export const CHAIN_ID_TO_KEY = {
  56: 'bsc',
  1: 'ethereum',
  42161: 'arbitrum',
  8453: 'base',
  10: 'optimism',
  137: 'polygon',
};

export const NAV_CHAINS = [
  { name: 'ROBOTX', color: '#06B6D4', id: 'robotx', chainId: 0x524F58, blockTime: '3s', consensus: 'DPoS' },
  { name: 'Ethereum', color: '#627EEA', id: 'eth', chainId: 1, blockTime: '12s', consensus: 'PoS' },
  { name: 'Arbitrum', color: '#28A0F0', id: 'arb', chainId: 42161, blockTime: '0.26s', consensus: 'Nitro' },
  { name: 'Base', color: '#0052FF', id: 'base', chainId: 8453, blockTime: '2s', consensus: 'OP' },
  { name: 'Optimism', color: '#FF0420', id: 'op', chainId: 10, blockTime: '2s', consensus: 'OP' },
  { name: 'Polygon', color: '#8247E5', id: 'poly', chainId: 137, blockTime: '2s', consensus: 'PoS' },
  { name: 'BNB Chain', color: '#F0B90B', id: 'bsc', chainId: 56, blockTime: '3s', consensus: 'PoSA' },
];

export const TOKEN_ADDRESSES = {
  USDT: '0xc213...b58e8f',
  USDC: '0x3c49...5c3359',
  BNB: '0x2170...b4Ece8',
  DAI: '0x6B17...1d0F',
};