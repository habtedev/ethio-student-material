import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import PwaInstallPrompt from '@/src/components/PwaInstallPrompt';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Ethio Student Material | Ethiopian University Freshman Academic Portal',
  description:
    'Official Ethiopian University Freshman Materials, Past Mid & Final Exams, Department Info, University Guides & Telegram Bot Platform.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Ethio Student Material',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ethio Student',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-white">
        <PwaInstallPrompt />
        {children}
      </body>
    </html>
  );
}
