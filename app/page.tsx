'use client';

import { useState, useEffect } from 'react';
import Card from './components/Card';
import BuscaInput from './components/BuscaInput';
import { ProdutoItem } from '../types/ProdutoItem';
import Paginacao from './components/Paginacao';
import { useDebounce } from '../hooks/useDebounce';
import { PaginacaoInfo } from '../types/PaginacaoInfo';

export default function Home() {
  const [produtos, setProdutos] = useState<ProdutoItem[]>([]);
  const [paginacao, setPaginacao] = useState<PaginacaoInfo | null>(null);
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(true);

  const itensPorPagina: number = 6;
  
  // evita chamadas excessivas à API enquanto o usuário digita
  const debouncedBusca = useDebounce(busca, 500); // 500ms de espera

  // sessionStorage
  useEffect(() => {
    const storedPage = sessionStorage.getItem('homePage');
    if (storedPage) setPaginaAtual(parseInt(storedPage, 10));
    const storedBusca = sessionStorage.getItem('BuscaInput');
    if (storedBusca) setBusca(storedBusca);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('BuscaInput', busca);
    // Reinicia para a página 1 ao fazer uma nova busca
    if (busca !== sessionStorage.getItem('BuscaInput')) {
      setPaginaAtual(1);
    }
  }, [busca]);

  useEffect(() => {
    sessionStorage.setItem('homePage', String(paginaAtual));
  }, [paginaAtual]);

  // carrega sempre que a página ou a busca mudar
  useEffect(() => {
    async function loadProdutos() {
      setLoading(true);
      try {
        // URL com parâmetros dinâmicos
        const params = new URLSearchParams({
          page: String(paginaAtual),
          limit: String(itensPorPagina),
          busca: debouncedBusca,
        });
        const response = await fetch(`/api/produtos?${params.toString()}`);
  
        if (!response.ok) {
          throw new Error('Falha ao carregar os dados da API.');
        }
  
        const data = await response.json();
  
        // atualiza com os dados recebidos da api
        setProdutos(data.produtos);
        setPaginacao(data.paginacao);

      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setProdutos([]); // Limpa os produtos em caso de erro
      } finally {
        setLoading(false);
      }
    }
  
    loadProdutos();
  }, [paginaAtual, debouncedBusca, itensPorPagina]); // Dependências que disparam a busca

  return (
    <main className="flex flex-col items-center bg-gray-50 min-h-screen p-6">
      <BuscaInput busca={busca} setBusca={setBusca} />
      <h1 className="text-4xl font-bold mb-6 text-black">Produtos</h1>
      
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <Card produtos={produtos} />
          {paginacao && paginacao.totalDeItens > 0 && (
            <Paginacao
              paginaAtual={paginaAtual}
              setPaginaAtual={setPaginaAtual}
              totalPaginas={paginacao.totalDePaginas}
            />
          )}
        </>
      )}
    </main>
  );
}