import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/providers/AuthProvider';
import './globals.css';

// Fonte local otimizada (sem dependência de CDN externo)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Dalva | Amorim Rodrigues Advogados',
  description: 'Plataforma inteligente de captação e gestão de clientes jurídicos — Amorim Rodrigues Advogados',
  keywords: ['advocacia', 'CRM jurídico', 'legaltech', 'direito do consumidor', 'direito trabalhista', 'direito previdenciário'],
  robots: 'noindex, nofollow', // Privado — não indexar
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
