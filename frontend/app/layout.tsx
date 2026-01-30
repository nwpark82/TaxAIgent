import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'TaxAIgent - AI 세무 비서',
  description: '1인 사업자를 위한 AI 세무 비서 서비스',
  keywords: ['세무', '세금', 'AI', '경비처리', '1인사업자', '프리랜서'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
