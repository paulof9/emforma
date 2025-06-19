import { RowDataPacket } from 'mysql2';

export interface ProdutoItem extends RowDataPacket {
  id: number;
  imagem: string;
  valor: number;
  nome: string;
  descricao: string;
  quantidade: number;
  categoria: string;
}