import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type Props = { name: string };

export function DashboardHeader({ name }: Props) {
  const { user } = useAuth();
  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;

  return (
    <div className="mt-4 mb-4">
      <h1 className={cn(
        "font-semibold transition-all",
        isHighContrast ? "text-yellow-400" : "text-slate-900",
        isLargeText ? "text-4xl" : "text-3xl"
      )}>
        Olá, {name.split(' ')[0]}!
      </h1>
      <div className={cn(
        "mt-1 h-px",
        isHighContrast ? "bg-white" : "bg-slate-200"
      )} />
    </div>
  );
}