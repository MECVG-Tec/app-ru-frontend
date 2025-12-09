import { PlusCircle, Utensils, Moon, QrCode } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  lunchBalance: number;
  dinnerBalance: number;
  loading: boolean;
  onConsumeClick: () => void;
};

export function MealsSummary({ lunchBalance, dinnerBalance, loading, onConsumeClick }: Props) {
  return (
    <div className="mb-6 mt-2">
      <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-4 text-white shadow-lg shadow-blue-200">
        <h2 className="text-blue-100 text-xs font-medium uppercase tracking-wide mb-3 ml-1">
          Saldo Disponível
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex flex-col justify-between border border-white/10">
            <div className="flex items-center gap-2 text-blue-100 mb-1">
              <Utensils className="h-4 w-4" />
              <span className="text-xs font-medium">Almoço</span>
            </div>
            <span className="text-3xl font-bold">{loading ? "-" : lunchBalance}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex flex-col justify-between border border-white/10">
            <div className="flex items-center gap-2 text-blue-100 mb-1">
              <Moon className="h-4 w-4" />
              <span className="text-xs font-medium">Jantar</span>
            </div>
            <span className="text-3xl font-bold">{loading ? "-" : dinnerBalance}</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3">
          <Link href="/buy" className="flex-1">
            <Button 
              variant="secondary" 
              className="w-full bg-white/20 hover:bg-white/30 text-white border-0 transition-colors"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Comprar
            </Button>
          </Link>
          
          <Button 
            onClick={onConsumeClick}
            className="flex-1 bg-white text-blue-600 hover:bg-blue-50 border-0 transition-colors font-bold shadow-sm"
          >
            <QrCode className="mr-2 h-4 w-4" />
            Utilizar
          </Button>
        </div>
      </div>
    </div>
  );
}