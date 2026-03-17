"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header");

  useEffect(() => setMounted(true), []);

  const toggleLocale = () => {
    const next = locale === "zh" ? "en" : "zh";
    const newPath = pathname.replace(`/${locale}`, `/${next}`);
    router.push(newPath);
  };

  return (
    <header className="relative z-10 px-5 py-4 flex justify-between items-center backdrop-blur-md border-b border-light-border dark:border-dark-border">
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="RobotX"
          width={40}
          height={40}
          className="-mr-1 rounded-full object-contain mix-blend-screen"
        />
        <span className="text-lg font-black tracking-wider font-orbitron">
          <span className="text-primary transition-colors">ROBOT</span>
          <span className="text-light-textMain dark:text-dark-textMain transition-colors">X</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="text-sm text-light-textMuted dark:text-dark-textMuted cursor-pointer transition-colors hover:text-brandLight dark:hover:text-primary w-4 h-4"
        >
          {mounted ? (resolvedTheme === "dark" ? <Moon size={16} /> : <Sun size={16} />) : null}
        </button>
        <button
          onClick={toggleLocale}
          className="text-sm text-light-textMuted dark:text-dark-textMuted font-medium cursor-pointer hover:text-brandLight dark:hover:text-primary transition-colors"
        >
          {locale === "zh" ? "EN" : "中文"}
        </button>
        <div className="bg-black/5 dark:bg-white/10 border border-light-border dark:border-dark-border px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/15 active:scale-[0.98]">
          <span className="w-1.5 h-1.5 bg-brandLight dark:bg-primary rounded-full shadow-[0_0_8px_#0066FF] dark:shadow-[0_0_8px_#00E5FF]" />
          {t("wallet")}
        </div>
      </div>
    </header>
  );
}
