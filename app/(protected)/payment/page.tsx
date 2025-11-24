"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function PaymentPage() {
  const qp = useSearchParams();
  const router = useRouter();
  const total = qp.get("total") ?? "0.00";
  const [paid, setPaid] = useState(false);

  function handleConfirmPayment() {
    setPaid(true);
    setTimeout(() => router.push("/history"), 600);
  }

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md px-4 pt-6 pb-28">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">
          Pagamento
        </h1>
        <p className="text-sm text-slate-600 mb-4">Efetue o pagamento:</p>

        <Card className="p-6 flex flex-col items-center gap-4">
          <img
            src="/canvas.png"
            alt="QR Code de pagamento"
            className="h-56 w-56 rounded-md object-cover"
          />

          <div className="text-sm text-slate-600">
            Total:{" "}
            <span className="font-semibold text-slate-900">R$ {total}</span>
          </div>

          <Button
            onClick={handleConfirmPayment}
            className="mt-2 bg-gradient-to-r from-blue-600 to-sky-500"
          >
            {paid ? "Pagamento efetuado!" : "Confirmar pagamento"}
          </Button>
        </Card>
      </div>
    </main>
  );
}
