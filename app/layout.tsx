import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/nav';

export const metadata: Metadata = {
  title: 'NewsDrafts',
  description: 'Monitor feeds and draft tweets manually.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="max-w-6xl mx-auto px-4 pb-10">{children}</main>
      </body>
    </html>
  );
}
