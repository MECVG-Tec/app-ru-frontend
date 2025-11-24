'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-600 to-sky-400">
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">RU Fácil</h1>
          <p className="text-sm text-slate-500">
            Gerencie suas refeições do RU da UFRPE de forma simples e rápida.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <Button
            asChild
            className="w-full bg-linear-to-r from-blue-600 to-sky-500 text-white font-medium"
          >
            <Link href="/login">Entrar</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full border-blue-500 text-blue-600 font-medium"
          >
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-2">
          Projeto acadêmico – UFRPE
        </p>
      </div>
    </main>
  );
}
