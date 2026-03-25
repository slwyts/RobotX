"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { ToastProvider } from "@/components/ui/toast";
import { ParticleBg } from "@/components/particle-bg";
import { RayBg } from "@/components/ray-bg";
import { Header } from "@/components/header";
import { AdminTab } from "@/components/tabs/admin-tab";

export default function AdminPage() {
  const locale = useLocale();
  const router = useRouter();

  return (
    <WalletProvider>
      <ToastProvider>
        <div className="relative w-full max-w-[480px] h-full flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-[radial-gradient(circle_at_50%_0%,_#FFFFFF_0%,_#E2E8F0_100%)] dark:bg-[radial-gradient(circle_at_50%_0%,_#0a1a3a_0%,_#020611_100%)] transition-colors duration-500">
          <RayBg />
          <ParticleBg />
          <Header />
          <main className="flex-1 overflow-y-auto p-5 pb-5 z-[2] scroll-smooth no-scrollbar relative">
            <AdminTab onBack={() => router.push(`/${locale}`)} />
          </main>
        </div>
      </ToastProvider>
    </WalletProvider>
  );
}
