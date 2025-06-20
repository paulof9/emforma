import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--roxo)] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-sm font-bold">
            &copy; 2025 Emforma Sports. Todos os direitos reservados.
          </h1>
            <a href="https://www.instagram.com/emforma.sports/" className="underline">Instagram</a> <span>| Localizado em Piúma-ES.</span>
        </div>
              <li>
                <Link href="/Sobre" className="hover:text-gray-400">
                  Sobre
                </Link>
              </li>
      </div>
    </footer>
  );
}