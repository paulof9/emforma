'use client';
import { useState } from 'react';
import Card from './components/Card';
import BuscaInput from './components/BuscaInput';

export default function Home() {
  const [busca, setBusca] = useState("");

  return (
    <main className="flex flex-col items-center bg-gray-50 min-h-screen p-6">
      <BuscaInput busca={busca} setBusca={setBusca} />
      <h1 className="text-4xl font-bold mb-6 text-black">Produtos</h1>
      <Card busca={busca} />
    </main>
  );
}