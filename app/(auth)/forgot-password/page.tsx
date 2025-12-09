'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError('Não foi possível enviar o email. Verifique o endereço informado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-2xl shadow-xl bg-white/95 backdrop-blur-sm p-8 border-none animate-in fade-in zoom-in-95 duration-300">
      
      {success ? (
        <div className="text-center space-y-4 animate-in slide-in-from-right-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verifique seu email</h1>
          <p className="text-sm text-slate-600">
            Enviamos um código de recuperação para <strong>{email}</strong>.
            Use esse código na próxima tela para criar uma nova senha.
          </p>
          
          <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Link href="/reset-password">Digitar Código</Link>
          </Button>

          <Button asChild variant="ghost" className="w-full text-slate-500">
             <Link href="/login">Voltar ao Login</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <Link href="/login" className="inline-flex items-center text-xs text-slate-500 hover:text-blue-600 mb-4 transition-colors">
              <ArrowLeft className="mr-1 h-3 w-3" /> Voltar ao Login
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Recuperar Senha</h1>
            <p className="text-sm text-slate-500 mt-2">
              Digite seu email institucional para receber o token de redefinição.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="aluno@ufrpe.br"
                  className="pl-9 bg-slate-50/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded text-center font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Token'
              )}
            </Button>
          </form>
        </>
      )}
    </Card>
  );
}