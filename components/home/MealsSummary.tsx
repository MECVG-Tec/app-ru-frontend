import { PlusCircle, Utensils, Moon, QrCode } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type Props = {
  lunchBalance: number;
  dinnerBalance: number;
  loading: boolean;
  onConsumeClick: () => void;
};

export function MealsSummary({ lunchBalance, dinnerBalance, loading, onConsumeClick }: Props) {
  const { user } = useAuth();
  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;

  return (
    <div className="mb-6 mt-2">
      <div className={cn(
        "rounded-2xl p-4 shadow-lg transition-all",
        isHighContrast 
          ? "bg-zinc-900 border-2 border-yellow-400" 
          : "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-blue-200"
      )}>
        <h2 className={cn(
          "font-medium uppercase tracking-wide mb-3 ml-1",
          isHighContrast ? "text-yellow-400" : "text-blue-100",
          isLargeText ? "text-sm" : "text-xs"
        )}>
          Saldo Disponível
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-4">
          
          <div className={cn(
            "rounded-xl p-3 flex flex-col justify-between border transition-colors",
            isHighContrast ? "bg-black border-white text-white" : "bg-white/10 backdrop-blur-sm border-white/10"
          )}>
            <div className={cn("flex items-center gap-2 mb-1", isHighContrast ? "text-yellow-400" : "text-blue-100")}>
              <Utensils className={cn("w-4 h-4", isLargeText && "w-6 h-6")} />
              <span className={cn("font-medium", isLargeText ? "text-base" : "text-xs")}>Almoço</span>
            </div>
            <span className={cn("font-bold", isLargeText ? "text-4xl" : "text-3xl")}>
              {loading ? "-" : lunchBalance}
            </span>
          </div>

          <div className={cn(
            "rounded-xl p-3 flex flex-col justify-between border transition-colors",
            isHighContrast ? "bg-black border-white text-white" : "bg-white/10 backdrop-blur-sm border-white/10"
          )}>
            <div className={cn("flex items-center gap-2 mb-1", isHighContrast ? "text-yellow-400" : "text-blue-100")}>
              <Moon className={cn("w-4 h-4", isLargeText && "w-6 h-6")} />
              <span className={cn("font-medium", isLargeText ? "text-base" : "text-xs")}>Jantar</span>
            </div>
            <span className={cn("font-bold", isLargeText ? "text-4xl" : "text-3xl")}>
              {loading ? "-" : dinnerBalance}
            </span>
          </div>

        </div>

        <div className="flex gap-3">
          <Link href="/buy" className="flex-1">
            <Button 
              variant="secondary" 
              className={cn(
                "w-full border-0 transition-all font-bold",
                isHighContrast 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-white/20 hover:bg-white/30 text-white",
                isLargeText && "h-12 text-lg"
              )}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Comprar
            </Button>
          </Link>
          
          <Button 
            onClick={onConsumeClick}
            className={cn(
              "flex-1 border-0 transition-all font-bold shadow-sm",
              isHighContrast 
                ? "bg-yellow-400 text-black hover:bg-yellow-500" 
                : "bg-white text-blue-600 hover:bg-blue-50",
              isLargeText && "h-12 text-lg"
            )}
          >
            <QrCode className="mr-2 h-4 w-4" />
            Utilizar
          </Button>
        </div>
      </div>
    </div>
  );
}