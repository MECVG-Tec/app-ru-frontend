import { useMemo } from 'react';
import cardapio from '../../lib/data/cardapio.json';

interface Cardapio {
  almoco: Record<string, string>;
  jantar: Record<string, string>;
}

const formatLabel = (s: string) =>
  s
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

export function MenuTable() {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    []
  );

  const { almoco, jantar } = cardapio as Cardapio;

  const orderedKeys = useMemo(() => {
    const set = new Set([
      ...Object.keys(almoco),
      ...Object.keys(jantar),
    ]);
    return [...set].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [almoco, jantar]);

  return (
    <section className="mt-2">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-slate-900">Cardápio</h2>
        <p className="text-[10px] text-slate-500">{today}</p>
      </div>

      <div className="bg-blue-50 rounded-xl p-3 shadow-sm ring-1 ring-blue-100">
        <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-700 border-b border-slate-300 pb-1 mb-2">
          <span className="text-left pl-1">Item</span>
          <span className="text-center">Almoço</span>
          <span className="text-center">Jantar</span>
        </div>

        <div className="divide-y divide-blue-100">
          {orderedKeys.map((key, i) => {
            const alm = almoco[key];
            const jan = jantar[key];
            return (
              <div
                key={key}
                className="grid grid-cols-3 gap-2 py-1 px-1 text-[11px] even:bg-white odd:bg-blue-100/40 rounded"
              >
                <span className="font-bold truncate" title={formatLabel(key)}>
                  {formatLabel(key)}
                </span>
                <span
                  className={
                    'text-center ' +
                    (alm ? 'text-slate-800' : 'text-slate-400 italic')
                  }
                >
                  {alm ?? '—'}
                </span>
                <span
                  className={
                    'text-center ' +
                    (jan ? 'text-slate-800' : 'text-slate-400 italic')
                  }
                >
                  {jan ?? '—'}
                </span>
              </div>
            );
          })}
        </div>

        {!orderedKeys.length && (
          <p className="text-[11px] text-slate-500 italic py-2 text-center">
            Nenhum item disponível.
          </p>
        )}
      </div>
    </section>
  );
}
