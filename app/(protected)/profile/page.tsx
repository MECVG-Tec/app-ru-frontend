"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Trophy, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GamificationData } from "@/lib/types";
import { AccessibilityModal } from "@/components/perfil/AccessibilityModal";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  
  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;

  const [isA11yModalOpen, setA11yModalOpen] = useState(false);
  const [gameData, setGameData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.email) return;
      try {
        const data = await api.getGamification(user.email);
        setGameData(data);
      } catch (error) {
        console.error("Erro ao carregar pontuação", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const progressPercent = gameData 
    ? (gameData.totalPontos / (gameData.totalPontos + gameData.pontosParaProximoNivel)) * 100 
    : 0;

  return (
    <main className={cn(
      "min-h-screen flex justify-center pb-28 pt-6 px-4 transition-colors duration-300",
      isHighContrast ? "bg-black" : "bg-slate-50"
    )}>
      <div className="w-full max-w-md space-y-6">
        
        <div className="flex flex-col items-center">
          <div className={cn(
            "rounded-full flex items-center justify-center mb-3 shadow-sm border-4",
            isLargeText ? "h-32 w-32" : "h-24 w-24",
            isHighContrast 
              ? "bg-zinc-800 border-yellow-400 text-yellow-400" 
              : "bg-blue-100 border-white text-blue-600"
          )}>
            <User className={cn(isLargeText ? "h-14 w-14" : "h-10 w-10")} />
          </div>
          
          <h1 className={cn(
            "font-bold transition-all",
            isHighContrast ? "text-yellow-400" : "text-slate-900",
            isLargeText ? "text-3xl" : "text-xl"
          )}>
            {user?.name}
          </h1>
          
          <p className={cn(
            "transition-all",
            isHighContrast ? "text-white" : "text-slate-500",
            isLargeText ? "text-lg" : "text-sm"
          )}>
            {user?.email}
          </p>
        </div>

        <Card className={cn(
          "p-6 border-none shadow-lg transition-all",
          isHighContrast 
            ? "bg-zinc-900 border-2 border-yellow-400 text-white" 
            : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-200"
        )}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={cn(
                "font-bold uppercase tracking-wider",
                isHighContrast ? "text-yellow-400" : "text-indigo-100",
                isLargeText ? "text-base" : "text-xs"
              )}>
                Nível Atual
              </p>
              <div className="flex items-baseline gap-2">
                <span className={cn("font-extrabold", isLargeText ? "text-6xl" : "text-4xl")}>
                  {gameData?.nivel ?? 1}
                </span>
                <span className={cn(
                  isHighContrast ? "text-white" : "text-indigo-200",
                  isLargeText ? "text-lg" : "text-sm"
                )}>
                  Explorador
                </span>
              </div>
            </div>
            <Trophy className={cn("text-yellow-300", isLargeText ? "h-12 w-12" : "h-8 w-8")} />
          </div>

          <div className={cn("space-y-2", isLargeText && "space-y-4")}>
            <div className={cn(
              "flex justify-between font-medium",
              isHighContrast ? "text-gray-300" : "text-indigo-100",
              isLargeText ? "text-base" : "text-xs"
            )}>
              <span>XP: {gameData?.totalPontos ?? 0}</span>
              <span>Próximo: {gameData ? gameData.totalPontos + gameData.pontosParaProximoNivel : 100}</span>
            </div>
            
            <div className={cn(
              "w-full rounded-full overflow-hidden",
              isHighContrast ? "bg-zinc-700" : "bg-black/20",
              isLargeText ? "h-4" : "h-2"
            )}>
              <div 
                className={cn("h-full transition-all duration-1000", isHighContrast ? "bg-yellow-400" : "bg-yellow-400")} 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            
            <p className={cn(
              "text-center mt-1",
              isHighContrast ? "text-white" : "text-indigo-200",
              isLargeText ? "text-sm" : "text-[10px]"
            )}>
              Faltam {gameData?.pontosParaProximoNivel ?? 0} pontos para subir de nível!
            </p>
          </div>
        </Card>

        <div className="space-y-3">
          <h3 className={cn(
            "font-bold uppercase ml-1",
            isHighContrast ? "text-yellow-400" : "text-slate-900",
            isLargeText ? "text-lg" : "text-sm"
          )}>
            Configurações
          </h3>
          
          <Card className={cn(
            "divide-y transition-colors",
            isHighContrast ? "bg-zinc-900 border-white divide-zinc-700" : "bg-white border-slate-200 divide-slate-100"
          )}>
            <div 
              className={cn("p-4 flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity", isLargeText && "py-6")}
              onClick={() => setA11yModalOpen(true)} // <--- AQUI
            >
              <span className={cn(
                isHighContrast ? "text-white" : "text-slate-600",
                isLargeText ? "text-lg" : "text-sm"
              )}>
                Acessibilidade
              </span>
              <span className={cn(
                "font-medium",
                isHighContrast ? "text-yellow-400" : "text-blue-600",
                isLargeText ? "text-base" : "text-xs"
              )}>
                Editar
              </span>
            </div>
            
            <div className={cn("p-4 flex items-center justify-between", isLargeText && "py-6")}>
              <span className={cn(
                isHighContrast ? "text-white" : "text-slate-600",
                isLargeText ? "text-lg" : "text-sm"
              )}>
                Notificações
              </span>
              <span className={cn(
                "font-medium",
                isHighContrast ? "text-yellow-400" : "text-blue-600",
                isLargeText ? "text-base" : "text-xs"
              )}>
                Ativado
              </span>
            </div>
          </Card>

          <Button 
            variant="outline" 
            className={cn(
              "w-full mt-4 transition-all font-bold",
              isHighContrast 
                ? "border-white text-red-400 hover:bg-zinc-900 hover:text-red-300 hover:border-red-400" 
                : "border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700",
              isLargeText ? "h-14 text-xl" : "h-10 text-sm"
            )}
            onClick={logout}
          >
            <LogOut className={cn("mr-2", isLargeText ? "h-6 w-6" : "h-4 w-4")} />
            Sair da Conta
          </Button>
        </div>

      </div>

      <AccessibilityModal 
        isOpen={isA11yModalOpen} 
        onClose={() => setA11yModalOpen(false)} 
      />
    </main>
  );
}