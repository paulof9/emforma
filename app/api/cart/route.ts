import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { dbConfig, JWT_SECRET } from '@/lib/config';
import { UserTokenPayload } from '@/types/authInterface';

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
        const decoded = jwt.verify(token, secretKey) as JwtPayload;

        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded && typeof decoded.userId === 'number') {
            return decoded.userId;
        } else {
            console.error("userId não encontrado no payload do token decodificado ou tipo inválido.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao verificar o token JWT:", error instanceof Error ? error.message : String(error));
        return null;
    }
}

export async function GET(request: NextRequest) {
    const userId = await getUserIdFromToken(request);

    if (!userId) {
        return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    let connection;
    try {
        connection = await mysql.createConnection({
            ...dbConfig,
            ssl: {
                rejectUnauthorized: true
            }
        });

        // Query para o schema: junta 'carrinhos' e 'produtos'
        const query = `
            SELECT 
                c.id AS itemId, 
                c.produto_id AS productId,
                c.quantidade AS quantity,
                p.nome AS productName,
                p.valor AS productPrice,
                p.imagem AS productImage
            FROM 
                carrinhos AS c
            JOIN 
                produtos AS p ON c.produto_id = p.id
            WHERE 
                c.usuario_id = ?
        `;

        const [items] = await connection.execute<mysql.RowDataPacket[]>(query, [userId]);

        // Retorna a lista de itens diretamente. Se não houver itens, retorna um array vazio.
        return NextResponse.json({ items }, { status: 200 });

    } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
        return NextResponse.json({ message: 'Erro ao buscar carrinho', error: errorMessage }, { status: 500 });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (endError) {
                console.error("Erro ao fechar a conexão:", endError);
            }
        }
    }
}