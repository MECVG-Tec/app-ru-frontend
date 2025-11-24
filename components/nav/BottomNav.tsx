"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Newspaper, History, User, ShoppingCart } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/news", label: "Notícias", icon: Newspaper },
    { href: "/history", label: "Histórico", icon: History },
    { href: "/profile", label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 z-40">
      <div className="w-full max-w-md relative mx-4">
        <div className="bg-white rounded-2xl shadow-lg py-2 px-3 flex justify-between items-center text-xs text-slate-500">
          <div className="w-full grid grid-cols-4">
            {items.map((item, idx) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 py-1",
                    active ? "text-blue-600" : "text-slate-500"
                  )}
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <Link
            href="/buy"
            className="flex items-center justify-center h-14 w-14 rounded-full shadow-xl bg-linear-to-br from-blue-600 to-sky-500 text-white border-4 border-slate-50"
            aria-label="Comprar fichas"
          >
            <ShoppingCart className="h-6 w-6" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
