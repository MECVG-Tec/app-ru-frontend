'use client';

import { DashboardHeader } from '@/components/home/DashboardHeader';
import { MealsSummary } from '@/components/home/MealsSummary';
import { MenuTable } from '@/components/home/MenuTable';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        <header className="flex items-center justify-between px-4 pt-6">
          <span className="text-xs text-slate-400 uppercase tracking-wide">RU Fácil</span>
          <button
            onClick={logout}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Sair
          </button>
        </header>

        <section className="px-4 pb-24 pt-4">
          <DashboardHeader name={user?.name ?? 'Estudante'} />
          <MealsSummary lunchCount={2} dinnerCount={1} />
          <MenuTable />
        </section>

        {/* bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 flex justify-center pb-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg mx-4 py-2 flex justify-around text-xs text-slate-500">
            <button className="flex flex-col items-center gap-1 text-blue-600">
              <span>🏠</span>
              <span>Home</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <span>📰</span>
              <span>Notícias</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <span>📅</span>
              <span>Histórico</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <span>👤</span>
              <span>Perfil</span>
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
