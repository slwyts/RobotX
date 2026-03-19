import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowRightLeft,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Fuel,
  Globe,
  LogOut,
  MoreHorizontal,
  RotateCcw,
  Search,
  Settings,
  Shield,
  Zap,
} from 'lucide-react';
import {
  BRIDGE_CONTRACTS,
  BRIDGE_RPC,
  BRIDGE_VAULT,
  CHAIN_RPCS,
  CHAIN_TOKEN_SUPPORT,
  CHAINS,
  COINGECKO_MAP,
  COINGECKO_URL,
  EXTERNAL_TOKEN_CONTRACTS,
  EXTERNAL_TOKEN_DECIMALS,
  TOKENS,
  translations,
} from './bridge/constants';
import {
  ChainIcon,
  ChainSelectorModal,
  FloatingSupportButton,
  FlipArrowIcon,
  NavChainSelector,
  NavTab,
  RobotXNavLogo,
  SettingsPanel,
  SuccessModal,
  ThemeSwitcher,
  TokenIcon,
  TokenSelectorModal,
  WalletModal,
} from './bridge/BridgeWidgets';
import {
  callRelayerReverse,
  externalRpcCall,
  getERC20Balance,
  hexToRXAddress,
  rpcCall,
  waitForTx,
} from './bridge/utils';

