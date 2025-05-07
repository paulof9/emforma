'use client';
import { useCarrinho } from '../context/CarrinhoContext';
import { ProdutoItem } from '../../types/ProdutoItem';

interface CardProps {
  produtos: ProdutoItem[];
}

export default function Card({ produtos }: CardProps) {
  const { adicionarProduto } = useCarrinho();

  return (
    <div className="grid grid-cols-3 justify-center gap-6">
      {produtos.map((produto) => (
        <div key={produto.id} className="bg-white shadow-lg rounded-lg p-6 pb-16 max-w-xs relative">
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-full h-40 object-cover rounded"
          />
          <h2 className="text-xl font-bold mt-2 text-black">{produto.nome}</h2>
          <p className="text-gray-700 mt-1">{produto.descricao}</p>
          <p className="text-green-600 font-semibold mt-1">R$ {produto.valor.toFixed(2)}</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded w-fit hover:bg-blue-600 transition-all absolute bottom-4 left-4 right-4"
            onClick={() => adicionarProduto(produto)}
          >
            Adicionar ao carrinho
          </button>
        </div>
      ))}
    </div>
  );
}
