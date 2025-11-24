import { BottomNav } from "@/components/nav/BottomNav";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "App",
    template: "%s | App",
  },
  description: "Protected section",
};

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      {children}
      <BottomNav />
    </main>
  );
}
