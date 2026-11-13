import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AudioProvider } from '@/components/audio/AudioContext';
import { LanguageProvider } from '@/components/i18n/LanguageContext';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GlobalAudioPlayer } from '@/components/audio/GlobalAudioPlayer';
import { AuthModal } from '@/components/auth/AuthModal';
import { MindfulnessProvider } from '@/components/mindfulness/MindfulnessContext';
import { MindfulnessModal } from '@/components/mindfulness/MindfulnessModal';
import { DharmaMixerProvider, FloatingDharmaAudioPlayer } from '@/components/audio/DharmaAudioPlayer';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: '#FAF7F0',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://giacngo.vercel.app'),
  title: 'DHARMA — Không Gian Chánh Niệm & Tam Tạng Pháp Bảo',
  description:
    'Nền tảng tu học Phật pháp thanh tịnh: Thời khóa chánh niệm 4 thời, Lịch Vạn Niên & Trai Giới, Tam Tạng Kinh Điển và Không Gian Hành Trì.',
  keywords: [
    'Dharma',
    'Phật pháp',
    'Chánh niệm',
    'Thiền định',
    'Kinh Pháp Cú',
    'Lịch Vạn Niên Phật Giáo',
    'Tam Tạng Kinh Điển',
  ],
  authors: [{ name: 'Ban Biên Tập Dharma' }],
  openGraph: {
    title: 'DHARMA — Không Gian Chánh Niệm & Tam Tạng Pháp Bảo',
    description:
      'Không gian thanh tịnh để thực hành chánh niệm, thọ trì kinh điển, tra cứu lịch trai giới và tích lũy công đức mỗi ngày.',
    type: 'website',
    locale: 'vi_VN',
    url: process.env.APP_URL || 'https://giacngo.vercel.app',
    siteName: 'DHARMA',
    images: [{ url: '/dharma-logo.png?v=2', width: 800, height: 800, alt: 'Dharma Logo' }],
  },
  icons: {
    icon: [
      { url: '/dharma-logo.png?v=2', type: 'image/png' },
      { url: '/favicon.png?v=2', type: 'image/png' },
      { url: '/favicon.ico?v=2' },
    ],
    shortcut: '/dharma-logo.png?v=2',
    apple: '/dharma-logo.png?v=2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { document.documentElement.classList.add('light'); document.documentElement.classList.remove('dark'); } catch(e) {}`,
          }}
        />
        <link rel="icon" href="/dharma-logo.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/dharma-logo.png?v=2" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#2C1E10] overflow-x-hidden selection:bg-[#D9A02E]/25 selection:text-[#2C1E10]">
        <LanguageProvider>
          <AuthProvider>
            <AudioProvider>
              <DharmaMixerProvider>
                <MindfulnessProvider>
                  <Header />
                  <main className="flex-1 w-full min-w-0 pb-[72px]">{children}</main>
                  <MobileBottomNav />
                  <FloatingDharmaAudioPlayer />
                  <GlobalAudioPlayer />
                  <AuthModal />
                  <MindfulnessModal />
                </MindfulnessProvider>
              </DharmaMixerProvider>
            </AudioProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
