import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { CarrinhoProvider } from './context/CarrinhoContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emforma Sports",
  description: "Catálogo com os melhores produtos de esportes e fitness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
{
  const header = <Header />;
  const footer = <Footer />;
  
  return (
  
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <CarrinhoProvider>
        {header}
        <main>{children}</main>
        {footer}
        </CarrinhoProvider>
      </body>
    </html>
  );
}