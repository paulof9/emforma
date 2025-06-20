import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/config';
import { JwtPayload as CustomJwtPayload } from '@/types/authInterface';

export async function GET(request: NextRequest) {

  
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ isLoggedIn: false, message: 'Nenhum token fornecido.' }, { status: 401 });
  }

  if (!JWT_SECRET) {
    console.error("ERRO CRÍTICO: JWT_SECRET não está definida nas variáveis de ambiente.");
    return NextResponse.json({ isLoggedIn: false, message: 'Erro de configuração do servidor.' }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

    return NextResponse.json({
      isLoggedIn: true,
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    }, { status: 200 });

  } catch (error) {
    console.error("Token inválido ou expirado:", error);
    return NextResponse.json({ isLoggedIn: false, message: 'Token inválido ou expirado.' }, { status: 401 });
  }
}