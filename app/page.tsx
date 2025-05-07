'use client';
import { useState, useEffect } from 'react';
import Card from './components/Card';
import BuscaInput from './components/BuscaInput';
import { ProdutoItem } from '../types/ProdutoItem';


export default function Home() {
  const [produtos, setProdutos] = useState<ProdutoItem[]>([]);
  const [busca, setBusca] = useState("");


  useEffect(() => {
    async function loadProdutos() {
      try {
        const response = await fetch('/api/produtos');
        const produtosData: ProdutoItem[] = await response.json();
        setProdutos(produtosData);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    }

    loadProdutos();
  }, []);

  // Ordenação em ordem alfabetica por padrão
  const produtosOrdenados = [...produtos].sort((a, b) =>
    (a.nome || '').toLowerCase().localeCompare((b.nome || '').toLowerCase())
  );

  const produtosFiltrados = produtosOrdenados.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="flex flex-col items-center bg-gray-50 min-h-screen p-6">
      <BuscaInput busca={busca} setBusca={setBusca} />
      <h1 className="text-4xl font-bold mb-6 text-black">Produtos</h1>
      <Card produtos={produtosFiltrados} />
    </main>
  );
}
