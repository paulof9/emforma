'use client';
import { useCarrinho } from '../context/CarrinhoContext';

export default function Carrinho() {
  const { carrinho, removerProduto } = useCarrinho();

  const calcularTotal = () =>
    carrinho.reduce((total, item) => total + item.valor * item.quantidade, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">Carrinho de Compras</h1>
      {carrinho.length > 0 ? (
        <div className="space-y-4">
          {carrinho.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
            >
              <div>
                <h2 className="text-lg font-semibold">{item.nome}</h2>
                <p className="text-green-600 font-bold">
                R$ {(item.valor * item.quantidade).toFixed(2)}
              </p>
                <p className="text-gray-600">Quantidade: {item.quantidade}</p>
              </div>
              
              <button
                onClick={() => removerProduto(item)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
              >
                Remover
              </button>
            </div>
          ))}
          <div className="flex items-center bg-white p-4 rounded-lg shadow mt-6 flex-row-reverse">
            <div className="flex items-center">
              <p className="text-green-600 text-xl font-bold ml-4">
                R$ {calcularTotal().toFixed(2)}
              </p>
              <a href={`https://wa.me/5528988156893?text=Olá, gostaria de comprar: ${carrinho.map(item => `${item.nome} - R$ ${item.valor.toFixed(2)} (Quantidade: ${item.quantidade})`).join('; %0A')} - Total: R$ ${calcularTotal().toFixed(2)}`}>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all ml-4">
                  Prosseguir com a Compra
                </button>
              </a>
            </div>
            <h2 className="text-xl font-bold mr-auto">Total</h2>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">O seu carrinho está vazio.</p>
      )}
    </div>
  );
}
