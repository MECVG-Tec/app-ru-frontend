"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { MenuResponse } from "@/lib/types";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

dayjs.locale("pt-br");

export function MenuTable() {
  const { user } = useAuth();
  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;

  const [almoco, setAlmoco] = useState<MenuResponse | null>(null);
  const [jantar, setJantar] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const todayApi = dayjs().format("YYYY-MM-DD");
  const todayDisplay = dayjs().format("dddd, DD [de] MMMM");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [resAlmoco, resJantar] = await Promise.all([
            api.getMenu(todayApi, "ALMOCO"),
            api.getMenu(todayApi, "JANTAR")
        ]);
        setAlmoco(resAlmoco);
        setJantar(resJantar);
      } catch (error) {
        console.error("Erro ao buscar cardápio", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [todayApi]);

  const getDish = (menu: MenuResponse | null, slotName: string) => {
    if (!menu || !menu.slots) return "—";
    const item = menu.slots.find(s => s.slot === slotName);
    return item ? item.title : "—";
  };

  const rows = [
    { label: "Prato Principal 1", key: "PRATO_PRINCIPAL_1" },
    { label: "Prato Principal 2", key: "PRATO_PRINCIPAL_2" },
    { label: "Vegetariano", key: "VEGETARIANO" },
    { label: "Guarnição", key: "GUARNICAO" },
    { label: "Salada", key: "SALADA_CRUA" },
    { label: "Sobremesa", key: "SOBREMESA" },
    { label: "Suco", key: "SUCO" },
  ];

  if (loading) {
    return (
      <div className={cn(
        "rounded-xl p-6 shadow-sm border animate-pulse space-y-3",
        isHighContrast ? "bg-zinc-900 border-zinc-700" : "bg-white border-slate-100"
      )}>
        <div className={cn("h-4 rounded w-1/3", isHighContrast ? "bg-zinc-700" : "bg-slate-200")}></div>
        <div className={cn("h-20 rounded", isHighContrast ? "bg-zinc-800" : "bg-slate-100")}></div>
      </div>
    );
  }

  return (
    <section className={cn(
      "rounded-2xl shadow-sm overflow-hidden border transition-colors",
      isHighContrast ? "bg-black border-white" : "bg-white border-slate-100"
    )}>
      <div className={cn(
        "px-4 py-3 border-b transition-colors",
        isHighContrast 
          ? "bg-zinc-900 border-white text-yellow-400" 
          : "bg-slate-50/50 border-slate-100 text-slate-900"
      )}>
        <h2 className={cn("font-semibold", isLargeText ? "text-lg" : "text-base")}>Cardápio do Dia</h2>
        <p className={cn(
          "capitalize", 
          isHighContrast ? "text-white" : "text-slate-500",
          isLargeText ? "text-sm" : "text-xs"
        )}>
          {todayDisplay}
        </p>
      </div>

      <div className="p-0">
        <div className={cn(
          "grid grid-cols-3 gap-2 font-bold uppercase tracking-wider px-4 py-2 border-b",
          isHighContrast 
            ? "bg-zinc-800 text-white border-white" 
            : "bg-slate-50/80 text-slate-500 border-slate-100",
          isLargeText ? "text-xs" : "text-[10px]"
        )}>
          <span className="text-left">Item</span>
          <span className={cn("text-center", isHighContrast ? "text-yellow-400" : "text-blue-600")}>Almoço</span>
          <span className={cn("text-center", isHighContrast ? "text-yellow-400" : "text-indigo-600")}>Jantar</span>
        </div>

        <div className={cn("divide-y", isHighContrast ? "divide-zinc-700" : "divide-slate-100")}>
          {rows.map((row) => (
            <div key={row.key} className={cn(
              "grid grid-cols-3 gap-2 py-3 px-4 transition-colors",
              isHighContrast ? "hover:bg-zinc-900 text-white" : "hover:bg-slate-50/50 text-slate-600",
              isLargeText ? "text-sm" : "text-xs"
            )}>
              <span className={cn(
                "font-semibold flex items-center", 
                isHighContrast ? "text-yellow-400" : "text-slate-700"
              )}>
                {row.label}
              </span>
              <span className="text-center leading-tight flex items-center justify-center">
                {getDish(almoco, row.key)}
              </span>
              <span className="text-center leading-tight flex items-center justify-center">
                {getDish(jantar, row.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}