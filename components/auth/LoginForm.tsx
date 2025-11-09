// components/auth/LoginForm.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('loisbecket@gmail.com');
  const [password, setPassword] = useState('********');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg('Não foi possível fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-2xl shadow-xl bg-white/95 p-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
        <p className="text-sm text-slate-500 mt-2">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            Registre-se
          </Link>
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-slate-600">Lembrar</span>
          </label>

          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => alert('Placeholder: recuperação de senha')}
          >
            Esqueceu sua senha?
          </button>
        </div>

        {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

        <Button
          type="submit"
          className="w-full mt-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Log In'}
        </Button>
      </form>
    </Card>
  );
}
    