'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg('Email ou senha incorretos. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <Card 
      className="rounded-2xl shadow-xl bg-white/95 backdrop-blur-sm p-8 border-none animate-in fade-in slide-in-from-bottom-4 duration-500"
      data-testid="login-card"
    >
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Login</h1>
        <p className="text-sm text-slate-500 mt-2">
          Bem-vindo de volta! Acesse sua conta.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="aluno@ufrpe.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-slate-50/50"
            disabled={loading}
            data-testid="email-input"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-slate-50/50"
            disabled={loading}
            data-testid="password-input"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div /> 
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
            data-testid="forgot-password-link"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        {errorMsg && (
          <div 
            className="p-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-xs font-medium text-center animate-in zoom-in-95"
            data-testid="login-error-msg"
          >
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-medium shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
          disabled={loading}
          data-testid="login-submit-btn"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>

        <p className="text-sm text-slate-500 text-center mt-4">
          Não tem uma conta?{' '}
          <Link 
            href="/register" 
            className="text-blue-600 font-medium hover:underline"
            data-testid="register-link"
          >
            Registre-se
          </Link>
        </p>
      </form>
    </Card>
  );
}