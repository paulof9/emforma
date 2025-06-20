"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import  { UserData } from '@/types/userDate';
import { MoonLoader } from "react-spinners"; 

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/me');

        if (response.ok) {
          const data = await response.json();
          if (data.isLoggedIn && (data.name || data.email)) {
            setUserData(data);
          } else {
            setError("Sessão inválida ou dados do usuário ausentes.");
            Cookies.remove('authToken');
            router.push('/login'); // redireciona para login caso n esteja logado
          }
        } else {
          // erros
          if (response.status === 401 || response.status === 403) {
            setError('Acesso não autorizado. Redirecionando para login...');
            Cookies.remove('authToken'); // limpa token se falhar
            router.push('/login');
          } else {
            setError(`Erro ao buscar dados do usuário: ${response.status} ${response.statusText}`);
          }
        }
      } catch (err: any) {
        console.error("Falha ao buscar dados do usuário:", err);
        setError(err.message || "Ocorreu um erro de rede ao buscar dados do usuário.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' }); // logout endpoint
    } catch (apiError) {
      console.error("Erro na API de logout:", apiError);
    } finally {
      //remove e redireciona
      Cookies.remove('authToken'); 
      setUserData(null); 
      router.push('/login'); 
      router.refresh(); 
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-[var(--roxo-fade)] to-[var(--roxo)]">
        <MoonLoader color={"#ffffff"}/>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }
  
  if (!userData) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-xl text-gray-700">Não foi possível carregar os dados. Por favor, tente fazer login novamente.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-[var(--roxo-fade)] to-[var(--roxo)] flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 md:p-12 w-full max-w-lg transform transition-all duration-500 ease-in-out">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Meu Painel
        </h1>

        <div className="space-y-6 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-500">Nome Completo</label>
            <p className="mt-1 text-xl text-gray-900 p-3 bg-gray-50 rounded-md">
              {userData.name || 'Não informado'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Endereço de Email</label>
            <p className="mt-1 text-xl text-gray-900 p-3 bg-gray-50 rounded-md">
              {userData.email || 'Não informado'}
            </p>
          </div>

            {userData.created_at && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Membro Desde</label>
              <p className="mt-1 text-xl text-gray-900 p-3 bg-gray-50 rounded-md">
                {new Date(userData.created_at).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) || 'Data não disponível'} 
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md
                     transition duration-150 ease-in-out transform hover:scale-105 
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
        >
          Logout
        </button>
      </div>
    </div>
  );
}