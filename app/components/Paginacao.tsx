'use client';
interface PaginacaoProps {
  paginaAtual: number;
  setPaginaAtual: React.Dispatch<React.SetStateAction<number>>;
  totalPaginas: number;
}

export default function Paginacao({ paginaAtual, setPaginaAtual, totalPaginas }: PaginacaoProps) {
  return (
    <div className="flex gap-4 mt-6 items-center">
      <button
        onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
        disabled={paginaAtual === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-black">{paginaAtual} de {totalPaginas}</span>
      <button
        onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
        disabled={paginaAtual === totalPaginas}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  );
}
