'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { ProdutoItem } from '../../types/ProdutoItem';

interface CarrinhoContextType {
  carrinho: ProdutoItem[];
  adicionarProduto: (produto: ProdutoItem) => void;
  removerProduto: (produto: ProdutoItem) => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [carrinho, setCarrinho] = useState<ProdutoItem[]>([]);

  // carrega carrinho do sessionStorage APÓS renderizar no cliente
  useEffect(() => {
    const storedCarrinho = sessionStorage.getItem('carrinho');
    if (storedCarrinho) {
      setCarrinho(JSON.parse(storedCarrinho));
    }
  }, []);

  // salva no sessionStorage sempre que o carrinho mudar
  useEffect(() => {
    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarProduto = (produto: ProdutoItem) => {
    setCarrinho((prev) => {
      const produtoExistente = prev.find((item) => item.id === produto.id);

      if (produtoExistente) {
        if((produtoExistente.quantidade || 0) < produto.quantidade){
          return prev.map((item) =>
            item.id === produto.id ? { ...item, quantidade: (item.quantidade || 1) + 1 } : item
          );
        }else{
          // Retorna o valor de antes caso o produto já tenha a quantidade máxima
          return prev;
        }
      } else {
        return [...prev, { ...produto, quantidade: 1 }];
      }
    });
  };

  // Função para remover um item
  const removerProduto = (produto: ProdutoItem) => {
    if(produto.quantidade === 1){
      setCarrinho((prev) => prev.filter((item) => item.id !== produto.id));
    }else{
      setCarrinho((prev) =>
        prev.map((item) =>
          item.id === produto.id ? { ...item, quantidade: (item.quantidade || 1) - 1 } : item
        )
      );
    }
  };

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarProduto, removerProduto }}>
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