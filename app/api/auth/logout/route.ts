import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logout bem-sucedido' },
      { status: 200 }
    );

    response.cookies.set('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', 
      sameSite: 'lax', 
      path: '/',       
      expires: new Date(0), // data de expiração
    });

    console.log("API de Logout: Cookie authToken instruído para ser removido.");
    return response;

  } catch (error) {
    console.error("Erro na API de logout:", error);
    return NextResponse.json(
      { success: false, message: 'Erro ao tentar fazer logout.' },
      { status: 500 }
    );
  }
}