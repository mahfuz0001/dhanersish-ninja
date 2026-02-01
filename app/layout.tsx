import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dhaner Ninja - Dhanersish version of fruit ninja!',
  description: 'Dhoner sish e vot din, Fruit Ninja (Dhoner sish edition)',
  metadataBase: new URL('https://dhanersish.vercel.app'),
  
  openGraph: {
    title: 'Dhaner Ninja - Dhanersish version of fruit ninja!',
    description: 'Dhoner sish e vot din, Fruit Ninja (Dhoner sish edition)',
    url: 'https://dhanersish.vercel.app',
    siteName: 'Dhaner Ninja',
    images: [
      {
        url: '/og.png', // Pointing directly to your public/og.png
        width: 1200,
        height: 630,
        alt: 'Dhaner Ninja Game Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhaner Ninja - Dhanersish version of fruit ninja!',
    description: 'Dhoner sish e vot din, Fruit Ninja (Dhoner sish edition)',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Makes the Discord embed line Paddy Green */}
        <meta name="theme-color" content="#15803d" />
      </head>
      <body className={inter.className}>
        <Analytics/>
        {children}
      </body>
    </html>
  );
}
