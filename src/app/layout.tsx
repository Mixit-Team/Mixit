import { Metadata } from 'next';
import Providers from './providers';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Mixit',
  description: 'Mixit Application',
  keywords: ['Next.js', 'React', 'App Router'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <main className="bg-[#F4F4F5]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
