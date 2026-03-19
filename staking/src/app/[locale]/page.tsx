"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { ParticleBg } from "@/components/particle-bg";
import { RayBg } from "@/components/ray-bg";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { ToastProvider } from "@/components/ui/toast";
import { StakeTab } from "@/components/tabs/stake-tab";
import { TeamTab } from "@/components/tabs/team-tab";
import { NewsTab } from "@/components/tabs/news-tab";
import { MineTab } from "@/components/tabs/mine-tab";
import { AdminTab } from "@/components/tabs/admin-tab";

export type TabId = "stake" | "team" | "news" | "mine" | "admin";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("stake");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("ref")) {
      setActiveTab("mine");
    }
  }, []);

  return (
    <WalletProvider>
      <ToastProvider>
        <div className="relative w-full max-w-[480px] h-full flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-[radial-gradient(circle_at_50%_0%,_#FFFFFF_0%,_#E2E8F0_100%)] dark:bg-[radial-gradient(circle_at_50%_0%,_#0a1a3a_0%,_#020611_100%)] transition-colors duration-500">
          <RayBg />
          <ParticleBg />
          <Header />

          <main className="flex-1 overflow-y-auto p-5 pb-[90px] z-[2] scroll-smooth no-scrollbar relative">
            {activeTab === "stake" && <StakeTab onNavigate={setActiveTab} />}
            {activeTab === "team" && <TeamTab />}
            {activeTab === "news" && <NewsTab />}
            {activeTab === "mine" && <MineTab onOpenAdmin={() => setActiveTab("admin")} />}
            {activeTab === "admin" && <AdminTab onBack={() => setActiveTab("mine")} />}
          </main>

          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </ToastProvider>
    </WalletProvider>
  );
}
