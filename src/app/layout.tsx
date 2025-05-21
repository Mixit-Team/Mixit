import { Metadata } from 'next';
import Providers from './providers';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: '내 Next.js 앱',
  description: 'Next.js App Router로 만든 애플리케이션',
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
