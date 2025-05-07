'use client';

import { useState, useEffect } from 'react';
import Card from './components/Card';
import BuscaInput from './components/BuscaInput';
import { ProdutoItem } from '../types/ProdutoItem';
import Paginacao from './components/Paginacao';

export default function Home() {
  const [produtos, setProdutos] = useState<ProdutoItem[]>([]);
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina: number = 6;

  // Carregar página salva no sessionStorage (apenas no cliente)
  useEffect(() => {
    const storedPage = sessionStorage.getItem('homePage');
    if (storedPage) {
      setPaginaAtual(parseInt(storedPage, 10));
    }

    const storedBusca = sessionStorage.getItem('BuscaInput');
    if (storedBusca) {
      setBusca(storedBusca);
    }
  }, []);

  // Salvar busca e página atual no sessionStorage
  useEffect(() => {
    sessionStorage.setItem('BuscaInput', busca);
  }, [busca]);

  useEffect(() => {
    sessionStorage.setItem('homePage', String(paginaAtual));
  }, [paginaAtual]);

  // Carregar produtos
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

  // Ordenação alfabética (padrão)
  const produtosOrdenados = [...produtos].sort((a, b) =>
    (a.nome || '').toLowerCase().localeCompare((b.nome || '').toLowerCase())
  );

  // Filtro por busca
  const produtosFiltrados = produtosOrdenados.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Paginação
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);

  useEffect(() => {
    if (paginaAtual > totalPaginas && totalPaginas > 0) {
      setPaginaAtual(totalPaginas);
    }
  }, [totalPaginas, paginaAtual]);

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const produtosPaginados = produtosFiltrados.slice(indiceInicial, indiceInicial + itensPorPagina);


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
      <Card busca={busca} />
    </main>
  );
}
