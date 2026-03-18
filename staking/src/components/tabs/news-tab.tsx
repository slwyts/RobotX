"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { GlassPanel } from "@/components/ui/glass-panel";
import { readAnnouncements, type RxStakingAnnouncement } from "@/lib/contracts/rx-staking-client";

export function NewsTab() {
  const t = useTranslations("news");
  const locale = useLocale();
  const [detail, setDetail] = useState<RxStakingAnnouncement | null>(null);
  const [announcements, setAnnouncements] = useState<RxStakingAnnouncement[]>([]);

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

  const formatAnnouncementDate = (item: RxStakingAnnouncement) => {
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(Number(item.updatedAt) * 1000);
  };

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
          {formatAnnouncementDate(detail)}
        </div>
        <h2 className="text-[22px] font-bold mb-5 leading-tight">{detail.title}</h2>
        <div className="text-light-textMuted dark:text-dark-textMuted leading-relaxed text-[15px]">
          <ReactMarkdown>{detail.content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <GlassPanel className="!py-2">
        {announcements.length === 0 ? (
          <div className="py-4 text-[13px] text-light-textMuted dark:text-dark-textMuted">
            {t("noAnnouncements")}
          </div>
        ) : (
          announcements.map((item) => (
            <button
              key={item.id.toString()}
              onClick={() => setDetail(item)}
              className="w-full text-left py-4 border-b border-light-border dark:border-dark-border last:border-none cursor-pointer group"
            >
              <div className="font-rajdhani text-[11px] text-light-textMuted dark:text-dark-textMuted mb-1 group-hover:text-brandLight dark:group-hover:text-primary transition-colors">
                {formatAnnouncementDate(item)}
              </div>
              <div className="text-[15px] font-semibold mb-1.5">{item.title}</div>
              <div className="text-[13px] text-light-textMuted dark:text-dark-textMuted line-clamp-2">
                {item.summary}
              </div>
            </button>
          ))
        )}
      </GlassPanel>
    </div>
  );
}
