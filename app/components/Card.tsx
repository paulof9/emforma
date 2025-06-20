'use client';
import { useCarrinho } from '../context/CarrinhoContext';
import { ProdutoItem } from '../../types/ProdutoItem';

interface CardProps {
  produtos: ProdutoItem[];
}

export default function Card({ produtos }: CardProps) {
  const { adicionarProduto } = useCarrinho();

return (
  <div className="w-full max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
    {produtos.map((produto) => (
      <div key={produto.id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-full h-40 object-cover rounded"
        />
        <div className="flex-grow pt-4">
          <h2 className="text-xl font-bold text-black">{produto.nome}</h2>
          
          <p className="text-gray-700 mt-1 line-clamp-2">
            {produto.descricao}
          </p>

          <p className="text-green-600 font-semibold mt-1">R$ {produto.valor.toFixed(2)}</p>
        </div>
        
        <button
          className="mt-4 bg-[var(--roxo)] text-white py-2 px-4 rounded w-full hover:bg-[var(--roxo-fade)] transition-colors"
          onClick={() => adicionarProduto(produto)}
        >
          Adicionar ao carrinho
        </button>
      </div>
    ))}
  </div>
);
}