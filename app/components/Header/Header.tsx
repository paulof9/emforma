"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { FaUser, FaShoppingCart } from "react-icons/fa";
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await fetch('/api/auth/me'); // Chama o endpoint /api/auth/me
        if (response.ok) {
          const userData = await response.json();
          if (userData.isLoggedIn) {
            setIsLoggedIn(true);
            setUserName(userData.name || userData.email); // dados da api
          } else {
            setIsLoggedIn(false);
            setUserName(null);
          }
        } else {
          setIsLoggedIn(false);
          setUserName(null);
        }
      } catch (error) {
        console.error("Erro ao buscar status do usuário via /api/auth/me:", error);
        setIsLoggedIn(false);
        setUserName(null);
      }
    };

    fetchUserStatus();
  }, [pathname]);

  const handleUserButtonClick = () => {
    router.push('/dashboard');
  };

  const handleCartRedirect = () => {
    router.push('/carrinho');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      Cookies.remove('authToken');
      setIsLoggedIn(false);
      setUserName(null);
      router.refresh(); // avalia estado do servidor em sinergia com o middleware
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
     <nav className="bg-[var(--roxo)] text-white p-4">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold">
        <Image
          src="/logo.png"
          alt="Emforma Sports Logo"
          width={150}
          height={40}
          className="inline-block mr-2"
        />
        </Link>

        <div className="flex items-center gap-x-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleCartRedirect}
                className="hover:text-gray-300 flex items-center"
                title="Carrinho de Compras"
              >
                <FaShoppingCart />
                {/* <span className="ml-1 hidden sm:inline">Carrinho</span> */}
              </button>

              <button
                onClick={handleUserButtonClick}
                className="hover:text-gray-300 flex items-center"
                title="Ir para meu perfil"
              >
                <FaUser />
                <span className="ml-1 hidden sm:inline">{ userName || 'Meu Perfil'}</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">Login</Link>
              <Link href="/register" className="hover:text-gray-300">Registrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}