import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-600 to-sky-400 p-4">
      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
        {children}
      </div>
    </main>
  );
}