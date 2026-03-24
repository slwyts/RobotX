import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ROBOTX | Official Website',
  description: 'ROBOTX - Next-generation decentralized public chain. DPoS consensus, 3s block time, 27 Super Representatives, RX native token.',
  keywords: 'ROBOTX, blockchain, DPoS, RX token, decentralized, public chain, EVM, MetaMask',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'ROBOTX | Official Website',
    description: 'Next-generation decentralized public chain infrastructure. High-performance DPoS consensus, RX address system, RX native token.',
    type: 'website',
    images: ['/favicon.png'],
    url: 'https://robotxhub.ai',
  },
  metadataBase: new URL('https://robotxhub.ai'),
};

export const viewport: Viewport = {
  themeColor: '#050508',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts: Orbitron + Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
