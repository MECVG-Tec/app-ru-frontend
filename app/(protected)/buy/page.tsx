"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, Utensils, Moon } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function BuyPage() {
  const { user } = useAuth();
  
  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;

  const [lunchQty, setLunchQty] = useState(0);
  const [dinnerQty, setDinnerQty] = useState(0);
  const [checkLunch, setCheckLunch] = useState(true);
  const [checkDinner, setCheckDinner] = useState(false);

  const handleCheckLunch = (checked: boolean) => {
    setCheckLunch(checked);
    if (!checked) setLunchQty(0);
    else if (lunchQty === 0) setLunchQty(1);
  };

  const handleCheckDinner = (checked: boolean) => {
    setCheckDinner(checked);
    if (!checked) setDinnerQty(0);
    else if (dinnerQty === 0) setDinnerQty(1);
  };

  const total = useMemo(() => {
    const lTotal = checkLunch ? lunchQty * (user?.is_student ? APP_CONFIG.TICKET_LUNCH_PRICE : APP_CONFIG.TICKET_LUNCH_PRICE_EXTERNAL) : 0;
    const dTotal = checkDinner ? dinnerQty * (user?.is_student ? APP_CONFIG.TICKET_DINNER_PRICE : APP_CONFIG.TICKET_DINNER_PRICE_EXTERNAL) : 0;
    return (lTotal + dTotal).toFixed(2);
  }, [checkLunch, checkDinner, lunchQty, dinnerQty]);

  const hasItems = (checkLunch && lunchQty > 0) || (checkDinner && dinnerQty > 0);

  const queryParams = {
    qtdAlmoco: checkLunch ? lunchQty : 0,
    qtdJantar: checkDinner ? dinnerQty : 0,
    totalDisplay: total 
  };

  return (
    <main className={cn(
      "flex justify-center pt-6 px-4 pb-24 min-h-screen transition-colors duration-300",
      isHighContrast ? "bg-black" : "bg-slate-50"
    )}>
      <div className="w-full max-w-md">
        
        <h1 className={cn(
          "font-bold mb-1 transition-all",
          isHighContrast ? "text-yellow-400" : "text-slate-900",
          isLargeText ? "text-3xl" : "text-2xl"
        )}>
          Comprar Fichas
        </h1>
        
        <p className={cn(
          "mb-6 transition-all",
          isHighContrast ? "text-white" : "text-slate-500",
          isLargeText ? "text-base" : "text-sm"
        )}>
          Valor Almoço: <span className="font-semibold">R$ {(user?.is_student ? APP_CONFIG.TICKET_LUNCH_PRICE : APP_CONFIG.TICKET_LUNCH_PRICE_EXTERNAL).toFixed(2)}</span>
          {' '}| Valor Jantar: <span className="font-semibold">R$ {(user?.is_student ? APP_CONFIG.TICKET_DINNER_PRICE : APP_CONFIG.TICKET_DINNER_PRICE_EXTERNAL).toFixed(2)}</span>
        </p>

        <Card className={cn(
          "p-4 space-y-6 transition-colors",
          isHighContrast 
            ? "bg-zinc-900 border-2 border-yellow-400" 
            : "bg-white shadow-sm border-slate-100"
        )}>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <Checkbox 
                checked={checkLunch} 
                onCheckedChange={handleCheckLunch}
                className={cn(isHighContrast && "border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black")}
              />
              <span className={cn(
                "flex items-center gap-2 font-medium transition-all",
                isHighContrast ? "text-white" : "text-slate-700",
                isLargeText ? "text-lg" : "text-sm"
              )}>
                <Utensils className={cn("w-4 h-4", isLargeText && "w-6 h-6")} /> 
                Almoço
              </span>
            </label>
            <div className="flex items-center gap-3">
              <CounterButton 
                icon={Minus} 
                onClick={() => setLunchQty(q => Math.max(0, q - 1))}
                disabled={!checkLunch || lunchQty <= 0} 
                isHighContrast={isHighContrast}
                isLargeText={isLargeText}
              />
              <span className={cn(
                "w-8 text-center font-medium",
                isHighContrast ? "text-yellow-400" : "text-slate-900",
                isLargeText ? "text-xl" : "text-base"
              )}>
                {lunchQty}
              </span>
              <CounterButton 
                icon={Plus} 
                onClick={() => setLunchQty(q => q + 1)}
                disabled={!checkLunch} 
                isHighContrast={isHighContrast}
                isLargeText={isLargeText}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <Checkbox 
                checked={checkDinner} 
                onCheckedChange={handleCheckDinner}
                className={cn(isHighContrast && "border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black")}
              />
              <span className={cn(
                "flex items-center gap-2 font-medium transition-all",
                isHighContrast ? "text-white" : "text-slate-700",
                isLargeText ? "text-lg" : "text-sm"
              )}>
                <Moon className={cn("w-4 h-4", isLargeText && "w-6 h-6")} /> 
                Jantar
              </span>
            </label>
            <div className="flex items-center gap-3">
              <CounterButton 
                icon={Minus} 
                onClick={() => setDinnerQty(q => Math.max(0, q - 1))}
                disabled={!checkDinner || dinnerQty <= 0} 
                isHighContrast={isHighContrast}
                isLargeText={isLargeText}
              />
              <span className={cn(
                "w-8 text-center font-medium",
                isHighContrast ? "text-yellow-400" : "text-slate-900",
                isLargeText ? "text-xl" : "text-base"
              )}>
                {dinnerQty}
              </span>
              <CounterButton 
                icon={Plus} 
                onClick={() => setDinnerQty(q => q + 1)}
                disabled={!checkDinner} 
                isHighContrast={isHighContrast}
                isLargeText={isLargeText}
              />
            </div>
          </div>

        </Card>

        <div className="flex items-center justify-between mt-6 px-2">
          <span className={cn(
            "transition-all",
            isHighContrast ? "text-white" : "text-slate-600",
            isLargeText ? "text-lg" : "text-base"
          )}>
            Total a pagar
          </span>
          <span className={cn(
            "font-bold transition-all",
            isHighContrast ? "text-yellow-400" : "text-blue-600",
            isLargeText ? "text-3xl" : "text-2xl"
          )}>
            R$ {total}
          </span>
        </div>

        <Link 
          href={{ pathname: "/payment", query: queryParams }} 
          className={!hasItems ? "pointer-events-none opacity-50" : ""}
        >
          <Button 
            className={cn(
              "w-full mt-6 transition-all font-bold",
              isHighContrast 
                ? "bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-white" 
                : "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg",
              isLargeText ? "h-14 text-xl" : "h-12 text-base"
            )}
            disabled={!hasItems}
          >
            Ir para Pagamento
          </Button>
        </Link>
      </div>
    </main>
  );
}

function CounterButton({ icon: Icon, onClick, disabled, isHighContrast, isLargeText }: any) {
  return (
    <button
      className={cn(
        "rounded-full grid place-items-center transition-colors outline-none focus:ring-2",
        isLargeText ? "h-10 w-10" : "h-8 w-8",
        isHighContrast 
          ? "bg-zinc-800 text-yellow-400 border border-white hover:bg-zinc-700 disabled:opacity-30 disabled:border-zinc-600"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className={cn("w-4 h-4", isLargeText && "w-6 h-6")} />
    </button>
  );
}