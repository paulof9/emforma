'use client';
// Hook!
import { createContext, useContext, useState } from 'react';
import { ProdutoItem } from '../../types/ProdutoItem';

type CarrinhoContextType = {
  carrinho: ProdutoItem[];
  adicionarProduto: (produto: ProdutoItem) => void;
};

export const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

// Provider (tornar global o estado do carrinho)
export const CarrinhoProvider = ({ children }: { children: React.ReactNode }) => {
  const [carrinho, setCarrinho] = useState<ProdutoItem[]>([]);

  const adicionarProduto = (produto: ProdutoItem) => {
    const produtoExistente = carrinho.find((item) => item.id === produto.id);
    if (produtoExistente) return;

    setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
  };

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarProduto }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado com CarrinhoProvider');
  }
  return context;
};