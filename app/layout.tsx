import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Paddy Protector - Slice the Harvest!',
  description: 'A high-energy mobile game where you slice paddy and ballots while avoiding bombs. Achieve political ranks and share your development record!',
  openGraph: {
    title: 'Paddy Protector - Slice the Harvest!',
    description: 'Slice the paddy, avoid the bombs, and become The People\'s Leader!',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paddy Protector - Slice the Harvest!',
    description: 'Slice the paddy, avoid the bombs, and become The People\'s Leader!',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
