import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt, { Secret } from 'jsonwebtoken';
import { dbConfig, JWT_SECRET } from '@/lib/config';
import { JwtPayload as CustomJwtPayload } from '@/types/authInterface';

async function getUserIdFromToken(request: NextRequest): Promise<number | null> {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
        console.log("Token de autenticação não encontrado nos cookies.");
        return null;
    }

    if (!JWT_SECRET) {
        console.error("ERRO CRÍTICO: JWT_SECRET não está definida nas variáveis de ambiente.");
        return null;
    }
    const secretKey: Secret = JWT_SECRET;

    try {
        const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded && typeof decoded.userId === 'number') {
            return decoded.userId;
        } else {
            console.error("userId não encontrado ou tipo inválido no payload do token.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao verificar o token JWT:", error instanceof Error ? error.message : String(error));
        return null;
    }
}


// route handler
export async function POST(request: NextRequest): Promise<NextResponse> {
    const userId = await getUserIdFromToken(request);

    if (!userId) {
        return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    let connection;
    try {
        const body = await request.json();
        const { productId, quantity } = body;

        if (!productId || typeof quantity !== 'number' || quantity <= 0) {
            return NextResponse.json({ message: 'ID do produto e quantidade positiva são obrigatórios.' }, { status: 400 });
        }

        connection = await mysql.createConnection({  });
        await connection.beginTransaction(); 

        // OBTER O ESTOQUE ATUAL DO PRODUTO
        const [productRows] = await connection.execute<mysql.RowDataPacket[]>(
            'SELECT quantidade FROM produtos WHERE id = ? FOR UPDATE',
            [productId]
        );

        if (productRows.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: 'Produto não encontrado.' }, { status: 404 });
        }
        
        const estoqueDisponivel = productRows[0].quantidade;

        // VERIFICAR SE A QUANTIDADE DESEJADA ESTÁ DISPONÍVEL
        if (quantity > estoqueDisponivel) {
            await connection.rollback(); // Desfaz a transação
            return NextResponse.json(
                { message: `Estoque insuficiente. Apenas ${estoqueDisponivel} unidades disponíveis.` },
                { status: 400 }
            );
        }

        // SE O ESTOQUE FOR SUFICIENTE, PROCEDER COM A LÓGICA DO CARRINHO
        const [existingItems] = await connection.execute<mysql.RowDataPacket[]>(
            'SELECT id, quantidade FROM carrinhos WHERE usuario_id = ? AND produto_id = ?',
            [userId, productId]
        );

        if (existingItems.length > 0) {
            // Item já existe, apenas atualizar a quantidade
             await connection.execute(
                'UPDATE carrinhos SET quantidade = ? WHERE id = ?',
                [quantity, existingItems[0].id]
            );
        } else {
            // Item não existe, inserir novo
            await connection.execute(
                'INSERT INTO carrinhos (usuario_id, produto_id, quantidade) VALUES (?, ?, ?)',
                [userId, productId, quantity]
            );
        }
        
        await connection.commit();

        return NextResponse.json({ message: 'Carrinho atualizado com sucesso!' }, { status: 200 });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Erro ao atualizar carrinho:", error);
        return NextResponse.json({ message: 'Erro ao atualizar carrinho' }, { status: 500 });

    } finally {
        if (connection) {
            await connection.end();
        }
    }
}