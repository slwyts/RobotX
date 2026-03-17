"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { GlassPanel } from "@/components/ui/glass-panel";

export function TeamTab() {
  const t = useTranslations("team");
  const [view, setView] = useState<"direct" | "community">("direct");

  return (
    <div className="animate-slide-up">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <GlassPanel className="!mb-0 !p-4">
          <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-1 font-semibold">
            {t("myLevel")}
          </div>
          <div className="font-rajdhani text-[22px] font-bold text-brandLight dark:text-primary">
            V2 Leader
          </div>
        </GlassPanel>
        <GlassPanel className="!mb-0 !p-4">
          <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-1 font-semibold">
            {t("totalVol")}
          </div>
          <div className="font-rajdhani text-[22px] font-bold">854,200</div>
        </GlassPanel>
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
            {t("direct")} (3)
          </button>
          <button
            onClick={() => setView("community")}
            className={`flex-1 text-center py-2 text-[13px] font-semibold rounded-lg cursor-pointer transition-all duration-300 ${
              view === "community"
                ? "bg-light-panel dark:bg-dark-panel text-light-textMain dark:text-dark-textMain shadow-sm"
                : "text-light-textMuted dark:text-dark-textMuted hover:text-light-textMain dark:hover:text-dark-textMain"
            }`}
          >
            {t("community")} (15)
          </button>
        </div>

        {/* Direct view */}
        {view === "direct" && (
          <div>
            {[
              { addr: "0x1A2...9bC3", date: "Oct 24, 2023", amount: "50,000 RX", level: "V1 Level" },
              { addr: "0x8F0...2a11", date: "Oct 20, 2023", amount: "12,000 RX", level: "Unranked" },
            ].map((m) => (
              <div
                key={m.addr}
                className="flex justify-between items-center py-3.5 border-b border-light-border dark:border-dark-border last:border-none"
              >
                <div>
                  <div className="font-rajdhani text-[15px] font-bold">{m.addr}</div>
                  <div className="text-[11px] text-light-textMuted dark:text-dark-textMuted mt-0.5">
                    {t("joined")}: {m.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-rajdhani text-[15px] font-bold">{m.amount}</div>
                  <div className="text-[10px] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-light-textMuted dark:text-dark-textMuted inline-block mt-1">
                    {m.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Community view */}
        {view === "community" && (
          <div>
            <div className="flex justify-between items-center py-3.5 border-b border-light-border dark:border-dark-border last:border-none">
              <div className="flex gap-3 items-center">
                <div className="text-sm text-light-textMuted dark:text-dark-textMuted font-bold w-4">
                  #1
                </div>
                <div>
                  <div className="font-rajdhani text-[15px] font-bold">0x99C...3dE1</div>
                  <div className="text-[10px] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-light-textMuted dark:text-dark-textMuted inline-block mt-1">
                    L2 {t("downline")}
                  </div>
                </div>
              </div>
              <div className="font-rajdhani text-[15px] font-bold text-successLight dark:text-success">
                320,000 RX
              </div>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
