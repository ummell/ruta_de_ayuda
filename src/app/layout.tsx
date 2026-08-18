import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EmergencyBanner } from '@/components/layout/emergency-banner';
import { DisclaimerBanner } from '@/components/layout/disclaimer-banner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RutaDeAyuda - Plataforma de Ayuda Humanitaria',
  description: 'Conectando ayuda con quienes la necesitan tras el terremoto en Colombia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <EmergencyBanner />
          <DisclaimerBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
