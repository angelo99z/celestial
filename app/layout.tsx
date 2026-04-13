import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '700', '800'],
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Celestial - Immersive Digital Experience',
  description: 'A sensory journey through light, sound, and digital matter.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${plusJakartaSans.variable} ${beVietnamPro.variable}`}>
      <body className="bg-[#070e1b] text-[#e2e8fb] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
