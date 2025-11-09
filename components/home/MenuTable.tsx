export function MenuTable() {
  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <section className="mt-2">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-slate-900">Cardápio</h2>
        <p className="text-[10px] text-slate-400">{today}</p>
      </div>

      <div className="bg-blue-50 rounded-xl p-3">
        <div className="grid grid-cols-2 text-xs font-medium text-slate-600 border-b border-slate-300 pb-1 mb-1">
          <span className="text-center">Almoço</span>
          <span className="text-center">Jantar</span>
        </div>

        <div className="space-y-1 text-[11px] text-slate-700">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-2 border-b border-slate-200 last:border-none py-1">
              <span className="text-center">—</span>
              <span className="text-center">—</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
