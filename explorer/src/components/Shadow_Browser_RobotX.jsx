import React, { useState, useEffect } from 'react';
import {
  Search, Box, FileText, Globe, Activity, Zap,
  Menu, Sun, Moon, ChevronDown, Layers, Server,
  ArrowRight, CheckCircle, Clock, Database,
  ArrowLeft, RotateCw, Plus, X as CloseIcon, Shield, Lock, Maximize2,
  Twitter, Github, Send, Facebook, Linkedin, TrendingUp, TrendingDown,
  ChevronRight, X, Copy, ExternalLink, BarChart3, Users, Code,
  AlertTriangle, Eye, Filter, Hash, Cpu, Fuel, Timer, Radio,
  Bookmark, Star, Bell, Settings, LogIn, Wallet, ArrowUpRight, Coins,
  ArrowDownRight, Circle, Package, GitBranch, Terminal, FileCode
} from 'lucide-react';

// =========================================================
// 国际化翻译 (EN / 中文)
// =========================================================
const translations = {
  en: {
    ethPriceLabel:'ETH Price:', gasLabel:'Gas:', rtxPriceLabel:'RX Price:',
    mainnet:'ROBOTX Mainnet',
    home:'Home', signIn:'Connect Wallet', walletBalance:'My Balance', disconnect:'Disconnect',
    navBlockchain:'Blockchain', navTokens:'Tokens', navNFTs:'NFTs',
    navResources:'Resources', navDevelopers:'Developers', navMore:'More',
    menuTransactions:'Transactions', menuMainToRx:'Latest Main→RX Txns',
    menuRxToMain:'Latest RX→Main Txns', menuContractInternal:'Contract Internal Txns',
    menuRxTxns:'RX Transactions', menuViewBlocks:'View Blocks',
    menuViewBatches:'View Batches', menuForkedBlocks:'Forked Blocks (Reorgs)',
    menuTopAccounts:'Top Accounts', menuVerifiedContracts:'Verified Contracts',
    menuTopTokens:'Top Tokens (RX-20)', menuTokenTransfers:'Token Transfers (RX-20)',
    menuTokenFlow:'Token Flow Visualizer',
    menuLatestTransfers:'Latest Transfers', menuLatestMints:'Latest Mints',
    menuChartsStats:'Charts & Stats', menuTopStats:'Top Statistics',
    menuApiPlans:'API Plans', menuApiDocs:'API Documentation', menuCodeReader:'Code Reader',
    menuVerifyContract:'Verify Contract', menuSimilarContract:'Similar Contract Search',
    menuContractDiff:'Contract Diff Checker', menuVyper:'Vyper Online Compiler',
    menuBytecode:'Bytecode to Opcode', menuBroadcast:'Broadcast Transaction',
    headerTools:'— Tools', headerExplore:'— Explore', headerServices:'— Services',
    menuInputDecoder:'Input Data Decoder', menuUnitConverter:'Unit Converter',
    menuCsvExport:'CSV Export', menuBalanceChecker:'Account Balance Checker',
    menuRelayer:'RX to Main Relayer', menuGasTracker:'Gas Tracker',
    menuLabelCloud:'Label Cloud', menuDomainLookup:'Domain Name Lookup',
    menuTokenApprovals:'Token Approvals', menuVerifiedSig:'Verified Signature',
    menuAdvancedFilter:'Advanced Filter',
    heroTitle:'The ROBOTX Block Explorer',
    searchPlaceholder:'Search by Address (0x...) / Txn Hash / Block / Token / Domain Name',
    sponsored:'Sponsored:', sponsorDesc:'— Zero-knowledge offline transactions.',
    filterAll:'All Filters', filterAddresses:'Addresses', filterTokens:'Tokens',
    filterNameTags:'Name Tags', filterLabels:'Labels', filterWebsites:'Websites',
    statRtxPrice:'RX PRICE', statMarketCap:'MARKET CAP',
    statTransactions:'TRANSACTIONS', statMedGas:'MED GAS PRICE',
    statLatestBlock:'LATEST BLOCK', statAvgTime:'AVG TIME',
    statLatestBatch:'LATEST BATCH', statTxHistory:'TRANSACTION HISTORY (14 DAYS)',
    listBlocks:'Latest Blocks', listTxns:'Latest Transactions', listBridge:'Latest Main→RX Txns',
    customize:'Customize', validatedBy:'Validated By', txnsSuffix:'txns',
    viewAllBlocks:'View all blocks', from:'From', to:'To',
    viewAllTxns:'View all transactions', bridge:'BRIDGE',
    mainBlock:'Main Block', loadingBridge:'Loading bridge data...',
    viewAllBridge:'View all bridge transactions',
    addNetwork:'Add ROBOTX Network',
    footerDesc:'ROBOTX is a Block Explorer and Analytics Platform for the ROBOTX decentralized smart contracts platform.',
    footCompany:'Company', footCommunity:'Community', footProducts:'Products', footTools:'Tools',
    footAboutUs:'About Us', footBrandAssets:'Brand Assets', footContactUs:'Contact Us',
    footTerms:'Terms & Privacy', footBugBounty:'Bug Bounty',
    footApiDocs:'API Documentation', footKnowledgeBase:'Knowledge Base',
    footNetworkStatus:'Network Status', footLearnRobotx:'Learn ROBOTX',
    footAdvertise:'Advertise', footEaas:'Explorer as a Service (EaaS)',
    footApiPlans:'API Plans', footPrioritySupport:'Priority Support', footBlockscan:'Blockscan',
    footGasTracker:'Gas Tracker', footTokenApprovals:'Token Approvals',
    footVerifyContract:'Verify Contract', footUnitConverter:'Unit Converter', footCsvExport:'CSV Export',
    donations:'Donations:', builtBy:'Built by',
    cookieText:'ROBOTX uses cookies and analytics to improve user experience.',

    // --- Inner pages ---
    backToDashboard:'Back to Dashboard', backToHome:'Back to Home',
    queryFailed:'Query Failed', addressQueryFailed:'Address Query Failed',
    invalidSearch:'Invalid Search', invalidSearchHint:'Please enter a valid EVM address (0x...) or transaction hash',
    invalidSearchExample:'Example: 0x1234...abcd',
    networkError:'Network Error', txNotFound:'Transaction Not Found',
    rpcFailed:'RPC connection failed, please retry.',
    txNotExist:'This transaction does not exist on ROBOTX Chain.',
    txDetails:'Transaction Details',
    tokenTransferLabel:'Token Transfer', tokenApproval:'Token Approval', tokenTransferFrom:'Token TransferFrom',
    sentToVault:'Sent to', swapVault:'Swap Vault', bridgeDexVault:'Bridge/DEX Vault',
    nativeRxTransfer:'Native RX Transfer',
    stakingLabel:'Staking', voteLabel:'Vote', dexSwap:'DEX Swap',
    bridgeInbound:'Bridge Inbound', bridgeOutbound:'Bridge Outbound',
    vaultRelease:'Vault Release', vaultDeposit:'Vault Deposit',
    swapDetail:'Swap Details', sell:'Sell', buy:'Buy',
    sellTx:'Sell Tx', buyTx:'Buy Tx', initiator:'Initiator', timeLabel:'Time',
    stakingPool:'Staking Pool', staker:'Staker',
    bridgeDetail:'Bridge Details', tokenLabel:'Token', destination:'Destination',
    sourceChain:'Source Chain', sourceTx:'Source Tx', robotxTx:'ROBOTX Tx',
    sender:'Sender', receiver:'Receiver',
    basicInfo:'Basic Info', txHash:'Transaction Hash', statusLabel:'Status',
    blockLabel:'Block', typeLabel:'Type', addresses:'Addresses',
    fromLabel:'From', toLabel:'To', recipientLabel:'Recipient',
    valueAndMethod:'Value & Method', valueLabel:'Value',
    methodLabel:'Method', nativeTransfer:'Native Transfer', contractCall:'Contract Call',
    technical:'Technical', gasUsed:'Gas Used', nonceLabel:'Nonce', inputData:'Input Data',
    addressLabel:'Address', contractLabel:'Contract',
    rxBalance:'RX Balance', usdValue:'USD Value',
    tokensCount:'Tokens', transactionsLabel:'Transactions', firstSeen:'First Seen',
    tokenHoldings:'Token Holdings', nativeToken:'Native Token',
    previousPage:'Previous', nextPage:'Next',
    pageOf:'Page {0} of {1}',
    totalSupply:'Total Supply', decimals:'Decimals', holdersLabel:'Holders',
    topHolders:'Top {0} Holders',
    rank:'Rank', addressCol:'Address', quantity:'Quantity', percentage:'Percentage',
    noHolders:'No holders found', noHoldersHint:'This token has no recorded holders yet',
    verifiedContracts:'Verified Contracts',
    verifiedTokenContracts:'{0} Verified Token Contracts on ROBOTX Chain',
    contractAddress:'Contract Address', tokenName:'Token Name',
    symbolLabel:'Symbol', decimalsLabel:'Decimals', compilerLabel:'Compiler',
    licenseLabel:'License', statusVerified:'Verified',
    contractSourceVerified:'Contract Source Code Verified',
    contractSourceCode:'Contract Source Code',
    copySource:'Copy Source', backToContractList:'Back to Verified Contracts List',
    contractNameLabel:'Contract Name:', compilerVersion:'Compiler Version:',
    optimization:'Optimization:', evmVersion:'EVM Version:',
    latestTransactions:'Latest Transactions', latestBlocks:'Latest Blocks',
    recentTxDesc:'Recent on-chain transactions (refreshes every 3.5s)',
    recentBlockDesc:'Recent blocks (refreshes every 3.5s)',
    topAccountsByBalance:'Top Accounts by RX Balance',
    rx20TokenTracker:'RX-20 Token Tracker', tokensFound:'{0} tokens found',
    rx20TokenTransfers:'RX-20 Token Transfers', recentTokenTransfers:'Recent token transfer records',
    thTxHash:'Txn Hash', thMethod:'Method', thBlock:'Block', thFrom:'From', thTo:'To',
    thValue:'Value', thFee:'Fee', thAge:'Age', thTxn:'Txn', thProducer:'Producer',
    thGasUsed:'Gas Used', thGasPercent:'Gas %', thBaseFee:'Base Fee', thReward:'Reward',
    thNameTag:'Name Tag', thBalance:'Balance (RX)', thPercentage:'Percentage', thTxnCount:'Txn Count',
    thToken:'Token', thContract:'Contract', thDecimals:'Decimals', thStandard:'Standard',
    thAmount:'Amount',
    totalTransactionsLabel:'Total Transactions', totalBlocksLabel:'Total Blocks',
    avgBlockTimeLabel:'Avg Block Time', tpsLabel:'TPS',
    rxPriceLabelStat:'RX Price', gasPriceLabelStat:'Gas Price',
    latestBatchLabel:'Latest Batch', rx20TokensLabel:'RX-20 Tokens',
    txHistory14d:'Transaction History (14 Days)',
    chartsAndStats:'Charts & Stats',
    contractCreation:'Contract Creation',
    cookiePolicy:'Cookie Policy', privacyPolicy:'Privacy Policy', gotIt:'Got it!',
  },
  zh: {
    ethPriceLabel:'ETH 价格:', gasLabel:'Gas:', rtxPriceLabel:'RX 价格:',
    mainnet:'ROBOTX 主网',
    home:'首页', signIn:'连接钱包', walletBalance:'我的余额', disconnect:'断开连接',
    navBlockchain:'区块链', navTokens:'代币', navNFTs:'NFTs',
    navResources:'资源', navDevelopers:'开发者', navMore:'更多',
    menuTransactions:'交易记录', menuMainToRx:'最新 Main→RX 交易',
    menuRxToMain:'最新 RX→Main 交易', menuContractInternal:'合约内部交易',
    menuRxTxns:'RX 交易', menuViewBlocks:'查看区块',
    menuViewBatches:'查看批次', menuForkedBlocks:'分叉区块 (重组)',
    menuTopAccounts:'热门账户', menuVerifiedContracts:'已验证合约',
    menuTopTokens:'热门代币 (RX-20)', menuTokenTransfers:'代币转账 (RX-20)',
    menuTokenFlow:'代币流向可视化',
    menuLatestTransfers:'最新转账', menuLatestMints:'最新铸造',
    menuChartsStats:'图表与统计', menuTopStats:'热门统计',
    menuApiPlans:'API 套餐', menuApiDocs:'API 文档', menuCodeReader:'代码阅读器',
    menuVerifyContract:'验证合约', menuSimilarContract:'相似合约搜索',
    menuContractDiff:'合约差异对比', menuVyper:'Vyper 在线编译器',
    menuBytecode:'字节码转操作码', menuBroadcast:'广播交易',
    headerTools:'— 工具', headerExplore:'— 探索', headerServices:'— 服务',
    menuInputDecoder:'输入数据解码器', menuUnitConverter:'单位转换器',
    menuCsvExport:'CSV 导出', menuBalanceChecker:'账户余额查询',
    menuRelayer:'RX 至主链中继', menuGasTracker:'Gas 追踪器',
    menuLabelCloud:'标签云', menuDomainLookup:'域名查询',
    menuTokenApprovals:'代币授权', menuVerifiedSig:'已验证签名',
    menuAdvancedFilter:'高级筛选',
    heroTitle:'ROBOTX 区块浏览器',
    searchPlaceholder:'搜索地址 (0x...) / 交易哈希 / 区块 / 代币 / 域名',
    sponsored:'赞助:', sponsorDesc:'— 零知识离线交易。',
    filterAll:'全部筛选', filterAddresses:'地址', filterTokens:'代币',
    filterNameTags:'名称标签', filterLabels:'标签', filterWebsites:'网站',
    statRtxPrice:'RX 价格', statMarketCap:'市值',
    statTransactions:'交易总量', statMedGas:'中位 GAS 价格',
    statLatestBlock:'最新区块', statAvgTime:'平均时间',
    statLatestBatch:'最新批次', statTxHistory:'交易历史 (近14天)',
    listBlocks:'最新区块', listTxns:'最新交易', listBridge:'最新 Main→RX 交易',
    customize:'自定义', validatedBy:'验证者', txnsSuffix:'笔交易',
    viewAllBlocks:'查看全部区块', from:'发送方', to:'接收方',
    viewAllTxns:'查看全部交易', bridge:'桥接',
    mainBlock:'主链区块', loadingBridge:'加载桥接数据中...',
    viewAllBridge:'查看全部桥接交易',
    addNetwork:'添加 ROBOTX 网络',
    footerDesc:'ROBOTX 是 ROBOTX 去中心化智能合约平台的区块浏览器与数据分析平台。',
    footCompany:'公司', footCommunity:'社区', footProducts:'产品', footTools:'工具',
    footAboutUs:'关于我们', footBrandAssets:'品牌资源', footContactUs:'联系我们',
    footTerms:'条款与隐私', footBugBounty:'漏洞赏金',
    footApiDocs:'API 文档', footKnowledgeBase:'知识库',
    footNetworkStatus:'网络状态', footLearnRobotx:'了解 ROBOTX',
    footAdvertise:'广告投放', footEaas:'浏览器即服务 (EaaS)',
    footApiPlans:'API 套餐', footPrioritySupport:'优先支持', footBlockscan:'Blockscan',
    footGasTracker:'Gas 追踪器', footTokenApprovals:'代币授权',
    footVerifyContract:'验证合约', footUnitConverter:'单位转换器', footCsvExport:'CSV 导出',
    donations:'捐赠:', builtBy:'构建者',
    cookieText:'ROBOTX 使用 Cookie 和分析工具来改善用户体验。',

    // --- 内页 ---
    backToDashboard:'返回首页', backToHome:'返回首页',
    queryFailed:'查询失败', addressQueryFailed:'地址查询失败',
    invalidSearch:'无效搜索', invalidSearchHint:'请输入有效的 EVM 地址 (0x...) 或交易哈希',
    invalidSearchExample:'示例: 0x1234...abcd',
    networkError:'网络错误', txNotFound:'交易未找到',
    rpcFailed:'RPC 连接失败，请重试。',
    txNotExist:'该交易在 ROBOTX 链上不存在。',
    txDetails:'交易详情',
    tokenTransferLabel:'代币转账', tokenApproval:'代币授权', tokenTransferFrom:'代币转移',
    sentToVault:'已发送至', swapVault:'Swap Vault', bridgeDexVault:'Bridge/DEX Vault',
    nativeRxTransfer:'RX 原生转账',
    stakingLabel:'质押', voteLabel:'投票', dexSwap:'DEX 兑换',
    bridgeInbound:'跨链转入', bridgeOutbound:'跨链转出',
    vaultRelease:'Vault 释放', vaultDeposit:'Vault 存入',
    swapDetail:'兑换详情', sell:'卖出', buy:'买入',
    sellTx:'卖出交易', buyTx:'买入交易', initiator:'发起人', timeLabel:'时间',
    stakingPool:'质押池', staker:'质押人',
    bridgeDetail:'跨链详情', tokenLabel:'代币', destination:'目标',
    sourceChain:'源链', sourceTx:'源链交易', robotxTx:'ROBOTX 交易',
    sender:'发送人', receiver:'接收人',
    basicInfo:'基本信息', txHash:'交易哈希', statusLabel:'状态',
    blockLabel:'区块', typeLabel:'类型', addresses:'地址信息',
    fromLabel:'发送方', toLabel:'接收方', recipientLabel:'收款方',
    valueAndMethod:'金额与方法', valueLabel:'金额',
    methodLabel:'方法', nativeTransfer:'原生转账', contractCall:'合约调用',
    technical:'技术信息', gasUsed:'Gas 消耗', nonceLabel:'Nonce', inputData:'输入数据',
    addressLabel:'地址', contractLabel:'合约',
    rxBalance:'RX 余额', usdValue:'USD 价值',
    tokensCount:'代币', transactionsLabel:'交易记录', firstSeen:'首次出现',
    tokenHoldings:'代币持有', nativeToken:'原生代币',
    previousPage:'上一页', nextPage:'下一页',
    pageOf:'第 {0} 页 / 共 {1} 页',
    totalSupply:'总供应量', decimals:'精度', holdersLabel:'持有者',
    topHolders:'前 {0} 名持有者',
    rank:'排名', addressCol:'地址', quantity:'数量', percentage:'占比',
    noHolders:'暂无持有者', noHoldersHint:'该代币尚无持有记录',
    verifiedContracts:'已验证合约',
    verifiedTokenContracts:'ROBOTX 链上 {0} 个已验证代币合约',
    contractAddress:'合约地址', tokenName:'代币名称',
    symbolLabel:'代码', decimalsLabel:'精度', compilerLabel:'编译器',
    licenseLabel:'许可证', statusVerified:'已验证',
    contractSourceVerified:'合约源码已验证',
    contractSourceCode:'合约源代码',
    copySource:'复制源码', backToContractList:'返回已验证合约列表',
    contractNameLabel:'合约名称:', compilerVersion:'编译器版本:',
    optimization:'优化:', evmVersion:'EVM 版本:',
    latestTransactions:'最新交易', latestBlocks:'最新区块',
    recentTxDesc:'最近链上交易 (每3.5秒刷新)',
    recentBlockDesc:'最近区块 (每3.5秒刷新)',
    topAccountsByBalance:'RX 余额排行',
    rx20TokenTracker:'RX-20 代币追踪', tokensFound:'共 {0} 个代币',
    rx20TokenTransfers:'RX-20 代币转账', recentTokenTransfers:'最近代币转账记录',
    thTxHash:'交易哈希', thMethod:'方法', thBlock:'区块', thFrom:'发送方', thTo:'接收方',
    thValue:'金额', thFee:'手续费', thAge:'时间', thTxn:'交易', thProducer:'出块者',
    thGasUsed:'Gas 消耗', thGasPercent:'Gas %', thBaseFee:'基础费', thReward:'奖励',
    thNameTag:'标签', thBalance:'余额 (RX)', thPercentage:'占比', thTxnCount:'交易数',
    thToken:'代币', thContract:'合约', thDecimals:'精度', thStandard:'标准',
    thAmount:'数量',
    totalTransactionsLabel:'交易总量', totalBlocksLabel:'区块总量',
    avgBlockTimeLabel:'平均出块时间', tpsLabel:'TPS',
    rxPriceLabelStat:'RX 价格', gasPriceLabelStat:'Gas 价格',
    latestBatchLabel:'最新批次', rx20TokensLabel:'RX-20 代币',
    txHistory14d:'交易历史 (近14天)',
    chartsAndStats:'图表与统计',
    contractCreation:'合约创建',
    cookiePolicy:'Cookie 政策', privacyPolicy:'隐私政策', gotIt:'知道了！',
  },
};


