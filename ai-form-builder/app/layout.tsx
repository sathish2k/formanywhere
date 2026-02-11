import { SessionProvider } from '@/shared/auth';
import { ThemeProvider } from '@/shared/theme';
import { Public_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const publicSans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
});

export const metadata = {
  title: 'FormBuilder AI',
  description: 'Build powerful forms in minutes, not hours.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={publicSans.variable}>
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
