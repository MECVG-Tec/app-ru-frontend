"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, Utensils, Moon } from "lucide-react";

const TICKET_PRICE = 3.0;

export default function BuyPage() {
  const [buyLunch, setBuyLunch] = useState(true);
  const [buyDinner, setBuyDinner] = useState(false);
  const [lunchQty, setLunchQty] = useState(1);
  const [dinnerQty, setDinnerQty] = useState(0);

  const total = useMemo(() => {
    const lt = buyLunch ? lunchQty * TICKET_PRICE : 0;
    const dt = buyDinner ? dinnerQty * TICKET_PRICE : 0;
    return (lt + dt).toFixed(2);
  }, [buyLunch, buyDinner, lunchQty, dinnerQty]);

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md px-4 pt-6 pb-28">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Compra</h1>
        <p className="text-sm text-slate-500 mb-4">Selecione as opções:</p>

        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3">
              <Checkbox
                checked={buyDinner}
                onCheckedChange={(v) => setBuyDinner(!!v)}
              />
              <span className="flex items-center gap-2 text-slate-700">
                <Moon className="h-4 w-4" /> Jantar
              </span>
            </label>
            <div className="flex items-center gap-2">
              <button
                className="h-6 w-6 rounded-full bg-slate-100 grid place-items-center"
                onClick={() => setDinnerQty((q) => Math.max(0, q - 1))}
                aria-label="Diminuir quantidade do jantar"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-slate-700">
                {dinnerQty}
              </span>
              <button
                className="h-6 w-6 rounded-full bg-slate-100 grid place-items-center"
                onClick={() => setDinnerQty((q) => q + 1)}
                aria-label="Aumentar quantidade do jantar"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3">
              <Checkbox
                checked={buyLunch}
                onCheckedChange={(v) => setBuyLunch(!!v)}
              />
              <span className="flex items-center gap-2 text-slate-700">
                <Utensils className="h-4 w-4" /> Almoço
              </span>
            </label>
            <div className="flex items-center gap-2">
              <button
                className="h-6 w-6 rounded-full bg-slate-100 grid place-items-center"
                onClick={() => setLunchQty((q) => Math.max(0, q - 1))}
                aria-label="Diminuir quantidade do almoço"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-slate-700">{lunchQty}</span>
              <button
                className="h-6 w-6 rounded-full bg-slate-100 grid place-items-center"
                onClick={() => setLunchQty((q) => q + 1)}
                aria-label="Aumentar quantidade do almoço"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <Button variant="outline" className="text-blue-600 border-blue-500">
              Adicionar item
            </Button>
          </div>
        </Card>

        <div className="flex items-center justify-between mt-4">
          <span className="text-base text-slate-700">Total</span>
          <span className="text-lg font-semibold text-slate-900">
            R$ {total}
          </span>
        </div>

        <Link href={{ pathname: "/payment", query: { total } }}>
          <Button className="w-full mt-4 bg-linear-to-r from-blue-600 to-sky-500">
            Pagamento
          </Button>
        </Link>
      </div>
    </main>
  );
}
