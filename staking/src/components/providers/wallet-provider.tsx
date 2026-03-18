"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BrowserProvider, formatEther } from "ethers";
import { appConfig } from "@/lib/web3/config";
import { getChainById, type SupportedChain } from "@/lib/web3/chains";

type EthereumRequest = {
  method: string;
  params?: unknown[] | Record<string, unknown>;
};

type InjectedProvider = {
  request: (request: EthereumRequest) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
};

type WalletContextValue = {
  account: string | null;
  chainId: number | null;
  currentChain: SupportedChain | null;
  targetChain: SupportedChain;
  nativeBalance: string;
  hasInjectedWallet: boolean;
  isConnecting: boolean;
  isTargetChain: boolean;
  connectWallet: () => Promise<void>;
  switchToTargetChain: () => Promise<void>;
  refreshWalletState: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function getInjectedProvider() {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as typeof window & { ethereum?: InjectedProvider }).ethereum ?? null;
}

function toHexChainId(chainId: number) {
  return `0x${chainId.toString(16)}`;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [nativeBalance, setNativeBalance] = useState("0.0000");
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasInjectedWallet, setHasInjectedWallet] = useState(false);

  const targetChain = appConfig.targetChain;
  const currentChain = chainId === null ? null : getChainById(chainId);
  const isTargetChain = chainId === targetChain.chainId;

  const refreshWalletState = useCallback(async () => {
    const ethereum = getInjectedProvider();
    setHasInjectedWallet(ethereum !== null);

    if (!ethereum) {
      setAccount(null);
      setChainId(null);
      setNativeBalance("0.0000");
      return;
    }

    const [accounts, currentChainHex] = await Promise.all([
      ethereum.request({ method: "eth_accounts" }) as Promise<string[]>,
      ethereum.request({ method: "eth_chainId" }) as Promise<string>,
    ]);

    const nextAccount = accounts[0] ?? null;
    const nextChainId = Number.parseInt(currentChainHex, 16);

    setAccount(nextAccount);
    setChainId(nextChainId);

    if (!nextAccount) {
      setNativeBalance("0.0000");
      return;
    }

    const provider = new BrowserProvider(ethereum as never);
    const balance = await provider.getBalance(nextAccount);
    setNativeBalance(Number(formatEther(balance)).toFixed(4));
  }, []);

  const switchToTargetChain = useCallback(async () => {
    const ethereum = getInjectedProvider();
    if (!ethereum) {
      return;
    }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHexChainId(targetChain.chainId) }],
      });
    } catch (error) {
      const switchError = error as { code?: number };
      if (switchError.code !== 4902) {
        throw error;
      }

      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: toHexChainId(targetChain.chainId),
            chainName: targetChain.name,
            nativeCurrency: targetChain.nativeCurrency,
            rpcUrls: [targetChain.rpcUrl],
            blockExplorerUrls: targetChain.explorerUrl ? [targetChain.explorerUrl] : [],
          },
        ],
      });
    }

    await refreshWalletState();
  }, [refreshWalletState, targetChain]);

  const connectWallet = useCallback(async () => {
    const ethereum = getInjectedProvider();
    if (!ethereum) {
      return;
    }

    setIsConnecting(true);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      await refreshWalletState();
      if (!isTargetChain) {
        await switchToTargetChain();
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isTargetChain, refreshWalletState, switchToTargetChain]);

  useEffect(() => {
    void refreshWalletState();
  }, [refreshWalletState]);

  useEffect(() => {
    const ethereum = getInjectedProvider();
    if (!ethereum?.on || !ethereum.removeListener) {
      return;
    }

    const handleAccountsChanged = () => {
      void refreshWalletState();
    };
    const handleChainChanged = () => {
      void refreshWalletState();
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [refreshWalletState]);

  const value = useMemo<WalletContextValue>(() => ({
    account,
    chainId,
    currentChain,
    targetChain,
    nativeBalance,
    hasInjectedWallet,
    isConnecting,
    isTargetChain,
    connectWallet,
    switchToTargetChain,
    refreshWalletState,
  }), [
    account,
    chainId,
    connectWallet,
    currentChain,
    hasInjectedWallet,
    isConnecting,
    isTargetChain,
    nativeBalance,
    refreshWalletState,
    switchToTargetChain,
    targetChain,
  ]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }

  return context;
}