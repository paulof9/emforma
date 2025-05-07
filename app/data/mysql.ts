import { PrismaClient } from '@prisma/client';
import { ProdutoItem } from '../../types/ProdutoItem';

const prisma = new PrismaClient();

export async function getProdutos(): Promise<ProdutoItem[]> {
  const produtos = await prisma.produto.findMany();

  return produtos.map((produto: { id: number; nome: string; descricao: string; valor: number; imagem: string; quantidade: number; categoria: string }) => ({
    id: produto.id,
    nome: produto.nome,
    descricao: produto.descricao,
    valor: produto.valor,
    imagem: produto.imagem,
    quantidade: produto.quantidade,
    categoria: produto.categoria,
  }));
}