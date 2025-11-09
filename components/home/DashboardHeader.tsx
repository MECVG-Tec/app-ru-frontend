type Props = { name: string };

export function DashboardHeader({ name }: Props) {
  return (
    <div className="mt-4 mb-4">
      <h1 className="text-3xl font-semibold text-slate-900">Olá, {name.split(' ')[0]}!</h1>
      <div className="mt-1 h-px bg-slate-200" />
    </div>
  );
}
