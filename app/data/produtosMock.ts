import { ProdutoItem } from '../../types/ProdutoItem';

export const produtosMock: ProdutoItem[] = [
  {
    id: 1,
    nome: 'Bola de Futebol',
    descricao: 'Tamanho oficial e resistente.',
    valor: 89.9,
    imagem: '/imagens/bola-futebol.jpg',
    quantidade: 1,
    categoria: 'esportes',
  },
  {
    id: 2,
    nome: 'Caneleira',
    descricao: 'Leve e com ótima proteção.',
    valor: 39.5,
    imagem: '/imagens/caneleira.jpg',
    quantidade: 1,
    categoria: 'esportes',
  },
  {
    id: 3,
    nome: 'Luva de Goleiro',
    descricao: 'Ajuste firme e boa aderência.',
    valor: 59.9,
    imagem: '/imagens/luva-goleiro.jpg',
    quantidade: 1,
    categoria: 'esportes',
  },
];
