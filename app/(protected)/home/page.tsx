"use client";

import { DashboardHeader } from "@/components/home/DashboardHeader";
import { MealsSummary } from "@/components/home/MealsSummary";
import { MenuTable } from "@/components/home/MenuTable";
import { useAuth } from "@/context/AuthContext";
import { BottomNav } from "@/components/nav/BottomNav";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        <header className="flex items-center justify-between px-4 pt-6">
          <span className="text-xs text-slate-400 uppercase tracking-wide">
            RU Fácil
          </span>
          <button
            onClick={logout}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Sair
          </button>
        </header>

        <section className="px-4 pb-24 pt-4">
          <DashboardHeader name={user?.name ?? "Estudante"} />
          <MealsSummary lunchCount={2} dinnerCount={1} />
          <MenuTable />
        </section>
      </div>
    </main>
  );
}
