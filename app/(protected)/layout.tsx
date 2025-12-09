import { BottomNav } from "@/components/nav/BottomNav";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {children}
      <BottomNav />
    </div>
  );
}