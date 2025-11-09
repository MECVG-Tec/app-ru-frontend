'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState('Lois Becket');
  const [email, setEmail] = useState('loisbecket@gmail.com');
  const [birthdate, setBirthdate] = useState('2024-03-18');
  const [phone, setPhone] = useState('(81) 99999-9999');
  const [password, setPassword] = useState('********');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-2xl shadow-lg bg-white p-8">
      <h1 className="text-3xl font-semibold text-slate-900 mb-6">Registrar</h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          <Label htmlFor="birthdate">Data de Aniversário</Label>
          <Input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Celular</Label>
          <Input
            id="phone"
            placeholder="(81) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Register'}
        </Button>

        <p className="text-sm text-slate-500 text-center mt-2">
          Já tem conta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Fazer login
          </Link>
        </p>
      </form>
    </Card>
  );
}
