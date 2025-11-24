"use client";

import dayjs from "dayjs";
import { Card } from "@/components/ui/card";

const MOCK_HISTORY = [
  {
    id: "h1",
    type: "Compra almoço",
    qty: 2,
    date: "2025-10-21",
    success: true,
  },
  { id: "h2", type: "Almoço", qty: 1, date: "2025-10-21", success: false },
  { id: "h3", type: "Almoço", qty: 1, date: "2025-10-22", success: false },
  {
    id: "h4",
    type: "Compra almoço",
    qty: 1,
    date: "2025-10-23",
    success: true,
  },
  { id: "h5", type: "Almoço", qty: 1, date: "2025-10-23", success: false },
];

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md px-4 pt-6 pb-28">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">
          Histórico
        </h1>
        <Card className="divide-y">
          {MOCK_HISTORY.map((row) => {
            const date = dayjs(row.date).format("DD/MM");
            return (
              <div
                key={row.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span
                  className={row.success ? "text-green-700" : "text-red-600"}
                >
                  {row.type} - {row.qty} {row.qty > 1 ? "tickets" : "ticket"}
                </span>
                <span className="text-slate-500 text-xs">{date}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </main>
  );
}
