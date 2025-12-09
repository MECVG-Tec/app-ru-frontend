"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, History, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/home", label: "Início", icon: Home },
    { href: "/history", label: "Histórico", icon: History },
    { href: "/profile", label: "Perfil", icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
      <nav className="w-full max-w-sm relative pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-200/60 rounded-2xl px-6 py-3 h-[72px]">
          <div className="flex w-full justify-between">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={
                  item.href === "/home"
                    ? pathname === item.href
                    : pathname.startsWith(item.href)
                }
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavItem({ item, isActive }: { item: any; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 w-12 transition-all duration-300",
        isActive ? "-translate-y-1" : "hover:opacity-70"
      )}
    >
      <div
        className={cn(
          "p-1.5 rounded-xl transition-colors duration-300",
          isActive ? "bg-blue-50" : "bg-transparent"
        )}
      >
        <Icon
          className={cn(
            "h-6 w-6 transition-colors duration-300",
            isActive ? "text-blue-600 fill-blue-600/20" : "text-slate-400"
          )}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </div>
      <span
        className={cn(
          "text-[10px] font-medium transition-colors duration-300",
          isActive ? "text-blue-600" : "text-slate-400"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}
