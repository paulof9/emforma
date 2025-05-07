'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { ProdutoItem } from '../../types/ProdutoItem';

interface CarrinhoContextType {
  carrinho: ProdutoItem[];
  adicionarProduto: (produto: ProdutoItem) => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [carrinho, setCarrinho] = useState<ProdutoItem[]>([]);

  // Carrega carrinho do sessionStorage APÓS renderizar no cliente
  useEffect(() => {
    const storedCarrinho = sessionStorage.getItem('carrinho');
    if (storedCarrinho) {
      setCarrinho(JSON.parse(storedCarrinho));
    }
  }, []);

  // Salva no sessionStorage sempre que o carrinho mudar
  useEffect(() => {
    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarProduto = (produto: ProdutoItem) => {
    setCarrinho((prev) => [...prev, produto]);
  };

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarProduto }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
}
