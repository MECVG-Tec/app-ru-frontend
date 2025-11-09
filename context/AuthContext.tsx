'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/', '/login', '/register'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsReady(true);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublic) {
      router.replace('/login');
    }

    if (user && (pathname === '/' || pathname === '/login' || pathname === '/register')) {
      router.replace('/home');
    }
  }, [isReady, pathname, router, user]);

  async function login(email: string, password: string) {
    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error('Credenciais inválidas');
    }

    const data = await res.json();
    setUser(data.user);
    router.push('/home');
  }

  async function register(data: { name: string; email: string; password: string }) {
    await login(data.email, data.password);
  }

  async function logout() {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
      router.push('/login');
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Carregando...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
