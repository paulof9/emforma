import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          @paulo
        </h1>
        <li>
              <Link href="/Sobre" className="hover:text-gray-400">
                Sobre
              </Link>
            </li>
      </div>
    </footer>
  );
}