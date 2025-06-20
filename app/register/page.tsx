"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function RegisterPage() {
  const [nome, setName] = useState(''); // nome do usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // confirmação de senha
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // validação básica dos campos
    if (!nome || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    // valida se as senhas coincidem
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', { // Endpoint para registro
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, password }), // Enviando nome, email e senha
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha no registro.');
      }

      console.log('Registro bem-sucedido:', data); 
      router.push('/'); // redireciona para a pagina principal

    } catch (err) {
      console.error('Erro no registro:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-t from-[var(--roxo-fade)] to-[var(--roxo)] min-h-screen flex flex-col items-center justify-center">
      <main className="bg-white min-w-lg mx-auto p-8 md:p-12 rounded-lg shadow-2xl w-full max-w-md">
        <section>
          <h3 className="font-bold text-2xl text-black">Create your Account</h3>
          <p className="text-gray-600 pt-2">Get started by creating your account.</p>
        </section>

        <section className="mt-10">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            {/* Campo Nome */}
            <div className="mb-6 pt-3 rounded bg-gray-200">
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="nanomeme">
                Full Name
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                required
              />
            </div>

            {/* Campo Email */}
            <div className="mb-6 pt-3 rounded bg-gray-200">
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                required
              />
            </div>

            {/* Campo Senha */}
            <div className="mb-6 pt-3 rounded bg-gray-200">
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                required
              />
            </div>

            {/* Campo Confirmar Senha */}
            <div className="mb-6 pt-3 rounded bg-gray-200">
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Botão de Registro */}
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-50 cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </section>
      </main>

      <div className="max-w-lg mx-auto text-center mt-12 mb-6">
        <p className="text-white">
          Already have an account?{' '}

          <a href="/login" className="font-bold hover:underline">
            Sign In
          </a>
          .
        </p>
      </div>
    </div>
  );
}