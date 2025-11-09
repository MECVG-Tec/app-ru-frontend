'use client';

import { RegisterForm } from "@/components/auth/RegisterForm";


export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-sky-400">
      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>
    </main>
  );
}
