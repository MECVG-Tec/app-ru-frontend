"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, Utensils, Moon } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants"; 

export default function BuyPage() {
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
    const lTotal = checkLunch ? lunchQty * APP_CONFIG.TICKET_PRICE : 0;
    const dTotal = checkDinner ? dinnerQty * APP_CONFIG.TICKET_PRICE : 0;
    return (lTotal + dTotal).toFixed(2);
  }, [checkLunch, checkDinner, lunchQty, dinnerQty]);

  const hasItems = (checkLunch && lunchQty > 0) || (checkDinner && dinnerQty > 0);

  const queryParams = {
    qtdAlmoco: checkLunch ? lunchQty : 0,
    qtdJantar: checkDinner ? dinnerQty : 0,
    totalDisplay: total 
  };

  return (
    <main className="flex justify-center pt-6 px-4 pb-24">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Comprar Fichas</h1>
        <p className="text-sm text-slate-500 mb-6">
          Valor unitário: R$ {APP_CONFIG.TICKET_PRICE.toFixed(2)}
        </p>

        <Card className="p-4 space-y-6 bg-white shadow-sm border-slate-100">
          
          {/* Seção Almoço */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <Checkbox checked={checkLunch} onCheckedChange={handleCheckLunch} />
              <span className="flex items-center gap-2 text-slate-700 font-medium">
                <Utensils className="h-4 w-4 text-slate-500" /> Almoço
              </span>
            </label>
            <div className="flex items-center gap-3">
              <CounterButton 
                icon={Minus} 
                onClick={() => setLunchQty(q => Math.max(0, q - 1))}
                disabled={!checkLunch || lunchQty <= 0} 
              />
              <span className="w-6 text-center font-medium text-slate-900">{lunchQty}</span>
              <CounterButton 
                icon={Plus} 
                onClick={() => setLunchQty(q => q + 1)}
                disabled={!checkLunch} 
              />
            </div>
          </div>

          {/* Seção Jantar */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <Checkbox checked={checkDinner} onCheckedChange={handleCheckDinner} />
              <span className="flex items-center gap-2 text-slate-700 font-medium">
                <Moon className="h-4 w-4 text-slate-500" /> Jantar
              </span>
            </label>
            <div className="flex items-center gap-3">
              <CounterButton 
                icon={Minus} 
                onClick={() => setDinnerQty(q => Math.max(0, q - 1))}
                disabled={!checkDinner || dinnerQty <= 0} 
              />
              <span className="w-6 text-center font-medium text-slate-900">{dinnerQty}</span>
              <CounterButton 
                icon={Plus} 
                onClick={() => setDinnerQty(q => q + 1)}
                disabled={!checkDinner} 
              />
            </div>
          </div>

        </Card>

        <div className="flex items-center justify-between mt-6 px-2">
          <span className="text-base text-slate-600">Total a pagar</span>
          <span className="text-2xl font-bold text-blue-600">R$ {total}</span>
        </div>

        <Link 
          href={{ pathname: "/payment", query: queryParams }} 
          className={!hasItems ? "pointer-events-none opacity-50" : ""}
        >
          <Button 
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-sky-500 h-12 text-base shadow-lg shadow-blue-200"
            disabled={!hasItems}
          >
            Ir para Pagamento
          </Button>
        </Link>
      </div>
    </main>
  );
}

function CounterButton({ icon: Icon, onClick, disabled }: any) {
  return (
    <button
      className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed grid place-items-center transition-colors text-slate-600"
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}