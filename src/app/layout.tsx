import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, Playfair_Display, Outfit } from 'next/font/google';
import SmoothScroll from '@/components/common/SmoothScroll/SmoothScroll';
import Navigation from '@/components/common/Navigation/Navigation';
import Footer from '@/components/common/Footer/Footer';
import './globals.scss';
import { GoogleAnalytics } from '@next/third-parties/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-serif', // Keeping existing variable name for backward compat
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-geom',
  display: 'swap',
});

export const metadata = {
  title: 'Yu Hang Ang | Developer & Creator',
  description: 'Personal portfolio and blog of Yu Hang Ang.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} ${playfair.variable} ${outfit.variable}`}>
      <body>
        <SmoothScroll>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      )}
    </html>
  );
}