const BridgeInterface = () => {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const NAV_TABS = [
    {
      id: 'bridge',
      label: t.navBridge,
      active: true,
      items: [
        { icon: <ArrowRightLeft size={16} />, label: t.navBridgeItem, desc: t.navBridgeDesc, active: true },
        { icon: <Clock size={16} />, label: t.navHistory, desc: t.navHistoryDesc },
      ],
    },
  ];

  const [fromChain, setFromChain] = useState(CHAINS[0]);
  const [toChain, setToChain] = useState(null);
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');

  const [showFromChainSelector, setShowFromChainSelector] = useState(false);
  const [showToChainSelector, setShowToChainSelector] = useState(false);
  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false);
  const [showToTokenSelector, setShowToTokenSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [slippage, setSlippage] = useState('0.5');
  const [deadline, setDeadline] = useState('30');

  const [isConnected, setIsConnected] = useState(false);
  const [livePrices, setLivePrices] = useState(null);
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

  const [theme, setTheme] = useState('light');
  const [activeNav, setActiveNav] = useState('bridge');
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chainData, setChainData] = useState({ blockHeight: 0, txCount: 0, srCount: 0, epochBlock: 0 });

  useEffect(() => {
    let alive = true;

    const fetchPrices = async () => {
      try {
        const res = await fetch(COINGECKO_URL);
        const data = await res.json();
        const prices = {};
        for (const [geckoId, symbol] of Object.entries(COINGECKO_MAP)) {
          if (data[geckoId] && data[geckoId].usd > 0) {
            prices[symbol] = data[geckoId].usd;
          }
        }
        if (alive && Object.keys(prices).length > 0) {
          setLivePrices(prices);
        }
      } catch {
      }
    };

    fetchPrices();
    const timer = setInterval(fetchPrices, 60000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const getTokenPrice = useCallback((token) => {
    if (!token) return 0;
    if (token.symbol === 'RX') return token.price;
    return (livePrices && livePrices[token.symbol]) || token.price;
  }, [livePrices]);

  useEffect(() => {
    let alive = true;

    const poll = async () => {
      try {
        const res = await fetch(BRIDGE_RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'robotx_getChainInfo', params: [], id: 1 }),
        });
        const json = await res.json();
        if (alive && json.result) {
          const result = json.result;
          setChainData({
            blockHeight: result.blockHeight || 0,
            txCount: result.txCount || 0,
            srCount: result.srCount || 0,
            epochBlock: result.epochBlock || 0,
          });
        }
      } catch {
      }
    };

    poll();
    const timer = setInterval(poll, 6000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!isConnected || !walletAddress || !isRealWallet) return undefined;
    let alive = true;

    const fetchBalance = async () => {
      try {
        const balance = await rpcCall('robotx_getBalance', [rawHexAddress || walletAddress]);
        if (alive) {
          const value = typeof balance === 'number' ? balance : parseInt(balance, 10) || 0;
          setRxBalance(value / 1e6);
        }
      } catch {
      }
    };

    fetchBalance();
    const timer = setInterval(fetchBalance, 10000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [isConnected, isRealWallet, rawHexAddress, walletAddress]);

  useEffect(() => {
    if (!isConnected || !walletAddress || !isRealWallet) return undefined;
    let alive = true;

    const fetchAccountInfo = async () => {
      try {
        const info = await rpcCall('robotx_getAccountInfo', [rawHexAddress || walletAddress]);
        if (alive && info) {
          setAccountInfo(info);
        }
      } catch {
      }
    };

    fetchAccountInfo();
    const timer = setInterval(fetchAccountInfo, 10000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [isConnected, isRealWallet, rawHexAddress, walletAddress]);

  useEffect(() => {
    if (!isConnected || !rawHexAddress || !isRealWallet) return undefined;
    let alive = true;

    const fetchTokenBalances = async () => {
      const balances = {};
      for (const token of TOKENS) {
        if (!token.contract) continue;
        try {
          const rawBalance = await getERC20Balance(token.contract, rawHexAddress);
          balances[token.symbol] = rawBalance / Math.pow(10, token.decimals);
        } catch {
          balances[token.symbol] = 0;
        }
      }
      if (alive) {
        setTokenBalances(balances);
      }
    };

    fetchTokenBalances();
    const timer = setInterval(fetchTokenBalances, 15000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [isConnected, isRealWallet, rawHexAddress]);

  useEffect(() => {
    if (!isConnected || !rawHexAddress || !isRealWallet || fromChain?.id === 'robotx') {
      setExternalNativeBalance(0);
      setExternalTokenBalances({});
      return undefined;
    }

    let alive = true;
    const fetchExternalBalances = async () => {
      const chainId = fromChain.chainId;
      if (!rawHexAddress.startsWith('0x') || rawHexAddress.length < 42) return;

      try {
        const result = await externalRpcCall(chainId, 'eth_getBalance', [rawHexAddress, 'latest']);
        if (alive && result) {
          setExternalNativeBalance(Number(BigInt(result)) / 1e18);
        }
      } catch {
      }

      const contracts = EXTERNAL_TOKEN_CONTRACTS[chainId] || {};
      const decimalsMap = EXTERNAL_TOKEN_DECIMALS[chainId] || {};
      const balances = {};

      for (const [symbol, contractAddr] of Object.entries(contracts)) {
        if (contractAddr === 'native') continue;
        try {
          const address = rawHexAddress.replace(/^0x/i, '').toLowerCase().padStart(64, '0');
          const data = `0x70a08231${address}`;
          const result = await externalRpcCall(chainId, 'eth_call', [{ to: contractAddr, data }, 'latest']);
          if (result && result !== '0x' && result !== '0x0') {
            const decimals = decimalsMap[symbol] || 18;
            balances[symbol] = Number(BigInt(result)) / Math.pow(10, decimals);
          } else {
            balances[symbol] = 0;
          }
        } catch {
          balances[symbol] = 0;
        }
      }

      if (alive) {
        setExternalTokenBalances(balances);
      }
    };

    fetchExternalBalances();
    const timer = setInterval(fetchExternalBalances, 15000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [fromChain, isConnected, isRealWallet, rawHexAddress]);

  useEffect(() => {
    if (fromChain && fromToken) {
      const supported = CHAIN_TOKEN_SUPPORT[fromChain.id];
      if (supported && !supported.includes(fromToken.symbol)) {
        const fallback = TOKENS.find((token) => supported.includes(token.symbol));
        if (fallback) {
          setFromToken(fallback);
        }
      }
    }
  }, [fromChain, fromToken]);

  useEffect(() => {
    if (fromToken && (!toToken || toToken.symbol !== fromToken.symbol)) {
      setToToken(fromToken);
    }
  }, [fromToken, toToken]);

  useEffect(() => {
    if (toChain && toToken) {
      const supported = CHAIN_TOKEN_SUPPORT[toChain.id];
      if (supported && !supported.includes(toToken.symbol)) {
        const fallback = TOKENS.find((token) => supported.includes(token.symbol));
        if (fallback) {
          setToToken(fallback);
        }
      }
    }
  }, [toChain, toToken]);

  useEffect(() => {
    if (fromChain?.id === 'robotx' && toChain && fromToken) {
      const supported = CHAIN_TOKEN_SUPPORT[toChain.id];
      if (supported && !supported.includes(fromToken.symbol)) {
        const fallback = TOKENS.find((token) => supported.includes(token.symbol));
        if (fallback) {
          setFromToken(fallback);
          setToToken(fallback);
        }
      }
    }
  }, [fromChain, fromToken, toChain]);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && fromToken && toToken && toChain) {
      const feeRate = fromChain?.id === 'robotx' ? 0.05 : 0.01;
      const fee = parseFloat(amount) * feeRate;
      const afterFee = parseFloat(amount) - fee;
      const receive = afterFee * (getTokenPrice(fromToken) / getTokenPrice(toToken));
      setReceiveAmount(receive > 0 ? receive.toFixed(getTokenPrice(toToken) >= 100 ? 8 : 4) : '0');
    } else {
      setReceiveAmount('');
    }
  }, [amount, fromChain, fromToken, getTokenPrice, toChain, toToken]);

  const getTokenBal = (token) => {
    if (fromChain?.id !== 'robotx') {
      if (!isRealWallet || !rawHexAddress) return 0;
      const contracts = EXTERNAL_TOKEN_CONTRACTS[fromChain?.chainId] || {};
      if (contracts[token.symbol] === 'native') {
        return externalNativeBalance;
      }
      return externalTokenBalances[token.symbol] !== undefined ? externalTokenBalances[token.symbol] : 0;
    }

    if (!isRealWallet) return token.balance;
    if (token.symbol === 'RX') return rxBalance;
    return tokenBalances[token.symbol] !== undefined ? tokenBalances[token.symbol] : 0;
  };

  const handleFlip = useCallback(() => {
    if (!toChain) return;
    setFromChain((prev) => {
      setToChain(prev);
      return toChain;
    });
    setFromToken((prev) => {
      setToToken(prev);
      return toToken;
    });
  }, [toChain, toToken]);

  const handleBridge = useCallback(async () => {
    setIsBridging(true);
    const isFromRobotx = fromChain?.id === 'robotx';
    const isToRobotx = toChain?.id === 'robotx';

    if (!isFromRobotx && isToRobotx && window.ethereum) {
      try {
        const provider = window.ethereum;
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        const userAddr = accounts[0];
        const destAddr = rawHexAddress || walletAddress || userAddr;

        const sourceChainHex = `0x${fromChain.chainId.toString(16)}`;
        try {
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: sourceChainHex }] });
        } catch {
        }

        const tokenSymbol = fromToken?.symbol;
        const externalContracts = EXTERNAL_TOKEN_CONTRACTS[fromChain.chainId] || {};
        const tokenContract = externalContracts[tokenSymbol];
        const externalDecimals = EXTERNAL_TOKEN_DECIMALS[fromChain.chainId]?.[tokenSymbol];
        const decimals = tokenContract && tokenContract !== 'native' && externalDecimals !== undefined ? externalDecimals : (fromToken?.decimals || 18);
        const rawAmount = BigInt(Math.round(parseFloat(amount) * (10 ** decimals)));
        const bridgeTarget = BRIDGE_CONTRACTS[fromChain.chainId] || BRIDGE_VAULT;

        let sourceTxHash;
        if (!tokenContract || tokenContract === 'native') {
          if (bridgeTarget !== BRIDGE_VAULT) {
            const destBytes = new TextEncoder().encode(destAddr);
            const destHex = Array.from(destBytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
            const paddedLen = Math.ceil(destHex.length / 2 / 32) * 32;
            const depositData = '0xd51ba8f6'
              + '0000000000000000000000000000000000000000000000000000000000000020'
              + (destHex.length / 2).toString(16).padStart(64, '0')
              + destHex.padEnd(paddedLen * 2, '0');
            sourceTxHash = await provider.request({
              method: 'eth_sendTransaction',
              params: [{ from: userAddr, to: bridgeTarget, value: `0x${rawAmount.toString(16)}`, data: depositData }],
            });
          } else {
            sourceTxHash = await provider.request({
              method: 'eth_sendTransaction',
              params: [{ from: userAddr, to: BRIDGE_VAULT, value: `0x${rawAmount.toString(16)}` }],
            });
          }
        } else if (bridgeTarget !== BRIDGE_VAULT) {
          const waitForReceipt = async (txHash, maxWait = 60000) => {
            const start = Date.now();
            while (Date.now() - start < maxWait) {
              try {
                const receipt = await window.ethereum.request({ method: 'eth_getTransactionReceipt', params: [txHash] });
                if (receipt && receipt.blockNumber) {
                  return receipt;
                }
              } catch {
              }
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
            throw new Error('Transaction confirmation timeout');
          };

          const allowanceData = '0xdd62ed3e'
            + userAddr.slice(2).toLowerCase().padStart(64, '0')
            + bridgeTarget.slice(2).toLowerCase().padStart(64, '0');
          let currentAllowance = 0n;
          try {
            const allowanceResult = await provider.request({ method: 'eth_call', params: [{ to: tokenContract, data: allowanceData }, 'latest'] });
            currentAllowance = BigInt(allowanceResult || '0x0');
          } catch {
          }

          if (currentAllowance < rawAmount) {
            if (currentAllowance > 0n) {
              const approveZeroData = '0x095ea7b3'
                + bridgeTarget.slice(2).toLowerCase().padStart(64, '0')
                + '0'.padStart(64, '0');
              const zeroTx = await provider.request({
                method: 'eth_sendTransaction',
                params: [{ from: userAddr, to: tokenContract, data: approveZeroData }],
              });
              await waitForReceipt(zeroTx);
            }

            const approveData = '0x095ea7b3'
              + bridgeTarget.slice(2).toLowerCase().padStart(64, '0')
              + rawAmount.toString(16).padStart(64, '0');
            const approveTxHash = await provider.request({
              method: 'eth_sendTransaction',
              params: [{ from: userAddr, to: tokenContract, data: approveData }],
            });
            await waitForReceipt(approveTxHash);
          }

          const destBytes = new TextEncoder().encode(destAddr);
          const destHex = Array.from(destBytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
          const paddedLen = Math.ceil(destHex.length / 2 / 32) * 32;
          const depositTokenData = '0xa10d0960'
            + tokenContract.slice(2).toLowerCase().padStart(64, '0')
            + rawAmount.toString(16).padStart(64, '0')
            + '0000000000000000000000000000000000000000000000000000000000000060'
            + (destHex.length / 2).toString(16).padStart(64, '0')
            + destHex.padEnd(paddedLen * 2, '0');
          sourceTxHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: userAddr, to: bridgeTarget, data: depositTokenData }],
          });
        } else {
          const transferData = '0xa9059cbb'
            + BRIDGE_VAULT.slice(2).toLowerCase().padStart(64, '0')
            + rawAmount.toString(16).padStart(64, '0');
          sourceTxHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: userAddr, to: tokenContract, data: transferData }],
          });
        }

        let robotxTxHash = sourceTxHash;
        try {
          const result = await rpcCall('robotx_bridgeRelease', [{
            token: tokenSymbol,
            amount: rawAmount.toString(),
            destAddress: destAddr,
            sourceTxHash,
          }]);
          robotxTxHash = result?.txHash || result || sourceTxHash;
        } catch {
        }

        setSuccessData({ fromChain, toChain, fromToken, toToken, amount, txHash: robotxTxHash, sourceTxHash });
        setAmount('');
        setReceiveAmount('');
        setIsBridging(false);
      } catch (error) {
        setIsBridging(false);
        alert(`${t.btnBridge} failed: ${error.message}`);
      }
      return;
    }

    if (isRealWallet && isFromRobotx && !isToRobotx) {
      try {
        try {
          await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x524F58' }] });
        } catch {
        }

        const userAddr = rawHexAddress || walletAddress;
        if (fromToken?.symbol === 'RX') {
          throw new Error(t.rxNativeNotSupported);
        }

        let robotxTxHash;
        let rawAmountStr;

        if (fromToken?.symbol === 'RX') {
          const rawValue = Math.round(parseFloat(amount) * 1e6);
          rawAmountStr = rawValue.toString();
          robotxTxHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{ from: rawHexAddress || walletAddress, to: BRIDGE_VAULT, value: `0x${rawValue.toString(16)}` }],
          });
        } else {
          const decimals = fromToken?.decimals || 18;
          const rawAmount = BigInt(Math.round(parseFloat(amount) * (10 ** decimals)));
          rawAmountStr = rawAmount.toString();
          const transferData = '0xa9059cbb'
            + BRIDGE_VAULT.slice(2).toLowerCase().padStart(64, '0')
            + rawAmount.toString(16).padStart(64, '0');
          robotxTxHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{ from: rawHexAddress || walletAddress, to: fromToken.contract, data: transferData, value: '0x0' }],
          });
        }

        await waitForTx(robotxTxHash, 10);

        let extAddr = userAddr;
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts[0]) {
              extAddr = accounts[0];
            }
          } catch {
          }
        }

        if (!extAddr || !extAddr.startsWith('0x')) {
          throw new Error('Please connect MetaMask to get external chain address');
        }

        const relayerResult = await callRelayerReverse(robotxTxHash, toChain.chainId, extAddr, fromToken?.symbol, rawAmountStr);
        setSuccessData({
          fromChain,
          toChain,
          fromToken,
          toToken,
          amount,
          txHash: robotxTxHash,
          sourceTxHash: relayerResult.withdrawTx || robotxTxHash,
        });
        setAmount('');
        setReceiveAmount('');
        setIsBridging(false);
      } catch (error) {
        setIsBridging(false);
        alert(`${t.btnBridge} failed: ${error.message}`);
      }
      return;
    }

    if (isRealWallet && isFromRobotx && isToRobotx) {
      try {
        const nonce = accountInfo?.nonce || accountInfo?.Nonce || 0;
        const txHash = await rpcCall('robotx_sendRawTransaction', [{
          from: rawHexAddress || walletAddress,
          to: rawHexAddress || walletAddress,
          value: Math.round(parseFloat(amount) * 1e6),
          fee: 100000,
          nonce,
          type: 0,
        }]);
        await waitForTx(txHash, 5);
        setSuccessData({ fromChain, toChain, fromToken, toToken, amount, txHash });
        setAmount('');
        setReceiveAmount('');
        setIsBridging(false);
      } catch (error) {
        setIsBridging(false);
        alert(`${t.btnBridge} failed: ${error.message}`);
      }
      return;
    }

    setTimeout(() => {
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setSuccessData({ fromChain, toChain, fromToken, toToken, amount, txHash });
      setAmount('');
      setReceiveAmount('');
      setIsBridging(false);
    }, 2500);
  }, [accountInfo, amount, fromChain, fromToken, isRealWallet, rawHexAddress, t, toChain, toToken, walletAddress]);

  const handleConnect = useCallback(async (name) => {
    const provider = window.ethereum;
    if (name === 'MetaMask' || name === 'OKX Wallet' || name === 'Trust Wallet' || name === 'Coinbase Wallet') {
      if (!provider) {
        const urls = {
          MetaMask: 'https://metamask.io/download/',
          'OKX Wallet': 'https://www.okx.com/web3',
          'Trust Wallet': 'https://trustwallet.com/download',
          'Coinbase Wallet': 'https://www.coinbase.com/wallet/downloads',
        };
        if (window.confirm(`${t.walletNotDetected_prefix}${name}${t.walletNotDetected_suffix}`)) {
          window.open(urls[name] || 'https://metamask.io/download/', '_blank');
        }
        return;
      }

      try {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x524F58',
              chainName: 'ROBOTX Mainnet',
              nativeCurrency: { name: 'RX', symbol: 'RX', decimals: 6 },
              rpcUrls: [BRIDGE_RPC],
              blockExplorerUrls: ['https://explorer.robotxhub.io'],
            }],
          });
        } catch {
        }

        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          const hex = accounts[0];
          setRawHexAddress(hex);
          const rxAddr = await hexToRXAddress(hex);
          setWalletAddress(rxAddr);
          setConnectedWallet(name);
          setIsConnected(true);
          setIsRealWallet(true);
          setShowWalletModal(false);
        }
      } catch (error) {
        console.error(`${name}连接失败:`, error);
      }
      return;
    }

    setWalletAddress('RXTJnkP8m2Kj5vRq9YwBd4fG7hXi3NpQ6sMr');
    setConnectedWallet(name);
    setIsConnected(true);
    setIsRealWallet(false);
    setRxBalance(12580);
    setShowWalletModal(false);
  }, [t]);

  const getButtonState = () => {
    if (!isConnected) return { text: t.btnConnectWallet, style: 'wallet', action: () => setShowWalletModal(true), disabled: false };
    if (!toChain) return { text: t.btnSelectTarget, style: 'disabled', disabled: true };
    if (!amount || parseFloat(amount) <= 0) return { text: t.btnEnterAmount, style: 'disabled', disabled: true };

    const balance = getTokenBal(fromToken);
    if (parseFloat(amount) > balance) {
      return { text: `${fromToken.symbol} ${t.btnInsufficientBalance}`, style: 'error', disabled: true };
    }
    if (isBridging) return { text: t.btnConfirming, style: 'loading', disabled: true, loading: true };
    return { text: t.btnBridge, style: 'bridge', action: handleBridge, disabled: false };
  };

  const btn = getButtonState();
  const usdValue = amount && parseFloat(amount) > 0 ? parseFloat(amount) * getTokenPrice(fromToken) : 0;
  const receiveUsd = receiveAmount && parseFloat(receiveAmount) > 0 ? parseFloat(receiveAmount) * getTokenPrice(toToken) : 0;
  const feeRate = fromChain?.id === 'robotx' ? 0.05 : 0.01;
  const bridgeFee = amount && parseFloat(amount) > 0 ? parseFloat(amount) * feeRate : 0;
  const hasValidBridge = amount && parseFloat(amount) > 0 && toChain;

  return (
    <div data-theme={theme} className="min-h-screen w-full pb-20 md:pb-0" style={{ background: 'var(--t-bg)' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)', filter: 'blur(120px)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', filter: 'blur(120px)' }} />
      </div>

      <nav style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 20px', borderBottom: '1px solid rgba(30,41,59,0.3)', background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="flex items-center gap-1">
          <RobotXNavLogo />
          <div className="hidden md:flex items-center gap-0.5 ml-4">
            {NAV_TABS.map((tab) => (
              <NavTab key={tab.id} tab={tab} activeNav={activeNav} onSelect={setActiveNav} />
            ))}
          </div>
          <button className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors ml-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <MoreHorizontal size={22} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block"><ThemeSwitcher theme={theme} onChange={setTheme} /></div>
          <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-transparent hover:border-slate-700/50 transition-all" title={lang === 'zh' ? 'Switch to English' : '切换到中文'}>
            <Globe size={14} className="text-cyan-400" />
            <span className="text-white text-xs font-medium">{lang === 'zh' ? 'EN' : '中'}</span>
          </button>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-slate-800/40 text-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
            <span className="text-slate-500">{t.blockLabel}</span>
            <span className="text-green-400 font-semibold">{chainData.blockHeight ? `#${chainData.blockHeight.toLocaleString()}` : '...'}</span>
          </div>
          <div className="hidden md:block"><NavChainSelector t={t} /></div>

          {isConnected ? (
            <div className="relative">
              <button onClick={() => setShowWalletDropdown(!showWalletDropdown)} className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-transparent hover:border-slate-700/50 transition-all">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#0a0a0f]" />
                </div>
                <span className="hidden md:inline text-white text-sm font-medium font-mono">{walletAddress ? (walletAddress.length > 12 ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}` : walletAddress) : 'RXa7F2...8e3D'}</span>
                <ChevronDown size={14} className={`hidden md:inline text-slate-400 transition-transform ${showWalletDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showWalletDropdown && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setShowWalletDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[280px] max-w-[calc(100vw-32px)] rounded-xl border shadow-2xl z-[91] overflow-hidden" style={{ background: 'var(--card-bg, #16161e)', borderColor: 'var(--border, #2a2a3a)' }}>
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border, #2a2a3a)' }}>
                      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted, #888)' }}>RX Address</div>
                      <div className="text-xs font-mono break-all" style={{ color: 'var(--text, #fff)' }}>{walletAddress || 'RXa7F2...8e3D'}</div>
                      {rawHexAddress && <div className="text-[10px] font-mono mt-1 break-all" style={{ color: 'var(--text-muted, #666)' }}>{rawHexAddress}</div>}
                    </div>
                    <button onClick={() => { const address = walletAddress || rawHexAddress; navigator.clipboard.writeText(address).then(() => { setCopiedAddress(true); setTimeout(() => setCopiedAddress(false), 2000); }); }} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left" style={{ color: 'var(--text, #fff)' }}>
                      <Copy size={16} className={copiedAddress ? 'text-green-400' : 'text-cyan-400'} />
                      <span className="text-sm">{copiedAddress ? (lang === 'zh' ? '已复制' : 'Copied!') : (lang === 'zh' ? '复制RX地址' : 'Copy RX Address')}</span>
                    </button>
                    <button onClick={() => { setIsConnected(false); setConnectedWallet(''); setIsRealWallet(false); setWalletAddress(''); setRawHexAddress(''); setRxBalance(0); setTokenBalances({}); setAccountInfo(null); setExternalNativeBalance(0); setExternalTokenBalances({}); setShowWalletDropdown(false); }} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-left" style={{ borderTop: '1px solid var(--border, #2a2a3a)' }}>
                      <LogOut size={16} className="text-red-400" />
                      <span className="text-sm text-red-400">{lang === 'zh' ? '断开连接' : 'Disconnect'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => setShowWalletModal(true)} className="px-5 py-2 rounded-full bg-cyan-500/15 text-cyan-400 font-semibold text-sm border border-cyan-500/25 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all">
              {t.connectBtn}
            </button>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[80]" style={{ position: 'fixed' }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 w-[280px] h-full bg-[#12121a] border-r border-slate-800/60 p-5 overflow-y-auto" style={{ animation: 'fadeInScale 0.2s ease-out' }}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-bold text-lg">ROBOTX</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400">x</button>
            </div>
            {NAV_TABS.map((tab) => (
              <div key={tab.id} className="mb-2">
                <button onClick={() => { setActiveNav(tab.id); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${activeNav === tab.id ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}>
                  {tab.label}
                </button>
                {tab.items && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {tab.items.map((item, index) => (
                      <button key={index} onClick={() => { setActiveNav(tab.id); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-colors">
                        <span className={item.active ? 'text-cyan-400' : ''}>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center gap-2 px-4">
              <ThemeSwitcher theme={theme} onChange={setTheme} />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/60">
              <button onClick={() => { setLang(lang === 'zh' ? 'en' : 'zh'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                <Globe size={16} className="text-cyan-400" />
                {lang === 'zh' ? 'English' : '中文'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 pt-6 md:pt-10 px-3">
        <div className="w-full max-w-[30.5rem] mx-auto">
          <div className="mb-4 rounded-2xl overflow-hidden border border-[#2e2e2e]/50 bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] p-3 flex items-center gap-3 cursor-pointer hover:border-[#404040] transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
              <Zap size={16} className="text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{t.bannerTitle}</div>
              <div className="text-[#6c6c6c] text-[11px]">{t.bannerDesc}</div>
            </div>
            <ChevronRight size={16} className="text-[#6c6c6c] flex-shrink-0 group-hover:text-[#b0b0b0] transition-colors" />
          </div>

          <div className="flex justify-between items-center mb-2 px-1">
            <div className="flex items-center bg-[#2e2e2e] rounded-full">
              <span className="px-3 py-1 text-white text-base font-medium">Bridge</span>
            </div>
            <div className="flex items-center gap-0 text-sm relative">
              <div className="w-9 h-9 flex items-center justify-center bg-[#2e2e2e] hover:bg-[#404040] p-1.5 rounded-xl cursor-pointer ml-3 transition-colors">
                <Clock size={20} className="text-[#b0b0b0]" />
              </div>
              <div onClick={() => setShowSettings(!showSettings)} className="w-9 h-9 flex items-center justify-center bg-[#2e2e2e] hover:bg-[#404040] p-1.5 rounded-xl cursor-pointer ml-3 transition-colors relative z-[1]">
                <Settings size={20} className="text-[#b0b0b0]" />
              </div>
              {showSettings && <SettingsPanel slippage={slippage} setSlippage={setSlippage} deadline={deadline} setDeadline={setDeadline} onClose={() => setShowSettings(false)} t={t} />}
            </div>
          </div>

          <div className="w-full bg-[#1a1a1a] rounded-2xl border border-transparent hover:border-[#6c6c6c] transition-colors group/sell">
            <div className="px-4 py-3 flex items-center justify-between">
              <button onClick={() => setShowFromChainSelector(true)} className="flex items-center gap-2 rounded-xl py-2.5 px-3 bg-[#2e2e2e] whitespace-nowrap cursor-pointer">
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
                    {[25, 50, 75, 100].map((pct) => (
                      <div key={pct} onClick={() => setAmount(String((getTokenBal(fromToken) * pct) / 100))} className="cursor-pointer font-medium text-xs text-white bg-[#1a1a1a] border rounded-full border-[#404040] py-1 px-1.5 hover:bg-[#2e2e2e] transition-all duration-150">
                        {pct === 100 ? 'MAX' : `${pct}%`}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full flex mt-1.5 justify-between items-center">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <input value={amount} onChange={(event) => { if (/^[0-9]*\.?[0-9]*$/.test(event.target.value)) setAmount(event.target.value); }} placeholder="0" style={{ userSelect: 'all' }} className={`text-left placeholder:text-[#b0b0b0] font-medium truncate transition-all duration-75 w-full bg-transparent outline-none text-[#fafafa] ${amount.length > 16 ? 'text-xl' : amount.length > 10 ? 'text-2xl' : 'text-4xl'}`} />
                </div>
                <div className="flex-shrink-0 ml-2">
                  <div onClick={() => setShowFromTokenSelector(true)} className="flex items-center px-3 rounded-full cursor-pointer bg-[#1a1a1a] hover:bg-[#404040] py-2 font-medium border border-[#404040] transition-all duration-300">
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

              <div className="cursor-pointer absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 hover:scale-95 transition-all duration-200" onClick={handleFlip}>
                <FlipArrowIcon />
              </div>
            </div>
          </div>

          <div className="w-full bg-[#1a1a1a] rounded-2xl border border-transparent hover:border-[#6c6c6c] transition-colors mt-1">
            <div className="px-4 py-3 flex items-center justify-between">
              <button onClick={() => setShowToChainSelector(true)} className="flex items-center gap-2 rounded-xl py-2.5 px-3 bg-[#2e2e2e] whitespace-nowrap cursor-pointer">
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
                  <div className={`text-left font-medium truncate transition-all duration-75 ${(receiveAmount && parseFloat(receiveAmount) > 0) ? 'text-[#fafafa]' : 'text-[#b0b0b0]'} ${(receiveAmount || '0').length > 16 ? 'text-xl' : (receiveAmount || '0').length > 10 ? 'text-2xl' : 'text-4xl'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {receiveAmount || '0'}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {toChain ? (
                    <div className="flex items-center px-3 rounded-full bg-[#1a1a1a] py-2 font-medium border border-[#404040] transition-all duration-300">
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
                    <div onClick={() => setShowToChainSelector(true)} className="flex items-center px-3 rounded-full cursor-pointer bg-[#1a1a1a] hover:bg-[#404040] py-2 font-medium border border-[#404040] transition-all duration-300">
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

          <div className="mt-3">
            <button onClick={btn.action} disabled={btn.disabled} className={`w-full h-14 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${btn.style === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed' : btn.style === 'disabled' ? 'bg-[#2e2e2e] text-[#6c6c6c] cursor-not-allowed' : btn.style === 'loading' ? 'bg-[#2e2e2e] text-[#6c6c6c] cursor-wait' : btn.style === 'wallet' ? 'bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]' : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:brightness-110'}`}>
              {btn.loading && <RotateCcw size={16} className="animate-spin" />}
              {btn.text}
            </button>
          </div>

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
                  <span className="text-[#b0b0b0]">{bridgeFee.toFixed(6)} {fromToken.symbol} <span className="text-[#6c6c6c]">({fromChain?.id === 'robotx' ? '5' : '1'}%)</span></span>
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

          <div className="flex flex-col items-center mt-8 mb-4 select-none">
            <div className="flex items-center gap-1.5 text-[10px] text-[#6c6c6c]/50 font-mono">
              <Shield size={9} />Powered by ROBOTX Bridge Protocol v2.0
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-[#1e1e1e]" style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
          {[{ key: 'bridge', label: t.mobileNavBridge, icon: ArrowRightLeft }].map((tab) => {
            const Icon = tab.icon;
            const active = activeNav === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveNav(tab.key)} className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-150 ${active ? 'text-cyan-400' : 'text-[#6c6c6c]'}`}>
                <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
                <span className={`text-[10px] font-medium ${active ? 'text-cyan-400' : 'text-[#6c6c6c]'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>

      <FloatingSupportButton />

      {showFromChainSelector && <ChainSelectorModal currentChain={fromChain} excludeChainId={toChain?.chainId} onSelect={setFromChain} onClose={() => setShowFromChainSelector(false)} t={t} />}
      {showToChainSelector && <ChainSelectorModal currentChain={toChain} excludeChainId={fromChain?.chainId} onSelect={setToChain} onClose={() => setShowToChainSelector(false)} t={t} />}
      {showFromTokenSelector && <TokenSelectorModal currentToken={fromToken} fromChain={fromChain} toChain={toChain} onSelect={(token) => { setFromToken(token); setToToken(token); setShowFromTokenSelector(false); }} onClose={() => setShowFromTokenSelector(false)} t={t} isRealWallet={isRealWallet} />}
      {showToTokenSelector && <TokenSelectorModal currentToken={toToken} fromChain={fromChain} toChain={toChain} onSelect={(token) => { setToToken(token); setShowToTokenSelector(false); }} onClose={() => setShowToTokenSelector(false)} t={t} isRealWallet={isRealWallet} />}
      {showWalletModal && <WalletModal onConnect={handleConnect} onClose={() => setShowWalletModal(false)} t={t} />}
      {successData && <SuccessModal {...successData} onClose={() => setSuccessData(null)} t={t} />}
    </div>
  );
};

export default BridgeInterface;