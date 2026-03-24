export type Lang = 'en' | 'zh';

export interface Translations {
  navHome: string;
  navDemo: string;
  navDocs: string;
  navApi: string;
  navWhitepaper: string;
  navExplorer: string;
  navDex: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  btnDemo: string;
  btnDocs: string;
  btnExplorer: string;
  btnMetamask: string;
  statBlocks: string;
  statTxns: string;
  statSR: string;
  statTime: string;
  featTitle: string;
  featComment: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;
  feat4Title: string;
  feat4Desc: string;
  feat5Title: string;
  feat5Desc: string;
  feat6Title: string;
  feat6Desc: string;
  ecoComment: string;
  ecoTitle: string;
  ecoDesc: string;
  eco1Title: string;
  eco1Desc: string;
  eco2Title: string;
  eco2Desc: string;
  eco3Title: string;
  eco3Desc: string;
  eco4Title: string;
  eco4Desc: string;
  eco5Title: string;
  eco5Desc: string;
  eco6Title: string;
  eco6Desc: string;
  statsTitle: string;
  statsDesc: string;
  demoComment: string;
  demoTitle: string;
  demoDesc: string;
  demoAction: string;
  demoStart: string;
  demoReset: string;
  demoExec: string;
  demoIdle: string;
  rpcComment: string;
  rpcTitle: string;
  rpcDesc: string;
  ctaTitle: string;
  ctaDesc: string;
  footDesc: string;
  footProtocol: string;
  footDev: string;
  footCommunity: string;
  footTools: string;
  footWhitepaper: string;
  footConsensus: string;
  footToken: string;
  footGov: string;
  footRpc: string;
  footExplorer: string;
  footGithub: string;
  footSdk: string;
  footTwitter: string;
  footTelegram: string;
  footDiscord: string;
  footBlog: string;
  footGasTracker: string;
  footFaucet: string;
  footVerify: string;
  footConverter: string;
  footDonations: string;
  copied: string;
  liveData: string;
  offlineData: string;
  docTitle: string;
  docSuffix: string;
  docWhitepaper: string;
  docProtocol: string;
  docEncrypted: string;
  cookieText: string;
  cookiePolicy: string;
  cookiePrivacy: string;
  cookieOk: string;
}

