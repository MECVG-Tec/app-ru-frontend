'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, User, BookOpen, Accessibility } from 'lucide-react';
import { RegisterRequest } from '@/lib/types';

export function RegisterForm() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegisterRequest>({
    nome: '',
    email: '',
    senha: '',
    ehAluno: true,
    matricula: '',
    moradorResidencia: false,
    prefereAltoContraste: false,
    prefereLinguagemSimples: false,
    prefereFonteGrande: false,
  });

  const handleChange = (field: keyof RegisterRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.ehAluno && !formData.matricula) {
      setError('A matrícula é obrigatória para alunos.');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
    } catch (err) {
      console.error(err);
      setError('Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-2xl shadow-xl bg-white/95 backdrop-blur-sm p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Criar Conta</h1>
        <p className="text-xs text-slate-500 mt-1">
          Preencha seus dados para acessar o RU Fácil.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Seção: Dados Pessoais */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600 border-b border-blue-100 pb-1 mb-2">
            <User className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Dados Pessoais</span>
          </div>

          <div className="space-y-1">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              placeholder="Ex: Maria Silva"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email Institucional</Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@ufrpe.br"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={formData.senha}
              onChange={(e) => handleChange('senha', e.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>

        {/* Seção: Vínculo */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-blue-600 border-b border-blue-100 pb-1 mb-2">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Vínculo</span>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <Checkbox 
              id="ehAluno" 
              checked={formData.ehAluno}
              onCheckedChange={(v) => handleChange('ehAluno', !!v)}
            />
            <Label htmlFor="ehAluno" className="cursor-pointer">Sou Aluno da UFRPE</Label>
          </div>

          {formData.ehAluno && (
            <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-top-2">
              <div className="space-y-1">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  placeholder="Ex: 2024..."
                  value={formData.matricula}
                  onChange={(e) => handleChange('matricula', e.target.value)}
                  required={formData.ehAluno}
                />
              </div>
              
              <div className="flex items-center space-x-2 border p-2 rounded-md bg-slate-50">
                <Checkbox 
                  id="morador" 
                  checked={formData.moradorResidencia}
                  onCheckedChange={(v) => handleChange('moradorResidencia', !!v)}
                />
                <Label htmlFor="morador" className="cursor-pointer text-xs">Sou morador da residência universitária</Label>
              </div>
            </div>
          )}
        </div>

        {/* Seção: Acessibilidade */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-blue-600 border-b border-blue-100 pb-1 mb-2">
            <Accessibility className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Acessibilidade</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="contraste" 
                checked={formData.prefereAltoContraste}
                onCheckedChange={(v) => handleChange('prefereAltoContraste', !!v)}
              />
              <Label htmlFor="contraste" className="text-xs cursor-pointer">Alto Contraste</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="fonte" 
                checked={formData.prefereFonteGrande}
                onCheckedChange={(v) => handleChange('prefereFonteGrande', !!v)}
              />
              <Label htmlFor="fonte" className="text-xs cursor-pointer">Fonte Grande</Label>
            </div>

            <div className="flex items-center space-x-2 col-span-2">
              <Checkbox 
                id="linguagem" 
                checked={formData.prefereLinguagemSimples}
                onCheckedChange={(v) => handleChange('prefereLinguagemSimples', !!v)}
              />
              <Label htmlFor="linguagem" className="text-xs cursor-pointer">Linguagem Simples</Label>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded text-center mt-2 font-medium">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 mt-4"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Finalizar Cadastro'
          )}
        </Button>

        <p className="text-xs text-slate-500 text-center mt-2">
          Já tem conta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Fazer login
          </Link>
        </p>
      </form>
    </Card>
  );
}