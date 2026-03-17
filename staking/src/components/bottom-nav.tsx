"use client";

import { useTranslations } from "next-intl";
import { Layers, Network, Newspaper, User } from "lucide-react";
import type { TabId } from "@/app/[locale]/page";

const tabs: { id: TabId; icon: typeof Layers; labelKey: string }[] = [
  { id: "stake", icon: Layers, labelKey: "stake" },
  { id: "team", icon: Network, labelKey: "team" },
  { id: "news", icon: Newspaper, labelKey: "news" },
  { id: "mine", icon: User, labelKey: "mine" },
];

export function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}) {
  const t = useTranslations("nav");

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-[80px] bg-light-nav dark:bg-dark-nav backdrop-blur-xl border-t border-light-border dark:border-dark-border flex justify-around items-center z-10 pb-2 transition-colors duration-500">
      {tabs.map(({ id, icon: Icon, labelKey }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium w-1/4 cursor-pointer transition-colors ${
              active
                ? "text-brandLight dark:text-primary"
                : "text-light-textMuted dark:text-dark-textMuted hover:text-brandLight dark:hover:text-primary"
            }`}
          >
            <Icon
              size={20}
              className={`transition-transform duration-300 ${active ? "-translate-y-1" : ""}`}
            />
            <span>{t(labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
