import type { Metadata } from 'next';
import {
  Hanken_Grotesk,
  Instrument_Sans,
  Schibsted_Grotesk,
} from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const hankenGrotesk = Hanken_Grotesk({
  variable: '--font-hanken-grotesk',
  subsets: ['latin'],
});

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: '--font-schibsted-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: { default: 'Third Energy', template: '%s | Third Energy' },
  description:
    'Crowdfund solar stations for off-grid communities, earn performance-based returns, and track transparent impact on Hedera.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${hankenGrotesk.variable} ${instrumentSans.variable} ${schibstedGrotesk.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
