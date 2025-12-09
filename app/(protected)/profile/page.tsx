"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, User, LogOut, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GamificationData } from "@/lib/types";

export default function ProfilePage() {
  const { user, logout } = useAuth();
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
    <main className="min-h-screen bg-slate-50 flex justify-center pb-28 pt-6 px-4">
      <div className="w-full max-w-md space-y-6">
        
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3 border-4 border-white shadow-sm">
            <User className="h-10 w-10" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>

        <Card className="p-6 bg-linear-to-br from-indigo-600 to-violet-600 text-white border-none shadow-lg shadow-indigo-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Nível Atual</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{gameData?.nivel ?? 1}</span>
                <span className="text-sm text-indigo-200">Explorador</span>
              </div>
            </div>
            <Trophy className="h-8 w-8 text-yellow-300" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-indigo-100">
              <span>XP: {gameData?.totalPontos ?? 0}</span>
              <span>Próximo: {gameData ? gameData.totalPontos + gameData.pontosParaProximoNivel : 100}</span>
            </div>
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <p className="text-[10px] text-center text-indigo-200 mt-1">
              Faltam {gameData?.pontosParaProximoNivel ?? 0} pontos para subir de nível!
            </p>
          </div>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase ml-1">Configurações</h3>
          
          <Card className="divide-y divide-slate-100 border-slate-200">
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm text-slate-600">Acessibilidade</span>
              <span className="text-xs text-blue-600 font-medium">Editar</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm text-slate-600">Notificações</span>
              <span className="text-xs text-blue-600 font-medium">Ativado</span>
            </div>
          </Card>

          <Button 
            variant="outline" 
            className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 mt-4"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da Conta
          </Button>
        </div>

      </div>
    </main>
  );
}