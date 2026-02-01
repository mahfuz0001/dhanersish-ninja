import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dhaner Ninja - Dhanersish version of fruit ninja!',
  description: 'Dhoner sish e vot din, Fruit Ninja (Dhoner sish edition)',
  // This must match your actual deployment URL
  metadataBase: new URL('https://dhanersish.vercel.app'),
  
  openGraph: {
    title: 'Dhaner Ninja - Dhanersish version of fruit ninja!',
    description: 'Dhoner sish e vot din, Fruit Ninja (Dhoner sish edition)',
    url: 'https://dhanersish.vercel.app',
    siteName: 'Dhaner Ninja',
    images: [
      {
        // Using the absolute URL to ensure it loads regardless of domain matching
        url: 'https://www.dhanershish.org/social-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Dhaner Ninja Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhaner Ninja - Dhanersish version of fruit ninja!',
    description: 'Dhoner sish e vot din, Fruit Ninja (Dhoner sish edition)',
    images: ['https://www.dhanershish.org/social-preview.jpg'],
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
        {/* This makes the Discord embed border Green! */}
        <meta name="theme-color" content="#15803d" />
      </head>
      <body className={inter.className}>
        <Analytics/>
        {children}
      </body>
    </html>
  );
}
