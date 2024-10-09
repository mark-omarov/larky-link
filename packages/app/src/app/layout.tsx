import type { Metadata } from 'next';
import Image from 'next/image';
import { Inter, Bungee } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const bungee = Bungee({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Larky Link',
  description: 'Charting Joyful Links',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          'p-x-2 container max-w-3xl space-y-8 pb-2 pt-20',
        )}
      >
        <header className="mx-auto pl-0 pr-0">
          <Image
            src="/icon.png"
            width={50}
            height={50}
            alt="Picture of the author"
            className="mx-auto"
          />
          <h1
            className={cn(
              'text-center text-3xl text-[--logo]',
              bungee.className,
            )}
          >
            Larky Link
          </h1>
          <h2 className="text-center">Charting Joyful Links</h2>
        </header>
        {children}
      </body>
    </html>
  );
}
