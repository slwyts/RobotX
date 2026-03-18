"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useWallet } from "@/components/providers/wallet-provider";
import {
  formatRxAmount,
  readMemberNetwork,
  readStakingSnapshot,
  ZERO_ADDRESS,
  type RxStakingMemberProfile,
  type RxStakingSnapshot,
} from "@/lib/contracts/rx-staking-client";

export function TeamTab() {
  const t = useTranslations("team");
  const { account } = useWallet();
  const [view, setView] = useState<"direct" | "community">("direct");
  const [snapshot, setSnapshot] = useState<RxStakingSnapshot | null>(null);
  const [directMembers, setDirectMembers] = useState<RxStakingMemberProfile[]>([]);
  const [communityMembers, setCommunityMembers] = useState<RxStakingMemberProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const [nextSnapshot, nextNetwork] = await Promise.all([
          readStakingSnapshot(account),
          account ? readMemberNetwork(account) : Promise.resolve({ directProfiles: [], communityProfiles: [] }),
        ]);
        if (active) {
          setSnapshot(nextSnapshot);
          setDirectMembers(nextNetwork.directProfiles);
          setCommunityMembers(nextNetwork.communityProfiles);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();
    const id = setInterval(() => {
      void load();
    }, 15000);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [account]);

  const accountView = snapshot?.account ?? null;
  const activeOrders = useMemo(
    () => snapshot?.orders.filter((order) => !order.settled) ?? [],
    [snapshot?.orders],
  );
  const pendingStaticReward = useMemo(
    () => activeOrders.reduce((sum, order) => sum + order.pendingStaticReward, 0n),
    [activeOrders],
  );
  const effectiveInviter = accountView?.inviter && accountView.inviter !== ZERO_ADDRESS ? accountView.inviter : null;
  const teamLabel = accountView ? `V${accountView.teamLevel.toString()}` : "V0";
  const rewardRate = accountView ? `${(Number(accountView.teamRewardBps) / 100).toFixed(2)}%` : "0.00%";
  const totalVol = accountView ? formatRxAmount(accountView.teamBusiness, 2) : "0.00";
  const directCount = directMembers.length.toString();
  const communityCount = communityMembers.length.toString();
  const activeOrderCount = activeOrders.length.toString();
  const totalActiveStaked = snapshot ? formatRxAmount(snapshot.totalActiveStaked, 2) : "0.00";
  const poolBalance = snapshot ? formatRxAmount(snapshot.contractBalance, 2) : "0.00";
  const pendingRewardText = formatRxAmount(pendingStaticReward, 2);
  const inviterText = effectiveInviter ? `${effectiveInviter.slice(0, 6)}...${effectiveInviter.slice(-4)}` : t("noInviter");

  const statCards = [
    { label: t("myLevel"), value: teamLabel, accent: true },
    { label: t("totalVol"), value: totalVol },
    { label: t("rewardRate"), value: rewardRate },
    { label: t("boundInviter"), value: inviterText },
    { label: t("teamBusiness"), value: `${totalVol} RX` },
    { label: t("poolBalance"), value: `${poolBalance} RX` },
    // { label: t("networkActiveStaked"), value: `${totalActiveStaked} RX` },
    // { label: t("teamOrders"), value: activeOrderCount },
    // { label: t("pendingStaticReward"), value: `${pendingRewardText} RX`, accent: true },
  ];

  const renderMemberRow = (member: RxStakingMemberProfile, showGeneration: boolean) => {
    const activeStake = member.orders
      .filter((order) => !order.settled)
      .reduce((total, order) => total + order.principalAmount, 0n);
    const firstOrder = member.orders.at(-1);
    const subLabel = firstOrder
      ? `${t("joined")}: ${new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(Number(firstOrder.startAt) * 1000)}`
      : t("noOrders");
    const badge = showGeneration ? `L${member.generation} ${t("downline")}` : `V${member.account.teamLevel.toString()}`;

    return (
      <div
        key={`${member.address}-${member.generation}`}
        className="flex justify-between items-center py-3.5 border-b border-light-border dark:border-dark-border last:border-none gap-3"
      >
        <div>
          <div className="font-rajdhani text-[15px] font-bold">{`${member.address.slice(0, 6)}...${member.address.slice(-4)}`}</div>
          <div className="text-[11px] text-light-textMuted dark:text-dark-textMuted mt-0.5">
            {subLabel}
          </div>
        </div>
        <div className="text-right">
          <div className="font-rajdhani text-[15px] font-bold">{formatRxAmount(activeStake, 2)} RX</div>
          <div className="text-[10px] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-light-textMuted dark:text-dark-textMuted inline-block mt-1">
            {badge}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-slide-up">
      <div className="grid grid-cols-2 gap-3 mb-4">
        {statCards.map((card) => (
          <GlassPanel key={card.label} className="!mb-0 !p-4">
            <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-1 font-semibold">
              {card.label}
            </div>
            <div className={`font-rajdhani text-[22px] font-bold ${card.accent ? "text-brandLight dark:text-primary" : ""}`}>
              {card.value}
            </div>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel className="!p-4">
        {/* Segment switcher */}
        <div className="flex bg-light-input dark:bg-dark-input rounded-xl p-1 mb-4">
          <button
            onClick={() => setView("direct")}
            className={`flex-1 text-center py-2 text-[13px] font-semibold rounded-lg cursor-pointer transition-all duration-300 ${
              view === "direct"
                ? "bg-light-panel dark:bg-dark-panel text-light-textMain dark:text-dark-textMain shadow-sm"
                : "text-light-textMuted dark:text-dark-textMuted hover:text-light-textMain dark:hover:text-dark-textMain"
            }`}
          >
            {t("direct")} ({directCount})
          </button>
          <button
            onClick={() => setView("community")}
            className={`flex-1 text-center py-2 text-[13px] font-semibold rounded-lg cursor-pointer transition-all duration-300 ${
              view === "community"
                ? "bg-light-panel dark:bg-dark-panel text-light-textMain dark:text-dark-textMain shadow-sm"
                : "text-light-textMuted dark:text-dark-textMuted hover:text-light-textMain dark:hover:text-dark-textMain"
            }`}
          >
            {t("community")} ({communityCount})
          </button>
        </div>

        {/* Direct view */}
        {view === "direct" && (
          <div>
            <div>
              {directMembers.length === 0 ? (
                <div className="rounded-xl border border-light-border dark:border-dark-border p-3 text-[11px] text-light-textMuted dark:text-dark-textMuted">
                  {isLoading ? t("loading") : t("noDirectMembers")}
                </div>
              ) : (
                directMembers.map((member) => renderMemberRow(member, false))
              )}
            </div>
          </div>
        )}

        {/* Community view */}
        {view === "community" && (
          <div>
            <div>
              {communityMembers.length === 0 ? (
                <div className="rounded-xl border border-light-border dark:border-dark-border p-3 text-[11px] text-light-textMuted dark:text-dark-textMuted">
                  {isLoading ? t("loading") : t("noCommunityMembers")}
                </div>
              ) : (
                communityMembers.map((member) => renderMemberRow(member, true))
              )}
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
