"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Megaphone,
  Shield,
  Link as LinkIcon,
  Globe,
  Search,
  FileText,
  ChevronRight,
  CheckCircle,
  CircleDollarSign,
  Copy,
  X,
  Twitter,
  MessageCircle,
  Send,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useToast } from "@/components/ui/toast";
import { useWallet } from "@/components/providers/wallet-provider";
import {
  ADMIN_UPLINE_SENTINEL,
  bindUpline,
  formatRxAmount,
  readAccountView,
  readStakingSnapshot,
  settleOrder,
  type RxStakingAccountView,
  type RxStakingOrderView,
  ZERO_ADDRESS,
} from "@/lib/contracts/rx-staking-client";
import { appConfig } from "@/lib/web3/config";
import { isAddress } from "ethers";

const socialLinks = [
  { icon: Twitter, href: "#" },
  { icon: Send, href: "#" },
  { icon: MessageCircle, href: "#" },
];

export function MineTab({ onOpenAdmin, onSettled, refreshSignal }: { onOpenAdmin: () => void; onSettled?: () => void; refreshSignal?: number }) {
  const t = useTranslations("mine");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { account, isTargetChain, hasInjectedWallet, connectWallet, switchToTargetChain, refreshWalletState } = useWallet();
  const [uplineInput, setUplineInput] = useState("");
  const [boundAddress, setBoundAddress] = useState<string | null>(null);
  const [contractOwner, setContractOwner] = useState<string | null>(null);
  const [accountView, setAccountView] = useState<RxStakingAccountView | null>(null);
  const [orders, setOrders] = useState<RxStakingOrderView[]>([]);
  const [isBinding, setIsBinding] = useState(false);
  const [settlingOrderId, setSettlingOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoBindAttempted, setAutoBindAttempted] = useState(false);
  const [copyFailLink, setCopyFailLink] = useState<string | null>(null);
  const snapshotFetchedAt = useRef(Date.now() / 1000);
  const lastCopyAt = useRef(0);
  const [nowSec, setNowSec] = useState(() => Date.now() / 1000);

  const menuItems = [
    { icon: Globe, labelKey: "officialWebsite", href: "https://www.robotxhub.ai/" },
    { icon: Search, labelKey: "blockExplorer", href: appConfig.targetChain.explorerUrl ?? appConfig.targetChain.rpcUrl },
    {
      icon: FileText,
      labelKey: "smartContract",
      href: appConfig.targetChain.explorerUrl && appConfig.contractAddress !== "0x0000000000000000000000000000000000000000"
        ? `${appConfig.targetChain.explorerUrl}/address/${appConfig.contractAddress}`
        : appConfig.targetChain.rpcUrl,
    },
  ];

  const loadSnapshot = async () => {
    if (!appConfig.isContractConfigured) {
      return;
    }

    setIsLoading(true);
    try {
      const snapshot = await readStakingSnapshot(account);
      setContractOwner(snapshot.owner);
      setAccountView(snapshot.account);
      setOrders(snapshot.orders);
      setBoundAddress(snapshot.account?.inviter && snapshot.account.inviter !== "0x0000000000000000000000000000000000000000" ? snapshot.account.inviter : null);
      snapshotFetchedAt.current = Date.now() / 1000;
    } catch {
      showToast(t("loadFailed"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSnapshot();
  }, [account, refreshSignal]);

  useEffect(() => {
    const id = setInterval(() => setNowSec(Date.now() / 1000), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const inviteRef = searchParams.get("ref");
    if (!inviteRef || boundAddress || !isAddress(inviteRef) || inviteRef === account) {
      return;
    }

    setUplineInput(inviteRef);
  }, [account, boundAddress, searchParams]);

  useEffect(() => {
    const inviteRef = searchParams.get("ref");
    if (!inviteRef || !isAddress(inviteRef) || autoBindAttempted || boundAddress || isBinding) {
      return;
    }

    const autoBind = async () => {
      if (!hasInjectedWallet) {
        return;
      }

      if (!account) {
        await connectWallet();
        return;
      }

      if (!isTargetChain) {
        await switchToTargetChain();
        return;
      }

      if (inviteRef.toLowerCase() === account.toLowerCase()) {
        return;
      }

      setAutoBindAttempted(true);
      setUplineInput(inviteRef);
      await handleBind(inviteRef, true);
    };

    void autoBind();
  }, [
    account,
    autoBindAttempted,
    boundAddress,
    connectWallet,
    contractOwner,
    hasInjectedWallet,
    isBinding,
    isTargetChain,
    refreshWalletState,
    searchParams,
    showToast,
    switchToTargetChain,
    t,
  ]);

  // kept for non-display uses if any; live display uses liveTotalRx below
  const totalAssetValue = useMemo(() => {
    return orders.reduce((total, order) => {
      if (order.settled) {
        return total;
      }

      const grossValue = order.principalAmount + order.pendingStaticReward;
      return total + grossValue;
    }, 0n);
  }, [orders]);

  // real-time interpolated total (updates every second)
  const liveTotalRx = orders.reduce((acc, order) => {
    if (order.settled) return acc;
    const endAt = Number(order.endAt);
    const extraSec = Math.max(0, Math.min(nowSec, endAt) - Math.min(snapshotFetchedAt.current, endAt));
    const liveExtra = (Number(order.principalAmount) / 1e18) * 0.15 / 2592000 * extraSec;
    return acc + Number(order.principalAmount) / 1e18 + Number(order.pendingStaticReward) / 1e18 + liveExtra;
  }, 0);

  const isAdminAccount = Boolean(
    account && contractOwner && account.toLowerCase() === contractOwner.toLowerCase(),
  );

  const handleBind = async (overrideInviter?: string, isAutoTriggered = false) => {
    if (!appConfig.isContractConfigured) {
      showToast(t("contractUnavailable"), "error");
      return false;
    }

    if (!hasInjectedWallet) {
      showToast(t("walletMissing"), "error");
      return false;
    }

    if (!account) {
      await connectWallet();
      return false;
    }

    if (!isTargetChain) {
      await switchToTargetChain();
      showToast(t("switchNetworkFirst"), "error");
      return false;
    }

    const nextInviter = isAdminAccount ? ADMIN_UPLINE_SENTINEL : (overrideInviter ?? uplineInput).trim();
    if (!isAdminAccount && !isAddress(nextInviter)) {
      showToast(t("invalidAddress"), "error");
      return false;
    }

    if (!isAdminAccount && account && nextInviter.toLowerCase() === account.toLowerCase()) {
      showToast(t("invalidAddress"), "error");
      return false;
    }

    if (!isAdminAccount && nextInviter !== ZERO_ADDRESS) {
      const ownerAddress = contractOwner ?? (await readStakingSnapshot()).owner;
      const inviterAccount = await readAccountView(nextInviter);
      if (nextInviter.toLowerCase() !== ownerAddress.toLowerCase() && inviterAccount.inviter === ZERO_ADDRESS) {
        showToast(t("uplineMustBeBound"), "error");
        return false;
      }
    }

    setIsBinding(true);
    try {
      await bindUpline(nextInviter);
      await Promise.all([refreshWalletState(), loadSnapshot()]);
      clearInviteRefParam();
      showToast(isAutoTriggered ? t("autoBindSuccess") : isAdminAccount ? t("adminSpecialUpline") : t("bindSuccess"));
      return true;
    } catch {
      showToast(t("bindFailed"), "error");
      return false;
    } finally {
      setIsBinding(false);
    }
  };

  const handleSettle = async (orderId: bigint) => {
    if (!appConfig.isContractConfigured) {
      showToast(t("contractUnavailable"), "error");
      return;
    }

    if (!hasInjectedWallet) {
      showToast(t("walletMissing"), "error");
      return;
    }

    if (!account) {
      await connectWallet();
      return;
    }

    if (!isTargetChain) {
      await switchToTargetChain();
      showToast(t("switchNetworkFirst"), "error");
      return;
    }

    setSettlingOrderId(orderId.toString());
    try {
      await settleOrder(orderId);
      await Promise.all([refreshWalletState(), loadSnapshot()]);
      onSettled?.();
      showToast(t("settleSuccess"));
    } catch {
      showToast(t("settleFailed"), "error");
    } finally {
      setSettlingOrderId(null);
    }
  };

  const handleCopyInviteLink = async () => {
    if (!account) {
      showToast(t("connectWalletFirst"), "error");
      return;
    }

    const inviteLink = `${window.location.origin}${pathname}?ref=${account}`;
    const now = Date.now();
    const forceModal = now - lastCopyAt.current < 3000;
    lastCopyAt.current = now;

    if (forceModal) {
      setCopyFailLink(inviteLink);
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      showToast(t("inviteLinkCopied"));
    } catch {
      setCopyFailLink(inviteLink);
    }
  };

  const clearInviteRefParam = () => {
    if (!searchParams.get("ref")) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("ref");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  const formatAddress = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`;

  const formatTimestamp = (value: bigint) => new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(Number(value) * 1000);

  const formatRemaining = (value: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(value) - now;
    if (remaining <= 0) {
      return `0 ${t("days")}`;
    }

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    if (days > 0) {
      return `${days} ${t("days")} ${hours}h`;
    }

    return `${Math.max(hours, 1)}h`;
  };

  return (
    <div className="animate-slide-up">
      {/* Manual copy modal — rendered via portal to escape overflow-hidden */}
      {copyFailLink ? createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md px-6" onClick={() => setCopyFailLink(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">{t("manualCopyTitle")}</span>
              <button onClick={() => setCopyFailLink(null)} className="text-light-textMuted dark:text-dark-textMuted"><X size={16} /></button>
            </div>
            <p className="text-xs text-light-textMuted dark:text-dark-textMuted mb-3">{t("manualCopyHint")}</p>
            <textarea
              readOnly
              value={copyFailLink}
              rows={3}
              onFocus={(e) => e.target.select()}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-xs font-mono break-all outline-none resize-none"
            />
            <button
              onClick={() => setCopyFailLink(null)}
              className="mt-4 w-full rounded-xl bg-brandLight dark:bg-primary py-2.5 text-sm font-semibold text-white"
            >
              {t("close")}
            </button>
          </div>
        </div>,
        document.body,
      ) : null}
      {/* Total Asset */}
      <div className="text-center py-2 pb-5">
        <div className="text-xs text-light-textMuted dark:text-dark-textMuted mb-1 font-medium">
          {t("totalAsset")}
        </div>
        <div className="font-rajdhani text-[38px] font-bold">
          {liveTotalRx.toFixed(4)}<span className="text-xl text-light-textMuted dark:text-dark-textMuted font-medium"> RX</span>
        </div>
      </div>

      {/* Marquee */}
      <div className="bg-brandLight/5 dark:bg-primary/5 border border-light-border dark:border-dark-border rounded-xl p-2.5 px-4 flex items-center gap-2.5 mb-5">
        <Megaphone size={16} className="text-brandLight dark:text-primary shrink-0" />
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <span className="inline-block text-[13px] text-light-textMuted dark:text-dark-textMuted animate-marquee">
            {t("marquee")}
          </span>
        </div>
      </div>

      {/* Bind Upline */}
      <GlassPanel className="!p-4">
        <div className="text-xs text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-2 font-semibold">
          {t("inviter")}
        </div>
        {!boundAddress ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={isAdminAccount ? ADMIN_UPLINE_SENTINEL : t("enterUpline")}
              value={uplineInput}
              onChange={(e) => setUplineInput(e.target.value)}
              disabled={isAdminAccount || isBinding}
              className="flex-1 bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border rounded-lg px-3 py-2 text-sm outline-none text-light-textMain dark:text-dark-textMain placeholder:text-light-textMuted/50 dark:placeholder:text-dark-textMuted/50 focus:border-brandLight dark:focus:border-primary transition-colors"
            />
            <button
              onClick={() => {
                void handleBind();
              }}
              disabled={isBinding}
              className="bg-gradient-to-r from-brandLight to-brandLight dark:from-primaryDark dark:to-primary text-white px-5 rounded-lg text-sm font-bold active:scale-95 transition-transform cursor-pointer"
            >
              {isBinding ? t("binding") : t("bind")}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 bg-successLight/10 dark:bg-success/10 p-2.5 rounded-lg border border-successLight/30 dark:border-success/30">
            <LinkIcon size={14} className="text-successLight dark:text-success" />
            <span className="text-sm font-mono text-successLight dark:text-success font-semibold">
              {t("bound")}: {formatAddress(boundAddress)}
            </span>
          </div>
        )}
        {isAdminAccount && !boundAddress ? (
          <div className="mt-2 text-[11px] text-brandLight dark:text-primary">
            {t("adminSpecialUpline")}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => void handleCopyInviteLink()}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-black/5 px-3 py-2 text-sm font-medium text-light-textMain transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-dark-textMain dark:hover:bg-white/10"
        >
          <Copy size={14} />
          {t("copyInviteLink")}
        </button>
      </GlassPanel>

      {/* Orders */}
      <div className="text-xs text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-3 font-semibold ml-1 mt-6 flex justify-between items-center">
        {t("myOrders")}
      </div>
      {orders.length === 0 ? (
        <div className="bg-light-input dark:bg-dark-input rounded-xl p-4 mb-3 border border-light-border dark:border-dark-border text-sm text-light-textMuted dark:text-dark-textMuted">
          {isLoading ? t("loading") : t("noOrders")}
        </div>
      ) : (
        orders.map((order) => {
          const endAt = Number(order.endAt);
          const extraSec = order.settled ? 0 : Math.max(0, Math.min(nowSec, endAt) - Math.min(snapshotFetchedAt.current, endAt));
          const liveExtra = (Number(order.principalAmount) / 1e18) * 0.15 / 2592000 * extraSec;
          const liveCurrentValue = Number(order.principalAmount) / 1e18 + Number(order.pendingStaticReward) / 1e18 + liveExtra;
          const liveEarned = liveCurrentValue - Number(order.amountIn) / 1e18;

          return (
            <div key={order.id.toString()} className="bg-light-input dark:bg-dark-input rounded-xl p-4 mb-3 border-l-4 border-brandLight dark:border-primary shadow-sm">
              <div className="flex justify-between items-center mb-2 gap-3">
                <span className="text-xs text-brandLight dark:text-primary font-bold flex items-center gap-1.5">
                  <CheckCircle size={16} /> {order.settled ? t("settled") : t("active")} (30 {t("days")})
                </span>
                <span className="font-rajdhani text-xs text-light-textMuted dark:text-dark-textMuted">
                  #{order.id.toString()} · {formatTimestamp(order.startAt)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                  <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted mb-0.5">
                    {t("initialStake")}
                  </div>
                  <div className="font-rajdhani text-sm font-bold">{formatRxAmount(order.amountIn, 2)} RX</div>
                </div>
                <div className="bg-brandLight/10 dark:bg-primary/10 border border-brandLight/20 dark:border-primary/20 p-2 rounded-lg">
                  <div className="text-[10px] text-brandLight dark:text-primary mb-0.5 font-medium">
                    {t("currentValue")}
                  </div>
                  <div className="font-rajdhani text-sm font-bold text-brandLight dark:text-primary">
                    {liveCurrentValue.toFixed(4)} RX
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="text-[11px] text-light-textMuted dark:text-dark-textMuted flex justify-between font-medium flex-1">
                  <span>
                    {t("unlocksIn")}: {order.settled ? t("settled") : formatRemaining(order.endAt)}
                  </span>
                  <span className="text-successLight dark:text-success">
                    +{Math.max(0, liveEarned).toFixed(4)} RX
                  </span>
                </div>
                {!order.settled ? (
                  <button
                    onClick={() => void handleSettle(order.id)}
                    disabled={settlingOrderId === order.id.toString()}
                    className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-brandLight/10 dark:bg-primary/10 px-3 py-2 text-xs font-semibold text-brandLight dark:text-primary"
                  >
                    <CircleDollarSign size={14} />
                    {settlingOrderId === order.id.toString() ? t("settling") : t("settle")}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })
      )}

      {/* Ecosystem menu */}
      <GlassPanel className="!p-2 !mt-5">
        <div className="flex flex-col gap-1">
          {isAdminAccount ? (
            <button
              onClick={onOpenAdmin}
              className="flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] border border-transparent hover:border-light-border dark:hover:border-dark-border"
            >
              <div className="flex items-center gap-3 text-sm font-medium">
                <Shield size={16} className="text-light-textMuted dark:text-dark-textMuted" />
                {t("adminPanel")}
              </div>
              <ChevronRight size={14} className="text-light-textMuted dark:text-dark-textMuted" />
            </button>
          ) : null}
          {menuItems.map(({ icon: Icon, labelKey, href }) => (
            <a
              key={labelKey}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] border border-transparent hover:border-light-border dark:hover:border-dark-border"
            >
              <div className="flex items-center gap-3 text-sm font-medium">
                <Icon size={16} className="text-light-textMuted dark:text-dark-textMuted" />
                {t(labelKey)}
              </div>
              <ChevronRight size={14} className="text-light-textMuted dark:text-dark-textMuted" />
            </a>
          ))}
        </div>
      </GlassPanel>

      {/* Social links */}
      <div className="flex justify-center gap-5 mt-8 mb-4">
        {socialLinks.map(({ icon: Icon, href }, i) => (
          <a
            key={i}
            href={href}
            className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-light-textMuted dark:text-dark-textMuted hover:bg-brandLight dark:hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>

      <div className="text-center mb-5 text-[10px] text-light-textMuted dark:text-dark-textMuted font-medium leading-relaxed">
        {t("version")} · {appConfig.targetChain.shortName}
      </div>
    </div>
  );
}
