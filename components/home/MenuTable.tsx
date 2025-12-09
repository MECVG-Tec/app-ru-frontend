"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { MenuResponse } from "@/lib/types";
import dayjs from "dayjs";
import "dayjs/locale/pt-br"; // Importante para tradução

// Configura o locale globalmente
dayjs.locale("pt-br");

export function MenuTable() {
  const [almoco, setAlmoco] = useState<MenuResponse | null>(null);
  const [jantar, setJantar] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Formato para API: YYYY-MM-DD
  const todayApi = dayjs().format("YYYY-MM-DD");
  // Formato para Exibição: segunda-feira, 08 de dezembro...
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-20 bg-slate-100 rounded"></div>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">Cardápio do Dia</h2>
        <p className="text-xs text-slate-500 capitalize">{todayDisplay}</p>
      </div>

      <div className="p-0">
        <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80 px-4 py-2 border-b border-slate-100">
          <span className="text-left">Item</span>
          <span className="text-center text-blue-600">Almoço</span>
          <span className="text-center text-indigo-600">Jantar</span>
        </div>

        <div className="divide-y divide-slate-100">
          {rows.map((row) => (
            <div key={row.key} className="grid grid-cols-3 gap-2 py-3 px-4 text-xs hover:bg-slate-50/50 transition-colors">
              <span className="font-semibold text-slate-700 flex items-center">{row.label}</span>
              <span className="text-center text-slate-600 leading-tight flex items-center justify-center">
                {getDish(almoco, row.key)}
              </span>
              <span className="text-center text-slate-600 leading-tight flex items-center justify-center">
                {getDish(jantar, row.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}