"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Bell, ChevronRight, Wallet } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useToast } from "@/components/ui/toast";
import type { TabId } from "@/app/[locale]/page";

const periods = [
  { days: 1, apy: 0.15, label: "1D" },
  { days: 15, apy: 0.3, label: "15D" },
  { days: 30, apy: 0.5, label: "30D" },
  { days: 90, apy: 0.73, label: "90D" },
];

export function StakeTab({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const t = useTranslations("stake");
  const { showToast } = useToast();
  const [counter, setCounter] = useState(1250.598);
  const [amount, setAmount] = useState("10000");
  const [selectedPeriod, setSelectedPeriod] = useState(2); // index 2 = 30D

  useEffect(() => {
    const id = setInterval(() => {
      setCounter((c) => c + 0.000125);
    }, 100);
    return () => clearInterval(id);
  }, []);

  const period = periods[selectedPeriod];
  const amt = parseFloat(amount) || 0;
  const totalEst = (amt * (period.apy / 100) * period.days).toFixed(2);

  const handlePeriodClick = useCallback((idx: number) => {
    setSelectedPeriod(idx);
  }, []);

  const handleStake = () => {
    showToast(t("stakeSuccess"));
  };

  return (
    <div className="animate-slide-up">
      {/* Network Total Staked */}
      <div className="text-center py-2 pb-6">
        <div className="text-xs text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-3 font-semibold">
          {t("networkStaked")}
        </div>
        <div className="font-rajdhani text-[46px] font-bold tabular-nums leading-tight">
          {counter.toFixed(6)}
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
          <div className="text-brandLight dark:text-primary text-xs font-bold px-2 py-1 bg-brandLight/10 dark:bg-primary/10 rounded-md cursor-pointer active:scale-95 transition-transform">
            MAX
          </div>
        </div>
        <div className="flex justify-end items-center gap-1 text-[11px] text-light-textMuted dark:text-dark-textMuted mb-5">
          <Wallet size={11} />
          <span>{t("walletBalance")}: <span className="font-rajdhani font-semibold">56,830.00 RX</span></span>
        </div>

        <div className="text-xs text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-3 font-semibold">
          {t("lockPeriod")}
        </div>
        <div className="flex gap-2 mb-5">
          {periods.map((p, i) => (
            <button
              key={p.days}
              onClick={() => handlePeriodClick(i)}
              className={`flex-1 py-2.5 text-center rounded-lg cursor-pointer transition-all duration-300 border ${
                selectedPeriod === i
                  ? "bg-brandLight/10 dark:bg-primary/10 border-brandLight dark:border-primary text-brandLight dark:text-primary"
                  : "bg-black/5 dark:bg-white/5 border-light-border dark:border-dark-border text-light-textMuted dark:text-dark-textMuted"
              }`}
            >
              <div className="font-rajdhani text-[15px] font-bold">{p.label}</div>
              <div className="text-[10px]">{p.apy.toFixed(2)}%</div>
            </button>
          ))}
        </div>

        <div className="flex justify-between text-[13px] mb-2.5 text-light-textMuted dark:text-dark-textMuted">
          <span>{t("dailyYield")}</span>
          <span className="font-medium text-successLight dark:text-success">
            {period.apy.toFixed(2)}%
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
          className="w-full bg-gradient-to-r from-brandLight to-brandLight dark:from-primaryDark dark:to-primary text-white border-none py-4 rounded-xl text-[15px] font-bold cursor-pointer transition-transform duration-200 shadow-glow active:scale-[0.97] mt-4"
        >
          {t("confirmStake")}
        </button>
      </GlassPanel>

      {/* Announcement Banner */}
      <button
        onClick={() => onNavigate("news")}
        className="w-full bg-black/5 dark:bg-white/5 border border-light-border dark:border-dark-border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 active:scale-[0.98]"
      >
        <Bell size={18} className="text-brandLight dark:text-primary" />
        <span className="flex-1 text-[13px] whitespace-nowrap overflow-hidden text-ellipsis text-light-textMain dark:text-dark-textMain text-left">
          {t("announcementBanner")}
        </span>
        <ChevronRight size={14} className="text-light-textMuted dark:text-dark-textMuted" />
      </button>
    </div>
  );
}
