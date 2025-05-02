'use client';
import { produtosMock } from '../data/produtosMock';
import { useCarrinho } from '../context/CarrinhoContext';

interface CardProps {
  busca: string;
}

export default function Card({ busca }: CardProps) {
  const { adicionarProduto } = useCarrinho();

  const produtosFiltrados = produtosMock.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {produtosFiltrados.map((produto) => (
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
