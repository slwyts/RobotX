import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RobotX Staking",
  description: "RobotX Chain - Staking DApp : AI Powered EVM Blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
