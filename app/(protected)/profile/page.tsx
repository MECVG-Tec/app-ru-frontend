"use client";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center text-slate-600">
        <h1 className="text-2xl font-semibold text-slate-900">Perfil</h1>
        <p className="text-sm mt-2">
          Nome: <span className="text-slate-900">{user?.name ?? "—"}</span>
        </p>
        <p className="text-sm">
          Email: <span className="text-slate-900">{user?.email ?? "—"}</span>
        </p>
      </div>
    </main>
  );
}
