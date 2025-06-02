// app/api/produtos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { queryDatabase } from '@/lib/mysql';
import { ProdutoItem } from '@/types/ProdutoItem';

export async function GET(request: NextRequest) {
  try {
    // Busca todos os produtos.
    const sql = 'SELECT id, imagem, valor, nome, descricao, quantidade, categoria FROM Produto';
    const rawProdutos = await queryDatabase(sql);

    const produtos: ProdutoItem[] = (rawProdutos as any[]).map(row => ({
      id: row.id,
      imagem: row.imagem,
      valor: typeof row.valor === 'string' ? parseFloat(row.valor) : Number(row.valor), // DECIMAL pode vir como string
      nome: row.nome,
      descricao: row.descricao,
      quantidade: parseInt(row.quantidade, 10),
      categoria: row.categoria,
    }));

    return NextResponse.json(produtos, { status: 200 });

  } catch (error: any) {
    console.error('Erro na API ao buscar produtos:', error.message);
    let errorMessage = 'Erro interno do servidor ao buscar produtos.';
    let statusCode = 500;

    if (error.code) { 
        errorMessage = `Erro no banco de dados: ${error.message}`;
    } else if (error.message.includes("Pool de conexões MySQL não está disponível")) {
        errorMessage = error.message;
        statusCode = 503; // Service Unavailable
    }

    return NextResponse.json({ error: errorMessage, details: error.message }, { status: statusCode });
  }
}

export const dynamic = 'force-dynamic';