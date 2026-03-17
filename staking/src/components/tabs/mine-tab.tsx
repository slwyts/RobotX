"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Megaphone,
  Link as LinkIcon,
  Globe,
  Search,
  FileText,
  ChevronRight,
  CheckCircle,
  Twitter,
  MessageCircle,
  Send,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useToast } from "@/components/ui/toast";

const menuItems = [
  { icon: Globe, labelKey: "officialWebsite", href: "https://www.robotxhub.ai/" },
  { icon: Search, labelKey: "blockExplorer", href: "https://scan.robotxhub.ai/" },
  { icon: FileText, labelKey: "smartContract", href: "https://scan.robotxhub.ai/address/0x0000000000000000000000000000000000000000" },
];

const socialLinks = [
  { icon: Twitter, href: "#" },
  { icon: Send, href: "#" },
  { icon: MessageCircle, href: "#" },
];

export function MineTab() {
  const t = useTranslations("mine");
  const { showToast } = useToast();
  const [uplineInput, setUplineInput] = useState("");
  const [boundAddress, setBoundAddress] = useState<string | null>(null);

  const handleBind = () => {
    if (uplineInput.length > 10) {
      const addr = uplineInput.substring(0, 6) + "..." + uplineInput.substring(uplineInput.length - 4);
      setBoundAddress(addr);
      showToast(t("bindSuccess"));
    } else {
      showToast(t("invalidAddress"), "error");
    }
  };

  return (
    <div className="animate-slide-up">
      {/* Total Asset */}
      <div className="text-center py-2 pb-5">
        <div className="text-xs text-light-textMuted dark:text-dark-textMuted mb-1 font-medium">
          {t("totalAsset")}
        </div>
        <div className="font-rajdhani text-[38px] font-bold">
          $ 48,555<span className="text-xl text-light-textMuted dark:text-dark-textMuted font-medium">.00</span>
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
      <GlassPanel className="!border-dashed !border-brandLight dark:!border-primary !bg-brandLight/5 dark:!bg-primary/5 !p-4">
        <div className="text-xs text-brandLight dark:text-primary uppercase tracking-wider mb-2 font-semibold">
          {t("inviter")}
        </div>
        {!boundAddress ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t("enterUpline")}
              value={uplineInput}
              onChange={(e) => setUplineInput(e.target.value)}
              className="flex-1 bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border rounded-lg px-3 py-2 text-sm outline-none text-light-textMain dark:text-dark-textMain placeholder:text-light-textMuted/50 dark:placeholder:text-dark-textMuted/50 focus:border-brandLight dark:focus:border-primary transition-colors"
            />
            <button
              onClick={handleBind}
              className="bg-gradient-to-r from-brandLight to-brandLight dark:from-primaryDark dark:to-primary text-white px-5 rounded-lg text-sm font-bold active:scale-95 transition-transform cursor-pointer"
            >
              {t("bind")}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 bg-successLight/10 dark:bg-success/10 p-2.5 rounded-lg border border-successLight/30 dark:border-success/30">
            <LinkIcon size={14} className="text-successLight dark:text-success" />
            <span className="text-sm font-mono text-successLight dark:text-success font-semibold">
              {t("bound")}: {boundAddress}
            </span>
          </div>
        )}
      </GlassPanel>

      {/* Orders */}
      <div className="text-xs text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-3 font-semibold ml-1 mt-6 flex justify-between items-center">
        {t("myOrders")}
      </div>
      <div className="bg-light-input dark:bg-dark-input rounded-xl p-4 mb-3 border-l-4 border-brandLight dark:border-primary shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-brandLight dark:text-primary font-bold flex items-center gap-1.5">
            <CheckCircle size={16} /> {t("active")} (30 {t("days")})
          </span>
          <span className="font-rajdhani text-xs text-light-textMuted dark:text-dark-textMuted">
            Oct 20, 2023
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-black/5 dark:bg-white/5 p-2 rounded-lg">
            <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted mb-0.5">
              {t("initialStake")}
            </div>
            <div className="font-rajdhani text-sm font-bold">100,000 RX</div>
          </div>
          <div className="bg-brandLight/10 dark:bg-primary/10 border border-brandLight/20 dark:border-primary/20 p-2 rounded-lg">
            <div className="text-[10px] text-brandLight dark:text-primary mb-0.5 font-medium">
              {t("currentValue")}
            </div>
            <div className="font-rajdhani text-sm font-bold text-brandLight dark:text-primary">
              101,250 RX
            </div>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-light-textMuted dark:text-dark-textMuted flex justify-between font-medium">
          <span>
            {t("unlocksIn")}: 14 {t("days")}
          </span>
          <span className="text-successLight dark:text-success">+1,250 {t("earned")}</span>
        </div>
      </div>

      {/* Ecosystem menu */}
      <GlassPanel className="!p-2 !mt-5">
        <div className="flex flex-col gap-1">
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
        {t("version")}
      </div>
    </div>
  );
}
