"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, History, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;

  const navItems = [
    { href: "/home", label: "Início", icon: Home },
    { href: "/history", label: "Histórico", icon: History },
    { href: "/profile", label: "Perfil", icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
      <nav className="w-full max-w-sm relative pointer-events-auto">
        <div className={cn(
          "rounded-2xl px-6 transition-all duration-300 flex items-center",
          isLargeText ? "h-[90px] py-4" : "h-[72px] py-3",
          isHighContrast 
            ? "bg-zinc-900 border-2 border-white shadow-none" 
            : "bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-200/60"
        )}>
          <div className="flex w-full justify-between items-center">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={
                  item.href === "/home"
                    ? pathname === item.href
                    : pathname.startsWith(item.href)
                }
                isHighContrast={isHighContrast}
                isLargeText={isLargeText}
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavItem({ item, isActive, isHighContrast, isLargeText }: { item: any; isActive: boolean, isHighContrast?: boolean, isLargeText?: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 transition-all duration-300",
        isLargeText ? "w-16" : "w-12",
        isActive ? "-translate-y-1" : "hover:opacity-70"
      )}
    >
      <div
        className={cn(
          "rounded-xl transition-colors duration-300 flex items-center justify-center",
          isLargeText ? "p-2.5" : "p-1.5",
          isActive 
            ? (isHighContrast ? "bg-yellow-400" : "bg-blue-50") 
            : "bg-transparent"
        )}
      >
        <Icon
          className={cn(
            "transition-colors duration-300",
            isLargeText ? "h-8 w-8" : "h-6 w-6",
            isActive 
              ? (isHighContrast ? "text-black fill-black/20" : "text-blue-600 fill-blue-600/20") 
              : (isHighContrast ? "text-white" : "text-slate-400")
          )}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </div>
      <span
        className={cn(
          "font-medium transition-colors duration-300 text-center leading-tight",
          isLargeText ? "text-xs" : "text-[10px]",
          isActive 
            ? (isHighContrast ? "text-yellow-400" : "text-blue-600") 
            : (isHighContrast ? "text-white" : "text-slate-400")
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}