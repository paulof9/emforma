'use client';
import { useCarrinho } from '../context/CarrinhoContext';

export default function Carrinho() {
  const { carrinho } = useCarrinho();

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
                <p className="text-gray-600">
                  R$ {item.valor.toFixed(2)}
                </p>
              </div>
              <p className="text-green-600 font-bold">
                R$ {(item.valor * item.quantidade).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mt-6">
            <h2 className="text-xl font-bold">Total</h2>
            <p className="text-green-600 text-xl font-bold">
              R$ {calcularTotal().toFixed(2)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">O seu carrinho está vazio.</p>
      )}
    </div>
  );
}
