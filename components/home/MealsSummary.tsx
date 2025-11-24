import { Tickets } from "lucide-react";

type Props = {
  lunchCount: number;
  dinnerCount: number;
};

export function MealsSummary({ lunchCount, dinnerCount }: Props) {
  return (
    <div className="flex gap-4 mb-6 mt-2">
      <div className="flex-1 bg-blue-50 rounded-xl p-4 flex flex-col justify-between">
        <span className="text-xs text-slate-500 mb-2">Almoço</span>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-semibold text-blue-600">{lunchCount}</span>
          <Tickets className="h-10 w-10 text-blue-600" />
        </div>
      </div>
      <div className="flex-1 bg-blue-50 rounded-xl p-4 flex flex-col justify-between">
        <span className="text-xs text-slate-500 mb-2">Jantar</span>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-semibold text-blue-600">{dinnerCount}</span>
          <Tickets className="h-10 w-10 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
