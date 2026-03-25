import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ConvexClientProvider from '@/components/providers/ConvexClientProvider';

export const metadata: Metadata = {
  title: {
    default: 'Hirwa Ambassadeur — Breaking News & In-Depth Coverage',
    template: '%s | Hirwa Ambassadeur',
  },
  description:
    'Your trusted source for breaking news, politics, business, technology and more from Africa and the world.',
  keywords: ['news', 'Africa', 'Rwanda', 'politics', 'business', 'technology', 'Kigali'],
  authors: [{ name: 'Hirwa Ambassadeur Editorial' }],
  creator: 'Hirwa Ambassadeur',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon-180x180.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Hirwa Ambassadeur',
    title: 'Hirwa Ambassadeur — Breaking News & In-Depth Coverage',
    description:
      'Your trusted source for breaking news, politics, business, technology and more from Africa and the world.',
    images: [
      {
        url: '/favicon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Hirwa Ambassadeur Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hirwa Ambassadeur',
    description: 'Breaking news and in-depth coverage from Africa and the world.',
    images: ['/favicon-192x192.png'],
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hirwa Ambassadeur',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f2318',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts — with font-display=swap for faster rendering */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Source+Sans+3:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Google AdSense — Defer loading to improve FCP */}
        {publisherId && (
          <script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
          />
        )}
      </head>
      <body>
        <ConvexClientProvider>
          <div id="app-shell">
            <Navbar />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}