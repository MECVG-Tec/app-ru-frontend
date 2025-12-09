"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/home/DashboardHeader";
import { MealsSummary } from "@/components/home/MealsSummary";
import { MenuTable } from "@/components/home/MenuTable";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

interface HistoryItem {
  statusPagamento: string;
  quantidade: number;
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const [lunchBalance, setLunchBalance] = useState(0);
  const [dinnerBalance, setDinnerBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    async function fetchBalance() {
      if (!user?.email) return;

      try {
        const history = await api.getHistory(user.email);

        const paidItems = history.filter(
          (item: HistoryItem) => item.statusPagamento === "PAGO"
        );

        const totalLunch = paidItems.reduce(
          (acc: any, curr: { quantidadeAlmoco: any; }) => acc + (curr.quantidadeAlmoco || 0),
          0
        );
        const totalDinner = paidItems.reduce(
          (acc: any, curr: { quantidadeJantar: any; }) => acc + (curr.quantidadeJantar || 0),
          0
        );

        setLunchBalance(totalLunch);
        setDinnerBalance(totalDinner);
      } catch (error) {
        console.error("Erro ao carregar saldo", error);
      } finally {
        setLoadingBalance(false);
      }
    }

    fetchBalance();
  }, [user]);

  console.log(user);
  
  return (
    <main className="min-h-screen bg-slate-50/50 flex justify-center pb-28">
      <div className="w-full max-w-md flex flex-col">
        <header className="flex items-center justify-between px-6 pt-8 pb-2">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-full">
            RU Fácil App
          </span>
          <button
            onClick={logout}
            className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
          >
            Sair
          </button>
        </header>

        <section className="px-5 pt-2 space-y-6">
          <DashboardHeader name={user?.name ?? "Estudante"} />

          <MealsSummary
            lunchBalance={lunchBalance}
            dinnerBalance={dinnerBalance}
            loading={loadingBalance}
          />

          <MenuTable />
        </section>
      </div>
    </main>
  );
}
