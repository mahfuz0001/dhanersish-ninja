import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dhaner Ninja - Dhanersish version of fruit ninja!',
  description: 'Dhoner sish e vot din, Fruit Ninja (Dhoner sish edition)',
  openGraph: {
    title: 'Dhaner Ninja - Dhanersish version of fruit ninja!',
    description: 'Dhoner sish e vot din, Fruit Ninja (Dhoner sish edition)',
    images: [
      {
        url: 'https://www.dhanershish.org/social-preview.jpg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhaner Ninja - Dhanersish version of fruit ninja!',
    description: 'Dhoner sish e vot din, Fruit Ninja (Dhoner sish edition)',
    images: [
      {
        url: 'https://www.dhanershish.org/social-preview.jpg',
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
