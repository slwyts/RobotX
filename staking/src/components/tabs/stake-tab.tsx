"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bell, ChevronRight, Wallet } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useToast } from "@/components/ui/toast";
import { useWallet } from "@/components/providers/wallet-provider";
import { appConfig } from "@/lib/web3/config";
import { formatRxAmount, readAnnouncements, readContractBalance, readStakingSnapshot, stakeRx, ZERO_ADDRESS, type RxStakingAnnouncement } from "@/lib/contracts/rx-staking-client";
import type { TabId } from "@/app/[locale]/page";

const STAKE_LOCK_DAYS = 30;
const DAILY_YIELD = 0.5;
const FRONTEND_MIN_STAKE = 3000;

export function StakeTab({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const t = useTranslations("stake");
  const locale = useLocale();
  const { showToast } = useToast();
  const { account, nativeBalance, targetChain, isTargetChain, hasInjectedWallet, connectWallet, switchToTargetChain } = useWallet();
  const [networkStaked, setNetworkStaked] = useState("0.0000");
  const [amount, setAmount] = useState("3000");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState<RxStakingAnnouncement[]>([]);

  useEffect(() => {
    let active = true;

    const loadBalance = async () => {
      if (!appConfig.isContractConfigured) {
        return;
      }

      try {
        const balance = await readContractBalance();
        if (active) {
          setNetworkStaked(formatRxAmount(balance, 4));
        }
      } catch {
        if (active) {
          setNetworkStaked("0.0000");
        }
      }
    };

    void loadBalance();
    const id = setInterval(() => {
      void loadBalance();
    }, 15000);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadAnnouncements = async () => {
      try {
        const nextAnnouncements = await readAnnouncements();
        if (active) {
          setAnnouncements(
            nextAnnouncements
              .filter((announcement) => !announcement.deleted && announcement.locale === locale)
              .sort((left, right) => Number(right.updatedAt - left.updatedAt)),
          );
        }
      } catch {
        if (active) {
          setAnnouncements([]);
        }
      }
    };

    void loadAnnouncements();

    return () => {
      active = false;
    };
  }, [locale]);

  const latestAnnouncement = useMemo(() => announcements[0] ?? null, [announcements]);

  const amt = parseFloat(amount) || 0;
  const totalEst = (amt * 0.98 * 0.15).toFixed(2);

  const handleStake = async () => {
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

    if (!Number.isFinite(amt) || amt < FRONTEND_MIN_STAKE) {
      showToast(t("minStake"), "error");
      return;
    }

    const snapshot = await readStakingSnapshot(account);
    const inviter = snapshot.account?.inviter ?? ZERO_ADDRESS;
    if (inviter === ZERO_ADDRESS) {
      showToast(t("bindInviterFirst"), "error");
      onNavigate("mine");
      return;
    }

    setIsSubmitting(true);
    try {
      await stakeRx(STAKE_LOCK_DAYS, amount);
      const balance = await readContractBalance();
      setNetworkStaked(formatRxAmount(balance, 4));
      showToast(t("stakeSuccess"));
    } catch {
      showToast(t("stakeFailed"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-slide-up">
      {/* Network Total Staked */}
      <div className="text-center py-2 pb-6">
        <div className="text-xs text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-3 font-semibold">
          {t("networkStaked")}
        </div>
        <div className="font-rajdhani text-[46px] font-bold tabular-nums leading-tight">
          {networkStaked}
        </div>
      </div>

      {/* Stake Form */}
      <GlassPanel>
        <div className="text-xs text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-3 font-semibold">
          {t("stakeAmount")}
        </div>
        <div className="bg-light-input dark:bg-dark-input rounded-xl p-3 px-4 flex items-center border border-light-border dark:border-dark-border mb-1.5 transition-colors">
          <input
            type="number"
            placeholder={t("minPlaceholder")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent border-none text-light-textMain dark:text-dark-textMain text-[22px] font-semibold outline-none font-rajdhani w-full placeholder:text-light-textMuted/50 dark:placeholder:text-dark-textMuted/50"
          />
          <button
            type="button"
            onClick={() => setAmount(nativeBalance)}
            className="text-brandLight dark:text-primary text-xs font-bold px-2 py-1 bg-brandLight/10 dark:bg-primary/10 rounded-md cursor-pointer active:scale-95 transition-transform"
          >
            MAX
          </button>
        </div>
        <div className="flex justify-end items-center gap-1 text-[11px] text-light-textMuted dark:text-dark-textMuted mb-5">
          <Wallet size={11} />
          <span>{t("walletBalance")}: <span className="font-rajdhani font-semibold">{account ? `${nativeBalance} ${targetChain.nativeCurrency.symbol}` : t("notConnected")}</span></span>
        </div>

        <div className="text-xs text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-3 font-semibold">
          {t("lockPeriod")}
        </div>
        <div className="flex gap-2 mb-5">
          <button
            className="flex-1 py-2.5 text-center rounded-lg transition-all duration-300 border bg-brandLight/10 dark:bg-primary/10 border-brandLight dark:border-primary text-brandLight dark:text-primary"
          >
            <div className="font-rajdhani text-[15px] font-bold">30D</div>
            <div className="text-[10px]">15.00%</div>
          </button>
        </div>

        <div className="flex justify-between text-[13px] mb-2.5 text-light-textMuted dark:text-dark-textMuted">
          <span>{t("dailyYield")}</span>
          <span className="font-medium text-successLight dark:text-success">
            {DAILY_YIELD.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between text-[13px] mb-2.5 text-light-textMuted dark:text-dark-textMuted">
          <span>{t("entryFee")}</span>
          <span className="font-medium text-dangerLight dark:text-danger">- 2.00%</span>
        </div>
        <div className="flex justify-between text-[13px] mt-2 pt-3 border-t border-dashed border-light-border dark:border-dark-border text-light-textMuted dark:text-dark-textMuted items-center">
          <span>{t("estReturns")}</span>
          <span className="font-rajdhani text-base font-bold text-brandLight dark:text-primary">
            {totalEst} RX
          </span>
        </div>
        <button
          onClick={handleStake}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-brandLight to-brandLight dark:from-primaryDark dark:to-primary text-white border-none py-4 rounded-xl text-[15px] font-bold cursor-pointer transition-transform duration-200 shadow-glow active:scale-[0.97] mt-4"
        >
          {isSubmitting ? t("txSubmitted") : t("confirmStake")}
        </button>
      </GlassPanel>

      {/* Announcement Banner */}
      {latestAnnouncement ? (
        <button
          onClick={() => onNavigate("news")}
          className="w-full bg-black/5 dark:bg-white/5 border border-light-border dark:border-dark-border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 active:scale-[0.98]"
        >
          <Bell size={18} className="text-brandLight dark:text-primary" />
          <span className="flex-1 text-[13px] whitespace-nowrap overflow-hidden text-ellipsis text-light-textMain dark:text-dark-textMain text-left">
            {latestAnnouncement.title}
          </span>
          <ChevronRight size={14} className="text-light-textMuted dark:text-dark-textMuted" />
        </button>
      ) : null}
    </div>
  );
}
