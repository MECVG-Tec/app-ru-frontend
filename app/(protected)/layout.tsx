"use client";

import { BottomNav } from "@/components/nav/BottomNav";
import { SupportButton } from "@/components/support/SupportButton";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  
  const isHighContrast = user?.accessibilityOptions?.highContrast;

  return (
    <div className={cn(
      "min-h-screen pb-24 transition-colors duration-300",
      isHighContrast ? "bg-black" : "bg-slate-50"
    )}>
      {children}
      <SupportButton />
      <BottomNav />
    </div>
  );
}