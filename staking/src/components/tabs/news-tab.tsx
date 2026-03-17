"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";

interface NewsItem {
  date: string;
  title: string;
  summary: string;
  body: string;
}

export function NewsTab() {
  const t = useTranslations("news");
  const items = t.raw("items") as NewsItem[];
  const [detail, setDetail] = useState<NewsItem | null>(null);

  if (detail) {
    return (
      <div className="animate-slide-up">
        <div className="flex items-center gap-4 mb-5">
          <button
            onClick={() => setDetail(null)}
            className="p-1 active:scale-90 transition-transform cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold">{t("announcement")}</span>
        </div>
        <div className="font-rajdhani text-brandLight dark:text-primary mb-2.5 font-bold">
          {detail.date}
        </div>
        <h2 className="text-[22px] font-bold mb-5 leading-tight">{detail.title}</h2>
        <div className="text-light-textMuted dark:text-dark-textMuted leading-relaxed text-[15px]">
          {detail.body}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <GlassPanel className="!py-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setDetail(item)}
            className="w-full text-left py-4 border-b border-light-border dark:border-dark-border last:border-none cursor-pointer group"
          >
            <div className="font-rajdhani text-[11px] text-light-textMuted dark:text-dark-textMuted mb-1 group-hover:text-brandLight dark:group-hover:text-primary transition-colors">
              {item.date}
            </div>
            <div className="text-[15px] font-semibold mb-1.5">{item.title}</div>
            <div className="text-[13px] text-light-textMuted dark:text-dark-textMuted line-clamp-2">
              {item.summary}
            </div>
          </button>
        ))}
      </GlassPanel>
    </div>
  );
}
