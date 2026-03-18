"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, BadgeDollarSign, FilePlus2, FileWarning, Megaphone, RefreshCw, ShieldAlert } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useToast } from "@/components/ui/toast";
import { useWallet } from "@/components/providers/wallet-provider";
import {
  adminCloseOrder,
  adminCreateOrder,
  emergencyWithdraw,
  formatRxAmount,
  fundPool,
  readAllOrders,
  readAnnouncements,
  readStakingSnapshot,
  writeAnnouncement,
  ZERO_ADDRESS,
  type RxStakingAnnouncement,
  type RxStakingOrderView,
  type RxStakingSnapshot,
} from "@/lib/contracts/rx-staking-client";
import { appConfig } from "@/lib/web3/config";
import { isAddress } from "ethers";

export function AdminTab({ onBack }: { onBack: () => void }) {
  const t = useTranslations("admin");
  const common = useTranslations("mine");
  const locale = useLocale();
  const { showToast } = useToast();
  const { account, hasInjectedWallet, isTargetChain, connectWallet, switchToTargetChain } = useWallet();

  const [snapshot, setSnapshot] = useState<RxStakingSnapshot | null>(null);
  const [orders, setOrders] = useState<RxStakingOrderView[]>([]);
  const [announcements, setAnnouncements] = useState<RxStakingAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [poolAmount, setPoolAmount] = useState("1000");
  const [withdrawAmount, setWithdrawAmount] = useState("100");
  const [adminOrderUser, setAdminOrderUser] = useState("");
  const [adminOrderAmount, setAdminOrderAmount] = useState("3000");
  const [adminOrderDays, setAdminOrderDays] = useState("30");
  const [announcementId, setAnnouncementId] = useState<string>("");
  const [announcementLocale, setAnnouncementLocale] = useState(locale);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementSummary, setAnnouncementSummary] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementDeleted, setAnnouncementDeleted] = useState(false);
  const [isBusy, setIsBusy] = useState<string | null>(null);

  const loadAdminData = async () => {
    if (!appConfig.isContractConfigured) {
      return;
    }

    setIsLoading(true);
    try {
      const [nextSnapshot, nextOrders, nextAnnouncements] = await Promise.all([
        readStakingSnapshot(account),
        readAllOrders(),
        readAnnouncements(),
      ]);

      setSnapshot(nextSnapshot);
      setOrders(nextOrders);
      setAnnouncements(nextAnnouncements.sort((left, right) => Number(right.updatedAt - left.updatedAt)));
    } catch {
      showToast(t("loadFailed"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminData();
  }, [account]);

  const isOwner = Boolean(
    account && snapshot?.owner && account.toLowerCase() === snapshot.owner.toLowerCase(),
  );

  const activeOrders = useMemo(() => orders.filter((order) => !order.settled), [orders]);
  const visibleAnnouncements = useMemo(() => announcements.filter((announcement) => !announcement.deleted), [announcements]);

  const ensureReady = async () => {
    if (!appConfig.isContractConfigured) {
      showToast(common("contractUnavailable"), "error");
      return false;
    }

    if (!hasInjectedWallet) {
      showToast(common("walletMissing"), "error");
      return false;
    }

    if (!account) {
      await connectWallet();
      return false;
    }

    if (!isTargetChain) {
      await switchToTargetChain();
      showToast(common("switchNetworkFirst"), "error");
      return false;
    }

    if (!isOwner) {
      showToast(t("ownerOnly"), "error");
      return false;
    }

    return true;
  };

  const runAdminAction = async (key: string, action: () => Promise<void>, successMessage: string) => {
    if (!(await ensureReady())) {
      return;
    }

    setIsBusy(key);
    try {
      await action();
      await loadAdminData();
      showToast(successMessage);
    } catch {
      showToast(t("actionFailed"), "error");
    } finally {
      setIsBusy(null);
    }
  };

  const fillAnnouncementForm = (announcement: RxStakingAnnouncement) => {
    setAnnouncementId(announcement.id.toString());
    setAnnouncementLocale(announcement.locale);
    setAnnouncementTitle(announcement.title);
    setAnnouncementSummary(announcement.summary);
    setAnnouncementContent(announcement.content);
    setAnnouncementDeleted(announcement.deleted);
  };

  const resetAnnouncementForm = () => {
    setAnnouncementId("");
    setAnnouncementLocale(locale);
    setAnnouncementTitle("");
    setAnnouncementSummary("");
    setAnnouncementContent("");
    setAnnouncementDeleted(false);
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-4 mb-5">
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <span className="font-semibold">{t("title")}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: t("poolBalance"), value: `${formatRxAmount(snapshot?.contractBalance ?? 0n, 2)} RX` },
          { label: t("activeStaked"), value: `${formatRxAmount(snapshot?.totalActiveStaked ?? 0n, 2)} RX` },
          { label: t("allOrders"), value: orders.length.toString() },
          { label: t("announcements"), value: visibleAnnouncements.length.toString() },
        ].map((card) => (
          <GlassPanel key={card.label} className="!mb-0 !p-4">
            <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-1 font-semibold">{card.label}</div>
            <div className="font-rajdhani text-[22px] font-bold text-brandLight dark:text-primary">{card.value}</div>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold flex items-center gap-2"><BadgeDollarSign size={16} /> {t("poolOps")}</div>
          <button onClick={() => void loadAdminData()} className="text-xs text-light-textMuted dark:text-dark-textMuted inline-flex items-center gap-1">
            <RefreshCw size={12} /> {t("refresh")}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-black/5 dark:bg-white/5 p-3">
            <div className="text-xs mb-2">{t("fundPool")}</div>
            <input value={poolAmount} onChange={(event) => setPoolAmount(event.target.value)} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-sm mb-2" />
            <button
              onClick={() => void runAdminAction("fund", () => fundPool(poolAmount), t("fundSuccess"))}
              disabled={isBusy === "fund"}
              className="w-full rounded-lg bg-brandLight dark:bg-primary px-3 py-2 text-sm font-semibold text-white"
            >
              {t("fundAction")}
            </button>
          </div>
          <div className="rounded-xl bg-black/5 dark:bg-white/5 p-3">
            <div className="text-xs mb-2">{t("emergencyWithdraw")}</div>
            <input value={withdrawAmount} onChange={(event) => setWithdrawAmount(event.target.value)} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-sm mb-2" />
            <button
              onClick={() => void runAdminAction("withdraw", () => emergencyWithdraw(withdrawAmount), t("withdrawSuccess"))}
              disabled={isBusy === "withdraw"}
              className="w-full rounded-lg bg-black/70 px-3 py-2 text-sm font-semibold text-white dark:bg-white/20"
            >
              {t("withdrawAction")}
            </button>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel>
        <div className="text-sm font-semibold flex items-center gap-2 mb-3"><FilePlus2 size={16} /> {t("orderOps")}</div>
        <div className="grid grid-cols-1 gap-3">
          <input value={adminOrderUser} onChange={(event) => setAdminOrderUser(event.target.value)} placeholder={t("userAddress")} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input value={adminOrderAmount} onChange={(event) => setAdminOrderAmount(event.target.value)} placeholder={t("orderAmount")} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-sm" />
            <input value={adminOrderDays} onChange={(event) => setAdminOrderDays(event.target.value)} placeholder={t("orderDays")} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-sm" />
          </div>
          <button
            onClick={() => void runAdminAction(
              "create-order",
              async () => {
                if (!isAddress(adminOrderUser)) {
                  throw new Error("invalid address");
                }
                await adminCreateOrder(adminOrderUser, adminOrderAmount, Number(adminOrderDays));
              },
              t("createOrderSuccess"),
            )}
            disabled={isBusy === "create-order"}
            className="w-full rounded-lg bg-brandLight dark:bg-primary px-3 py-2 text-sm font-semibold text-white"
          >
            {t("createOrderAction")}
          </button>
        </div>
      </GlassPanel>

      <GlassPanel>
        <div className="text-sm font-semibold flex items-center gap-2 mb-3"><ShieldAlert size={16} /> {t("announcementOps")}</div>
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={announcementId} onChange={(event) => setAnnouncementId(event.target.value)} placeholder={t("announcementId")} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-sm" />
            <input value={announcementLocale} onChange={(event) => setAnnouncementLocale(event.target.value)} placeholder={t("announcementLocale")} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-sm" />
          </div>
          <input value={announcementTitle} onChange={(event) => setAnnouncementTitle(event.target.value)} placeholder={t("announcementTitle")} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-sm" />
          <input value={announcementSummary} onChange={(event) => setAnnouncementSummary(event.target.value)} placeholder={t("announcementSummary")} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-sm" />
          <textarea value={announcementContent} onChange={(event) => setAnnouncementContent(event.target.value)} placeholder={t("announcementContent")} rows={7} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={announcementDeleted} onChange={(event) => setAnnouncementDeleted(event.target.checked)} />
            {t("markDeleted")}
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => void runAdminAction(
                "write-announcement",
                () => writeAnnouncement({
                  announcementId: announcementId ? BigInt(announcementId) : undefined,
                  locale: announcementLocale,
                  title: announcementTitle,
                  summary: announcementSummary,
                  content: announcementContent,
                  deleted: announcementDeleted,
                }),
                t("announcementSuccess"),
              )}
              disabled={isBusy === "write-announcement"}
              className="flex-1 rounded-lg bg-brandLight dark:bg-primary px-3 py-2 text-sm font-semibold text-white"
            >
              {t("writeAnnouncementAction")}
            </button>
            <button onClick={resetAnnouncementForm} className="rounded-lg bg-black/5 dark:bg-white/5 px-3 py-2 text-sm font-semibold">
              {t("resetForm")}
            </button>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel>
        <div className="text-sm font-semibold flex items-center gap-2 mb-3"><Megaphone size={16} /> {t("announcementList")}</div>
        {announcements.length === 0 ? (
          <div className="text-sm text-light-textMuted dark:text-dark-textMuted">{t("noAnnouncements")}</div>
        ) : (
          announcements.map((announcement) => (
            <button key={announcement.id.toString()} onClick={() => fillAnnouncementForm(announcement)} className="w-full text-left py-3 border-b border-light-border dark:border-dark-border last:border-none">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{announcement.title || t("untitled")}</div>
                  <div className="text-xs text-light-textMuted dark:text-dark-textMuted mt-1">{announcement.locale} · #{announcement.id.toString()}</div>
                </div>
                <div className="text-xs text-light-textMuted dark:text-dark-textMuted">{announcement.deleted ? t("deleted") : t("active")}</div>
              </div>
            </button>
          ))
        )}
      </GlassPanel>

      <GlassPanel>
        <div className="text-sm font-semibold flex items-center gap-2 mb-3"><FileWarning size={16} /> {t("orderList")}</div>
        {orders.length === 0 ? (
          <div className="text-sm text-light-textMuted dark:text-dark-textMuted">{t("noOrders")}</div>
        ) : (
          orders.map((order) => (
            <div key={order.id.toString()} className="py-3 border-b border-light-border dark:border-dark-border last:border-none">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold break-all">#{order.id.toString()} · {order.user}</div>
                  <div className="text-xs text-light-textMuted dark:text-dark-textMuted mt-1">
                    {t("orderPrincipal")}: {formatRxAmount(order.principalAmount, 2)} RX · {t("orderAmount")}: {formatRxAmount(order.amountIn, 2)} RX
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-light-textMuted dark:text-dark-textMuted">{order.settled ? t("settled") : t("active")}</div>
                  {!order.settled ? (
                    <button
                      onClick={() => void runAdminAction(`close-${order.id.toString()}`, () => adminCloseOrder(order.id), t("closeOrderSuccess"))}
                      disabled={isBusy === `close-${order.id.toString()}`}
                      className="mt-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white/20"
                    >
                      {t("closeOrderAction")}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </GlassPanel>
    </div>
  );
}