'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, KeyRound, Lock } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialToken = searchParams.get('token') || '';

  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      await api.resetPassword(token, password);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err) {
      setError('Token inválido ou expirado. Tente solicitar novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="rounded-2xl shadow-xl bg-white/95 backdrop-blur-sm p-8 text-center animate-in zoom-in-95">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Lock className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Senha Alterada!</h1>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          Sua senha foi redefinida com sucesso. Você será redirecionado para o login em instantes.
        </p>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
          <Link href="/login">Ir para Login agora</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-xl bg-white/95 backdrop-blur-sm p-8 border-none animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Nova Senha</h1>
        <p className="text-sm text-slate-500 mt-1">
          Insira o código recebido e sua nova senha.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="token">Código de Recuperação (Token)</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="token"
              placeholder="Cole o código aqui"
              className="pl-9 bg-slate-50/50"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Nova Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded text-center font-medium">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-medium mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redefinindo...
            </>
          ) : (
            'Alterar Senha'
          )}
        </Button>

        <div className="text-center mt-4">
           <Link href="/login" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
              Cancelar e voltar
           </Link>
        </div>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}