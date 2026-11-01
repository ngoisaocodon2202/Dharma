import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AudioProvider } from '@/components/audio/AudioContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GlobalAudioPlayer } from '@/components/audio/GlobalAudioPlayer';
import { AuthModal } from '@/components/auth/AuthModal';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FFF8E7',
};

export const metadata: Metadata = {
  title: 'Phật Pháp — Cổng Thông Tin, Thư Viện, Chùa & Không Gian Thiền Định',
  description:
    'Một không gian thanh tịnh để học hỏi, chia sẻ và kết nối Phật pháp. Nơi những giá trị tỉnh thức, từ bi và trí tuệ được lan tỏa.',
  keywords: [
    'Phật pháp',
    'Chánh niệm',
    'Thiền định',
    'Kinh Pháp Cú',
    'Chùa Việt Nam',
    'Pháp thoại',
    'Tu học Phật giáo',
  ],
  authors: [{ name: 'Ban Biên Tập Phật Pháp' }],
  openGraph: {
    title: 'Phật Pháp — Nền Tảng Tu Học & Cộng Đồng Phật Giáo',
    description:
      'Một không gian thanh tịnh để học hỏi, chia sẻ và kết nối Phật pháp. Lộ trình học Phật, bản đồ chùa chiền và phòng thiền trực tuyến.',
    type: 'website',
    locale: 'vi_VN',
    url: 'http://localhost:3000',
    siteName: 'Phật Pháp',
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Phật Pháp Logo' }],
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.png',
    apple: '/logo.png',
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
            __html: `try { document.documentElement.classList.remove('dark'); localStorage.removeItem('theme'); } catch(e) {}`,
          }}
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory-50 text-charcoal-900 overflow-x-hidden selection:bg-saffron-500/20 selection:text-saffron-800">
        <AuthProvider>
          <AudioProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileBottomNav />
            <GlobalAudioPlayer />
            <AuthModal />
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