export const translations: Record<Lang, Translations> = {
  en: {
    navHome: 'Home', navDemo: 'Live Demo', navDocs: 'Docs', navApi: 'RPC API',
    navWhitepaper: 'Whitepaper', navExplorer: 'Explorer', navDex: 'DEX',
    heroBadge: 'PoA CONSENSUS · 1s BLOCK TIME · 27 SUPER REPRESENTATIVES',
    heroTitle: 'ROBOTX',
    heroSubtitle: 'SHADOW LAYER PROTOCOL',
    heroDesc: 'Next-generation decentralized public chain infrastructure. High-performance PoA consensus, RX address system, RX native token. Limitless potential.',
    btnDemo: 'LAUNCH DEMO', btnDocs: 'READ DOCS', btnExplorer: 'EXPLORER', btnMetamask: 'Add to MetaMask',
    statBlocks: 'Total Blocks', statTxns: 'Transactions', statSR: 'Super Reps', statTime: 'Block Time',
    featTitle: 'Core Architecture', featComment: 'CORE FEATURES',
    feat1Title: 'PoA Consensus',
    feat1Desc: 'Slot-based SR rotation with 27 validators. 1s block time, 200-block epochs with automatic re-election.',
    feat2Title: 'Dual-Protocol RPC',
    feat2Desc: '12 native robotx_* methods + 20+ EVM eth_* methods. MetaMask-ready with full JSON-RPC 2.0.',
    feat3Title: 'ShadowLink Network',
    feat3Desc: 'TCP P2P layer with 10 message types, 4-byte length-prefixed wire protocol, auto-sync.',
    feat4Title: 'RX Tokenomics',
    feat4Desc: '2.1B total supply across 3 genesis wallets. 18-decimal precision.',
    feat5Title: 'Staking & Governance',
    feat5Desc: '6 transaction types with epoch-based SR elections and on-chain voting power.',
    feat6Title: 'HTLC Atomic Swap',
    feat6Desc: 'Hash Time-Locked Contracts with onion-routed multi-hop payment channels.',
    ecoComment: 'ECOSYSTEM', ecoTitle: 'Ecosystem Applications',
    ecoDesc: 'A growing ecosystem of finance, gaming, AI, and infrastructure applications built on ROBOTX.',
    eco1Title: 'Finance',
    eco1Desc: 'Enterprise-grade infrastructure for global finance with AI-driven life networks.',
    eco2Title: 'RX Gaming',
    eco2Desc: 'Powerful primitive forces for chain games. AI robots grow smarter and earn $RM.',
    eco3Title: 'RX.AI',
    eco3Desc: 'Democratizing AI infrastructure through decentralized financing.',
    eco4Title: 'RX.DEX',
    eco4Desc: 'Instant peer-to-peer trading powered by 3-second finality.',
    eco5Title: 'RX.Bridge',
    eco5Desc: 'Cross-chain bridge for secure asset transfer across networks.',
    eco6Title: 'RX.Market',
    eco6Desc: 'Create, showcase, and trade digital assets peer-to-peer.',
    statsTitle: 'The Onchain Standard',
    statsDesc: 'ROBOTX consistently delivers proven performance with real-time metrics from the live network.',
    demoComment: 'INTERACTIVE SIMULATION',
    demoTitle: 'ShadowLink HTLC Demo',
    demoDesc: 'Onion-routed encrypted transmission + Hash Time-Locked payment channel',
    demoAction: 'Current Action', demoStart: 'START DEMO', demoReset: 'RESET', demoExec: 'EXECUTING...',
    demoIdle: 'System idle. Waiting for transaction...',
    rpcComment: 'JSON-RPC 2.0', rpcTitle: 'RPC API Reference',
    rpcDesc: '12 native robotx_* methods + 20+ EVM-compatible eth_* methods',
    ctaTitle: 'Ready to start building on ROBOTX?',
    ctaDesc: 'Join the next generation of decentralized infrastructure.',
    footDesc: 'Next-generation decentralized public chain infrastructure. PoA consensus, 1s block time, RX address system.',
    footProtocol: 'Protocol', footDev: 'Developers', footCommunity: 'Community', footTools: 'Tools',
    footWhitepaper: 'Whitepaper', footConsensus: 'PoA Consensus', footToken: 'RX Token', footGov: 'Governance',
    footRpc: 'RPC Docs', footExplorer: 'Block Explorer', footGithub: 'GitHub', footSdk: 'SDK',
    footTwitter: 'Twitter', footTelegram: 'Telegram', footDiscord: 'Discord', footBlog: 'Blog',
    footGasTracker: 'Gas Tracker', footFaucet: 'Faucet', footVerify: 'Verify Contract', footConverter: 'Unit Converter',
    footDonations: 'Donations:',
    copied: 'Copied!',
    liveData: 'LIVE', offlineData: 'OFFLINE',
    docTitle: 'ROBOTX', docSuffix: '.DOCS', docWhitepaper: 'Whitepaper', docProtocol: 'TX Protocol',
    docEncrypted: 'ENCRYPTED CONNECTION ESTABLISHED',
    cookieText: 'ROBOTX uses cookies and analytics to improve user experience.',
    cookiePolicy: 'Cookie Policy', cookiePrivacy: 'Privacy Policy', cookieOk: 'Got it!',
  },
  zh: {
    navHome: '首页', navDemo: '实时演示', navDocs: '文档', navApi: 'RPC API',
    navWhitepaper: '白皮书', navExplorer: '浏览器', navDex: '闪兑',
    heroBadge: 'PoA 共识 · 1秒出块 · 27个超级代表',
    heroTitle: 'ROBOTX',
    heroSubtitle: '影子层协议',
    heroDesc: '新一代去中心化公链基础设施。高性能 PoA 共识，RX 地址系统，RX 原生代币。无限潜力。',
    btnDemo: '启动演示', btnDocs: '阅读文档', btnExplorer: '浏览器', btnMetamask: '添加到 MetaMask',
    statBlocks: '区块总数', statTxns: '交易总量', statSR: '超级代表', statTime: '出块时间',
    featTitle: '核心架构', featComment: '核心特性',
    feat1Title: 'PoA 共识',
    feat1Desc: '27个验证节点的槽位轮转机制。1秒出块，每200个区块为一个纪元并自动重选。',
    feat2Title: '双协议 RPC',
    feat2Desc: '12个原生 robotx_* 方法 + 20+ 个 EVM 兼容 eth_* 方法。支持 MetaMask。',
    feat3Title: 'ShadowLink 网络',
    feat3Desc: 'TCP P2P层，10种消息类型，4字节长度前缀线协议，自动同步。',
    feat4Title: 'RX 代币经济',
    feat4Desc: '21亿总量，3个创世钱包分配。18位精度',
    feat5Title: '质押与治理',
    feat5Desc: '6种交易类型，基于纪元的SR选举和链上投票权。',
    feat6Title: 'HTLC 原子交换',
    feat6Desc: '哈希时间锁定合约，洋葱路由多跳支付通道。',
    ecoComment: '生态系统', ecoTitle: '生态应用',
    ecoDesc: '一个涵盖金融、游戏、AI和基础设施的生态应用体系，构建在ROBOTX之上。',
    eco1Title: 'Finance',
    eco1Desc: '面向全球金融的企业级基础设施，AI驱动的生命网络。',
    eco2Title: 'RX Gaming',
    eco2Desc: '强大的链游原始力量。AI机器人在您休息时变得更聪明并赚取 $RM。',
    eco3Title: 'RX.AI',
    eco3Desc: '通过去中心化融资让AI基础设施触手可及。',
    eco4Title: 'RX.DEX',
    eco4Desc: '依托1秒最终确认性的即时点对点交易平台。',
    eco5Title: 'RX.Bridge',
    eco5Desc: '跨链桥技术实现资产在异构网络间的安全转移。',
    eco6Title: 'RX.Market',
    eco6Desc: '创作、展示和点对点交易数字资产的区块链集散平台。',
    statsTitle: '链上标准',
    statsDesc: 'ROBOTX 以实时链上指标持续证明性能表现。',
    demoComment: '交互式模拟',
    demoTitle: 'ShadowLink HTLC 演示',
    demoDesc: '洋葱路由加密传输 + 哈希时间锁定支付通道',
    demoAction: '当前操作', demoStart: '开始模拟', demoReset: '重置', demoExec: '执行中...',
    demoIdle: '系统空闲。等待交易...',
    rpcComment: 'JSON-RPC 2.0', rpcTitle: 'RPC API 参考',
    rpcDesc: '12个原生 robotx_* 方法 + 20+ 个 EVM 兼容 eth_* 方法',
    ctaTitle: '准备好在 ROBOTX 上开始构建了吗？',
    ctaDesc: '加入下一代去中心化基础设施。',
    footDesc: '新一代去中心化公链基础设施。PoA共识，1秒出块，RX地址系统。',
    footProtocol: '协议', footDev: '开发者', footCommunity: '社区', footTools: '工具',
    footWhitepaper: '白皮书', footConsensus: 'PoA 共识', footToken: 'RX 代币', footGov: '治理',
    footRpc: 'RPC 文档', footExplorer: '区块浏览器', footGithub: 'GitHub', footSdk: 'SDK',
    footTwitter: 'Twitter', footTelegram: 'Telegram', footDiscord: 'Discord', footBlog: '博客',
    footGasTracker: 'Gas 追踪', footFaucet: '水龙头', footVerify: '验证合约', footConverter: '单位转换',
    footDonations: '捐赠:',
    copied: '已复制!',
    liveData: '实时', offlineData: '离线',
    docTitle: 'ROBOTX', docSuffix: '.文档', docWhitepaper: '白皮书', docProtocol: '交易协议',
    docEncrypted: '已建立加密连接',
    cookieText: 'ROBOTX 使用 Cookie 和分析工具来改善用户体验。',
    cookiePolicy: 'Cookie 政策', cookiePrivacy: '隐私政策', cookieOk: '知道了！',
  },
};
