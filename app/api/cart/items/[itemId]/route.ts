import { NextRequest, NextResponse } from 'next/server';
import { executeActionQuery, OkPacket } from '@/lib/mysql';
import jwt, { Secret } from 'jsonwebtoken';

interface CustomJwtPayload extends jwt.JwtPayload {
  userId: number;
}

async function getUserIdFromToken(request: NextRequest): Promise<number | null> {
  const token = request.cookies.get('authToken')?.value;
  if (!token) return null;
  try {
    const secretKey: Secret = process.env.JWT_SECRET || 'seu_segredo_padrao';
    const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
    return decoded.userId;
  } catch (error) {
    console.error("Token inválido ou expirado:", error);
    return null;
  }
}

export async function DELETE(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const itemId = pathname.split('/').pop(); // pega o último segmento da URL

  if (!itemId || isNaN(parseInt(itemId))) {
    return NextResponse.json({ message: 'ID de item inválido.' }, { status: 400 });
  }

  const usuarioId = await getUserIdFromToken(request);
  if (!usuarioId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const sql = 'DELETE FROM carrinhos WHERE id = ? AND usuario_id = ?';

  try {
    const result: OkPacket = await executeActionQuery(sql, [itemId, usuarioId]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Item não encontrado no carrinho ou não pertence a este usuário.' }, { status: 404 });
    }

    return NextResponse.json({ message: `Item ${itemId} removido do carrinho com sucesso.` }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno no servidor ao deletar item.' }, { status: 500 });
  }
}
