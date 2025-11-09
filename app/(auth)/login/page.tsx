'use client';

import { LoginForm } from "@/components/auth/LoginForm";


export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-sky-400">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
