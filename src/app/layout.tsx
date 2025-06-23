import { Metadata, Viewport } from 'next';
import Providers from './providers';
import '../styles/globals.css';
import Script from 'next/script';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Mixit',
  description: '믹스잇 음식/음료 조합 추천 커뮤니티',
  keywords: [
    '음식조합',
    '음료조합',
    '카페메뉴추천',
    '믹스잇',
    'mixit',
    '편의점 음식조합',
    '카페 음료레시피',
    '편의점 음식 레시피',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: 'Mixit',
    description: '믹스잇 음식/음료 조합 추천 커뮤니티',
    url: 'https://mixit.io.kr',
    siteName: 'Mixit',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'naver-site-verification': 'e438aca974fbb29320fb7c5e872e542b320e0b78',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="google-site-verification"
          content="aA4kTSnhP1DmGqeMIeVdFJ0kOUDIVtkvjpEXGJs_wkc"
        />
         <>
            <Script

              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUCLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUCLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
      </head>
      <body>
        <Providers>
          <main className="bg-[#F4F4F5]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
