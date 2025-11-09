import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get('ru-facil-auth')?.value;

  if (!email) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = {
    name: 'Lois Becket',
    email,
  };

  return NextResponse.json({ user });
}
