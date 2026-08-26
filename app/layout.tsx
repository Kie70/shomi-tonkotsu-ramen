import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://kie70.github.io/shomi-tonkotsu-ramen'
).replace(/\/$/, '');

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: '赏味 SHŌMI｜豚骨拉面',
  description: '从第一束面、溏心蛋到叉烧，以十五帧图文赏味一碗日式豚骨拉面。',
  openGraph: {
    title: '赏味 SHŌMI｜豚骨拉面',
    description: '一碗豚骨拉面，从热气升起到余味停留。',
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: 'SHŌMI 豚骨拉面' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '赏味 SHŌMI｜豚骨拉面',
    description: '一碗豚骨拉面，从热气升起到余味停留。',
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
