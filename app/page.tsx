'use client';
import { useState, useEffect } from 'react';
import Card from './components/Card';
import BuscaInput from './components/BuscaInput';
import { ProdutoItem } from '../types/ProdutoItem';
import Paginacao from './components/Paginacao';

export default function Home() {
  const [produtos, setProdutos] = useState<ProdutoItem[]>([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState<number>(() => {
    const storedPage = sessionStorage.getItem('homePage');
    return storedPage ? parseInt(storedPage, 10) : 1;
  });

  const itensPorPagina: number = 10;

 // --SessionStorage--
  // Salvar a página atual no sessionStorage
  useEffect(() => {
    sessionStorage.setItem('BuscaInput', busca);
  }, [busca]);
  // Atualizar página atual
  useEffect(() => {
    sessionStorage.setItem('homePage', String(paginaAtual));
  }, [paginaAtual]);

  // Carregar produtos do banco de dados
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

// Ajustar a página atual caso o número de páginas tenha mudado
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
  useEffect(() => {
    if (produtos.length === 0) return;

    const maxPagina = Math.max(1, totalPaginas);
    if (paginaAtual > maxPagina) {
      setPaginaAtual(maxPagina);
    }
  }, [totalPaginas, paginaAtual, produtos]);

  // Calcular o índice inicial para a páginação
  const indiceInicial = Math.max(0, (paginaAtual - 1)) * itensPorPagina;
  const produtosPaginados = produtosFiltrados.slice(indiceInicial, indiceInicial + itensPorPagina);

  return (
    <main className="flex flex-col items-center bg-gray-50 min-h-screen p-6">
      <BuscaInput busca={busca} setBusca={setBusca} />
      <h1 className="text-4xl font-bold mb-6 text-black">Produtos</h1>
      <Card produtos={produtosPaginados} />
      <Paginacao paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} totalPaginas={totalPaginas} />
    </main>
  );
}
