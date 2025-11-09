import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();


  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email e senha são obrigatórios' },
      { status: 400 }
    );
  }

  const user = {
    name: 'Lois Becket',
    email,
  };

  const response = NextResponse.json({ user });

  response.cookies.set('ru-facil-auth', email, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return response;
}
