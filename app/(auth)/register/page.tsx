'use client';

import { RegisterForm } from "@/components/auth/RegisterForm";


export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>
    </main>
  );
}