// =========================================================
// 已验证合约映射
// =========================================================
const TOKEN_LOGOS = {
  RX:   'https://robotxhub.ai/assets/images/logo.png',
  ETH:  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png',
  BNB:  'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
  DAI:  'https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png',
  POL:  'https://assets.coingecko.com/coins/images/4713/large/polygon.png',
  WBTC: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png',
  WETH: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  TEST: 'https://robotxhub.ai/assets/images/logo.png',
};

const TOKEN_COLORS = {
  RX:'#06B6D4', ETH:'#627EEA', USDT:'#26A17B', USDC:'#2775CA',
  BNB:'#F0B90B', DAI:'#F5AC37', POL:'#8247E5', WBTC:'#F7931A', WETH:'#627EEA'
};

const VERIFIED_CONTRACTS = {
  '0x366749238C873Ec04258d178B357B7e00422C0A4': { name: 'Tether USD', symbol: 'USDT', decimals: 6, verified: true, compiler: 'Solidity 0.8.24', license: 'MIT' },
  '0x7d7E19c484244741530cb27c993A54219e195CC6': { name: 'USD Coin', symbol: 'USDC', decimals: 6, verified: true, compiler: 'Solidity 0.8.24', license: 'MIT' },
  '0x22131CaBaC05cd131d0D48c4AaF0877AA5400D85': { name: 'Binance Coin', symbol: 'BNB', decimals: 18, verified: true, compiler: 'Solidity 0.8.24', license: 'MIT' },
  '0xB1171c358704866e6DCA7B403bEeaA32DFE857Ac': { name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, verified: true, compiler: 'Solidity 0.8.24', license: 'MIT' },
  '0x4630917C0C9871398aaF7F5ba47738c0Aa39b836': { name: 'Ethereum', symbol: 'ETH', decimals: 18, verified: true, compiler: 'Solidity 0.8.24', license: 'MIT' },
  '0xEA32afE9b640fD883C773A3F32DE971b7c4441bC': { name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8, verified: true, compiler: 'Solidity 0.8.24', license: 'MIT' },
  '0xdD96950b01AAE6D78bBBf323bedD2e3422CFF814': { name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18, verified: true, compiler: 'Solidity 0.8.24', license: 'MIT' },
  '0x8Ee160E90E388Bb860d397346197289489982248': { name: 'Polygon', symbol: 'POL', decimals: 18, verified: true, compiler: 'Solidity 0.8.24', license: 'MIT' },
};

// 代币合约反向映射（用于交易解码）
const TOKEN_BY_ADDRESS = {
  '0x366749238c873ec04258d178b357b7e00422c0a4': { symbol: 'USDT', decimals: 6 },
  '0x7d7e19c484244741530cb27c993a54219e195cc6': { symbol: 'USDC', decimals: 6 },
  '0x22131cabac05cd131d0d48c4aaf0877aa5400d85': { symbol: 'BNB', decimals: 18 },
  '0xb1171c358704866e6dca7b403beeaa32dfe857ac': { symbol: 'WETH', decimals: 18 },
  '0x4630917c0c9871398aaf7f5ba47738c0aa39b836': { symbol: 'ETH', decimals: 18 },
  '0xea32afe9b640fd883c773a3f32de971b7c4441bc': { symbol: 'WBTC', decimals: 8 },
  '0xdd96950b01aae6d78bbbf323bedd2e3422cff814': { symbol: 'DAI', decimals: 18 },
  '0x8ee160e90e388bb860d397346197289489982248': { symbol: 'POL', decimals: 18 },
};

const TOKEN_USD_PRICES = {USDT:1,USDC:1,DAI:1,ETH:2050,WETH:2050,BNB:600,WBTC:95000,POL:0.5};
const VAULT_ADDRESS = '0xed8d698d18575d9f732556516a8721abc8a87171';
const RPC_URL = process.env.REACT_APP_RPC_URL || 'https://rpc.robotxhub.ai';
const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID || '2679');
const CHAIN_ID_HEX = `0x${CHAIN_ID.toString(16).toUpperCase()}`;
const EXPLORER_URL = process.env.REACT_APP_EXPLORER_URL || 'https://explorer.robotxhub.ai';
const isEvmAddress = (value = '') => /^0x[a-fA-F0-9]{40}$/.test(value);

// 解码ERC-20 transfer/approve/transferFrom input data
const decodeTokenInput = (input, toAddr) => {
  if (!input || input.length < 10) return null;
  const selector = input.slice(0, 10).toLowerCase();
  const token = TOKEN_BY_ADDRESS[(toAddr || '').toLowerCase()];
  if (!token) return null;
  try {
    if (selector === '0xa9059cbb' && input.length >= 138) {
      const recipient = '0x' + input.slice(34, 74);
      const amountHex = input.slice(74, 138);
      const rawBig = BigInt('0x' + amountHex);
      const divisor = BigInt(10 ** token.decimals);
      const amount = Number(rawBig / divisor) + Number(rawBig % divisor) / Number(divisor);
      return { method: 'transfer', token: token.symbol, recipient, amount: amount.toFixed(token.decimals <= 6 ? 2 : 6), decimals: token.decimals };
    }
    if (selector === '0x23b872dd' && input.length >= 202) {
      const from = '0x' + input.slice(34, 74);
      const to = '0x' + input.slice(98, 138);
      const amountHex = input.slice(138, 202);
      const rawBig = BigInt('0x' + amountHex);
      const divisor = BigInt(10 ** token.decimals);
      const amount = Number(rawBig / divisor) + Number(rawBig % divisor) / Number(divisor);
      return { method: 'transferFrom', token: token.symbol, from, recipient: to, amount: amount.toFixed(token.decimals <= 6 ? 2 : 6), decimals: token.decimals };
    }
    if (selector === '0x095ea7b3' && input.length >= 138) {
      const spender = '0x' + input.slice(34, 74);
      const amountHex = input.slice(74, 138);
      const rawBig = BigInt('0x' + amountHex);
      const divisor = BigInt(10 ** token.decimals);
      const amount = Number(rawBig / divisor) + Number(rawBig % divisor) / Number(divisor);
      return { method: 'approve', token: token.symbol, recipient: spender, amount: amount.toFixed(token.decimals <= 6 ? 2 : 6), decimals: token.decimals };
    }
  } catch(e) {}
  return null;
};

const ERC20_SOURCE_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RXToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
}`;

// =========================================================
// SVG 图标组件（ROBOTX 原创设计）
// =========================================================

// ROBOTX 主品牌标志 — 六边形机器人头像
const RobotXIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
    {/* 六边形外框 */}
    <path d="M100 8L183 54V146L100 192L17 146V54L100 8Z" fill="#0B1221" stroke="#06B6D4" strokeWidth="4"/>
    {/* 机器人头部 */}
    <rect x="56" y="70" width="88" height="72" rx="14" fill="#0F1D35" stroke="#1A3352" strokeWidth="3"/>
    {/* 天线杆 */}
    <line x1="100" y1="70" x2="100" y2="44" stroke="#1A3352" strokeWidth="4" strokeLinecap="round"/>
    {/* 天线顶部发光球 */}
    <circle cx="100" cy="40" r="8" fill="#06B6D4"/>
    <circle cx="100" cy="40" r="14" fill="#06B6D4" opacity="0.15"/>
    {/* 左眼 */}
    <circle cx="78" cy="100" r="12" fill="#06B6D4"/>
    <circle cx="78" cy="100" r="18" fill="#06B6D4" opacity="0.1"/>
    <circle cx="74" cy="96" r="3.5" fill="#fff" opacity="0.45"/>
    {/* 右眼 */}
    <circle cx="122" cy="100" r="12" fill="#06B6D4"/>
    <circle cx="122" cy="100" r="18" fill="#06B6D4" opacity="0.1"/>
    <circle cx="118" cy="96" r="3.5" fill="#fff" opacity="0.45"/>
    {/* 嘴部格栅 */}
    <rect x="74" y="122" width="52" height="4" rx="2" fill="#06B6D4" opacity="0.5"/>
    <rect x="80" y="130" width="40" height="3" rx="1.5" fill="#06B6D4" opacity="0.3"/>
    {/* 耳部面板 */}
    <rect x="40" y="88" width="16" height="24" rx="5" fill="#0F1D35" stroke="#1A3352" strokeWidth="2"/>
    <rect x="144" y="88" width="16" height="24" rx="5" fill="#0F1D35" stroke="#1A3352" strokeWidth="2"/>
    {/* 耳部 LED 指示灯 */}
    <circle cx="48" cy="96" r="2.5" fill="#06B6D4" opacity="0.6"/>
    <circle cx="48" cy="104" r="2.5" fill="#06B6D4" opacity="0.3"/>
    <circle cx="152" cy="96" r="2.5" fill="#06B6D4" opacity="0.6"/>
    <circle cx="152" cy="104" r="2.5" fill="#06B6D4" opacity="0.3"/>
  </svg>
);

// RX 代币图标 — 圆形币 + 电路风 X
const RTXCoinIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
    {/* 外环 */}
    <circle cx="100" cy="100" r="94" fill="#0B1221" stroke="#06B6D4" strokeWidth="3.5"/>
    {/* 内环虚线 (扫描/电路感) */}
    <circle cx="100" cy="100" r="78" stroke="#1A3352" strokeWidth="1.5" strokeDasharray="6 4"/>
    {/* X 交叉线 */}
    <line x1="58" y1="58" x2="142" y2="142" stroke="#06B6D4" strokeWidth="8" strokeLinecap="round"/>
    <line x1="142" y1="58" x2="58" y2="142" stroke="#06B6D4" strokeWidth="8" strokeLinecap="round"/>
    {/* 四端节点 */}
    <circle cx="58" cy="58" r="6" fill="#06B6D4"/>
    <circle cx="142" cy="58" r="6" fill="#06B6D4"/>
    <circle cx="58" cy="142" r="6" fill="#06B6D4"/>
    <circle cx="142" cy="142" r="6" fill="#06B6D4"/>
    {/* 中心环 */}
    <circle cx="100" cy="100" r="14" fill="#0B1221" stroke="#06B6D4" strokeWidth="3"/>
    <circle cx="100" cy="100" r="6" fill="#06B6D4"/>
    <circle cx="100" cy="100" r="20" fill="#06B6D4" opacity="0.08"/>
  </svg>
);

// 以太坊菱形图标 (经典 ETH 钻石)
const EthIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size * 1.63} viewBox="0 0 256 417" className={className}>
    <path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
    <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
    <path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
    <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"/>
    <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z"/>
    <path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z"/>
  </svg>
);

// MetaMask 狐狸图标 (简化版)
const MetaMaskIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 318.6 318.6" className={className}>
    <polygon fill="#E2761B" points="274.1,35.5 174.6,109.4 193,65.8"/>
    <polygon fill="#E4761B" points="44.4,35.5 143.1,110.1 125.6,65.8"/>
    <polygon fill="#E4761B" points="238.3,206.8 211.8,247.4 268.5,263.1 284.8,207.7"/>
    <polygon fill="#E4761B" points="33.9,207.7 50.1,263.1 106.8,247.4 80.3,206.8"/>
    <polygon fill="#E4761B" points="103.6,138.2 87.8,162.1 143.8,164.6 141.7,104.3"/>
    <polygon fill="#E4761B" points="214.9,138.2 176.1,103.6 174.6,164.6 230.8,162.1"/>
    <polygon fill="#F6851B" points="106.8,247.4 140.6,230.9 111.4,208.1"/>
    <polygon fill="#F6851B" points="177.9,230.9 211.8,247.4 207.1,208.1"/>
    <polygon fill="#E2761B" points="211.8,247.4 177.9,230.9 180.6,253 180.3,262.3"/>
    <polygon fill="#E2761B" points="106.8,247.4 138.3,262.3 138.1,253 140.6,230.9"/>
    <polygon fill="#CD6116" points="138.8,193.5 110.6,185.2 130.5,176.1"/>
    <polygon fill="#CD6116" points="179.7,193.5 188,176.1 208,185.2"/>
    <polygon fill="#233447" points="106.8,247.4 111.6,206.8 80.3,207.7"/>
    <polygon fill="#233447" points="207,206.8 211.8,247.4 238.3,207.7"/>
    <polygon fill="#CD6116" points="230.8,162.1 174.6,164.6 179.8,193.5 188.1,176.1 208.1,185.2"/>
    <polygon fill="#CD6116" points="110.6,185.2 130.6,176.1 138.8,193.5 143.8,164.6 87.8,162.1"/>
    <polygon fill="#E4751F" points="87.8,162.1 111.4,208.1 110.6,185.2"/>
    <polygon fill="#E4751F" points="208.1,185.2 207.1,208.1 230.8,162.1"/>
    <polygon fill="#E4751F" points="143.8,164.6 138.8,193.5 145.1,227.6 146.6,182.4"/>
    <polygon fill="#E4751F" points="174.6,164.6 172,182.2 173.4,227.6 179.8,193.5"/>
    <polygon fill="#F6851B" points="179.8,193.5 173.4,227.6 177.9,230.9 207.1,208.1 208.1,185.2"/>
    <polygon fill="#F6851B" points="110.6,185.2 111.4,208.1 140.6,230.9 145.1,227.6 138.8,193.5"/>
    <polygon fill="#C0AD9E" points="180.3,262.3 180.6,253 178.1,250.8 140.4,250.8 138.1,253 138.3,262.3 106.8,247.4 117.8,256.4 140.1,271.9 178.4,271.9 200.8,256.4 211.8,247.4"/>
    <polygon fill="#161616" points="177.9,230.9 173.4,227.6 145.1,227.6 140.6,230.9 138.1,253 140.4,250.8 178.1,250.8 180.6,253"/>
    <polygon fill="#763D16" points="278.3,114.2 286.8,73.4 274.1,35.5 177.9,106.9 214.9,138.2 267.2,153.5 278.8,140 273.8,136.4 281.8,129.1 275.6,124.3 283.6,118.2"/>
    <polygon fill="#763D16" points="31.8,73.4 40.3,114.2 34.9,118.2 42.9,124.3 36.8,129.1 44.8,136.4 39.8,140 51.3,153.5 103.6,138.2 140.6,106.9 44.4,35.5"/>
    <polygon fill="#F6851B" points="267.2,153.5 214.9,138.2 230.8,162.1 207.1,208.1 238.3,207.7 284.8,207.7"/>
    <polygon fill="#F6851B" points="103.6,138.2 51.3,153.5 33.9,207.7 80.3,207.7 111.4,208.1 87.8,162.1"/>
    <polygon fill="#F6851B" points="174.6,164.6 177.9,106.9 193.1,65.8 125.6,65.8 140.6,106.9 143.8,164.6 145,182.5 145.1,227.6 173.4,227.6 173.6,182.5"/>
  </svg>
);

// --- 组件：迷你趋势图 ---
const Sparkline = ({ color = "text-cyan-500", trend = "up" }) => (
  <svg className={`w-16 h-8 ${color} opacity-80`} viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2">
    <path d={trend === "up"
      ? "M0 35 Q10 35, 20 20 T40 25 T60 10 T80 15 T100 5"
      : "M0 5 Q10 15, 20 20 T40 15 T60 25 T80 30 T100 35"} />
  </svg>
);

// --- 14天交易历史图表 ---
const TxHistoryChart = ({ data }) => {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 280, h = 80, pad = 4;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const area = `M${pts[0]} ${pts.join(' L')} L${w - pad},${h - pad} L${pad},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cg)" />
      <polyline points={pts.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={parseFloat(pts[pts.length-1])} cy={parseFloat(pts[pts.length-1].split(',')[1])} r="3" fill="var(--accent)" stroke="var(--bg)" strokeWidth="1.5" />
    </svg>
  );
};

// --- 复制按钮 ---
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const doCopy = () => { if (text) navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button onClick={doCopy} className="t-text-dim hover:t-accent p-0.5" title="Copy">
      {copied ? <CheckCircle size={12} className="t-price-up" /> : <Copy size={12} />}
    </button>
  );
};

// --- 搜索筛选标签 ---
const SearchFilterTabs = ({ active, onChange, tabs }) => (
  <div className="flex gap-1.5 mt-3 flex-wrap">
    {tabs.map((tab, idx) => (
      <button key={idx} onClick={() => onChange(idx)}
        className={`px-3 py-1 rounded-full text-[11px] font-medium ${active === idx ? 't-filter-active' : 't-filter-tab'}`}>
        {tab}
      </button>
    ))}
  </div>
);

// --- 主题切换器 ---
const ThemeSwitcher = ({ theme, onChange }) => {
  const items = [
    { key: 'dark', icon: Moon, label: 'Dark' },
    { key: 'dim', icon: Sun, label: 'Dim' },
    { key: 'light', icon: Sun, label: 'Light' },
  ];
  return (
    <div className="flex t-net-selector rounded overflow-hidden">
      {items.map(it => (
        <button key={it.key} onClick={() => onChange(it.key)}
          className={`px-2 py-1 text-[10px] flex items-center gap-1 ${theme === it.key ? 't-theme-active' : 't-theme-btn'}`}>
          <it.icon size={9} /> {it.label}
        </button>
      ))}
    </div>
  );
};

// --- 语言切换按钮 ---
const LanguageToggle = ({ lang, onChange }) => (
  <button onClick={() => onChange(lang === 'en' ? 'zh' : 'en')}
    className="flex items-center gap-1 px-2 py-1 text-[10px] t-theme-btn rounded t-bg-hover font-medium"
    title={lang === 'en' ? '切换中文' : 'Switch to English'}>
    <Globe size={10} />
    <span>{lang === 'en' ? '中文' : 'EN'}</span>
  </button>
);

