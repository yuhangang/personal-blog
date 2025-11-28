import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import './globals.scss';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yu Hang Ang - Developer & Creator',
  description: 'Personal blog featuring insights on software development, mobile apps, and technology.',
  openGraph: {
    title: 'Yu Hang Ang - Developer & Creator',
    description: 'Personal blog featuring insights on software development, mobile apps, and technology.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
