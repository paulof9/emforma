'use client'
interface BuscaInputProps {
  busca: string;
  setBusca: (value: string) => void;
}

export default function BuscaInput({ busca, setBusca }: BuscaInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusca(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Buscar produtos..."
      value={busca}
      onChange={handleChange}
      className="border border-gray-300 px-4 py-2 rounded-lg w-full max-w-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-black"
    />
  );
}