// --- Cookie 同意栏 ---
const CookieBanner = ({ onAccept, t }) => (
  <div className="fixed bottom-0 left-0 right-0 t-cookie px-4 py-3 flex items-center justify-between z-[60] text-xs">
    <span>
      {t.cookieText}
      <span className="t-accent hover:underline cursor-pointer ml-1">{t.cookiePolicy}</span> &
      <span className="t-accent hover:underline cursor-pointer ml-1">{t.privacyPolicy}</span>.
    </span>
    <button onClick={onAccept} className="text-white px-4 py-1.5 rounded text-xs font-bold shrink-0 ml-4" style={{ background: 'var(--accent)' }}>{t.gotIt}</button>
  </div>
);

const shortAddr = (a) => a.slice(0, 8) + '...' + a.slice(-6);

// =========================================================
// 核心内容组件
// =========================================================
const RobotXContent = () => {
  const [blockHeight, setBlockHeight] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [txs, setTxs] = useState([]);
  const [bridgeTxs, setBridgeTxs] = useState([]);
  const [robotxPrice, setRobotxPrice] = useState(2.45);
  const [robotxPriceChange, setRobotxPriceChange] = useState(0);
  const [ethPrice, setEthPrice] = useState(1973.32);
  const [ethPriceChange, setEthPriceChange] = useState(1.23);
  const [gasPrice, setGasPrice] = useState(0.02);
  const [tps, setTps] = useState(31.0);
  const [totalTxns] = useState(2383.92);
  const [latestBatch, setLatestBatch] = useState(1170842);
  const [avgBlockTime, setAvgBlockTime] = useState(0.25);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  const [searchFilter, setSearchFilter] = useState(0);
  const [theme, setTheme] = useState('dim');
  const [lang, setLang] = useState('en');
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [contractView, setContractView] = useState(null);  // null | 'list' | address string
  const [navPage, setNavPage] = useState(null); // null | 'transactions' | 'blocks' | 'accounts' | 'tokens' | 'transfers'
  const [searchTerm, setSearchTerm] = useState('');
  const [txDetail, setTxDetail] = useState(null); // 交易详情视图
  const [addressDetail, setAddressDetail] = useState(null);
    const [tokenDetail, setTokenDetail] = useState(null); // 地址详情视图 {address, hexAddress, balances, txHistory}
  const [searchLoading, setSearchLoading] = useState(false);
  const [expandedSource, setExpandedSource] = useState(null);  // 展开的源码合约地址
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalances, setWalletBalances] = useState(null); // {RX: number, USDT: number, ...}
  const [showWalletPanel, setShowWalletPanel] = useState(false);
  const [txChartData] = useState(() => Array(14).fill(0).map(() => Math.floor(Math.random() * 6000000) + 3000000));

  // RPC查询交易
  const rpcCall = async (method, params = []) => {
    const resp = await fetch(RPC_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    });
    const data = await resp.json();
    return data.result;
  };

  const getERC20Balance = async (contractAddr, ownerHex) => {
    const addr = ownerHex.replace(/^0x/, '').padStart(64, '0');
    const callData = '0x70a08231' + addr;
    const result = await rpcCall('eth_call', [{ to: contractAddr, data: callData }, 'latest']);
    if (!result || result === '0x' || result === '0x0') return 0;
    return Number(BigInt(result));
  };

  const connectWallet = async () => {
    const provider = window.ethereum;
    if (!provider) { alert('Please install MetaMask'); return; }
    try {
      try {
        await provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: CHAIN_ID_HEX, chainName: 'ROBOTX Mainnet', nativeCurrency: { name: 'RX', symbol: 'RX', decimals: 6 }, rpcUrls: [RPC_URL], blockExplorerUrls: [EXPLORER_URL] }] });
      } catch (_) {}
      try {
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_ID_HEX }] });
      } catch (_) {}
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        const hex = accounts[0];
        setWalletAddress(hex);
        setWalletConnected(true);
        fetchWalletBalances(hex);
      }
    } catch (e) { console.error('Wallet connect failed:', e); }
  };

  const fetchWalletBalances = async (hexAddr) => {
    const bals = {};
    const rxResult = await rpcCall('robotx_getBalance', [hexAddr]);
    if (rxResult != null) {
      const bal = typeof rxResult === 'string' ? parseInt(rxResult, 16) : Number(rxResult);
      bals.RX = bal / 1e6;
    } else { bals.RX = 0; }
    const tokenContracts = {
      USDT: { addr: '0x366749238C873Ec04258d178B357B7e00422C0A4', dec: 6 },
      USDC: { addr: '0x7d7E19c484244741530cb27c993A54219e195CC6', dec: 6 },
      ETH:  { addr: '0x4630917C0C9871398aaF7F5ba47738c0Aa39b836', dec: 18 },
      BNB:  { addr: '0x22131CaBaC05cd131d0D48c4AaF0877AA5400D85', dec: 18 },
      DAI:  { addr: '0xdD96950b01AAE6D78bBBf323bedD2e3422CFF814', dec: 18 },
      POL:  { addr: '0x8Ee160E90E388Bb860d397346197289489982248', dec: 18 },
      WBTC: { addr: '0xEA32afE9b640fD883C773A3F32DE971b7c4441bC', dec: 8 },
      WETH: { addr: '0xB1171c358704866e6DCA7B403bEeaA32DFE857Ac', dec: 18 },
    };
    for (const [sym, info] of Object.entries(tokenContracts)) {
      const raw = await getERC20Balance(info.addr, hexAddr);
      bals[sym] = raw / Math.pow(10, info.dec);
    }
    setWalletBalances(bals);
  };

  const disconnectWallet = () => {
    setWalletConnected(false); setWalletAddress('');
    setWalletBalances(null); setShowWalletPanel(false);
  };

  // eslint-disable-next-line
  useEffect(() => {
    if (!walletConnected || !walletAddress) return;
    const timer = setInterval(() => fetchWalletBalances(walletAddress), 15000);
    return () => clearInterval(timer);
  }, [walletConnected, walletAddress]);

  // 地址查询: 获取余额 + 代币持有 + 转账记录
  const searchTokenHolders = async (contractAddr) => {
    setSearchLoading(true);
    setTxDetail(null);
    setAddressDetail(null);
    setContractView(null);
    setNavPage(null);
    try {
      const result = await rpcCall('robotx_getTokenHolders', [contractAddr, 50]);
      if (result) {
        setTokenDetail(result);
      }
    } catch(e) {
      console.log('getTokenHolders error:', e);
      setTokenDetail({ error: e.message, contract: contractAddr });
    }
    setSearchLoading(false);
  };

  const searchAddress = async (inputAddr) => {
    setSearchLoading(true);
    setTxDetail(null);
    setContractView(null);
    setNavPage(null);
    try {
      const hexAddr = inputAddr.toLowerCase();

      // 获取RX余额
      const balances = {};
      const rxResult = await rpcCall('robotx_getBalance', [hexAddr]);
      if (rxResult != null) {
        const bal = typeof rxResult === 'string' ? parseInt(rxResult, 16) : Number(rxResult);
        balances.RX = bal / 1e6;
      } else { balances.RX = 0; }

      // 获取账户信息(nonce等)
      let accountInfo = null;
      try { accountInfo = await rpcCall('robotx_getAccountInfo', [hexAddr]); } catch(e) {}

      // 获取所有ERC-20代币余额
      const tokenContracts = {
        USDT: { addr: '0x366749238C873Ec04258d178B357B7e00422C0A4', dec: 6 },
        USDC: { addr: '0x7d7E19c484244741530cb27c993A54219e195CC6', dec: 6 },
        ETH:  { addr: '0x4630917C0C9871398aaF7F5ba47738c0Aa39b836', dec: 18 },
        BNB:  { addr: '0x22131CaBaC05cd131d0D48c4AaF0877AA5400D85', dec: 18 },
        DAI:  { addr: '0xdD96950b01AAE6D78bBBf323bedD2e3422CFF814', dec: 18 },
        POL:  { addr: '0x8Ee160E90E388Bb860d397346197289489982248', dec: 18 },
        WBTC: { addr: '0xEA32afE9b640fD883C773A3F32DE971b7c4441bC', dec: 8 },
        WETH: { addr: '0xB1171c358704866e6DCA7B403bEeaA32DFE857Ac', dec: 18 },
      };
      for (const [sym, info] of Object.entries(tokenContracts)) {
        try {
          const raw = await getERC20Balance(info.addr, hexAddr);
          balances[sym] = raw / Math.pow(10, info.dec);
        } catch(e) { balances[sym] = 0; }
      }

      // 查询地址交易历史
      let addrTxs = { total: 0, transactions: [], firstSeen: null };
      try {
        addrTxs = await rpcCall('robotx_getTransactionsByAddress', [{ address: hexAddr, page: 0, limit: 25 }]) || addrTxs;
      } catch(e) { console.log('getTxsByAddr:', e); }

      setAddressDetail({
        address: inputAddr,
        hexAddress: hexAddr,
        balances,
        accountInfo,
        transactions: addrTxs.transactions || [],
        totalTxs: addrTxs.total || 0,
        firstSeen: addrTxs.firstSeen || null,
        txPage: 0,
        txsExpanded: true,
        tokensExpanded: true,
        isVault: hexAddr.toLowerCase() === VAULT_ADDRESS,
        isContract: !!VERIFIED_CONTRACTS[Object.keys(VERIFIED_CONTRACTS).find(k => k.toLowerCase() === hexAddr.toLowerCase())],
      });
    } catch(e) {
      setAddressDetail({ address: inputAddr, error: e.message });
    }
    setSearchLoading(false);
  };

  const searchTransaction = async (hash) => {
    if (!hash || !hash.startsWith('0x')) return;
    setSearchLoading(true);
    setContractView(null);
    try {
      const [tx, receipt, rxTx] = await Promise.all([
        rpcCall('eth_getTransactionByHash', [hash]),
        rpcCall('eth_getTransactionReceipt', [hash]),
        rpcCall('robotx_getTransactionByHash', [hash]).catch(() => null),
      ]);
      const robotxType = rxTx?.type ?? rxTx?.Type ?? null;
      if (tx) {
        const toHex = tx.to ? tx.to.toLowerCase() : null;
        const decoded = decodeTokenInput(tx.input, toHex);
        const isVaultTx = toHex && toHex.toLowerCase() === VAULT_ADDRESS;
        const valueRX = tx.value ? Number(BigInt(tx.value)) / 1e6 : 0;
        const toContractLabel = TOKEN_BY_ADDRESS[(tx.to || '').toLowerCase()]?.symbol || null;
        let txType = '转账';
        try {
          if (robotxType === 4) txType = '质押';
          else if (robotxType === 1) txType = '投票';
          else if (robotxType === 6) txType = '合约部署';
          else if (tx.from?.toLowerCase() === VAULT_ADDRESS) txType = 'Vault释放';
          else if (isVaultTx || decoded?.recipient?.toLowerCase() === VAULT_ADDRESS) txType = 'Vault存入';
          else if (robotxType === 3 || (tx.input && tx.input !== '0x' && tx.input.length > 2)) txType = '合约调用';
          else txType = '转账';
        } catch(e) {}
        // 查询闪兑记录
        let swapInfo = null;
        try {
          swapInfo = await rpcCall('robotx_getSwapInfo', [hash]);
          if (swapInfo && swapInfo.buyTxHash) {
            txType = 'Swap兑换';
          }
        } catch(e) {}
        // 查询质押记录
        let stakingInfo = null;
        try {
          stakingInfo = await rpcCall('robotx_getStakingInfo', [hash]);
          if (stakingInfo && stakingInfo.depositTxHash) {
            txType = 'LP质押';
          }
        } catch(e) {}
        // 查询跨链桥记录
        let bridgeInfo = null;
        if (!swapInfo && !stakingInfo) {
          try {
            bridgeInfo = await rpcCall('robotx_getBridgeInfo', [hash]);
            if (bridgeInfo && (bridgeInfo.robotxTxHash || bridgeInfo.sourceChain)) {
              if (bridgeInfo.direction === 'inbound') txType = '跨链转入';
              else txType = '跨链转出';
            }
          } catch(e) {}
        }
        setTxDetail({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: valueRX.toFixed(6),
          blockNumber: tx.blockNumber ? parseInt(tx.blockNumber, 16) : 'Pending',
          status: receipt?.status === '0x1' ? 'Success' : receipt?.status === '0x0' ? 'Failed' : 'Pending',
          gasUsed: receipt?.gasUsed ? parseInt(receipt.gasUsed, 16) : '-',
          input: tx.input || '0x',
          nonce: tx.nonce ? parseInt(tx.nonce, 16) : 0,
          type: tx.type ? parseInt(tx.type, 16) : 0,
          decoded,
          isVaultTx,
          tokenSymbol: decoded ? decoded.token : (valueRX > 0 ? 'RX' : null),
          tokenAmount: decoded ? decoded.amount : (valueRX > 0 ? valueRX.toFixed(2) : null),
          toContractLabel, txType, robotxType, swapInfo, bridgeInfo, stakingInfo,
        });
      } else {
        setTxDetail({ hash, notFound: true });
      }
    } catch (e) {
      const isNetErr = e.message && (e.message.includes('fetch') || e.message.includes('network') || e.message.includes('Failed'));
      setTxDetail({ hash, notFound: true, error: e.message, isNetErr });
    }
    setSearchLoading(false);
  };

  const handleSearch = (overrideTerm) => {
    let term = (overrideTerm || searchTerm).trim();
    // 自动补0x前缀(txHash)
    if (/^[0-9a-fA-F]{64}$/.test(term)) term = '0x' + term;
    if (isEvmAddress(term)) {
      setAddressDetail(null);
      setTokenDetail(null);
      // 检查是否是代币合约
      const isToken = Object.keys(VERIFIED_CONTRACTS).some(k => k.toLowerCase() === term.toLowerCase());
      if (isToken) {
        searchTokenHolders(term);
      } else {
        searchAddress(term);
      }
    }
    // txHash(66字符)
    else if (term.startsWith('0x') && term.length >= 66) {
      setAddressDetail(null);
      searchTransaction(term);
    }
    else if (term.length > 0) {
      setAddressDetail(null);
      setTxDetail({ hash: term, notFound: true, invalidInput: true });
    }
  };

  // 粘贴自动搜索(txHash + 地址)
  const handlePaste = (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData('text').trim();
    if (isEvmAddress(pasted)) {
      e.preventDefault();
      setSearchTerm(pasted);
      setTimeout(() => handleSearch(pasted), 50);
      return;
    }
    // txHash(64位hex或0x+64)
    if (pasted.length >= 64) {
      e.preventDefault();
      let hash = pasted;
      if (/^[0-9a-fA-F]{64}$/.test(hash)) hash = '0x' + hash;
      setSearchTerm(hash);
      setTimeout(() => handleSearch(hash), 50);
    }
  };

  // URL参数解析: ?tx=0x... 或 ?address=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txParam = params.get('tx');
    const addrParam = params.get('address') || params.get('addr');
    if (txParam && txParam.startsWith('0x')) searchTransaction(txParam);
    else if (addrParam && isEvmAddress(addrParam)) searchAddress(addrParam);
  }, []);

  // 点击外部关闭钱包面板
  useEffect(() => {
    if (!showWalletPanel) return;
    const h = (e) => {
      if (!e.target.closest('.wallet-panel-container')) setShowWalletPanel(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showWalletPanel]);

  const t = translations[lang];

  // 交易类型翻译映射
  const txTypeMap = {
    '转账': t.nativeRxTransfer, '质押': t.stakingLabel, '投票': t.voteLabel,
    '合约部署': lang === 'zh' ? '合约部署' : 'Contract Deploy',
    'Vault释放': t.vaultRelease, 'Vault存入': t.vaultDeposit,
    '合约调用': t.contractCall, 'Swap兑换': t.dexSwap, 'LP质押': 'LP ' + t.stakingLabel,
    '跨链转入': t.bridgeInbound, '跨链转出': t.bridgeOutbound,
  };
  const txTypeDisplay = (type) => txTypeMap[type] || type;

  const filterTabs = [t.filterAll, t.filterAddresses, t.filterTokens, t.filterNameTags, t.filterLabels, t.filterWebsites];
  const navLabels = { Blockchain:t.navBlockchain, Tokens:t.navTokens, NFTs:t.navNFTs, Resources:t.navResources, Developers:t.navDevelopers, More:t.navMore };

  const navMenu = {
    Blockchain: [
      { name:t.menuTransactions, icon:FileText }, { name:t.menuMainToRx, icon:ArrowUpRight },
      { name:t.menuRxToMain, icon:ArrowDownRight }, { name:t.menuContractInternal, icon:GitBranch },
      { name:t.menuRxTxns, icon:Users, badge:'Beta' }, { name:'divider' },
      { name:t.menuViewBlocks, icon:Box }, { name:t.menuViewBatches, icon:Package },
      { name:t.menuForkedBlocks, icon:AlertTriangle }, { name:'divider' },
      { name:t.menuTopAccounts, icon:Users }, { name:t.menuVerifiedContracts, icon:CheckCircle },
    ],
    Tokens: [
      { name:t.menuTopTokens, icon:TrendingUp }, { name:t.menuTokenTransfers, icon:ArrowRight },
      { name:t.menuTokenFlow, icon:Activity, badge:'Beta' },
    ],
    NFTs: [ { name:t.menuLatestTransfers, icon:ArrowRight }, { name:t.menuLatestMints, icon:Star } ],
    Resources: [ { name:t.menuChartsStats, icon:BarChart3 }, { name:t.menuTopStats, icon:TrendingUp } ],
    Developers: [
      { name:t.menuApiPlans, icon:Zap }, { name:t.menuApiDocs, icon:FileText },
      { name:t.menuCodeReader, icon:FileCode, badge:'Beta' }, { name:'divider' },
      { name:t.menuVerifyContract, icon:CheckCircle }, { name:t.menuSimilarContract, icon:Search },
      { name:t.menuContractDiff, icon:Code }, { name:t.menuVyper, icon:Terminal },
      { name:t.menuBytecode, icon:Hash }, { name:t.menuBroadcast, icon:Radio },
    ],
    More: [
      { name:t.headerTools, isHeader:true }, { name:t.menuInputDecoder, icon:Code, badge:'Beta' },
      { name:t.menuUnitConverter, icon:RotateCw }, { name:t.menuCsvExport, icon:FileText },
      { name:t.menuBalanceChecker, icon:Wallet }, { name:t.menuRelayer, icon:ArrowDownRight },
      { name:t.headerExplore, isHeader:true }, { name:t.menuGasTracker, icon:Fuel },
      { name:t.menuLabelCloud, icon:Bookmark }, { name:t.menuDomainLookup, icon:Globe },
      { name:t.headerServices, isHeader:true }, { name:t.menuTokenApprovals, icon:Shield, badge:'Beta' },
      { name:t.menuVerifiedSig, icon:CheckCircle }, { name:t.menuAdvancedFilter, icon:Filter, badge:'Beta' },
    ],
  };

  useEffect(() => {
    const methodCls = {
      Transfer:'bg-purple-900/20 text-purple-300 border-purple-800/30',
      Approve:'bg-green-900/20 text-green-300 border-green-800/30',
      Execute:'bg-orange-900/20 text-orange-300 border-orange-800/30',
      Stake:'bg-emerald-900/20 text-emerald-300 border-emerald-800/30',
      Vote:'bg-blue-900/20 text-blue-300 border-blue-800/30',
      Deploy:'bg-pink-900/20 text-pink-300 border-pink-800/30',
      TransferFrom:'bg-amber-900/20 text-amber-300 border-amber-800/30',
    };
    const fetchDashboard = async () => {
      try {
        // 真实区块
        const realBlocks = await rpcCall('robotx_getLatestBlocks', [8]);
        if (realBlocks && realBlocks.length > 0) {
          setBlockHeight(realBlocks[0].number || 0);
          setBlocks(realBlocks.map(b => {
            const now = Date.now();
            const ts = b.timestamp > 1e12 ? b.timestamp : b.timestamp * 1000;
            const ageSec = Math.max(1, Math.floor((now - ts) / 1000));
            return {
              number: b.number,
              timestamp: ageSec,
              miner: 'Sequencer',
              txnCount: b.txCount || 0,
              gasUsed: (b.txCount || 0) * 21000,
              gasPercent: '0.0000',
              reward: ((b.txCount || 0) * 0.1).toFixed(5) + ' RX',
              baseFee: '0.100',
            };
          }));
        }
        // 真实交易
        const realTxs = await rpcCall('robotx_getLatestTransactions', [8]);
        if (realTxs && realTxs.length > 0) {
          setTxs(realTxs.map(tx => {
            const m = tx.method || 'Transfer';
            const from = tx.from || '';
            const to = tx.to || '';
            const now = Date.now();
            const ts = tx.timestamp > 1e12 ? tx.timestamp : tx.timestamp * 1000;
            const ageSec = Math.max(1, Math.floor((now - ts) / 1000));
            return {
              hash: tx.hash || '',
              method: { name: m, cls: methodCls[m] || methodCls.Transfer },
              block: tx.blockNumber,
              from, to,
              fromShort: shortAddr(from),
              toShort: shortAddr(to),
              amount: tx.value ? (tx.value / 1e6).toFixed(4) + ' RX' : '0 RX',
              fee: tx.fee ? (tx.fee / 1e6).toFixed(7) : '0.0000001',
              time: ageSec,
            };
          }));
        } else {
          setTxs([]);
        }
        // 桥接交易暂不从链获取
        setBridgeTxs([]);
      } catch(e) {
        console.log('Dashboard fetch error:', e);
      }
    };
    fetchDashboard();
    const iv = setInterval(fetchDashboard, 6000);
    return () => clearInterval(iv);
  }, []);

  // --- 渲染菜单项 ---
  const renderMenuItem = (item, idx) => {
    if (item.name === 'divider') return <div key={idx} className="border-t t-divider-strong my-1.5" />;
    if (item.isHeader) return <div key={idx} className="px-4 pt-2.5 pb-1 text-[10px] t-text-faint uppercase tracking-widest font-bold">{item.name.replace('— ','')}</div>;
    return (
      <a key={idx} href="#" className="flex items-center gap-3 px-4 py-2 text-[12px] t-text t-bg-hover border-l-2 border-transparent hover:t-accent group/item" style={{ borderLeftColor: 'transparent' }}
        onClick={(e) => {
          e.preventDefault();
          if (item.name === t.menuVerifiedContracts) { setContractView('list'); setNavPage(null); setTxDetail(null); }
          else if (item.name === t.menuTransactions || item.name === t.menuRxTxns) { setNavPage('transactions'); setContractView(null); setTxDetail(null); }
          else if (item.name === t.menuViewBlocks) { setNavPage('blocks'); setContractView(null); setTxDetail(null); }
          else if (item.name === t.menuTopAccounts) { setNavPage('accounts'); setContractView(null); setTxDetail(null); }
          else if (item.name === t.menuTopTokens) { setNavPage('tokens'); setContractView(null); setTxDetail(null); }
          else if (item.name === t.menuTokenTransfers) { setNavPage('transfers'); setContractView(null); setTxDetail(null); }
          else if (item.name === t.menuChartsStats || item.name === t.menuTopStats) { setNavPage('stats'); setContractView(null); setTxDetail(null); }
        }}
        onMouseEnter={e => e.currentTarget.style.borderLeftColor = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.borderLeftColor = 'transparent'}>
        {item.icon && <item.icon size={13} className="t-text-dim group-hover/item:t-accent shrink-0" />}
        <span>{item.name}</span>
        {item.badge && <span className="ml-auto text-[9px] t-badge px-1.5 py-0.5 rounded font-bold">{item.badge}</span>}
      </a>
    );
  };

  return (
    <div data-theme={theme} className="h-full w-full font-sans text-[14px] leading-relaxed overflow-y-auto scrollbar-thin scrollbar-track-transparent relative t-bg t-text">

      {/* === Top Bar === */}
      <div className="t-bg-alt py-1.5 px-4 flex justify-between items-center text-[11px] font-medium relative z-50 border-b t-border">
        <div className="flex flex-wrap gap-x-5 gap-y-1 items-center">
          <span className="flex items-center gap-1.5">
            <EthIcon size={10} className="shrink-0 opacity-70" />
            <span className="t-text-dim">{t.ethPriceLabel}</span>
            <span className="t-link t-accent-hover cursor-pointer tabular-nums">${ethPrice.toFixed(2)}</span>
            <span className="text-[10px] flex items-center gap-0.5">
              <span className="t-text-muted">@ 0.029 BTC</span>
              <span className={ethPriceChange >= 0 ? 't-price-up' : 't-price-down'}>
                ({ethPriceChange >= 0 ? '+' : ''}{ethPriceChange.toFixed(2)}%)
              </span>
            </span>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Fuel size={10} className="t-text-dim" />
            <span className="t-text-dim">{t.gasLabel}</span>
            <span className="t-link tabular-nums">{gasPrice} Gwei</span>
          </span>
          <span className="hidden lg:flex items-center gap-1.5">
            <RobotXIcon size={12} className="shrink-0" />
            <span className="t-text-dim">{t.rtxPriceLabel}</span>
            <span className="t-link t-accent-hover cursor-pointer tabular-nums">${Number(robotxPrice).toFixed(4)}</span>
            <span className="text-[10px]">
              <span className="t-text-muted">@ {(Number(robotxPrice)/ethPrice).toFixed(6)} ETH</span>
              <span className={robotxPriceChange >= 0 ? ' t-price-up' : ' t-price-down'}>
                {' '}({robotxPriceChange >= 0 ? '+' : ''}{robotxPriceChange.toFixed(2)}%)
              </span>
            </span>
          </span>
        </div>
        <div className="flex gap-3 items-center shrink-0">
          <div className="hidden md:flex items-center gap-2 t-net-selector rounded px-2 py-0.5 cursor-pointer text-[10px]">
            <RobotXIcon size={14} />
            <span className="t-text-muted">{t.mainnet}</span>
            <ChevronDown size={8} className="t-text-faint" />
          </div>
          <div className="hidden md:flex gap-3 items-center"><LanguageToggle lang={lang} onChange={setLang} /><ThemeSwitcher theme={theme} onChange={setTheme} /></div>
        </div>
      </div>

      {/* === Navbar === */}
      <div className="t-nav border-b t-border py-3 px-4 sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 cursor-pointer group z-50" onClick={() => { setContractView(null); setTxDetail(null); setNavPage(null); setSearchTerm(''); }}>
            <img src="https://robotxhub.ai/assets/images/logo.png" alt="RobotX" width="72" height="72" className="-mr-1 rounded-full" style={{objectFit:"contain"}}/>
            <span className="text-lg font-black tracking-wider" style={{fontFamily:"'Orbitron', sans-serif"}}><span className="text-cyan-400">ROBOT</span><span className="text-white">X</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-0.5 text-[13px] font-medium t-text">
            <span className="cursor-pointer t-accent-hover px-3 py-2 rounded t-bg-hover" onClick={() => { setContractView(null); setTxDetail(null); setNavPage(null); setSearchTerm(''); }}>{t.home}</span>
            {Object.keys(navMenu).map(key => (
              <div key={key} className="relative group">
                <button className="flex items-center gap-1 cursor-pointer t-accent-hover px-3 py-2 rounded t-bg-hover focus:outline-none">
                  {navLabels[key]} <ChevronDown size={10} className="opacity-50 group-hover:opacity-100 group-hover:rotate-180 duration-200" />
                </button>
                <div className="absolute left-0 mt-0 w-64 t-dropdown rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-200 transform origin-top-left -translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden py-1.5">
                  {navMenu[key].map(renderMenuItem)}
                </div>
              </div>
            ))}
            <span className="t-text-faint px-1 text-lg font-light">|</span>
            {walletConnected ? (
              <div className="relative wallet-panel-container">
                <button onClick={() => setShowWalletPanel(!showWalletPanel)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg t-bg-hover border t-border text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-400" style={{boxShadow:'0 0 6px rgba(34,197,94,0.6)'}}/>
                  <span className="t-logo-text font-mono">{walletAddress.slice(0,6)+'...'+walletAddress.slice(-4)}</span>
                  <ChevronDown size={10} className="t-text-dim"/>
                </button>
                {showWalletPanel && (
                  <div className="absolute right-0 mt-2 w-[320px] t-dropdown rounded-xl shadow-2xl z-50 overflow-hidden border t-border" style={{animation:'fadeInScale 0.15s ease-out'}}>
                    <div className="p-4 border-b t-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="t-logo-text font-semibold text-sm">{t.walletBalance}</span>
                        <button onClick={disconnectWallet} className="text-[10px] text-red-400 hover:text-red-300 font-medium">{t.disconnect}</button>
                      </div>
                      <div className="font-mono text-[11px] t-text-muted truncate">{walletAddress}</div>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {walletBalances && Object.entries(walletBalances).map(([sym, bal]) => (
                        <div key={sym} className="flex items-center justify-between px-4 py-2.5 t-row border-b t-border last:border-0">
                          <div className="flex items-center gap-2.5">
                            {TOKEN_LOGOS[sym] ? (
                              <img src={TOKEN_LOGOS[sym]} alt={sym} className="w-7 h-7 rounded-full object-cover" onError={(e)=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}}/>
                            ) : null}
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{background: TOKEN_COLORS[sym]||'#666', display: TOKEN_LOGOS[sym]?'none':'flex'}}>
                              {sym.charAt(0)}
                            </div>
                            <div>
                              <div className="t-logo-text text-[13px] font-semibold">{sym}</div>
                              <div className="t-text-faint text-[10px]">{sym==='RX'?'Native':VERIFIED_CONTRACTS[Object.keys(VERIFIED_CONTRACTS).find(a => {const c=VERIFIED_CONTRACTS[a]; return c.symbol===sym;})||'']?.name||sym}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="t-logo-text text-[13px] font-mono font-semibold">{bal > 0 ? (bal >= 1000 ? bal.toLocaleString(undefined,{maximumFractionDigits:2}) : bal >= 1 ? bal.toFixed(4) : bal.toFixed(6)) : '0'}</div>
                          </div>
                        </div>
                      ))}
                      {!walletBalances && (
                        <div className="px-4 py-8 text-center t-text-dim text-sm">Loading...</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={connectWallet} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide ml-1 px-3 py-2 rounded-lg border t-border t-bg-hover t-logo-text t-accent-hover">
                <Wallet size={14} /> {t.signIn}
              </button>
            )}
          </div>

          <button className="lg:hidden p-2 rounded t-bg-hover cursor-pointer t-text-muted z-50 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* === Mobile Menu === */}
      <div className={`fixed inset-0 t-bg z-30 duration-300 lg:hidden overflow-y-auto ${isMobileMenuOpen?'translate-y-0':'-translate-y-full'}`} style={{top:'56px'}}>
        <div className="p-4 space-y-2">
          <div className="t-bg-panel rounded-lg border t-border overflow-hidden">
            <div className="p-4 border-b t-border flex items-center justify-between cursor-pointer t-bg-hover"
              onClick={() => { setContractView(null); setTxDetail(null); setNavPage(null); setSearchTerm(''); setIsMobileMenuOpen(false); }}>
              <span className="t-logo-text font-medium">{t.home}</span>
            </div>
            {Object.keys(navMenu).map(key => (
              <div key={key} className="border-b t-border last:border-0">
                <button className="w-full p-4 flex items-center justify-between text-left t-text t-bg-hover focus:outline-none"
                  onClick={() => setMobileExpandedSection(mobileExpandedSection===key?null:key)}>
                  <span className="font-medium">{navLabels[key]}</span>
                  <ChevronDown size={16} className={`duration-300 ${mobileExpandedSection===key?'rotate-180 t-accent':''}`} />
                </button>
                <div className={`t-bg-alt overflow-hidden duration-300 ${mobileExpandedSection===key?'max-h-[600px] opacity-100':'max-h-0 opacity-0'}`}>
                  {navMenu[key].map((item, idx) => {
                    if(item.name==='divider') return <div key={idx} className="border-t t-border mx-4"/>;
                    if(item.isHeader) return <div key={idx} className="px-6 pt-3 pb-1 text-[10px] t-text-faint uppercase tracking-widest font-bold">{item.name.replace('— ','')}</div>;
                    return (
                      <div key={idx} className="px-6 py-2.5 text-sm t-text-muted t-accent-hover border-l-2 border-transparent t-bg-hover cursor-pointer flex items-center gap-2.5">
                        {item.icon && <item.icon size={13} className="opacity-50"/>} {item.name}
                        {item.badge && <span className="text-[9px] t-badge px-1.5 py-0.5 rounded font-bold">{item.badge}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 px-2 mt-4 mb-2"><LanguageToggle lang={lang} onChange={setLang} /><ThemeSwitcher theme={theme} onChange={setTheme} /></div>
          <div className="mt-2 flex flex-col gap-4 px-2">
            {walletConnected ? (
              <div className="t-card rounded-lg border t-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"/>
                    <span className="t-logo-text font-mono text-sm">{walletAddress.slice(0,6)+'...'+walletAddress.slice(-4)}</span>
                  </div>
                  <button onClick={disconnectWallet} className="text-[11px] text-red-400">{t.disconnect}</button>
                </div>
                {walletBalances && Object.entries(walletBalances).filter(([,b]) => b > 0).map(([sym, bal]) => (
                  <div key={sym} className="flex items-center justify-between py-2 text-sm">
                    <div className="flex items-center gap-2">
                      {TOKEN_LOGOS[sym] ? (
                        <img src={TOKEN_LOGOS[sym]} alt={sym} className="w-5 h-5 rounded-full object-cover"/>
                      ) : (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{background: TOKEN_COLORS[sym]||'#666'}}>{sym.charAt(0)}</div>
                      )}
                      <span className="t-text-muted">{sym}</span>
                    </div>
                    <span className="t-logo-text font-mono">{bal >= 1000 ? bal.toLocaleString(undefined,{maximumFractionDigits:2}) : bal.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <button onClick={() => { connectWallet(); setIsMobileMenuOpen(false); }} className="w-full py-3 text-white rounded font-bold flex items-center justify-center gap-2" style={{background:'var(--accent)'}}>
                <Wallet size={16}/> {t.signIn}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* === Search Section === */}
      <div className="t-bg py-8 px-4 border-b t-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[500px] pointer-events-none opacity-30" style={{background:'radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)'}}></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{background:`linear-gradient(to right, transparent, var(--accent), transparent)`, opacity:0.3}}></div>
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <h2 className="text-[18px] t-logo-text font-medium mb-3 tracking-tight">{t.heroTitle}</h2>
          <div className="flex w-full t-bg-panel border t-border rounded-lg overflow-hidden shadow-xl focus-within:ring-2" style={{'--tw-ring-color':'var(--accent)'}}>
            <div className="hidden sm:flex px-3 py-3 t-text-muted t-bg-input border-r t-border items-center gap-1.5 cursor-pointer t-bg-hover text-[12px] font-medium shrink-0">
              <Filter size={12}/> {filterTabs[searchFilter]} <ChevronDown size={11} className="opacity-70"/>
            </div>
            <input type="text" className="flex-1 bg-transparent px-4 py-3 t-text outline-none text-sm font-normal" style={{color:'var(--text)'}}
              placeholder={t.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              onPaste={handlePaste} />
            <button onClick={() => handleSearch()} disabled={searchLoading} className="text-white px-5 flex items-center justify-center cursor-pointer disabled:opacity-60" style={{background:'var(--accent)'}}>
              {searchLoading ? <RotateCw size={18} className="animate-spin"/> : <Search size={18}/>}
            </button>
          </div>
          <SearchFilterTabs active={searchFilter} onChange={setSearchFilter} tabs={filterTabs}/>
          <div className="mt-3 text-[12px] t-text-muted flex items-center gap-1">
            <span className="t-link font-medium">{t.sponsored}</span>
            <div className="flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded t-bg-hover cursor-pointer">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="font-bold t-logo-text">ShadowLink</span>
              <span className="t-text-dim">{t.sponsorDesc}</span>
              <ExternalLink size={10} className="t-text-faint"/>
            </div>
          </div>
        </div>
      </div>


      {/* === Address Detail View === */}
      {/* === Token Holders Page === */}
      {tokenDetail && !txDetail && !addressDetail && (
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <button onClick={() => { setTokenDetail(null); setSearchTerm(''); }} className="mb-4 flex items-center gap-2 t-text-muted text-sm cursor-pointer" style={{color:'var(--text-muted)'}}>
            <ArrowLeft size={16}/> {t.backToDashboard}
          </button>

          {tokenDetail.error ? (
            <div className="t-card rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold mb-2" style={{color:'var(--text)'}}>{t.queryFailed}</h3>
              <p className="text-sm" style={{color:'var(--text-muted)'}}>{tokenDetail.error}</p>
            </div>
          ) : (
            <>
              {/* 代币概览 */}
              <div className="t-card rounded-xl overflow-hidden mb-4">
                <div className="t-panel-head px-6 py-4 flex items-center gap-3" style={{borderBottom:'1px solid var(--border)'}}>
                  {TOKEN_LOGOS[tokenDetail.tokenSymbol] ? (
                    <img src={TOKEN_LOGOS[tokenDetail.tokenSymbol]} alt={tokenDetail.tokenSymbol} width={40} height={40} className="rounded-full"/>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{background: TOKEN_COLORS[tokenDetail.tokenSymbol] || '#888'}}>{(tokenDetail.tokenSymbol||'?').slice(0,2)}</div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold" style={{color:'var(--text)'}}>{tokenDetail.tokenName || 'Token'} ({tokenDetail.tokenSymbol})</h2>
                    <div className="text-xs font-mono" style={{color:'var(--text-muted)'}}>{tokenDetail.contract}</div>
                  </div>
                  <span className="ml-auto px-3 py-1 rounded-full text-xs font-semibold" style={{background:'rgba(34,197,94,0.15)', color:'#22c55e'}}>RX-20</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                  {[
                    [t.totalSupply, (tokenDetail.totalSupply||0).toLocaleString() + ' ' + (tokenDetail.tokenSymbol||'')],
                    [t.decimals, tokenDetail.tokenDecimals],
                    [t.holdersLabel, (tokenDetail.holdersCount||0).toLocaleString()],
                    [t.contractLabel, (tokenDetail.contract||'').slice(0,10)+'...'],
                  ].map(([label, value], i) => (
                    <div key={label} className="px-6 py-4" style={{borderBottom:'1px solid var(--border)', borderRight: i < 3 ? '1px solid var(--border)' : 'none'}}>
                      <div className="text-[10px] uppercase tracking-wider mb-1" style={{color:'var(--text-muted)'}}>{label}</div>
                      <div className="text-sm font-semibold" style={{color:'var(--text)'}}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holders 表格 */}
              <div className="t-card rounded-xl overflow-hidden mb-4">
                <div className="t-panel-head px-6 py-3 flex items-center gap-2" style={{borderBottom:'1px solid var(--border)'}}>
                  <Users size={16} className="text-cyan-400"/>
                  <span className="text-[13px] font-semibold" style={{color:'var(--text)'}}>
                    {t.topHolders.replace('{0}', tokenDetail.holdersCount||0)}
                  </span>
                </div>
                {tokenDetail.holders && tokenDetail.holders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead>
                        <tr style={{borderBottom:'1px solid var(--border)'}}>
                          {[t.rank,t.addressCol,t.quantity,t.percentage,t.valueLabel].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{color:'var(--text-muted)'}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tokenDetail.holders.map((h, idx) => (
                          <tr key={idx} className="hover:bg-cyan-500/5 transition-colors cursor-pointer" style={{borderBottom:'1px solid var(--border)'}}
                            onClick={() => { setTokenDetail(null); searchAddress(h.address); }}>
                            <td className="px-4 py-3 text-center font-semibold" style={{color:'var(--text-muted)'}}>{h.rank}</td>
                            <td className="px-4 py-3 font-mono text-xs text-cyan-400">
                              {h.address}
                              <CopyBtn text={h.address}/>
                            </td>
                            <td className="px-4 py-3 font-medium" style={{color:'var(--text)'}}>{(h.quantity||0).toLocaleString(undefined,{maximumFractionDigits:6})}</td>
                            <td className="px-4 py-3" style={{color:'var(--text-muted)'}}>
                              <span className="px-2 py-0.5 rounded text-xs" style={{background:'rgba(6,182,212,0.1)', color:'#06B6D4'}}>{(h.percentage||0).toFixed(4)}%</span>
                            </td>
                            <td className="px-4 py-3 font-medium" style={{color:'var(--text)'}}>${(h.value||0).toLocaleString(undefined,{maximumFractionDigits:2})}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center" style={{color:'var(--text-muted)'}}>
                    <Users size={48} className="mx-auto mb-3 opacity-30"/>
                    <p className="text-sm">{t.noHolders}</p>
                    <p className="text-xs mt-1">{t.noHoldersHint}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

            {addressDetail && !txDetail && (
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <button onClick={() => { setAddressDetail(null); setSearchTerm(''); }} className="mb-4 flex items-center gap-2 t-text-muted text-sm cursor-pointer" style={{color:'var(--text-muted)'}}>
            <ArrowLeft size={16}/> {t.backToDashboard}
          </button>

          {addressDetail.error ? (
            <div className="t-card rounded-xl p-8 text-center">
              <AlertTriangle size={48} className="mx-auto mb-3 text-yellow-400"/>
              <h3 className="text-xl font-semibold mb-2" style={{color:'var(--text)'}}>{t.addressQueryFailed}</h3>
              <p className="text-sm" style={{color:'var(--text-muted)'}}>{addressDetail.error}</p>
            </div>
          ) : (
            <>
              {/* 地址概览卡片 */}
              <div className="t-card rounded-xl overflow-hidden mb-4">
                <div className="t-panel-head px-6 py-4 flex items-center gap-3" style={{borderBottom:'1px solid var(--border)'}}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {addressDetail.isVault ? 'V' : addressDetail.isContract ? 'C' : 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-semibold" style={{color:'var(--text)'}}>
                        {addressDetail.isVault ? t.bridgeDexVault : addressDetail.isContract ? t.contractLabel : t.addressLabel}
                      </h2>
                      {addressDetail.isVault && <span className="px-2 py-0.5 rounded text-[10px] text-purple-400" style={{background:'rgba(168,85,247,0.15)'}}>Vault</span>}
                      {addressDetail.isContract && <span className="px-2 py-0.5 rounded text-[10px] text-green-400" style={{background:'rgba(34,197,94,0.15)'}}>Verified</span>}
                    </div>
                    <div className="text-xs font-mono text-cyan-400 mt-1 break-all">{addressDetail.hexAddress}</div>
                  </div>
                </div>

                {/* 概览信息 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
                  {[
                    [t.rxBalance, (addressDetail.balances?.RX ?? 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:6}) + ' RX'],
                    [t.usdValue, '$' + (Object.entries(addressDetail.balances || {}).reduce((sum, [k, v]) => sum + (v || 0) * (k === 'RX' ? 2.45 : (TOKEN_USD_PRICES[k] || 0)), 0)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})],
                    [t.nonceLabel, addressDetail.accountInfo?.nonce ?? addressDetail.accountInfo?.Nonce ?? '0'],
                    [t.tokensCount, Object.entries(addressDetail.balances || {}).filter(([k,v]) => k !== 'RX' && v > 0).length + ' types'],
                    [t.transactionsLabel, (addressDetail.totalTxs || 0).toLocaleString()],
                    [t.firstSeen, addressDetail.firstSeen ? new Date(typeof addressDetail.firstSeen === 'number' && addressDetail.firstSeen > 1e12 ? addressDetail.firstSeen : addressDetail.firstSeen * 1000).toLocaleDateString() : 'N/A'],
                  ].map(([label, value], i) => (
                    <div key={label} className="px-6 py-4" style={{borderBottom:'1px solid var(--border)', borderRight: i < 5 ? '1px solid var(--border)' : 'none'}}>
                      <div className="text-[10px] uppercase tracking-wider mb-1" style={{color:'var(--text-muted)'}}>{label}</div>
                      <div className="text-sm font-semibold" style={{color:'var(--text)'}}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 代币持有列表 */}
              <div className="t-card rounded-xl overflow-hidden mb-4">
                <div className="t-panel-head px-6 py-3 flex items-center justify-between cursor-pointer select-none"
                  style={{borderBottom:'1px solid var(--border)'}}
                  onClick={() => setAddressDetail(prev => ({...prev, tokensExpanded: !prev.tokensExpanded}))}>
                  <div className="flex items-center gap-2">
                    <Coins size={16} className="text-cyan-400"/>
                    <span className="text-[13px] font-semibold" style={{color:'var(--text)'}}>{t.tokenHoldings}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{background:'rgba(6,182,212,0.1)', color:'#06B6D4'}}>
                      {Object.entries(addressDetail.balances || {}).filter(([,v]) => v > 0).length} tokens
                    </span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${addressDetail.tokensExpanded ? 'rotate-180' : ''}`} style={{color:'var(--text-muted)'}}/>
                </div>
                {addressDetail.tokensExpanded && <div className="divide-y" style={{borderColor:'var(--border)'}}>
                  {/* RX原生代币 */}
                  <div className="flex items-center px-6 py-3 hover:bg-cyan-500/5 transition-colors">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{background:'rgba(6,182,212,0.15)', border:'1.5px solid rgba(6,182,212,0.3)'}}>
                      <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
                        <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="rgba(6,182,212,0.15)" stroke="#06B6D4" strokeWidth="1.5"/>
                        <circle cx="15" cy="19" r="3.5" fill="#06B6D4"/><circle cx="25" cy="19" r="3.5" fill="#06B6D4"/>
                        <rect x="13" y="26" width="14" height="1.5" rx="0.75" fill="#06B6D4" opacity="0.5"/>
                        <circle cx="20" cy="9" r="2" fill="#06B6D4"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{color:'var(--text)'}}>RX <span className="text-[10px] ml-1" style={{color:'var(--text-muted)'}}>{t.nativeToken}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold" style={{color:'var(--text)'}}>{(addressDetail.balances?.RX ?? 0).toLocaleString(undefined, {maximumFractionDigits:6})}</div>
                      <div className="text-[10px]" style={{color:'var(--text-muted)'}}>$ {((addressDetail.balances?.RX ?? 0) * 2.45).toFixed(2)}</div>
                    </div>
                  </div>
                  {/* ERC-20代币 */}
                  {Object.entries(addressDetail.balances || {}).filter(([k]) => k !== 'RX').map(([sym, bal]) => {
                    const color = TOKEN_COLORS[sym] || '#888';
                    const contract = Object.entries(VERIFIED_CONTRACTS).find(([,v]) => v.symbol === sym);
                    return (
                      <div key={sym} className="flex items-center px-6 py-3 hover:bg-cyan-500/5 transition-colors">
                        <>
                        {TOKEN_LOGOS[sym] ? (
                          <img src={TOKEN_LOGOS[sym]} alt={sym} width={32} height={32}
                            className="mr-3 rounded-full" style={{objectFit:'cover', flexShrink:0}}
                            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                        ) : null}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3"
                          style={{background: color, color:'#fff', display: TOKEN_LOGOS[sym] ? 'none' : 'flex'}}>{sym.slice(0,2)}</div>
                      </>
                        <div className="flex-1">
                          <div className="text-sm font-medium" style={{color:'var(--text)'}}>{sym}
                            {contract && <span className="text-[10px] ml-1" style={{color:'var(--text-muted)'}}>{contract[1].name}</span>}
                          </div>
                          {contract && <div className="flex items-center gap-1 text-[10px] font-mono" style={{color:'var(--text-muted)'}}>{contract[0].slice(0,10)}...{contract[0].slice(-6)} <CopyBtn text={contract[0]}/></div>}
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-semibold ${bal > 0 ? '' : ''}`} style={{color: bal > 0 ? 'var(--text)' : 'var(--text-muted)'}}>{bal > 0 ? bal.toLocaleString(undefined, {maximumFractionDigits:8}) : '0'}</div>
                          {bal > 0 && TOKEN_USD_PRICES[sym] && <div className="text-[10px]" style={{color:'var(--text-muted)'}}>$ {(bal * TOKEN_USD_PRICES[sym]).toLocaleString(undefined,{maximumFractionDigits:2})}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>}
              </div>

              {/* 交易历史表格 */}
              {addressDetail.transactions && addressDetail.transactions.length > 0 && (
                <div className="t-card rounded-xl overflow-hidden mb-4">
                  <div className="t-panel-head px-6 py-3 flex items-center justify-between cursor-pointer select-none"
                    style={{borderBottom:'1px solid var(--border)'}}
                    onClick={() => setAddressDetail(prev => ({...prev, txsExpanded: !prev.txsExpanded}))}>
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-cyan-400"/>
                      <span className="text-[13px] font-semibold" style={{color:'var(--text)'}}>{t.transactionsLabel}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full" style={{background:'rgba(6,182,212,0.1)', color:'#06B6D4'}}>
                        {(addressDetail.totalTxs||0).toLocaleString()} txns
                      </span>
                    </div>
                    <ChevronDown size={16} className={'transition-transform ' + (addressDetail.txsExpanded !== false ? 'rotate-180' : '')} style={{color:'var(--text-muted)'}}/>
                  </div>
                  <div className="overflow-x-auto" style={{display: addressDetail.txsExpanded !== false ? "block" : "none"}}>
                    <table className="w-full text-sm min-w-[700px]">
                      <thead>
                        <tr style={{borderBottom:'1px solid var(--border)'}}>
                          {[t.thTxHash,t.typeLabel,t.blockLabel,t.thAge,t.fromLabel,t.toLabel,t.valueLabel].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{color:'var(--text-muted)'}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {addressDetail.transactions.map((atx, idx) => {
                          const dirColors = { in: '#22c55e', out: '#ef4444', self: '#94a3b8', vault: '#a855f7', stake: '#8b5cf6', contract: '#f59e0b' };
                          const dirLabel = (atx.direction||'').toUpperCase() || (atx.type==='stake'?'STAKE':atx.type==='contract'?'CALL':'TX');
                          const dirColor = dirColors[atx.direction] || dirColors[atx.type] || '#94a3b8';
                          const now = Date.now();
                          const ts = atx.timestamp > 1e12 ? atx.timestamp : atx.timestamp * 1000;
                          const ago = now - ts;
                          const ageStr = ago < 60000 ? Math.floor(ago/1000)+'s ago' : ago < 3600000 ? Math.floor(ago/60000)+'m ago' : ago < 86400000 ? Math.floor(ago/3600000)+'h ago' : Math.floor(ago/86400000)+'d ago';
                          const fromShort = (atx.from||'').length > 20 ? (atx.from||'').slice(0,10)+'...'+atx.from.slice(-6) : atx.from;
                          const toShort = (atx.to||'').length > 20 ? (atx.to||'').slice(0,10)+'...'+atx.to.slice(-6) : atx.to;
                          const addrLower = (addressDetail.hexAddress||'').toLowerCase();
                          const isFromMe = (atx.from||'').toLowerCase().includes(addrLower.replace('0x',''));
                          const isToMe = (atx.to||'').toLowerCase().includes(addrLower.replace('0x',''));
                          const value = typeof atx.value === 'number' ? (atx.value / 1e6).toLocaleString(undefined,{maximumFractionDigits:4}) + ' RX' : '0 RX';
                          return (
                            <tr key={atx.hash+idx} className="hover:bg-cyan-500/5 transition-colors cursor-pointer" style={{borderBottom:'1px solid var(--border)'}}
                              onClick={() => { setAddressDetail(null); searchTransaction(atx.hash); }}>
                              <td className="px-4 py-3 font-mono text-xs text-cyan-400">{(atx.hash||'').slice(0,16)}...</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{background: dirColor+'20', color: dirColor, border:'1px solid '+dirColor+'30'}}>{dirLabel}</span>
                              </td>
                              <td className="px-4 py-3 text-xs" style={{color:'var(--text-muted)'}}>{atx.blockNumber}</td>
                              <td className="px-4 py-3 text-xs" style={{color:'var(--text-muted)'}}>{ageStr}</td>
                              <td className="px-4 py-3 font-mono text-xs" style={{color: isFromMe ? 'var(--text)' : 'var(--text-muted)', fontWeight: isFromMe ? 600 : 400}}>{fromShort}</td>
                              <td className="px-4 py-3 font-mono text-xs" style={{color: isToMe ? 'var(--text)' : 'var(--text-muted)', fontWeight: isToMe ? 600 : 400}}>{toShort}</td>
                              <td className="px-4 py-3 text-xs font-medium" style={{color:'var(--text)'}}>{value}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                  {/* 分页 */}
                  {(addressDetail.totalTxs||0) > 25 && (
                    <div className="px-6 py-3 flex items-center justify-between" style={{borderTop:'1px solid var(--border)'}}>
                      <button
                        disabled={!addressDetail.txPage}
                        onClick={async () => {
                          const newPage = (addressDetail.txPage||0) - 1;
                          try {
                            const r = await rpcCall('robotx_getTransactionsByAddress', [{address: addressDetail.hexAddress, page: newPage, limit: 25}]);
                            setAddressDetail(prev => ({...prev, transactions: r.transactions||[], txPage: newPage}));
                          } catch(e){}
                        }}
                        className="px-3 py-1.5 rounded text-xs font-medium disabled:opacity-30 transition-colors"
                        style={{color:'var(--text)', background:'var(--bg-panel,rgba(255,255,255,0.05))', border:'1px solid var(--border)', cursor: addressDetail.txPage ? 'pointer' : 'not-allowed'}}>
                        {t.previousPage}
                      </button>
                      <span className="text-xs" style={{color:'var(--text-muted)'}}>
                        {t.pageOf.replace('{0}', (addressDetail.txPage||0)+1).replace('{1}', Math.ceil((addressDetail.totalTxs||1)/25))}
                      </span>
                      <button
                        disabled={(addressDetail.txPage||0)+1 >= Math.ceil((addressDetail.totalTxs||1)/25)}
                        onClick={async () => {
                          const newPage = (addressDetail.txPage||0) + 1;
                          try {
                            const r = await rpcCall('robotx_getTransactionsByAddress', [{address: addressDetail.hexAddress, page: newPage, limit: 25}]);
                            setAddressDetail(prev => ({...prev, transactions: r.transactions||[], txPage: newPage}));
                          } catch(e){}
                        }}
                        className="px-3 py-1.5 rounded text-xs font-medium disabled:opacity-30 transition-colors"
                        style={{color:'var(--text)', background:'var(--bg-panel,rgba(255,255,255,0.05))', border:'1px solid var(--border)', cursor: (addressDetail.txPage||0)+1 < Math.ceil((addressDetail.totalTxs||1)/25) ? 'pointer' : 'not-allowed'}}>
                        {t.nextPage}
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* === Verified Contracts Panel === */}
      {/* === Transaction Detail View === */}
      {txDetail && !addressDetail && (
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <button onClick={() => { setTxDetail(null); setAddressDetail(null); setSearchTerm(''); }} className="mb-4 flex items-center gap-2 t-text-muted text-sm cursor-pointer" style={{color:'var(--text-muted)'}}>
            <ArrowLeft size={16}/> {t.backToDashboard}
          </button>
          {txDetail.invalidInput ? (
            <div className="t-card rounded-xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-yellow-400"/>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{color:'var(--text)'}}>{t.invalidSearch}</h3>
              <p className="text-sm mb-2" style={{color:'var(--text-muted)'}}>{t.invalidSearchHint}</p>
              <p className="text-xs font-mono text-cyan-400/60">{t.invalidSearchExample}</p>
            </div>
          ) : txDetail.notFound ? (
            <div className="t-bg-panel border t-border rounded-xl p-8 text-center" style={{background:'var(--bg-panel)', borderColor:'var(--border)'}}>
              <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-400"/>
              <h3 className="text-xl font-semibold mb-2" style={{color:'var(--text)'}}>{txDetail.isNetErr ? t.networkError : t.txNotFound}</h3>
              <p className="text-sm" style={{color:'var(--text-muted)'}}>Hash: <span className="font-mono text-cyan-400">{txDetail.hash}</span></p>
              {txDetail.isNetErr ? <p className="text-xs mt-2 text-yellow-400">{t.rpcFailed}</p> : <p className="text-xs mt-2" style={{color:'var(--text-muted)'}}>{t.txNotExist}</p>}
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{background:'var(--bg-panel)', border:'1px solid var(--border)'}}>
              <div className="px-6 py-4 flex items-center gap-3" style={{borderBottom:'1px solid var(--border)'}}>
                <FileText size={20} className="text-cyan-400"/>
                <h3 className="text-lg font-semibold" style={{color:'var(--text)'}}>{t.txDetails}</h3>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${txDetail.status === 'Success' ? 'bg-green-500/15 text-green-400' : txDetail.status === 'Failed' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                  {txDetail.status}
                </span>
              </div>
              <div>
                {/* 代币转账摘要卡片 */}
                {txDetail.decoded && (
                  <div className="mx-6 my-4 p-4 rounded-xl" style={{background:'rgba(6,182,212,0.08)', border:'1px solid rgba(6,182,212,0.2)'}}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{background:'rgba(6,182,212,0.15)', color:'#06b6d4'}}>
                        {txDetail.decoded.token.charAt(0)}
                      </div>
                      <div>
                        <div className="text-lg font-bold" style={{color:'var(--text)'}}>{txDetail.decoded.amount} {txDetail.decoded.token}</div>
                        <div className="text-xs" style={{color:'var(--text-muted)'}}>
                          {txDetail.txType && txDetail.txType !== '转账' && txDetail.txType !== '合约调用'
                            ? txDetail.txType + ' — ' + (txDetail.decoded.method === 'transfer' ? t.tokenTransferLabel : txDetail.decoded.method === 'approve' ? t.tokenApproval : t.tokenTransferFrom)
                            : (txDetail.decoded.method === 'transfer' ? t.tokenTransferLabel : txDetail.decoded.method === 'approve' ? t.tokenApproval : t.tokenTransferFrom)}
                        </div>
                      </div>
                    </div>
                    {txDetail.decoded && (
                      <div className="text-xs font-mono" style={{color:'var(--text-muted)'}}>
                        Contract: <span className="text-cyan-400">{txDetail.toContractLabel || txDetail.decoded.token} ({txDetail.to})</span>
                        {txDetail.to?.toLowerCase() === VAULT_ADDRESS ? <span className="ml-2 px-2 py-0.5 rounded text-purple-400 text-[10px]" style={{background:'rgba(168,85,247,0.15)'}}>{txDetail.swapInfo ? "Swap" : "Bridge/DEX"} Vault</span> : null}
                        {txDetail.decoded.recipient?.toLowerCase() === VAULT_ADDRESS ? <span className="ml-2 px-2 py-0.5 rounded text-purple-400 text-[10px]" style={{background:'rgba(168,85,247,0.15)'}}>{txDetail.swapInfo ? "→ Swap Vault" : "→ Bridge Vault"}</span> : null}
                      </div>
                    )}
                  </div>
                )}
                {/* RX原生转账摘要 */}
                {!txDetail.decoded && parseFloat(txDetail.value) > 0 && (
                  <div className="mx-6 my-4 p-4 rounded-xl" style={{background:'rgba(6,182,212,0.08)', border:'1px solid rgba(6,182,212,0.2)'}}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{background:'rgba(6,182,212,0.15)', color:'#06b6d4'}}>R</div>
                      <div>
                        <div className="text-lg font-bold" style={{color:'var(--text)'}}>{txDetail.value} RX</div>
                        <div className="text-xs" style={{color:'var(--text-muted)'}}>{
                          txTypeDisplay(txDetail.txType) || t.nativeRxTransfer
                        }</div>
                      </div>
                    </div>
                    {txDetail.isVaultTx && <div className="mt-2 text-xs px-2 py-1 rounded inline-block text-purple-400" style={{background:'rgba(168,85,247,0.15)'}}>{t.sentToVault} {txDetail.swapInfo ? "Swap" : "Bridge/DEX"} Vault</div>}
                  </div>
                )}
                {/* 闪兑详情卡片 */}
                {txDetail.swapInfo && txDetail.swapInfo.buyTxHash && (
                  <div className="mx-6 my-4 p-4 rounded-xl" style={{background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.25)'}}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background:'rgba(168,85,247,0.2)', color:'#a855f7'}}>S</div>
                      <div className="text-sm font-semibold" style={{color:'#a855f7'}}>{t.swapDetail}</div>
                    </div>
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <div className="px-4 py-3 rounded-xl flex items-center gap-3" style={{background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)'}}>
                        <div className="w-9 h-9 rounded-full shrink-0 relative overflow-hidden" style={{background:'rgba(239,68,68,0.15)'}}>
                          {TOKEN_LOGOS[txDetail.swapInfo.sellToken] ? <img src={TOKEN_LOGOS[txDetail.swapInfo.sellToken]} className="w-full h-full object-cover rounded-full" onError={(e)=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} /> : null}
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{color:'#ef4444',display:TOKEN_LOGOS[txDetail.swapInfo.sellToken]?'none':'flex'}}>{txDetail.swapInfo.sellToken.charAt(0)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] mb-0.5" style={{color:'var(--text-muted)'}}>{t.sell}</div>
                          <div className="text-base font-bold" style={{color:'#ef4444'}}>{txDetail.swapInfo.amountIn} <span className="text-xs opacity-70">{txDetail.swapInfo.sellToken}</span></div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div style={{color:'var(--text-muted)', fontSize:'22px', lineHeight:'1'}}>⇒</div>
                      </div>
                      <div className="px-4 py-3 rounded-xl flex items-center gap-3" style={{background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)'}}>
                        <div className="w-9 h-9 rounded-full shrink-0 relative overflow-hidden" style={{background:'rgba(34,197,94,0.15)'}}>
                          {TOKEN_LOGOS[txDetail.swapInfo.buyToken] ? <img src={TOKEN_LOGOS[txDetail.swapInfo.buyToken]} className="w-full h-full object-cover rounded-full" onError={(e)=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} /> : null}
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{color:'#22c55e',display:TOKEN_LOGOS[txDetail.swapInfo.buyToken]?'none':'flex'}}>{txDetail.swapInfo.buyToken.charAt(0)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] mb-0.5" style={{color:'var(--text-muted)'}}>{t.buy}</div>
                          <div className="text-base font-bold" style={{color:'#22c55e'}}>{txDetail.swapInfo.amountOut} <span className="text-xs opacity-70">{txDetail.swapInfo.buyToken}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs font-mono">
                      {txDetail.hash?.toLowerCase() !== ('0x' + txDetail.swapInfo.sellTxHash).toLowerCase() && (
                        <div style={{color:'var(--text-muted)'}}>{t.sellTx}: <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => searchTransaction('0x' + txDetail.swapInfo.sellTxHash)}>0x{txDetail.swapInfo.sellTxHash.slice(0,16)}...</span></div>
                      )}
                      {txDetail.hash?.toLowerCase() !== ('0x' + txDetail.swapInfo.buyTxHash).toLowerCase() && (
                        <div style={{color:'var(--text-muted)'}}>{t.buyTx}: <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => searchTransaction('0x' + txDetail.swapInfo.buyTxHash)}>0x{txDetail.swapInfo.buyTxHash.slice(0,16)}...</span></div>
                      )}
                      <div style={{color:'var(--text-muted)'}}>{t.initiator}: <span className="text-cyan-400">{txDetail.swapInfo.seller}</span></div>
                      <div style={{color:'var(--text-muted)'}}>Vault: <span className="text-purple-400">0xed8D698d18575d9f732556516A8721ABC8A87171</span></div>
                      {txDetail.swapInfo.timestamp > 0 && (
                        <div style={{color:'var(--text-muted)'}}>{t.timeLabel}: <span className="text-purple-300">{new Date(txDetail.swapInfo.timestamp * 1000).toLocaleString()}</span></div>
                      )}
                    </div>
                  </div>
                )}
                {/* 质押详情卡片 */}
                {(txDetail.stakingInfo || txDetail.robotxType === 4) && (() => {
                  const si = txDetail.stakingInfo;
                  const isLP = si?.token?.includes('-');
                  const t1 = si?.token?.split('-')[0] || 'RX';
                  const t2 = isLP ? si.token.split('-')[1] : '';
                  const prices = {RX:2.45,USDT:1,USDC:1,ETH:1984.88,BNB:627.46,DAI:1,POL:0.097};
                  const amt1 = parseFloat(si?.amount) || parseFloat(txDetail.value) || 0;
                  const amt2 = isLP ? (amt1 * (prices[t1]||1) / (prices[t2]||1)) : 0;
                  return (
                  <div className="mx-6 my-4 rounded-2xl overflow-hidden" style={{border:'1px solid rgba(16,185,129,0.3)'}}>
                    <div className="px-5 py-3 flex items-center justify-between" style={{background:'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1))'}}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{background:'rgba(16,185,129,0.25)'}}><span style={{color:'#10b981', fontSize:'14px'}}>⚡</span></div>
                        <span className="text-sm font-bold" style={{color:'#10b981'}}>Staking</span>
                      </div>
                      {isLP && <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{background:'rgba(6,182,212,0.2)', color:'#06b6d4'}}>LP Pool #{si?.poolId}</span>}
                    </div>
                    <div className="p-5" style={{background:'rgba(16,185,129,0.04)'}}>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="flex-1 p-3 rounded-xl text-center" style={{background:'rgba(6,182,212,0.08)', border:'1px solid rgba(6,182,212,0.2)'}}>
                          <div className="w-10 h-10 mx-auto mb-2 rounded-full relative overflow-hidden" style={{background:'rgba(6,182,212,0.15)'}}>
                            {TOKEN_LOGOS[t1] ? <img src={TOKEN_LOGOS[t1]} className="w-full h-full object-cover rounded-full" onError={(e)=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} /> : null}
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{color:'#06b6d4',display:TOKEN_LOGOS[t1]?'none':'flex'}}>{t1.charAt(0)}</div>
                          </div>
                          <div className="text-lg font-bold" style={{color:'#06b6d4'}}>{amt1.toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                          <div className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>{t1}</div>
                        </div>
                        {isLP && (
                          <>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'rgba(16,185,129,0.2)', border:'1px solid rgba(16,185,129,0.3)'}}>
                                <span className="text-xs font-bold" style={{color:'#10b981'}}>+</span>
                              </div>
                            </div>
                            <div className="flex-1 p-3 rounded-xl text-center" style={{background:'rgba(250,204,21,0.06)', border:'1px solid rgba(250,204,21,0.2)'}}>
                              <div className="w-10 h-10 mx-auto mb-2 rounded-full relative overflow-hidden" style={{background:'rgba(250,204,21,0.15)'}}>
                                {TOKEN_LOGOS[t2] ? <img src={TOKEN_LOGOS[t2]} className="w-full h-full object-cover rounded-full" onError={(e)=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} /> : null}
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{color:'#facc15',display:TOKEN_LOGOS[t2]?'none':'flex'}}>{t2.charAt(0)}</div>
                              </div>
                              <div className="text-lg font-bold" style={{color:'#facc15'}}>{amt2.toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                              <div className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>{t2}</div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="text-center mb-4">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold" style={{background:'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)'}}>
                          ${isLP ? (amt1 * (prices[t1]||1) + amt2 * (prices[t2]||1)).toLocaleString(undefined, {maximumFractionDigits:2}) : (amt1 * (prices[t1]||1)).toLocaleString(undefined, {maximumFractionDigits:2})} USD Total
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        {si?.poolId && <div className="flex justify-between py-1.5 px-2 rounded-lg" style={{background:'rgba(255,255,255,0.03)'}}><span style={{color:'var(--text-muted)'}}>{t.stakingPool}</span><span className="font-mono font-medium" style={{color:'#10b981'}}>#{si.poolId} {si.token} LP</span></div>}
                        {(si?.user || txDetail.from) && <div className="flex justify-between py-1.5 px-2 rounded-lg" style={{background:'rgba(255,255,255,0.03)'}}><span style={{color:'var(--text-muted)'}}>{t.staker}</span><span className="font-mono cursor-pointer hover:underline" style={{color:'#06b6d4'}} onClick={() => searchAddress(si?.user || txDetail.from)}>{(si?.user || txDetail.from).slice(0,12)}...{(si?.user || txDetail.from).slice(-6)}</span></div>}
                        <div className="flex justify-between py-1.5 px-2 rounded-lg" style={{background:'rgba(255,255,255,0.03)'}}><span style={{color:'var(--text-muted)'}}>Vault</span><span className="font-mono text-[10px]" style={{color:'#a78bfa'}}>0xed8D...7171</span></div>
                        {si?.timestamp > 0 && <div className="flex justify-between py-1.5 px-2 rounded-lg" style={{background:'rgba(255,255,255,0.03)'}}><span style={{color:'var(--text-muted)'}}>时间</span><span style={{color:'#10b981'}}>{new Date(si.timestamp * 1000).toLocaleString()}</span></div>}
                      </div>
                    </div>
                  </div>
                  );
                })()}
                {/* 跨链桥详情卡片 */}
                {txDetail.bridgeInfo && (txDetail.bridgeInfo.robotxTxHash || txDetail.bridgeInfo.sourceChain) && (
                  <div className="mx-6 my-4 p-4 rounded-xl" style={{background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.25)'}}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background:'rgba(59,130,246,0.2)', color:'#3b82f6'}}>B</div>
                      <div className="text-sm font-semibold" style={{color:'#3b82f6'}}>{t.bridgeDetail}</div>
                    </div>
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <div className="px-4 py-3 rounded-xl flex items-center gap-3" style={{background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)'}}>
                        <div className="w-9 h-9 rounded-full shrink-0 relative overflow-hidden" style={{background:'rgba(59,130,246,0.15)'}}>
                          {TOKEN_LOGOS[txDetail.bridgeInfo.token] ? <img src={TOKEN_LOGOS[txDetail.bridgeInfo.token]} className="w-full h-full object-cover rounded-full" onError={(e)=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} /> : null}
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{color:'#3b82f6',display:TOKEN_LOGOS[txDetail.bridgeInfo.token]?'none':'flex'}}>{txDetail.bridgeInfo.token.charAt(0)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] mb-0.5" style={{color:'var(--text-muted)'}}>{t.tokenLabel}</div>
                          <div className="text-base font-bold" style={{color:'#3b82f6'}}>{txDetail.bridgeInfo.amount} <span className="text-xs opacity-70">{txDetail.bridgeInfo.token}</span></div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div style={{color:'var(--text-muted)', fontSize:'22px', lineHeight:'1'}}>⇒</div>
                      </div>
                      <div className="px-4 py-3 rounded-xl flex items-center gap-3" style={{background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)'}}>
                        <div className="w-9 h-9 rounded-full shrink-0 relative overflow-hidden" style={{background:'rgba(34,197,94,0.15)'}}>
                          <img src="https://robotxhub.ai/assets/images/logo.png" className="w-full h-full object-cover rounded-full" onError={(e)=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} />
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{color:'#22c55e',display:'none'}}>RX</div>
                        </div>
                        <div>
                          <div className="text-[10px] mb-0.5" style={{color:'var(--text-muted)'}}>{t.destination}</div>
                          <div className="text-base font-bold" style={{color:'#22c55e'}}>ROBOTX Chain</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs font-mono">
                      {txDetail.bridgeInfo.sourceChain && (
                        <div style={{color:'var(--text-muted)'}}>{t.sourceChain}: <span className="text-blue-400">{txDetail.bridgeInfo.sourceChain.toUpperCase()}</span></div>
                      )}
                      {txDetail.bridgeInfo.sourceTxHash && (
                        <div style={{color:'var(--text-muted)'}}>{t.sourceTx}: <span className="text-cyan-400">0x{txDetail.bridgeInfo.sourceTxHash.slice(0,16)}...</span></div>
                      )}
                      {txDetail.bridgeInfo.robotxTxHash && txDetail.hash?.replace('0x','').toLowerCase() !== txDetail.bridgeInfo.robotxTxHash.toLowerCase() && (
                        <div style={{color:'var(--text-muted)'}}>{t.robotxTx}: <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => searchTransaction('0x' + txDetail.bridgeInfo.robotxTxHash)}>0x{txDetail.bridgeInfo.robotxTxHash.slice(0,16)}...</span></div>
                      )}
                      {txDetail.bridgeInfo.sender && (
                        <div style={{color:'var(--text-muted)'}}>{t.sender}: <span className="text-cyan-400">{txDetail.bridgeInfo.sender}</span></div>
                      )}
                      {txDetail.bridgeInfo.destAddress && (
                        <div style={{color:'var(--text-muted)'}}>{t.receiver}: <span className="text-cyan-400">{txDetail.bridgeInfo.destAddress}</span></div>
                      )}
                      <div style={{color:'var(--text-muted)'}}>Vault: <span className="text-blue-400">0xed8D698d18575d9f732556516A8721ABC8A87171</span></div>
                    </div>
                  </div>
                )}
                {/* 基本信息 */}
                <div className="mt-2 px-6 pt-3 pb-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider" style={{color:'var(--text-muted)', opacity:0.6}}>{t.basicInfo}</div>
                </div>
                <div className="flex px-6 py-2.5 items-start" style={{borderBottom:'1px solid var(--border)'}}>
                  <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>{t.txHash}</span>
                  <span className="text-xs break-all font-mono text-cyan-400 flex items-center gap-2">{txDetail.hash}
                    <span className="cursor-pointer opacity-50 hover:opacity-100 text-[10px]" onClick={() => { navigator.clipboard?.writeText(txDetail.hash); }}>📋</span>
                  </span>
                </div>
                <div className="flex px-6 py-2.5 items-center" style={{borderBottom:'1px solid var(--border)'}}>
                  <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>Status</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${txDetail.status === 'Success' ? 'bg-green-500/15 text-green-400' : txDetail.status === 'Failed' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>{txDetail.status}</span>
                </div>
                <div className="flex px-6 py-2.5 items-center" style={{borderBottom:'1px solid var(--border)'}}>
                  <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>Block</span>
                  <span className="text-xs font-medium" style={{color:'var(--text)'}}>{txDetail.blockNumber}</span>
                </div>
                <div className="flex px-6 py-2.5 items-center" style={{borderBottom:'1px solid var(--border)'}}>
                  <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>Type</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    txDetail.txType === 'Swap兑换' ? 'bg-purple-500/15 text-purple-400' :
                    txDetail.txType === '质押' ? 'bg-emerald-500/15 text-emerald-400' :
                    txDetail.txType === '跨链转入' || txDetail.txType === '跨链转出' ? 'bg-blue-500/15 text-blue-400' :
                    txDetail.txType === 'Vault释放' || txDetail.txType === 'Vault存入' ? 'bg-purple-500/15 text-purple-400' :
                    'bg-cyan-500/10 text-cyan-400'
                  }`}>{txTypeDisplay(txDetail.txType)}</span>
                </div>
                {/* 地址信息 */}
                <div className="px-6 pt-4 pb-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider" style={{color:'var(--text-muted)', opacity:0.6}}>{t.addresses}</div>
                </div>
                <div className="flex px-6 py-2.5 items-start" style={{borderBottom:'1px solid var(--border)'}}>
                  <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>From</span>
                  <div className="text-xs break-all font-mono">
                    <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => txDetail.from && searchAddress(txDetail.from)}>{txDetail.from}</span>
                    {txDetail.from?.toLowerCase() === VAULT_ADDRESS && <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] text-purple-400" style={{background:'rgba(168,85,247,0.12)'}}>Vault</span>}
                  </div>
                </div>
                <div className="flex px-6 py-2.5 items-start" style={{borderBottom:'1px solid var(--border)'}}>
                  <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>To</span>
                  <div className="text-xs break-all font-mono">
                    <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => txDetail.to && searchAddress(txDetail.to)}>{txDetail.to || t.contractCreation}</span>
                    {txDetail.to?.toLowerCase() === VAULT_ADDRESS && <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] text-purple-400" style={{background:'rgba(168,85,247,0.12)'}}>Vault</span>}
                    {txDetail.toContractLabel && <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] text-cyan-400" style={{background:'rgba(6,182,212,0.12)'}}>{txDetail.toContractLabel}</span>}
                  </div>
                </div>
                {/* 金额与方法 */}
                <div className="px-6 pt-4 pb-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider" style={{color:'var(--text-muted)', opacity:0.6}}>{t.valueAndMethod}</div>
                </div>
                <div className="flex px-6 py-2.5 items-center" style={{borderBottom:'1px solid var(--border)'}}>
                  <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>Value</span>
                  <span className="text-xs font-bold" style={{color:'var(--text)'}}>{txDetail.value} RX</span>
                </div>
                {txDetail.decoded && (
                  <div className="flex px-6 py-2.5 items-center" style={{borderBottom:'1px solid var(--border)'}}>
                    <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>{t.tokenTransferLabel}</span>
                    <span className="text-xs font-bold" style={{color:'var(--text)'}}>{txDetail.decoded.amount} {txDetail.decoded.token}</span>
                  </div>
                )}
                <div className="flex px-6 py-2.5 items-center" style={{borderBottom:'1px solid var(--border)'}}>
                  <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>Method</span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono" style={{background:'var(--bg-panel)', color:'var(--text)'}}>{txDetail.decoded ? txDetail.decoded.method + '()' : (txDetail.robotxType === 4 ? 'Stake' : txDetail.robotxType === 1 ? 'Vote' : txDetail.robotxType === 6 ? 'Deploy' : txDetail.input === '0x' ? t.nativeTransfer : t.contractCall)}</span>
                </div>
                {/* 技术信息 */}
                <div className="px-6 pt-4 pb-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider" style={{color:'var(--text-muted)', opacity:0.6}}>{t.technical}</div>
                </div>
                <div className="flex px-6 py-2.5 items-center" style={{borderBottom:'1px solid var(--border)'}}>
                  <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>{t.gasUsed}</span>
                  <span className="text-xs" style={{color:'var(--text)'}}>{txDetail.gasUsed}</span>
                </div>
                <div className="flex px-6 py-2.5 items-center" style={{borderBottom:'1px solid var(--border)'}}>
                  <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>Nonce</span>
                  <span className="text-xs" style={{color:'var(--text)'}}>{txDetail.nonce}</span>
                </div>
                {txDetail.input && txDetail.input !== '0x' && (
                  <div className="flex px-6 py-2.5 items-start" style={{borderBottom:'1px solid var(--border)'}}>
                    <span className="w-[160px] shrink-0 text-xs" style={{color:'var(--text-muted)'}}>{t.inputData}</span>
                    <span className="text-xs break-all font-mono text-cyan-400">{txDetail.input.length > 66 ? txDetail.input.slice(0, 66) + '...' : txDetail.input}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {contractView && !txDetail && (
        <div className="px-4 py-6 max-w-[1400px] mx-auto">
          {/* 返回按钮 */}
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => { setContractView(null); setExpandedSource(null); }}
              className="flex items-center gap-2 text-[12px] t-text-muted t-accent-hover cursor-pointer t-bg-hover px-3 py-1.5 rounded-lg border t-border">
              <ArrowLeft size={14}/> {t.backToHome}
            </button>
            <h2 className="text-[16px] font-semibold t-logo-text flex items-center gap-2">
              <CheckCircle size={18} className="text-green-400"/>
              {contractView === 'list' ? t.verifiedContracts : `${t.contractLabel} ${contractView.slice(0,10)}...${contractView.slice(-6)}`}
            </h2>
          </div>

          {contractView === 'list' ? (
            /* ---- 合约列表视图 ---- */
            <div className="t-card rounded-xl overflow-hidden shadow-sm">
              <div className="t-panel-head px-4 py-3 flex justify-between items-center">
                <span className="text-[13px] font-semibold t-logo-text flex items-center gap-2">
                  <Shield size={14} className="text-green-400"/> {t.verifiedTokenContracts.replace('{0}', Object.keys(VERIFIED_CONTRACTS).length)}
                </span>
                <span className="text-[10px] t-text-dim">Compiler: Solidity 0.8.24</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] min-w-[700px]">
                  <thead>
                    <tr className="t-bg-alt border-b t-border text-[10px] t-text-dim uppercase tracking-wider">
                      <th className="px-4 py-2.5 text-left font-medium">#</th>
                      <th className="px-4 py-2.5 text-left font-medium">{t.contractAddress}</th>
                      <th className="px-4 py-2.5 text-left font-medium">{t.tokenName}</th>
                      <th className="px-4 py-2.5 text-left font-medium">{t.symbolLabel}</th>
                      <th className="px-4 py-2.5 text-left font-medium">{t.decimalsLabel}</th>
                      <th className="px-4 py-2.5 text-left font-medium">{t.compilerLabel}</th>
                      <th className="px-4 py-2.5 text-left font-medium">{t.licenseLabel}</th>
                      <th className="px-4 py-2.5 text-left font-medium">{t.statusLabel}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y t-divider">
                    {Object.entries(VERIFIED_CONTRACTS).map(([addr, info], i) => (
                      <tr key={addr} className="t-row cursor-pointer" onClick={() => setContractView(addr)}>
                        <td className="px-4 py-3 t-text-dim">{i+1}</td>
                        <td className="px-4 py-3">
                          <span className="t-accent t-accent-hover font-mono text-[11px]">{addr.slice(0,10)}...{addr.slice(-8)}</span>
                        </td>
                        <td className="px-4 py-3 t-logo-text font-medium">{info.name}</td>
                        <td className="px-4 py-3">
                          <span className="t-pill px-2 py-0.5 rounded font-bold text-[10px]">{info.symbol}</span>
                        </td>
                        <td className="px-4 py-3 t-text-muted font-mono">{info.decimals}</td>
                        <td className="px-4 py-3 t-text-muted text-[11px]">{info.compiler}</td>
                        <td className="px-4 py-3 t-text-muted text-[11px]">{info.license}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-green-400 text-[11px] font-medium">
                            <CheckCircle size={12}/> Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : VERIFIED_CONTRACTS[contractView] ? (
            /* ---- 单个合约详情视图 ---- */
            <div className="space-y-4">
              {/* 合约概览卡片 */}
              <div className="t-card rounded-xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                        <CheckCircle size={20} className="text-green-400"/>
                      </div>
                      <div>
                        <h3 className="text-[15px] t-logo-text font-semibold">{VERIFIED_CONTRACTS[contractView].name} ({VERIFIED_CONTRACTS[contractView].symbol})</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] bg-green-900/30 text-green-400 border border-green-500/30 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                            <CheckCircle size={9}/> Contract Source Code Verified
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                      <div className="flex items-center gap-2">
                        <span className="t-text-dim w-24 shrink-0">Contract:</span>
                        <span className="t-accent font-mono text-[11px] truncate">{contractView}</span>
                        <CopyBtn/>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="t-text-dim w-24 shrink-0">Token Name:</span>
                        <span className="t-logo-text">{VERIFIED_CONTRACTS[contractView].name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="t-text-dim w-24 shrink-0">Symbol:</span>
                        <span className="t-pill px-2 py-0.5 rounded font-bold text-[10px]">{VERIFIED_CONTRACTS[contractView].symbol}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="t-text-dim w-24 shrink-0">Decimals:</span>
                        <span className="t-text-muted font-mono">{VERIFIED_CONTRACTS[contractView].decimals}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="t-text-dim w-24 shrink-0">Compiler:</span>
                        <span className="t-text-muted">{VERIFIED_CONTRACTS[contractView].compiler}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="t-text-dim w-24 shrink-0">License:</span>
                        <span className="t-text-muted">{VERIFIED_CONTRACTS[contractView].license}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 合约选项卡 */}
              <div className="t-card rounded-xl overflow-hidden shadow-sm">
                <div className="t-panel-head px-4 py-3 flex items-center gap-4 border-b t-border">
                  <button className="text-[12px] font-medium t-accent flex items-center gap-1.5 border-b-2 border-cyan-500 pb-1">
                    <Code size={13}/> Contract Source Code
                  </button>
                  <button className="text-[12px] t-text-dim flex items-center gap-1.5 pb-1 cursor-not-allowed opacity-50">
                    <FileCode size={13}/> ABI
                  </button>
                  <button className="text-[12px] t-text-dim flex items-center gap-1.5 pb-1 cursor-not-allowed opacity-50">
                    <Hash size={13}/> Bytecode
                  </button>
                </div>

                {/* 合约信息头 */}
                <div className="px-4 py-3 t-bg-alt border-b t-border">
                  <div className="flex flex-wrap gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="t-text-dim">{t.contractNameLabel}</span>
                      <span className="t-logo-text font-medium">RXToken</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="t-text-dim">{t.compilerVersion}</span>
                      <span className="t-text-muted font-mono">v0.8.24+commit.e11b9ed9</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="t-text-dim">{t.optimization}</span>
                      <span className="text-green-400 font-medium">Yes (200 runs)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="t-text-dim">{t.evmVersion}</span>
                      <span className="t-text-muted font-mono">shanghai</span>
                    </div>
                  </div>
                </div>

                {/* 源码展示 */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] t-text-dim flex items-center gap-1.5">
                      <FileText size={12}/> RXToken.sol — {VERIFIED_CONTRACTS[contractView].name}
                    </span>
                    <button className="text-[10px] t-text-muted t-accent-hover flex items-center gap-1 t-bg-hover px-2 py-1 rounded border t-border">
                      <Copy size={10}/> Copy Source
                    </button>
                  </div>
                  <div className="bg-[#1a1a2e] rounded-lg border border-slate-700/50 overflow-hidden">
                    <div className="flex text-[11px] font-mono leading-relaxed overflow-x-auto">
                      {/* 行号 */}
                      <div className="py-3 px-3 text-right select-none border-r border-slate-700/30 shrink-0" style={{color:'#4a4a6a'}}>
                        {ERC20_SOURCE_CODE.split('\n').map((_, i) => (
                          <div key={i} className="leading-[1.65]">{i + 1}</div>
                        ))}
                      </div>
                      {/* 代码内容 */}
                      <div className="py-3 px-4 flex-1 overflow-x-auto">
                        <pre className="whitespace-pre" style={{color:'#c9d1d9'}}>
                          {ERC20_SOURCE_CODE.split('\n').map((line, i) => {
                            let colored = line;
                            // 关键字高亮
                            if (/^\/\//.test(line.trim())) return <div key={i} className="leading-[1.65]" style={{color:'#6a9955'}}>{line}</div>;
                            colored = line
                              .replace(/(pragma|solidity|contract|function|public|returns|bool|require|event|emit|mapping|address|uint256|uint8|string|memory|indexed|constructor)/g, '<kw>$1</kw>')
                              .replace(/(true|false)/g, '<bool>$1</bool>')
                              .replace(/(".*?")/g, '<str>$1</str>');
                            const parts = colored.split(/(<kw>.*?<\/kw>|<bool>.*?<\/bool>|<str>.*?<\/str>)/);
                            return (
                              <div key={i} className="leading-[1.65]">
                                {parts.map((part, j) => {
                                  if (part.startsWith('<kw>')) return <span key={j} style={{color:'#569cd6'}}>{part.replace(/<\/?kw>/g,'')}</span>;
                                  if (part.startsWith('<bool>')) return <span key={j} style={{color:'#569cd6'}}>{part.replace(/<\/?bool>/g,'')}</span>;
                                  if (part.startsWith('<str>')) return <span key={j} style={{color:'#ce9178'}}>{part.replace(/<\/?str>/g,'')}</span>;
                                  return <span key={j}>{part}</span>;
                                })}
                              </div>
                            );
                          })}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 返回列表按钮 */}
              <div className="flex justify-center pb-4">
                <button onClick={() => setContractView('list')}
                  className="flex items-center gap-2 text-[12px] t-text-muted t-accent-hover cursor-pointer px-4 py-2 rounded-lg border t-border t-bg-hover">
                  <ArrowLeft size={14}/> Back to Verified Contracts List
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* === NavPage 视图 === */}
      {navPage && !contractView && !txDetail && (
        <div className="px-4 py-6 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setNavPage(null)} className="flex items-center gap-2 t-text-muted text-sm cursor-pointer hover:t-accent" style={{color:'var(--text-muted)'}}>
              <ArrowLeft size={16}/> {t.home}
            </button>
            <ChevronRight size={14} className="t-text-faint"/>
            <span className="t-logo-text font-semibold text-base">
              {navPage === 'transactions' ? t.transactionsLabel : navPage === 'blocks' ? t.latestBlocks : navPage === 'accounts' ? t.topAccountsByBalance : navPage === 'tokens' ? t.menuTopTokens : navPage === 'transfers' ? t.menuTokenTransfers : navPage === 'stats' ? t.chartsAndStats : ''}
            </span>
          </div>

          {/* Transactions页 */}
          {navPage === 'transactions' && (
            <div className="t-card rounded-xl border t-border overflow-hidden">
              <div className="p-4 border-b t-border flex items-center gap-2">
                <FileText size={16} className="t-accent"/>
                <span className="t-logo-text font-semibold">{t.latestTransactions}</span>
                <span className="ml-auto t-text-dim text-xs">{t.recentTxDesc}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] min-w-[700px]">
                  <thead><tr className="t-bg-alt text-left">
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thTxHash}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thMethod}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thBlock}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thFrom}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thTo}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thValue}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thFee}</th>
                  </tr></thead>
                  <tbody>
                    {txs.map((tx, i) => (
                      <tr key={i} className="border-t t-border t-row cursor-pointer" onClick={() => { if(tx.hash) { setSearchTerm(tx.hash); searchTransaction(tx.hash); setNavPage(null); } }}>
                        <td className="px-4 py-3 font-mono t-link truncate max-w-[140px]">{tx.hash?.slice(0,18)}...</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] border ${tx.method?.cls || 't-method-default'}`}>{tx.method?.name || '-'}</span></td>
                        <td className="px-4 py-3 t-text-muted">{tx.block}</td>
                        <td className="px-4 py-3 font-mono t-link text-[11px]">{tx.fromShort}</td>
                        <td className="px-4 py-3 font-mono t-link text-[11px]">{tx.toShort}</td>
                        <td className="px-4 py-3 t-text-muted">{tx.amount}</td>
                        <td className="px-4 py-3 t-text-faint">{tx.fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Blocks页 */}
          {navPage === 'blocks' && (
            <div className="t-card rounded-xl border t-border overflow-hidden">
              <div className="p-4 border-b t-border flex items-center gap-2">
                <Box size={16} className="t-accent"/>
                <span className="t-logo-text font-semibold">{t.latestBlocks}</span>
                <span className="ml-auto t-text-dim text-xs">{t.recentBlockDesc}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] min-w-[700px]">
                  <thead><tr className="t-bg-alt text-left">
                    <th className="px-4 py-3 t-text-dim font-semibold">Block</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">Age</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">Txn</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">Producer</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.gasUsed}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">Gas %</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">Base Fee</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">Reward</th>
                  </tr></thead>
                  <tbody>
                    {blocks.map((b, i) => (
                      <tr key={i} className="border-t t-border t-row">
                        <td className="px-4 py-3 t-link font-mono font-semibold">{b.number}</td>
                        <td className="px-4 py-3 t-text-muted">{b.timestamp}s ago</td>
                        <td className="px-4 py-3"><span className="t-link">{b.txnCount}</span></td>
                        <td className="px-4 py-3 t-link text-[11px]">{b.miner}</td>
                        <td className="px-4 py-3 t-text-muted font-mono">{b.gasUsed?.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full t-bg-alt overflow-hidden"><div className="h-full rounded-full bg-cyan-500/60" style={{width: Math.min(parseFloat(b.gasPercent||0)*10, 100)+'%'}}/></div>
                            <span className="t-text-faint text-[10px]">{b.gasPercent}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 t-text-muted">{b.baseFee} Gwei</td>
                        <td className="px-4 py-3 t-text-muted">{b.reward}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Accounts页 */}
          {navPage === 'accounts' && (
            <div className="t-card rounded-xl border t-border overflow-hidden">
              <div className="p-4 border-b t-border flex items-center gap-2">
                <Users size={16} className="t-accent"/>
                <span className="t-logo-text font-semibold">{t.topAccountsByBalance}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] min-w-[700px]">
                  <thead><tr className="t-bg-alt text-left">
                    <th className="px-4 py-3 t-text-dim font-semibold w-12">#</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.addressCol}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thNameTag}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold text-right">{t.thBalance}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold text-right">{t.thPercentage}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold text-right">{t.thTxnCount}</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { addr: '0xed8D698d18575d9f732556516A8721ABC8A87171', tag: 'Bridge/DEX Vault', bal: '8,500,000,000', pct: '85.00%', txn: '12,458' },
                      { addr: '0x06a93CB73aD813347b119880a8ba9bC5644C384A', tag: 'Foundation', bal: '500,000,000', pct: '5.00%', txn: '892' },
                      { addr: '0x107511aeef3b06af78256973d547dfbfaafd28bd', tag: 'Relayer Collector', bal: '320,000,000', pct: '3.20%', txn: '356' },
                      { addr: '0x7a3F2d8B9c1E5f0A6b4C3d2E1f0A9B8c7D6e5F4', tag: '', bal: '150,000,000', pct: '1.50%', txn: '2,341' },
                      { addr: '0x9B8c7D6e5F4a3F2d8B1c0E9A8b7C6d5E4f3A2B1', tag: '', bal: '89,000,000', pct: '0.89%', txn: '1,024' },
                      { addr: '0x2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9B0c1', tag: 'Ecosystem Fund', bal: '75,000,000', pct: '0.75%', txn: '445' },
                      { addr: '0x4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9B0c1D2e3', tag: '', bal: '42,000,000', pct: '0.42%', txn: '789' },
                      { addr: '0x6A7b8C9d0E1f2A3b4C5d6E7f8A9B0c1D2e3F4a5', tag: 'Development Fund', bal: '35,000,000', pct: '0.35%', txn: '234' },
                      { addr: '0x8C9d0E1f2A3b4C5d6E7f8A9B0c1D2e3F4a5B6c7', tag: '', bal: '18,500,000', pct: '0.19%', txn: '567' },
                      { addr: '0x0E1f2A3b4C5d6E7f8A9B0c1D2e3F4a5B6c7D8e9', tag: '', bal: '12,000,000', pct: '0.12%', txn: '123' },
                    ].map((acc, i) => (
                      <tr key={i} className="border-t t-border t-row">
                        <td className="px-4 py-3 t-text-muted font-semibold">{i+1}</td>
                        <td className="px-4 py-3 font-mono t-link text-[11px]">{acc.addr.slice(0,10)}...{acc.addr.slice(-8)}</td>
                        <td className="px-4 py-3">{acc.tag ? <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{acc.tag}</span> : <span className="t-text-faint">-</span>}</td>
                        <td className="px-4 py-3 text-right t-logo-text font-mono">{acc.bal}</td>
                        <td className="px-4 py-3 text-right t-text-muted">{acc.pct}</td>
                        <td className="px-4 py-3 text-right t-text-muted">{acc.txn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Tokens (RX-20) 页 */}
          {navPage === 'tokens' && (
            <div className="t-card rounded-xl border t-border overflow-hidden">
              <div className="p-4 border-b t-border flex items-center gap-2">
                <TrendingUp size={16} className="t-accent"/>
                <span className="t-logo-text font-semibold">{t.rx20TokenTracker}</span>
                <span className="ml-auto t-text-dim text-xs">{t.tokensFound.replace('{0}', Object.keys(VERIFIED_CONTRACTS).length)}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] min-w-[700px]">
                  <thead><tr className="t-bg-alt text-left">
                    <th className="px-4 py-3 t-text-dim font-semibold w-12">#</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thToken}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thContract}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thDecimals}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thStandard}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.statusVerified}</th>
                  </tr></thead>
                  <tbody>
                    {Object.entries(VERIFIED_CONTRACTS).map(([addr, c], i) => (
                      <tr key={addr} className="border-t t-border t-row cursor-pointer" onClick={() => { setContractView(addr); setNavPage(null); }}>
                        <td className="px-4 py-3 t-text-muted font-semibold">{i+1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {TOKEN_LOGOS[c.symbol] ? (
                              <img src={TOKEN_LOGOS[c.symbol]} alt={c.symbol} className="w-6 h-6 rounded-full object-cover"/>
                            ) : (
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{background: TOKEN_COLORS[c.symbol]||'#666'}}>{c.symbol.charAt(0)}</div>
                            )}
                            <div>
                              <div className="t-logo-text font-semibold">{c.name}</div>
                              <div className="t-text-faint text-[10px]">{c.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono t-link text-[11px]">{addr.slice(0,10)}...{addr.slice(-6)}</td>
                        <td className="px-4 py-3 t-text-muted">{c.decimals}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">RX-20</span></td>
                        <td className="px-4 py-3">{c.verified ? <CheckCircle size={14} className="text-green-400"/> : <span className="t-text-faint">-</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Token Transfers页 */}
          {navPage === 'transfers' && (
            <div className="t-card rounded-xl border t-border overflow-hidden">
              <div className="p-4 border-b t-border flex items-center gap-2">
                <ArrowRight size={16} className="t-accent"/>
                <span className="t-logo-text font-semibold">{t.rx20TokenTransfers}</span>
                <span className="ml-auto t-text-dim text-xs">{t.recentTokenTransfers}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] min-w-[700px]">
                  <thead><tr className="t-bg-alt text-left">
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thTxHash}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thAge}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thFrom}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thTo}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thToken}</th>
                    <th className="px-4 py-3 t-text-dim font-semibold">{t.thAmount}</th>
                  </tr></thead>
                  <tbody>
                    {txs.filter(tx => tx.method?.name === 'Transfer' || tx.method?.name === 'Approve').slice(0, 8).map((tx, i) => {
                      const tokens = Object.values(VERIFIED_CONTRACTS);
                      const tk = tokens[i % tokens.length];
                      return (
                        <tr key={i} className="border-t t-border t-row cursor-pointer" onClick={() => { if(tx.hash) { setSearchTerm(tx.hash); searchTransaction(tx.hash); setNavPage(null); } }}>
                          <td className="px-4 py-3 font-mono t-link truncate max-w-[140px]">{tx.hash?.slice(0,18)}...</td>
                          <td className="px-4 py-3 t-text-muted">{tx.time}s ago</td>
                          <td className="px-4 py-3 font-mono t-link text-[11px]">{tx.fromShort}</td>
                          <td className="px-4 py-3 font-mono t-link text-[11px]">{tx.toShort}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{tk.symbol}</span></td>
                          <td className="px-4 py-3 t-logo-text font-mono">{(Math.random()*10000).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    {txs.filter(tx => tx.method?.name === 'Transfer' || tx.method?.name === 'Approve').length === 0 &&
                      txs.slice(0, 8).map((tx, i) => {
                        const tokens = Object.values(VERIFIED_CONTRACTS);
                        const tk = tokens[i % tokens.length];
                        return (
                          <tr key={i} className="border-t t-border t-row">
                            <td className="px-4 py-3 font-mono t-link truncate max-w-[140px]">{tx.hash?.slice(0,18)}...</td>
                            <td className="px-4 py-3 t-text-muted">{tx.time}s ago</td>
                            <td className="px-4 py-3 font-mono t-link text-[11px]">{tx.fromShort}</td>
                            <td className="px-4 py-3 font-mono t-link text-[11px]">{tx.toShort}</td>
                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{tk.symbol}</span></td>
                            <td className="px-4 py-3 t-logo-text font-mono">{(Math.random()*10000).toFixed(2)}</td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Charts & Stats页 */}
          {navPage === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: t.totalTransactionsLabel, value: totalTxns.toFixed(2) + 'M', icon: FileText, color: '#06B6D4' },
                  { label: t.totalBlocksLabel, value: blockHeight.toLocaleString(), icon: Box, color: '#8B5CF6' },
                  { label: t.avgBlockTimeLabel, value: avgBlockTime + 's', icon: Clock, color: '#F59E0B' },
                  { label: t.tpsLabel, value: tps.toFixed(1), icon: Zap, color: '#10B981' },
                  { label: t.rxPriceLabelStat, value: '$' + Number(robotxPrice).toFixed(4), icon: TrendingUp, color: '#06B6D4' },
                  { label: t.gasPriceLabelStat, value: gasPrice + ' Gwei', icon: Fuel, color: '#EF4444' },
                  { label: t.latestBatchLabel, value: '#' + latestBatch.toLocaleString(), icon: Package, color: '#8B5CF6' },
                  { label: t.rx20TokensLabel, value: Object.keys(VERIFIED_CONTRACTS).length.toString(), icon: Coins, color: '#F59E0B' },
                ].map((stat, i) => (
                  <div key={i} className="t-card rounded-xl p-4 border t-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: stat.color + '15'}}>
                        <stat.icon size={18} style={{color: stat.color}}/>
                      </div>
                      <div>
                        <div className="t-text-dim text-[10px] uppercase tracking-wide font-medium">{stat.label}</div>
                        <div className="t-logo-text text-lg font-bold tabular-nums">{stat.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="t-card rounded-xl border t-border p-4">
                <h3 className="t-logo-text font-semibold mb-3 flex items-center gap-2"><BarChart3 size={16} className="t-accent"/>{t.txHistory14d}</h3>
                <div className="h-48 flex items-end gap-1">
                  {txChartData.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t" style={{height: (v / 9000000 * 160) + 'px', background: 'linear-gradient(to top, rgba(6,182,212,0.3), rgba(6,182,212,0.6))'}}/>
                      <span className="text-[9px] t-text-faint">{14-i}d</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

            {!contractView && !txDetail && !navPage && <>
      {/* === Dashboard Stats (4 Cards) === */}
      <div className="px-4 py-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Price + MCap */}
          <div className="t-card rounded-xl p-4 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100"><Sparkline color="t-accent" trend="up"/></div>
            <div className="flex gap-3 relative z-10">
              <RobotXIcon size={22} className="shrink-0 mt-0.5"/>
              <div className="flex-1 min-w-0">
                <div className="t-text-dim text-[10px] uppercase tracking-wide mb-0.5 font-medium">{t.statRtxPrice}</div>
                <div className="t-logo-text text-[14px] t-accent-hover cursor-pointer font-medium tabular-nums">
                  ${Number(robotxPrice).toFixed(4)} <span className="t-text-muted ml-1 font-normal text-[11px]">@ {(Number(robotxPrice)/ethPrice).toFixed(6)} ETH</span>
                </div>
              </div>
            </div>
            <div className="mt-3.5 pt-3.5 border-t t-divider flex gap-3 relative z-10">
              <Database size={18} className="t-text-dim mt-0.5 shrink-0"/>
              <div>
                <div className="t-text-dim text-[10px] uppercase tracking-wide mb-0.5 font-medium">{t.statMarketCap}</div>
                <div className="t-logo-text text-[14px] t-accent-hover cursor-pointer font-medium tracking-tight">$428,910,291</div>
              </div>
            </div>
          </div>

          {/* Txns + Gas */}
          <div className="t-card rounded-xl p-4 shadow-sm relative group">
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100"><Sparkline color="text-purple-500" trend="down"/></div>
            <div className="flex gap-3">
              <Activity size={18} className="t-text-dim mt-0.5 shrink-0"/>
              <div>
                <div className="t-text-dim text-[10px] uppercase tracking-wide mb-0.5 font-medium">{t.statTransactions}</div>
                <div className="t-logo-text text-[14px] t-accent-hover cursor-pointer font-medium tabular-nums">{totalTxns.toFixed(2)} M <span className="t-text-muted text-[11px] ml-1 font-normal">({tps} TPS)</span></div>
              </div>
            </div>
            <div className="mt-3.5 pt-3.5 border-t t-divider flex gap-3">
              <Fuel size={18} className="t-text-dim mt-0.5 shrink-0"/>
              <div>
                <div className="t-text-dim text-[10px] uppercase tracking-wide mb-0.5 font-medium">{t.statMedGas}</div>
                <div className="t-logo-text text-[14px] t-accent-hover cursor-pointer font-medium tabular-nums">{gasPrice} Gwei <span className="t-text-muted text-[11px] ml-1 font-normal">($0.01)</span></div>
              </div>
            </div>
          </div>

          {/* Block + Batch */}
          <div className="t-card rounded-xl p-4 shadow-sm relative group">
            <div className="flex gap-3">
              <Box size={18} className="t-text-dim mt-0.5 shrink-0"/>
              <div className="flex-1">
                <div className="t-text-dim text-[10px] uppercase tracking-wide mb-0.5 font-medium">{t.statLatestBlock}</div>
                <div className="t-logo-text text-[14px] font-mono tabular-nums">{blockHeight.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="t-text-dim text-[10px] uppercase tracking-wide mb-0.5 font-medium">{t.statAvgTime}</div>
                <div className="t-logo-text text-[14px] font-medium tabular-nums">{avgBlockTime}s</div>
              </div>
            </div>
            <div className="mt-3.5 pt-3.5 border-t t-divider flex gap-3">
              <Package size={18} className="t-text-dim mt-0.5 shrink-0"/>
              <div>
                <div className="t-text-dim text-[10px] uppercase tracking-wide mb-0.5 font-medium">{t.statLatestBatch}</div>
                <div className="t-logo-text text-[14px] t-accent-hover cursor-pointer font-mono tabular-nums">{latestBatch.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="t-card rounded-xl p-4 shadow-sm relative group">
            <div className="flex justify-between items-start mb-2">
              <div className="t-text-dim text-[10px] uppercase tracking-wide font-medium">{t.statTxHistory}</div>
              <BarChart3 size={14} className="t-text-dim"/>
            </div>
            <div className="h-[70px] w-full"><TxHistoryChart data={txChartData}/></div>
            <div className="flex justify-between mt-1.5 text-[9px] t-text-faint"><span>Feb 3</span><span>Feb 10</span><span>Feb 17</span></div>
          </div>
        </div>

        {/* === Triple List === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">

          {/* Blocks */}
          <div className="t-card rounded-xl overflow-hidden shadow-sm flex flex-col h-[520px]">
            <div className="t-panel-head px-4 py-3 flex justify-between items-center shrink-0">
              <span className="text-[14px] font-semibold t-logo-text">{t.listBlocks}</span>
              <button className="text-[10px] t-pill px-2.5 py-1 rounded font-medium t-bg-hover">{t.customize}</button>
            </div>
            <div className="divide-y t-divider flex-1 overflow-auto scrollbar-thin">
              {blocks.map((b, i) => (
                <div key={i} className="px-4 py-3 flex gap-3 items-start t-row group">
                  <div className="t-bg-input w-11 h-11 flex items-center justify-center rounded-lg shrink-0 border t-border"><RobotXIcon size={22}/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="t-accent t-accent-hover cursor-pointer text-[13px] font-medium tabular-nums">{b.number.toLocaleString()}</span>
                      <span className="text-[10px] t-text-dim tabular-nums">{b.timestamp}s ago</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="t-text-muted">{t.validatedBy} <span className="t-accent t-accent-hover cursor-pointer font-mono">{b.miner}</span></span>
                      <span className="t-accent t-accent-hover cursor-pointer tabular-nums">{b.txnCount} {t.txnsSuffix}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[10px] t-text-faint">
                      <span>Gas <span className="t-text-muted tabular-nums">{(b.gasUsed/1000).toFixed(0)}K</span> <span className="t-text-faint">({b.gasPercent}%)</span></span>
                      <span className="t-pill px-2 py-0.5 rounded font-mono tabular-nums text-[10px] flex items-center gap-1"><RobotXIcon size={10}/>{b.reward}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="t-panel-foot px-4 py-3 text-center shrink-0">
              <span className="text-[11px] font-semibold t-text-muted t-accent-hover cursor-pointer flex justify-center items-center gap-1 uppercase tracking-wide">{t.viewAllBlocks} <ArrowRight size={11}/></span>
            </div>
          </div>

          {/* Transactions */}
          <div className="t-card rounded-xl overflow-hidden shadow-sm flex flex-col h-[520px]">
            <div className="t-panel-head px-4 py-3 flex justify-between items-center shrink-0">
              <span className="text-[14px] font-semibold t-logo-text">{t.listTxns}</span>
              <button className="text-[10px] t-pill px-2.5 py-1 rounded font-medium t-bg-hover">{t.customize}</button>
            </div>
            <div className="divide-y t-divider flex-1 overflow-auto scrollbar-thin">
              {txs.map((tx, i) => (
                <div key={i} className="px-4 py-3 flex gap-3 items-start t-row group">
                  <div className="t-bg-input w-11 h-11 flex items-center justify-center rounded-lg shrink-0 border t-border"><EthIcon size={14}/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="t-accent t-accent-hover cursor-pointer text-[12px] font-mono truncate max-w-[120px]">{tx.hash.slice(0,16)}...</span>
                        <CopyBtn/>
                      </div>
                      <span className="text-[10px] t-text-dim tabular-nums shrink-0">{tx.time}s ago</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="t-text-muted truncate">{t.from} <span className="t-accent t-accent-hover cursor-pointer font-mono">{tx.fromShort}</span></span>
                      <span className="t-text-muted truncate">{t.to} <span className="t-accent t-accent-hover cursor-pointer font-mono">{tx.toShort}</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`border px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wide ${tx.method.cls}`}>{tx.method.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="t-pill text-[10px] px-2 py-0.5 rounded font-mono tabular-nums flex items-center gap-1"><RTXCoinIcon size={8}/>{tx.amount}</span>
                        <span className="text-[9px] t-text-faint tabular-nums">{tx.fee} RX</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="t-panel-foot px-4 py-3 text-center shrink-0">
              <span className="text-[11px] font-semibold t-text-muted t-accent-hover cursor-pointer flex justify-center items-center gap-1 uppercase tracking-wide">{t.viewAllTxns} <ArrowRight size={11}/></span>
            </div>
          </div>

          {/* Main→RX Bridge */}
          <div className="t-card rounded-xl overflow-hidden shadow-sm flex flex-col h-[520px]">
            <div className="t-panel-head px-4 py-3 flex justify-between items-center shrink-0">
              <span className="text-[14px] font-semibold t-logo-text flex items-center gap-2">
                {t.listBridge} <span className="text-[9px] bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded font-bold">{t.bridge}</span>
              </span>
            </div>
            <div className="divide-y t-divider flex-1 overflow-auto scrollbar-thin">
              {bridgeTxs.length===0 ? (
                <div className="flex items-center justify-center h-full t-text-faint text-sm">{t.loadingBridge}</div>
              ) : bridgeTxs.map((item,i) => (
                <div key={i} className="px-4 py-3 t-row">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] t-text-dim font-medium">{t.mainBlock} <span className="t-accent cursor-pointer font-mono">{item.mainBlock.toLocaleString()}</span></span>
                    <span className="text-[10px] t-text-dim tabular-nums">{item.time}s ago</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] t-tag-muted px-1.5 py-0.5 rounded font-bold shrink-0">Main</span>
                      <span className="t-accent t-accent-hover cursor-pointer font-mono truncate">{item.mainTx.slice(0,16)}...</span>
                      <CopyBtn/>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] t-tag-accent px-1.5 py-0.5 rounded font-bold shrink-0">RX</span>
                      <span className="t-accent t-accent-hover cursor-pointer font-mono truncate">{item.rxTx.slice(0,16)}...</span>
                      <CopyBtn/>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1.5 text-[10px]">
                    <span className="t-text-dim">
                      <span className="t-text-muted font-mono">{item.from}</span>
                      <ArrowRight size={9} className="inline mx-1 t-text-faint"/>
                      <span className="t-text-muted font-mono">{item.to}</span>
                    </span>
                    <span className="t-pill px-2 py-0.5 rounded font-mono tabular-nums text-[10px] flex items-center gap-1"><RTXCoinIcon size={7}/>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="t-panel-foot px-4 py-3 text-center shrink-0">
              <span className="text-[11px] font-semibold t-text-muted t-accent-hover cursor-pointer flex justify-center items-center gap-1 uppercase tracking-wide">{t.viewAllBridge} <ArrowRight size={11}/></span>
            </div>
          </div>
        </div>
      </div>

      </>}

      {/* === Footer === */}
      <footer className="t-footer-bg border-t t-border pt-10 pb-6 px-4 mt-auto">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div className="md:w-1/3 pr-8">
              <div className="flex items-center gap-2.5 mb-4">
                <RobotXIcon size={28} />
                <span className="text-xl font-black tracking-wider -skew-x-3" style={{fontFamily:"'Orbitron', sans-serif"}}><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ROBOT</span><span className="text-white">X</span></span>
              </div>
              <p className="text-[11px] t-text-muted leading-relaxed mb-5">
                {t.footerDesc}
              </p>
              <div className="flex items-center gap-2.5 mb-4">
                <button className="flex items-center gap-2 t-bg-input border t-border rounded-lg px-3 py-2 text-[11px] t-text-muted cursor-pointer hover:t-border-hover group/mm">
                  <MetaMaskIcon size={16} /> <span className="group-hover/mm:t-text font-medium">{t.addNetwork}</span>
                </button>
              </div>
              <div className="flex gap-2.5">
                {[Twitter,Github,Send,Facebook,Linkedin].map((Icon,i) => (
                  <div key={i} className="t-bg-panel p-2 rounded-full t-text-dim cursor-pointer border t-border hover:t-border-hover">
                    <Icon size={14}/>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {title:t.footCompany, items:[t.footAboutUs,t.footBrandAssets,t.footContactUs,t.footTerms,t.footBugBounty]},
                {title:t.footCommunity, items:[t.footApiDocs,t.footKnowledgeBase,t.footNetworkStatus,t.footLearnRobotx]},
                {title:t.footProducts, items:[t.footAdvertise,t.footEaas,t.footApiPlans,t.footPrioritySupport,t.footBlockscan]},
                {title:t.footTools, items:[t.footGasTracker,t.footTokenApprovals,t.footVerifyContract,t.footUnitConverter,t.footCsvExport]},
              ].map(col => (
                <div key={col.title}>
                  <h4 className="t-logo-text text-[10px] font-bold mb-3 border-b t-border pb-2 inline-block uppercase tracking-wider">{col.title}</h4>
                  <ul className="space-y-2 text-[11px] t-text-muted">
                    {col.items.map(item => <li key={item} className="t-accent-hover cursor-pointer">{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t t-border pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] t-text-faint">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span>ROBOTX © 2077 (RTX-B1)</span>
              <span className="hidden md:inline t-text-faint">|</span>
              <span>{t.builtBy} <span className="t-accent t-accent-hover cursor-pointer">Team ShadowLink</span></span>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-2">
              <span className="t-text-dim">{t.donations}</span>
              <span className="t-accent t-bg-panel px-2 py-0.5 rounded border t-border font-mono text-[10px] cursor-pointer">RXn8Kj2v...Qm4pYz</span>
              <CopyBtn/>
              <span className="text-red-500">♥</span>
            </div>
          </div>
        </div>
      </footer>

      {showCookieBanner && <CookieBanner onAccept={() => setShowCookieBanner(false)} t={t}/>}
    </div>
  );
};

// =========================================================

// 主应用入口
const BrowserApp = () => <RobotXContent />;

export default BrowserApp;
