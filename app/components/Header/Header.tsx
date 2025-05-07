'use client';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useCarrinho } from '../../context/CarrinhoContext';

export default function Header() {
  const { carrinho } = useCarrinho();
  const quantidadeTotal = carrinho.length;
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">Meu Site</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/carrinho" className="hover:text-gray-400">
                <div className="flex items-center justify-center p-2 rounded hover:bg-gray-700 transition">
                  <FaShoppingCart className="text-xl" />
                  <span className="ml-2">
                    {quantidadeTotal > 0 ? quantidadeTotal : 0}
                  </span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}