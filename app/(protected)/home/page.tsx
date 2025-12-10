"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/home/DashboardHeader";
import { MealsSummary } from "@/components/home/MealsSummary";
import { MenuTable } from "@/components/home/MenuTable";
import { UseTicketModal } from "@/components/home/UseTicketModal";
import { FeedbackModal } from "@/components/home/FeedbackModal";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { user, logout } = useAuth();
  
  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;
  
  const [lunchBalance, setLunchBalance] = useState(0);
  const [dinnerBalance, setDinnerBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  const [isUseModalOpen, setUseModalOpen] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [lastConsumedMeal, setLastConsumedMeal] = useState<'ALMOCO' | 'JANTAR'>('ALMOCO');

  const fetchBalance = async () => {
    if (!user?.email) return;
    try {
      const data = await api.getBalance(user.email);
      setLunchBalance(data.saldoAlmoco);
      setDinnerBalance(data.saldoJantar);
    } catch (error) {
      console.error("Erro ao carregar saldo", error);
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  const handleUseSuccess = (mealType: 'ALMOCO' | 'JANTAR') => {
    setLastConsumedMeal(mealType);
    fetchBalance();
    setFeedbackOpen(true);
  };

  return (
    <main 
      className={cn(
        "min-h-screen flex justify-center pb-28 transition-colors duration-300",
        isHighContrast ? "bg-black" : "bg-slate-50/50"
      )}
      data-testid="home-page-container"
    >
      <div className="w-full max-w-md flex flex-col">
        
        <header className="flex items-center justify-between px-6 pt-8 pb-2">
          <span className={cn(
            "font-bold uppercase tracking-widest px-2 py-1 rounded-full",
            isHighContrast ? "bg-yellow-400 text-black border border-white" : "text-blue-600 bg-blue-50",
            isLargeText ? "text-xs" : "text-[10px]"
          )}>
            RU Fácil App
          </span>
          <button
            onClick={logout}
            className={cn(
              "font-medium transition-colors",
              isHighContrast ? "text-white hover:text-yellow-400" : "text-slate-400 hover:text-red-500",
              isLargeText ? "text-base" : "text-xs"
            )}
            data-testid="logout-btn"
          >
            Sair
          </button>
        </header>

        <section className="px-5 pt-2 space-y-6">
          <div data-testid="dashboard-header">
             <DashboardHeader name={user?.name ?? "Estudante"} />
          </div>

          <div data-testid="meals-summary-section">
            <MealsSummary
              lunchBalance={lunchBalance}
              dinnerBalance={dinnerBalance}
              loading={loadingBalance}
              onConsumeClick={() => setUseModalOpen(true)}
            />
          </div>

          <div data-testid="menu-table-section">
            <MenuTable />
          </div>
        </section>
      </div>

      <UseTicketModal 
        isOpen={isUseModalOpen} 
        onClose={() => setUseModalOpen(false)}
        onSuccess={handleUseSuccess}
      />

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setFeedbackOpen(false)}
        mealType={lastConsumedMeal}
      />

    </main>
  );
}