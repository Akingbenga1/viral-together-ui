import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/hooks/useAuth';
import CookieConsent from '@/components/GDPR/CookieConsent';
import LoggingProvider from '@/components/LoggingProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Viral Together - Influencer Marketing Platform',
  description: 'Connect influencers with brands and businesses for successful marketing campaigns.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoggingProvider>
          <AuthProvider>
            {children}
            <CookieConsent />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  marginTop: '80px',
                },
              }}
            />
          </AuthProvider>
        </LoggingProvider>
      </body>
    </html>
  );
} 