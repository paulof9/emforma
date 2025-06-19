import { NextRequest, NextResponse } from 'next/server';
import { queryDatabase } from '@/lib/mysql';
import { ProdutoItem } from '@/types/ProdutoItem';
import { RowDataPacket } from 'mysql2';

interface TotalCount extends RowDataPacket {
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    // le parametros (ex.: /api/produtos?page=2&busca=tenis)
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const busca = searchParams.get('busca') || ''; 

    // VALIDAÇÃO BÁSICA
    if (page < 1 || limit < 1) {
      return NextResponse.json({ error: 'Parâmetros de paginação inválidos.' }, { status: 400 });
    }

    // ve a pagina para buscar (ex.: na página 2 de 10 itens, o offset é 10)
    const offset = (page - 1) * limit;
    // filtro da pesquisa
    const searchTerm = `%${busca}%`; 
    const searchCondition = 'WHERE nome LIKE ?';

    // busca os produtos
    const produtosQuery = `
      SELECT id, imagem, valor, nome, descricao, quantidade, categoria 
      FROM produtos 
      ${searchCondition}
      ORDER BY nome ASC
      LIMIT ? OFFSET ?
    `;
    
    // número total de produtos
    const totalSql = `
      SELECT COUNT(*) as total 
      FROM produtos 
      ${searchCondition}
    `;

    // buscar produtos e contar total
    const [produtosResult, totalResult] = await Promise.all([
      queryDatabase<ProdutoItem[]>(produtosQuery, [searchTerm, limit, offset]),
      queryDatabase<TotalCount[]>(totalSql, [searchTerm])
    ]);

    const totalProdutos = totalResult[0]?.total || 0;

    // garante que o campo `valor` seja sempre um float
    const produtos: ProdutoItem[] = produtosResult.map(produto => ({
      ...produto,
      valor: typeof produto.valor === 'string' ? parseFloat(produto.valor) : Number(produto.valor),
    }));

    // infos pro front
    return NextResponse.json({
      produtos,
      paginacao: {
        paginaAtual: page,
        itensPorPagina: limit,
        totalDeItens: totalProdutos,
        totalDePaginas: Math.ceil(totalProdutos / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Erro na rota GET /api/produtos:', error);
    return NextResponse.json({ error: 'Erro interno ao buscar produtos.' }, { status: 500 });
  }
}

// instrui o Next.js a sempre executar esta rota no servidor para toda req.
export const dynamic = 'force-dynamic';